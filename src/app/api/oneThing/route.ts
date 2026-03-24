import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/services/aiChatService';

export async function POST(req: Request) {
  try {
    const { bookTitle, messages } = await req.json();
    
    const openai = getOpenAIClient();
    
    let conversationContext = '';
    if (messages && Array.isArray(messages) && messages.length > 1) {
      const chatHistory = messages
        .filter((m: any) => m.role === 'user' || m.role === 'character')
        .map((m: any) => `${m.role === 'user' ? 'Reader' : 'Character'}: ${m.content}`)
        .join('\n');
      
      conversationContext = `
      The reader has just finished a conversation with a character from the book. Here is their conversation history:
      <conversation>
      ${chatHistory}
      </conversation>
      
      Please heavily base your response on this conversation. 
      Analyze what the reader was asking, feeling, or struggling with during the chat, and tailor the "connection", "coreIssue", "insight", and "reflection" directly to their personal experience in this conversation.
      `;
    }

    const prompt = `
      You are distilling the core essence of the book "${bookTitle}" for a highly curated "Take Something With You" (带走一些) page.
      ${conversationContext}
      
      The output must be structured as a meaningful reflection, not generic advice.
      
      Return JSON strictly in this structure:
      {
        "quote": "A REAL, exact famous quote from the book. If unsure, leave empty string \\"\\".",
        "connection": "Why this book matters to the reader (这本书与你的关系). 1-2 sentences. ${conversationContext ? 'Base this on their conversation.' : ''}",
        "coreIssue": "The real underlying question or problem the reader might be facing based on the book's themes (你真正关注的问题). 1-2 sentences. ${conversationContext ? 'Derive this from their chat.' : ''}",
        "insight": "A specific, deep human insight, NOT advice (一个具体洞察). E.g., '你似乎在意的是被理解，而不是被喜欢'. 1 sentence. ${conversationContext ? 'Address their specific situation from the chat.' : ''}",
        "reflection": "An open-ended philosophical thought to linger on, NOT a question (一个开放式思考句). E.g., '或许我们终其一生，都在学习如何与自己的平凡和解'. 1 sentence."
      }
      
      CRITICAL RULES:
      1. quote: MUST be actual, exact quotes from the book. DO NOT fabricate.
      2. insight: No generic life advice, no chicken soup for the soul, no "you should...".
      3. reflection: No question marks. No motivational slogans.
      4. Language: Simplified Chinese only.
      5. Tone: Calm, human, minimal, profound, intentional.
      6. No emojis, no labels.
    `;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a wisdom distiller. Output JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(content || '{}'));
  } catch (error: any) {
    console.error('One Thing API Error:', error);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}
