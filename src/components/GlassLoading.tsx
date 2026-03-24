'use client';

import { BookOpen, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingQuotes from './LoadingQuotes';

interface GlassLoadingProps {
  title?: string;
  subtitle?: string;
}

export default function GlassLoading({ title = '请稍候', subtitle = '正在加载...' }: GlassLoadingProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-neutral-50/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6"
    >
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
            {title}
          </h3>
          <div className="h-6 relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={subtitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center gap-2 text-neutral-500 text-sm tracking-wider"
              >
                <Loader2 size={14} className="animate-spin" />
                {subtitle}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        
        <div className="w-full pt-2">
          <LoadingQuotes compact={true} />
        </div>
      </motion.div>
    </motion.div>
  );
}