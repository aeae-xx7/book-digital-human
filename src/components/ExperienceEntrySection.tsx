'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Ghost, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperienceEntrySectionProps {
  bookTitle: string;
}

export default function ExperienceEntrySection({ bookTitle }: ExperienceEntrySectionProps) {
  const router = useRouter();

  const handleExperience = (type: 'role-test' | 'book-sees-you' | 'one-thing' | 'character-selection') => {
    router.push(`/experience/${type}?title=${encodeURIComponent(bookTitle || '')}`);
  };

  const cards = [
    {
      type: 'character-selection' as const,
      title: '选择角色',
      enTitle: 'Select Character',
      desc: '浏览书中人物，选择一位进行深度对话',
      color: 'hover:border-neutral-300 hover:bg-neutral-50/50'
    },
    {
      type: 'role-test' as const,
      title: '进入故事',
      enTitle: 'Enter the Story',
      desc: '穿越成为书中角色，亲历关键时刻',
      color: 'hover:border-neutral-300 hover:bg-neutral-50/50'
    },
    {
      type: 'book-sees-you' as const,
      title: '与之交谈',
      enTitle: 'Speak with the Book',
      desc: '让书本来阅读你，发现灵魂共鸣',
      color: 'hover:border-neutral-300 hover:bg-neutral-50/50'
    },
    {
      type: 'one-thing' as const,
      title: '带走一些',
      enTitle: 'Take Something With You',
      desc: '弱水三千，只取一瓢',
      color: 'hover:border-neutral-300 hover:bg-neutral-50/50'
    }
  ];

  return (
    <section className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2 pl-1">
        选择一种方式进入这本书
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {cards.map((card, idx) => (
           <motion.button
             key={card.type}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             onClick={() => handleExperience(card.type)}
             className={`relative p-8 rounded-2xl bg-white border border-neutral-100 shadow-sm transition-all duration-300 text-left group flex flex-col h-full justify-between ${card.color} hover:shadow-md`}
           >
             <div>
               <h4 className="font-serif font-bold text-2xl text-neutral-900 mb-2 group-hover:text-neutral-800">
                 {card.title}
               </h4>
               <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                 {card.enTitle}
               </p>
               <p className="text-sm text-neutral-500 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto overflow-hidden">
                 {card.desc}
               </p>
             </div>
             
             <div className="mt-6 flex justify-between items-center border-t border-neutral-100 pt-4 group-hover:border-neutral-200/0 transition-colors">
               <span className="text-xs font-bold text-neutral-300 group-hover:text-neutral-500 transition-colors uppercase tracking-wider">
                 Start
               </span>
               <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                 <ArrowRight size={14} />
               </div>
             </div>
           </motion.button>
         ))}
      </div>
    </section>
  );
}
