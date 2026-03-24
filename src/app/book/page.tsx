'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, BookOpen, Target, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from '@/lib/types';
import ExperienceEntrySection from '@/components/ExperienceEntrySection';
import LoadingQuotes from '@/components/LoadingQuotes';
import GlassLoading from '@/components/GlassLoading';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookTitle = searchParams.get('title');
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentLoadingText, setCurrentLoadingText] = useState(0);
  const loadingTexts = [
    '正在翻阅书页...',
    '正在寻找关键人物...',
    '正在构建对话入口...',
    '正在准备深度解读...'
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentLoadingText(prev => (prev + 1) % loadingTexts.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (!bookTitle) {
      router.replace('/');
      return;
    }

    // Fetch real data from API
    const fetchBook = async () => {
      try {
        const res = await fetch('/api/book-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookTitle }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch book data');
        }
        
        setBook({
          ...data,
          id: 'generated_book_id',
        });
      } catch (error: any) {
        console.error('Error fetching book:', error);
        alert(`书籍生成失败: ${error.message}\n\n建议：\n1. 检查 API Key 额度\n2. 检查网络连接（是否需要配置代理）\n3. 查看终端控制台的详细报错`);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookTitle, router]);

  if (loading || !book) {
    return (
      <div className="min-h-screen text-[#1c1917] p-6 md:p-12 max-w-5xl mx-auto pb-24">
        <button 
          className="mb-8 flex items-center gap-2 text-neutral-300 text-sm font-medium"
          disabled
        >
          <ArrowLeft size={16} /> 返回搜索
        </button>
        
        <div className="relative">
          {/* Background Skeleton */}
          <div className="space-y-16 animate-pulse opacity-20 pointer-events-none select-none">
            {/* Header Skeleton */}
            <div className="space-y-8 text-center md:text-left">
              <div className="flex gap-3 mb-4 justify-center md:justify-start">
                <div className="h-6 w-16 bg-neutral-200 rounded-full"></div>
                <div className="h-6 w-24 bg-neutral-200 rounded-full"></div>
              </div>
              <div className="h-16 md:h-20 bg-neutral-200 rounded-2xl w-3/4 mx-auto md:mx-0"></div>
              <div className="h-8 bg-neutral-100 rounded-xl w-1/2 mx-auto md:mx-0"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-6">
                <div className="h-4 w-24 bg-neutral-200 rounded-md"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-neutral-100 rounded-md w-full"></div>
                  <div className="h-4 bg-neutral-100 rounded-md w-11/12"></div>
                  <div className="h-4 bg-neutral-100 rounded-md w-full"></div>
                  <div className="h-4 bg-neutral-100 rounded-md w-5/6"></div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="h-32 bg-neutral-100 rounded-2xl w-full"></div>
                <div className="h-48 bg-neutral-50 rounded-2xl w-full"></div>
              </div>
            </div>
          </div>

          {/* Foreground Engaging Loader */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-xl border border-white/50 flex flex-col items-center w-full max-w-lg text-center space-y-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="w-16 h-16 bg-[#1c1917] rounded-2xl flex items-center justify-center shadow-lg"
              >
                <BookOpen className="text-[#fdfbf7] w-8 h-8" />
              </motion.div>
              
              <div className="space-y-3 w-full">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1c1917]">
                  正在生成专属解读
                </h3>
                <div className="h-6 relative w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentLoadingText}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center gap-2 text-neutral-500 text-sm tracking-wider"
                    >
                      <Loader2 size={14} className="animate-spin" />
                      {loadingTexts[currentLoadingText]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
              
              <div className="w-full pt-2">
                <LoadingQuotes compact={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1c1917] p-6 md:p-12 max-w-5xl mx-auto pb-24">
      <button 
        onClick={() => router.push('/')}
        className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors text-sm font-medium group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        返回搜索
      </button>

      {/* Value Proposition Bar */}
      {book.whyReadThisToday && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 bg-[#1c1917] text-[#fdfbf7] p-6 md:p-8 rounded-2xl shadow-xl flex gap-5 items-start"
        >
          <div className="p-2 bg-white/10 rounded-full flex-shrink-0 mt-1">
             <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
              当下的阅读价值
            </h3>
            <p className="text-base md:text-lg leading-relaxed font-serif text-neutral-100">
              {book.whyReadThisToday}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Header */}
        <div className="space-y-8 text-center md:text-left">
          <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
            {book.genreTags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-full uppercase tracking-wider border border-neutral-200">
                {tag}
              </span>
            ))}
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${
              book.difficulty === '轻松' ? 'border-green-200 text-green-700 bg-green-50' :
              book.difficulty === '中等' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
              'border-red-200 text-red-700 bg-red-50'
            }`}>
              阅读门槛：{book.difficulty}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-[#1c1917] leading-none">
            《{book.title}》
          </h1>
          <p className="text-xl md:text-3xl text-neutral-500 font-serif leading-relaxed italic">
            {book.oneLiner}
          </p>
        </div>

        {/* Experience Entries - MOVED UP for Shortest Path */}
        <div className="relative">
           <div className="absolute -inset-4 bg-neutral-50 rounded-[2rem] -z-10 opacity-50"></div>
           <ExperienceEntrySection bookTitle={bookTitle || ''} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content (Left 2/3) */}
          <div className="md:col-span-2 space-y-12">
             {/* Structured Summary */}
            <section className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-200 pb-2">
                <BookOpen size={14} /> 书籍概览
              </h3>
              <div className="prose prose-lg prose-neutral max-w-none">
                <p className="text-lg md:text-xl text-neutral-800 leading-loose font-serif">
                  {book.summaryParagraph || book.overviewBullets.join(' ')}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="space-y-8">
             {/* Author Card */}
            {book.authorBio && (
               <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 space-y-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-neutral-100 flex-shrink-0 flex items-center justify-center text-neutral-400 font-bold text-lg font-serif">
                     {book.author ? book.author[0] : 'A'}
                   </div>
                   <h3 className="text-lg font-bold text-neutral-900 font-serif">{book.author || '作者'}</h3>
                 </div>
                 <p className="text-neutral-600 leading-relaxed text-sm">
                   {book.authorBio}
                 </p>
               </section>
            )}

            {/* Who it's for */}
            <section className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <UserCheck size={14} /> 适合人群
              </h3>
              <div className="flex flex-col gap-3">
                {book.whoItsFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-neutral-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<GlassLoading title="即将进入" subtitle="正在准备页面..." />}>
      <BookContent />
    </Suspense>
  );
}
