import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/services/aiChatService';

export async function POST(req: Request) {
  try {
    const { messages, bookTitle, character } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'messages are required' }, { status: 400 });
    }

    const openai = getOpenAIClient();

    const prompt = `
      请根据以下用户与书籍《${bookTitle}》中的角色【${character.name}】的对话历史，生成一段“对话后的总结”。
      
      【结构要求】（必须严格遵守以下4个字段，直接输出JSON）
      1. question: "你在问什么" (提炼用户真正关心的核心问题)
      2. seeking: "你在寻找的" (更深层的情感或价值观诉求)
      3. answer: "你得到的" (基于对话内容，提炼出的一个答案或视角)
      4. takeaway: "留下一句" (一句精炼的、有哲理的结语，像是送给用户的一句话)

      【输出格式】
      {
        "question": "你在意的是...",
        "seeking": "你希望确认...",
        "answer": "...",
        "takeaway": "“...”"
      }

      【对话历史】
      ${messages.map((m: any) => `${m.role === 'user' ? '用户' : character.name}: ${m.content}`).join('\n')}
      
      【要求】
      1. 必须是简体中文。
      2. 语气要像一个有洞察力的旁观者，平静、温暖。
      3. 语言要精炼，不要啰嗦。
    `;

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a wise observer analyzing a profound conversation. Output JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || '{}');

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Chat Summary API Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
