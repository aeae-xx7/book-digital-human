import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/services/aiChatService';

export async function POST(req: Request) {
  try {
    const { bookTitle, characters, answers } = await req.json();
    
    const openai = getOpenAIClient();
    
    const prompt = `
      Based on the user's answers: ${JSON.stringify(answers)},
      match them to one of these characters from "${bookTitle}": ${JSON.stringify(characters)}.
      
      Return JSON:
      {
        "matchedCharacterId": "id_from_input",
        "matchedCharacterName": "Name",
        "reasonParagraph": "Concise analysis (approx 80-100 words) of why they match. (Chinese)",
        "bookMirror": "1-2 sentences: How this book sees the user through this character's eyes. (Chinese)",
        "gentleReminder": "1 sentence: A gentle reminder for this personality type. (Chinese)"
      }
      
      IMPORTANT:
      1. Simplified Chinese only.
      2. No emojis.
      3. Tone: Insightful, literary, psychological but accessible.
    `;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a literary psychologist. Output JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || '{}');
    
    // Attach full character object for frontend navigation
    const matchedChar = characters.find((c: any) => c.name === result.matchedCharacterName) || characters[0];
    result.matchedCharacter = matchedChar;
    result.matchedCharacterId = matchedChar.id;

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Role Test Result API Error:', error);
    return NextResponse.json({ error: 'Failed to generate result' }, { status: 500 });
  }
}
