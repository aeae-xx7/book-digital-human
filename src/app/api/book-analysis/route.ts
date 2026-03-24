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
      Generate a compact but rich analysis of the book "${bookTitle}".
      
      Return JSON:
      {
        "title": "Book title (Chinese or original)",
        "author": "Author name",
        "authorBio": "2-3 sentences (Chinese)",
        "oneLiner": "1 sentence tagline (Chinese)",
        "whyReadThisToday": "2-3 sentences on modern relevance (Chinese)",
        "genreTags": ["Tag1", "Tag2", "Tag3"],
        "difficulty": "轻松 | 中等 | 困难",
        "summaryParagraph": "5-8 sentences summary (Chinese)",
        "overviewBullets": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
        "whoItsFor": ["Audience 1", "Audience 2", "Audience 3"]
      }
      
      IMPORTANT:
      1. Simplified Chinese only (except author/title if original).
      2. No emojis.
      3. Keep output concise and non-encyclopedic.
    `;

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a literary editor. Output JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(content || '{}'));
  } catch (error: any) {
    console.error('Book Analysis API Error:', error);
    return NextResponse.json({ error: 'Failed to generate book analysis' }, { status: 500 });
  }
}
