import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/services/aiChatService';

export async function POST(req: Request) {
  try {
    const { bookTitle, characters } = await req.json();
    
    const openai = getOpenAIClient();
    
    const prompt = `
      Design a personality test to match a user to one of these characters from "${bookTitle}": 
      ${characters.map((c: any) => c.name).join(', ')}.
      
      Generate exactly 5 multiple choice questions.
      Each question should be profound, smart, and deeply interactive, subtly probing core values, moral dilemmas, decision-making styles, or emotional tendencies relevant to the book's themes. Create specific, immersive scenarios (e.g., "Imagine you are standing before a difficult choice in the story...") that put the user in thought-provoking situations.
      
      Return JSON:
      {
        "questions": [
          {
            "id": "q1",
            "question": "Question text (Chinese)",
            "options": [
              { "key": "A", "text": "Option text (Chinese)" },
              { "key": "B", "text": "Option text (Chinese)" },
              { "key": "C", "text": "Option text (Chinese)" },
              { "key": "D", "text": "Option text (Chinese)" }
            ]
          }
        ]
      }
      
      IMPORTANT:
      1. Simplified Chinese only.
      2. No emojis.
      3. Questions should be highly immersive, thought-provoking, and slightly challenging to answer directly, creating a strong sense of interaction and depth.
      4. Avoid generic personality questions; tie them closely to the atmosphere and themes of "${bookTitle}".
    `;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a creative psychologist designing a book character quiz. Output JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(content || '{}'));
  } catch (error: any) {
    console.error('Role Test API Error:', error);
    return NextResponse.json({ error: 'Failed to generate test' }, { status: 500 });
  }
}
