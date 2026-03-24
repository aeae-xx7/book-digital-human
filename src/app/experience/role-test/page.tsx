'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingQuotes from '@/components/LoadingQuotes';
import GlassLoading from '@/components/GlassLoading';

function RoleTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookTitle = searchParams.get('title');
  const [step, setStep] = useState<'intro' | 'question' | 'result'>('intro');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [characters, setCharacters] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!bookTitle) {
      router.push('/');
    }
  }, [bookTitle, router]);

  const startTest = async () => {
    setLoading(true);
    setLoadingText('正在阅读书籍，寻找书中角色...');
    try {
      // 1. Fetch characters first (needed for context)
      const charRes = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookTitle }),
      });
      const charData = await charRes.json();
      setCharacters(charData.characters);

      setLoadingText('正在根据角色生成测试题...');
      // 2. Generate questions
      const qRes = await fetch('/api/roleTest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookTitle, characters: charData.characters }),
      });
      const qData = await qRes.json();
      
      setQuestions(qData.questions);
      setStep('question');
    } catch (e) {
      console.error(e);
      alert('测试生成失败，请重试');
    } finally {
      setLoading(false);
      setLoadingText('');
    }
  };

  const handleAnswer = async (questionId: string, answerKey: string) => {
    const newAnswers = { ...answers, [questionId]: answerKey };
    setAnswers(newAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Submit
      if (loading) return;
      setLoading(true);
      setLoadingText('正在分析你的回答，寻找灵魂共鸣...');
      try {
        // Use stored characters instead of fetching again
        const res = await fetch('/api/roleTestResult', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            bookTitle, 
            characters: characters, // Use state
            answers: newAnswers 
          }),
        });
        const data = await res.json();
        setResult(data);
        setStep('result');
      } catch (e) {
        console.error(e);
        alert('结果生成失败');
      } finally {
        setLoading(false);
        setLoadingText('');
      }
    }
  };

  const handleStartChat = () => {
    if (result?.matchedCharacter) {
      sessionStorage.setItem('selected_character', JSON.stringify(result.matchedCharacter));
      router.push(`/chat?title=${encodeURIComponent(bookTitle || '')}`);
    }
  };

  if (!bookTitle) return null;

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 flex flex-col items-center justify-center font-sans">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <GlassLoading 
            title={step === 'intro' ? '准备测试中' : step === 'question' ? '分析灵魂共鸣' : '请稍候'} 
            subtitle={loadingText || '请稍候...'} 
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
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <h1 className="text-3xl font-bold text-neutral-900">如果你是书中人</h1>
              <p className="text-neutral-500 leading-relaxed">
                在《{bookTitle}》的世界里，<br/>
                你的性格底色最接近谁？<br/>
                通过几个简单的问题，找到你在书中的倒影。
              </p>
              <button 
                onClick={startTest}
                disabled={loading}
                className="bg-neutral-900 text-white px-8 py-4 rounded-full font-medium hover:bg-neutral-800 transition-all shadow-lg flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : '开始测试'}
              </button>
            </motion.div>
          )}

          {step === 'question' && questions.length > 0 && (
            <motion.div 
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100"
            >
              <div className="mb-8">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  问题 {currentQIndex + 1} / {questions.length}
                </span>
                <h2 className="text-xl font-bold text-neutral-900 mt-4 leading-relaxed">
                  {questions[currentQIndex].question}
                </h2>
              </div>
              <div className="space-y-3">
                {questions[currentQIndex].options.map((opt: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(questions[currentQIndex].id, opt.key)}
                    className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-400 transition-all text-neutral-700 font-medium"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100 text-center space-y-8"
            >
              <div>
                <p className="text-sm text-neutral-400 font-medium uppercase tracking-widest mb-2">你的书中倒影是</p>
                <h2 className="text-4xl font-bold text-neutral-900 mb-4">{result.matchedCharacterName}</h2>
                <div className="w-16 h-1 bg-neutral-900 mx-auto rounded-full" />
              </div>

              <div className="text-left space-y-6 bg-neutral-50 p-6 rounded-2xl">
                <p className="text-neutral-700 leading-relaxed font-medium">
                  {result.reasonParagraph}
                </p>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 italic">
                    “{result.bookMirror}”
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleStartChat}
                  className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  与TA对话 <ArrowRight size={18} />
                </button>
                <p className="text-xs text-neutral-400 mt-4">{result.gentleReminder}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function RoleTestPage() {
  return (
    <Suspense fallback={<GlassLoading title="准备测试" subtitle="正在加载..." />}>
      <RoleTestContent />
    </Suspense>
  );
}
