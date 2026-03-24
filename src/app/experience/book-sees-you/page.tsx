'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingQuotes from '@/components/LoadingQuotes';
import GlassLoading from '@/components/GlassLoading';

function BookSeesYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookTitle = searchParams.get('title');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!bookTitle) {
      router.push('/');
    }
  }, [bookTitle, router]);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const charRes = await fetch('/api/characters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookTitle }),
      });
      const charData = await charRes.json();

      const res = await fetch('/api/bookSeesYou', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookTitle, 
          characters: charData.characters,
          userContext: input 
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    if (result?.recommendedCharacter) {
      sessionStorage.setItem('selected_character', JSON.stringify(result.recommendedCharacter));
      router.push(`/chat?title=${encodeURIComponent(bookTitle || '')}`);
    }
  };

  if (!bookTitle) return null;

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 flex flex-col items-center justify-center font-sans">
      <AnimatePresence>
        {loading && (
          <GlassLoading 
            title="书籍正在凝视你" 
            subtitle="解读你的困惑..." 
          />
        )}
      </AnimatePresence>

      <button 
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> 退出
      </button>

      <div className="max-w-xl w-full">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-neutral-900">这本书会如何看你</h1>
                <p className="text-neutral-500 leading-relaxed">
                  如果你愿意，写下你最近的困惑或状态。<br/>
                  如果不填，将获得一段来自《{bookTitle}》视角的通用注视。
                </p>
              </div>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="最近我在思考..."
                className="w-full h-40 p-6 rounded-2xl border border-neutral-200 focus:border-neutral-400 focus:ring-0 bg-white resize-none outline-none text-neutral-800 placeholder:text-neutral-300 transition-all shadow-sm"
              />

              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-neutral-900 text-white py-4 rounded-xl font-medium hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : '获得注视'}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100 space-y-10"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">它欣赏你</h3>
                  <p className="text-lg text-neutral-800 leading-relaxed font-serif">{result.admired}</p>
                </div>
                <div className="w-full h-px bg-neutral-100" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">它想问你</h3>
                  <p className="text-lg text-neutral-800 leading-relaxed font-serif">{result.questioned}</p>
                </div>
                <div className="w-full h-px bg-neutral-100" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">它的提醒</h3>
                  <p className="text-lg text-neutral-800 leading-relaxed font-serif">{result.reminder}</p>
                </div>
              </div>

              <div className="bg-neutral-50 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">推荐对话者</p>
                  <p className="font-bold text-neutral-900">{result.recommendedCharacterName}</p>
                </div>
                <button 
                  onClick={handleStartChat}
                  className="px-6 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors shadow-sm"
                >
                  去聊聊 →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookSeesYouPage() {
  return (
    <Suspense fallback={<GlassLoading title="凝视准备中" subtitle="正在加载..." />}>
      <BookSeesYouContent />
    </Suspense>
  );
}
