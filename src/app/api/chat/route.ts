import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/services/aiChatService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { character, bookTitle, messages } = body;

    const reply = await generateChatResponse({ character, bookTitle, messages });
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: '对话暂时中断，请稍后重试', fallback: '（沉默了一会儿）抱歉，我的思绪有些混乱...' }, 
      { status: 500 }
    );
  }
}
