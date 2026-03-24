'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "阅读是一座随身携带的避难所。 —— 毛姆",
  "书籍是屹立在时间的汪洋大海中的灯塔。 —— 惠普尔",
  "读一本好书，就是和许多高尚的人谈话。 —— 笛卡尔",
  "生活里没有书籍，就好像没有阳光。 —— 莎士比亚",
  "理想的书籍，是智慧的钥匙。 —— 列夫·托尔斯泰",
  "书卷多情似故人，晨昏忧乐每相亲。 —— 于谦",
  "脚步不能到达的地方，眼光可以到达。 —— 佚名",
  "要么旅行，要么读书，身体和灵魂必须有一个在路上。 —— 罗马假日",
];

export default function LoadingQuotes({ compact = false }: { compact?: boolean }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Randomize the first quote
    setQuoteIndex(Math.floor(Math.random() * quotes.length));

    // Change quote every 3 seconds if loading takes longer
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center w-full text-[#1c1917] ${compact ? 'space-y-4' : 'min-h-[60vh] h-full space-y-8'}`}>
      {!compact && (
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-[#1c1917]/80" strokeWidth={1.5} />
        </motion.div>
      )}
      
      <div className={`${compact ? 'h-12' : 'h-16'} relative w-full max-w-lg text-center px-6`}>
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 flex items-center justify-center font-serif text-[#1c1917]/70 italic tracking-wider leading-relaxed ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}
          >
            {quotes[quoteIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
