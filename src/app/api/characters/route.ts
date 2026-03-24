import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/services/aiChatService';

export async function POST(req: Request) {
  try {
    const { bookTitle } = await req.json();

    if (!bookTitle) {
      return NextResponse.json({ error: 'bookTitle is required' }, { status: 400 });
    }

    const openai = getOpenAIClient();

    const prompt = `
      List 5-8 key characters from the book "${bookTitle}".
      
      Return JSON:
      {
        "characters": [
          {
            "name": "Character name",
            "role": "身份/角色标签 (Chinese)",
            "styleTag": "性格底色短语 (Chinese)",
            "intro": "1-2 sentences intro in Chinese",
            "avatar": "optional short description for avatar generation (Chinese)"
          }
        ]
      }
      
      IMPORTANT:
      1. Simplified Chinese only (except names if original).
      2. No emojis.
      3. Keep intros concise and evocative.
    `;

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a literary curator. Output JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || '{}');
    const characters = Array.isArray(parsed.characters) ? parsed.characters : [];

    const withIds = characters.map((c: any, index: number) => ({
      id: `char_${index + 1}`,
      ...c,
    }));

    return NextResponse.json({ characters: withIds });
  } catch (error: any) {
    console.error('Characters API Error:', error);
    return NextResponse.json({ error: 'Failed to generate characters' }, { status: 500 });
  }
}
