'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Quote, Lightbulb, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassLoading from '@/components/GlassLoading';

function OneThingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookTitle = searchParams.get('title');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookTitle) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const storedMessages = sessionStorage.getItem(`chat_messages_${bookTitle}`);
        const messages = storedMessages ? JSON.parse(storedMessages) : null;

        const res = await fetch('/api/oneThing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookTitle, messages }),
        });
        const data = await res.json();
        setResult(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookTitle, router]);

  const handleDiscuss = () => {
    router.push(`/characters?title=${encodeURIComponent(bookTitle || '')}`);
  };

  if (loading) {
    return <GlassLoading title="提炼只言片语" subtitle="正在为你整理这本书的意义…" />;
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 flex flex-col items-center justify-center font-sans">
      <button 
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> 退出
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-neutral-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-neutral-900" />
        
        <div className="space-y-12">
          {/* Quote Section */}
          {result.quote && (
            <div className="text-center space-y-4">
              <Quote className="mx-auto text-neutral-200" size={32} />
              <p className="text-2xl md:text-3xl font-serif text-neutral-900 leading-relaxed italic">
                “{result.quote}”
              </p>
            </div>
          )}

          <div className="w-16 h-px bg-neutral-200 mx-auto" />

          <div className="space-y-8 max-w-2xl mx-auto">
            {/* Section 1: Connection */}
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">这本书与你的关系</h3>
              <p className="text-neutral-800 leading-relaxed font-serif text-lg">
                {result.connection}
              </p>
            </div>

            {/* Section 2: Core Issue */}
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">你真正关注的问题</h3>
              <p className="text-neutral-800 leading-relaxed font-serif text-lg">
                {result.coreIssue}
              </p>
            </div>

            {/* Section 3: Insight */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">一个具体洞察</h3>
              <p className="text-neutral-900 leading-relaxed font-serif text-xl font-medium">
                {result.insight}
              </p>
            </div>

            {/* Section 4: Open Reflection */}
            <div className="pt-4">
              <p className="text-neutral-500 leading-relaxed font-serif text-lg italic">
                {result.reflection}
              </p>
            </div>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={handleDiscuss}
              className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-all shadow-lg"
            >
              带走这一念 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OneThingPage() {
  return (
    <Suspense fallback={<GlassLoading title="提炼准备中" subtitle="正在加载..." />}>
      <OneThingContent />
    </Suspense>
  );
}
