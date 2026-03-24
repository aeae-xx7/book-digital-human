import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/services/aiChatService';

export async function POST(req: Request) {
  try {
    const { bookTitle, characters, userContext } = await req.json();
    
    const openai = getOpenAIClient();
    
    const prompt = `
      From the perspective of the book "${bookTitle}", analyze the user based on their input: "${userContext || 'General reader'}".
      
      Return JSON:
      {
        "admired": "2-3 sentences: What the book appreciates about the user's state/mindset. (Chinese)",
        "questioned": "2-3 sentences: A challenging but constructive question the book would ask. (Chinese)",
        "reminder": "1-2 sentences: A core reminder from the book's wisdom. (Chinese)",
        "recommendedCharacterName": "Name of one character from ${characters.map((c: any) => c.name).join(', ')} who fits best to discuss this.",
        "recommendedCharacterReason": "1 sentence why. (Chinese)"
      }
      
      IMPORTANT:
      1. Simplified Chinese only.
      2. No emojis.
      3. Tone: Deep, observant, empathetic but objective.
    `;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are the spirit of the book. Output JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || '{}');
    
    const matchedChar = characters.find((c: any) => c.name === result.recommendedCharacterName) || characters[0];
    result.recommendedCharacter = matchedChar;
    result.recommendedCharacterId = matchedChar.id;

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Book Sees You API Error:', error);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}
