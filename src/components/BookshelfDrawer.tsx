'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface BookshelfDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookshelfDrawer({ isOpen, onClose }: BookshelfDrawerProps) {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const shelf = localStorage.getItem('my_bookshelf');
      if (shelf) {
        try {
          setBooks(JSON.parse(shelf));
        } catch (e) {
          console.error('Failed to parse bookshelf', e);
        }
      }
    }
  }, [isOpen]);

  const handleBookClick = (bookTitle: string) => {
    // Navigate to book detail page
    router.push(`/book?title=${encodeURIComponent(bookTitle)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#fdfbf7] shadow-2xl z-50 border-l border-neutral-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200/60 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0">
              <h2 className="text-xl font-serif font-bold text-neutral-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-neutral-400" />
                我的书架
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {books.length === 0 ? (
                <div className="text-center py-20 text-neutral-400">
                  <p className="mb-4">书架还是空的</p>
                  <button 
                    onClick={onClose}
                    className="text-sm font-medium text-neutral-900 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-all"
                  >
                    去挑选一本书
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {books.map((book, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleBookClick(book.bookTitle)}
                      className="group relative bg-white p-5 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer flex gap-4 items-start"
                    >
                      <div className="w-12 h-16 bg-neutral-100 rounded-md flex-shrink-0 overflow-hidden shadow-inner relative">
                        {/* Mock Cover */}
                         <div className="absolute inset-0 flex items-center justify-center text-xs font-serif text-neutral-400 font-bold p-1 text-center leading-none">
                           {book.bookTitle.slice(0, 4)}
                         </div>
                         {book.lastCharacterAvatar && (
                           <img src={book.lastCharacterAvatar} className="w-full h-full object-cover relative z-10" />
                         )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-neutral-900 truncate group-hover:text-amber-900 transition-colors">
                          {book.bookTitle}
                        </h3>
                        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                             <Clock size={12} />
                             {book.lastCharacter ? `与 ${book.lastCharacter} 对话中` : '最近阅读'}
                          </span>
                        </div>
                      </div>

                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                        <ArrowRight size={18} className="text-neutral-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-neutral-200/60 bg-neutral-50/50 text-center text-xs text-neutral-400 font-medium">
              共 {books.length} 本藏书
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
