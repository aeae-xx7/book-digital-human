'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send, Loader2, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassLoading from '@/components/GlassLoading';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookTitle = searchParams.get('title');
  const [character, setCharacter] = useState<any>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const charStr = sessionStorage.getItem('selected_character');
    if (!bookTitle || !charStr) {
      router.push('/');
      return;
    }
    try {
      const char = JSON.parse(charStr);
      setCharacter(char);
      setMessages([
        { role: 'character', content: char.greeting || `你好，我是${char.name}。` }
      ]);
    } catch (e) {
      router.push('/');
    }
    
    // Simulate loading state for Chat Page
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [bookTitle, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 1 && bookTitle) {
      sessionStorage.setItem(`chat_messages_${bookTitle}`, JSON.stringify(messages));
    }
  }, [messages, loading, bookTitle]);

  const handleSend = async (retryMessage?: string) => {
    const userMsg = retryMessage || input.trim();
    if (!userMsg) return;

    if (!retryMessage) {
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
      setInput('');
    }
    
    setLoading(true);
    setError(null);

    try {
      // If it's a retry, the user message is already in the messages array
      const apiMessages = retryMessage 
        ? messages 
        : [...messages, { role: 'user', content: userMsg }];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character,
          bookTitle,
          messages: apiMessages
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '对话暂时中断，请稍后重试');
      }

      setMessages(prev => [...prev, { role: 'character', content: data.reply }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('对话暂时中断，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Find the last user message to retry
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  const handleEndChat = async () => {
    if (messages.length <= 1) return; // Not enough history
    setChatEnded(true);
    setGeneratingSummary(true);
    
    try {
      const res = await fetch('/api/chat-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, bookTitle, character })
      });
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      console.error('Failed to generate summary', e);
    } finally {
      setGeneratingSummary(false);
    }
  };

  if (initialLoading) {
    return <GlassLoading title="即将开始对话" subtitle="角色正在靠近你..." />;
  }

  if (!character) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-neutral-900">{character.name}</h1>
            <p className="text-xs text-neutral-500 font-serif italic">《{bookTitle}》</p>
          </div>
        </div>
        {!chatEnded && messages.length > 1 && (
          <button 
            onClick={handleEndChat}
            className="text-xs font-medium px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            结束对话
          </button>
        )}
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl mx-auto w-full pb-32">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-neutral-900 text-white rounded-br-sm' 
                    : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm shadow-sm font-serif'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center gap-2 text-neutral-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm font-serif">正在思考...</span>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center my-4"
            >
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm shadow-sm">
                <span>{error}</span>
                <button 
                  onClick={handleRetry}
                  disabled={loading}
                  className="flex items-center gap-1 bg-white px-3 py-1 rounded-md border border-red-200 hover:bg-red-50 transition-colors font-medium"
                >
                  <RotateCw size={14} /> 重试
                </button>
              </div>
            </motion.div>
          )}

          {/* Chat Summary Section */}
          {chatEnded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 pt-12 border-t border-neutral-200"
            >
              <div className="text-center mb-10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">对话之后</h2>
              </div>
              
              {generatingSummary ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
                  <p className="text-sm text-neutral-500 font-serif">正在沉淀这段对话...</p>
                </div>
              ) : summary ? (
                <div className="space-y-8 px-4 md:px-10">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">你在问什么</h3>
                    <p className="text-neutral-800 leading-relaxed font-serif">{summary.question}</p>
                  </div>
                  <div className="w-full h-px bg-neutral-100" />
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">你在寻找的</h3>
                    <p className="text-neutral-800 leading-relaxed font-serif">{summary.seeking}</p>
                  </div>
                  <div className="w-full h-px bg-neutral-100" />
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">你得到的</h3>
                    <p className="text-neutral-800 leading-relaxed font-serif">{summary.answer}</p>
                  </div>
                  <div className="w-full h-px bg-neutral-100" />
                  <div className="space-y-2 pt-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">留下一句</h3>
                    <p className="text-xl text-neutral-900 leading-relaxed font-serif italic text-center">
                      {summary.takeaway}
                    </p>
                  </div>
                  
                  <div className="pt-10 flex justify-center">
                    <button 
                      onClick={() => router.push(`/book?title=${encodeURIComponent(bookTitle)}`)}
                      className="px-6 py-3 bg-neutral-100 text-neutral-600 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
                    >
                      返回书籍页
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-500 text-sm">
                  总结生成失败，但这并不影响你们已经发生的连接。
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      {!chatEnded && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-neutral-200 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="回复..."
              className="flex-1 bg-neutral-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-neutral-200 outline-none transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-neutral-900 text-white p-3 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<GlassLoading title="请稍候" subtitle="正在准备页面..." />}>
      <ChatContent />
    </Suspense>
  );
}
