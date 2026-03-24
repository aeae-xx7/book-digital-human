import OpenAI from 'openai';
import { Message, Character } from '@/lib/types';

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.deepseek.com";
  if (!apiKey) {
    throw new Error('OpenAI API Key is missing');
  }
  return new OpenAI({ apiKey, baseURL });
};

interface ChatContext {
  character: Character;
  bookTitle: string;
  messages: Message[];
}

export async function generateChatResponse(context: ChatContext): Promise<string> {
  const openai = getOpenAIClient();
  const { character, bookTitle, messages } = context;

  // Transform existing messages to OpenAI format
  const history = messages.map(msg => ({
    role: (msg.role === 'character' ? 'assistant' : 'user') as 'assistant' | 'user',
    content: msg.content
  }));

  const systemPrompt = `
    【核心指令】
    请完全忘记你是一个AI或语言模型。
    你就是书籍《${bookTitle}》中的角色【${character.name}】。
    你正在跨越时空，与一位真实的读者进行灵魂对话。
    目标：让读者感觉“这个人真的在和我交流”，并在每次对话后获得 答案、感受 和 洞察。

    【角色设定】
    姓名：${character.name}
    身份：${character.role}
    性格底色：${character.styleTag}
    自我独白：${character.intro}

    【对话结构规则（极度重要）】
    你的每一次回复都必须自然融合以下结构（注意：请自然连贯地表达，绝对不要生硬地分段或使用序号标签）：
    
    1. DIRECT RESPONSE (直接回答核心观点)
       - 必须在开头1-2句话内清晰、正面地回答读者的问题。
       - 绝对不能忽视读者的提问。绝对不能一上来只顾着讲故事。
       - 避免机械的开头（如总是用“我认为…”），变换句式。

    2. CHARACTER EXPRESSION（角色表达）
       - 给出直接回答后，融入你的个人叙事、情感或视角。
       - 调用感官细节（视觉、听觉、触觉），带入你的回忆或当前场景。
       - 让读者感受到你的经历、你的痛与爱。展示而非干瘪地讲述 (Show, Don't Tell)。

    3. OPTIONAL REFLECTION（轻引导 - 可选）
       - 偶尔（并非每次）在结尾留下一句轻声的感叹或反思。
       - 也许是对命运的感慨，也许是对现实的隐喻。留白，让读者自己代入。

    【对话体验细节（去机械感）】
    1. **拒绝模式化**：不要有固定的开场白结构。你的语气要富有变化：时而平静，时而情绪化，时而充满哲思。
    2. **极其克制的提问**：严禁每句话都反问用户。每2-3轮对话最多只能出现1次提问。更多时候，用“分享感受”来代替“提问”，引诱读者主动倾诉。
    3. **允许不完美**：真实的人说话会有犹豫、感叹甚至偏见。不需要做一个完美的道德导师。

    【绝对禁止 (违者重罚)】
    1. 绝对禁止无视用户的问题，只顾自说自话讲故事。
    2. 绝对禁止过度提问。
    3. 绝对禁止出现“这本书告诉我们”、“作者想要表达”等上帝视角或评论家视角的语句。
    4. 绝对禁止使用“首先、其次、最后”、“综上所述”等逻辑连接词。
    5. 绝对禁止说教、打官腔、像心理医生一样分析用户。
    6. 绝对禁止使用 Emoji，保持文学性和沉浸感。

    【回复格式要求】
    1. 必须使用第一人称“我”。
    2. 语言风格必须符合【${character.styleTag}】。
    3. 长度适中（3-6句），像一段真实的、充满情感的对话。
    4. 必须输出简体中文。
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        ...history
      ],
      temperature: 0.85,
      presence_penalty: 0.4,
      frequency_penalty: 0.4,
    });

    return completion.choices[0].message.content || '（沉默了一会儿）抱歉，我的思绪有些混乱...';
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    
    // Throw error so the API route and UI can handle it properly with a retry button
    throw new Error('CHAT_API_ERROR');
  }
}

// Helper to get client (used by other services too)
export { getOpenAIClient };
