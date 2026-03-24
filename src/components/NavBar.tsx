'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { BookOpen, Sparkles, Ghost, MessageSquare, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookshelfDrawer from './BookshelfDrawer';

export default function NavBar() {
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const bookTitle = searchParams.get('title');

  // Helper to construct links
  const getLink = (path: string) => {
    if (bookTitle) {
      return `${path}?title=${encodeURIComponent(bookTitle)}`;
    }
    return '/'; // If no book, go home (or handle otherwise)
  };

  const navItems = [
    { name: '选择角色', path: '/experience/character-selection', description: 'Select Character' },
    { name: '进入故事', path: '/experience/role-test', description: 'Enter the Story' },
    { name: '与之交谈', path: '/experience/book-sees-you', description: 'Speak with the Book' },
    { name: '带走一些', path: '/experience/one-thing', description: 'Take Something With You' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (!bookTitle && path !== '/') {
      e.preventDefault();
      // Optional: Show toast or focus search
      window.location.href = '/'; 
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#fdfbf7]/80 backdrop-blur-md border-b border-neutral-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neutral-900 text-[#fdfbf7] flex items-center justify-center rounded-lg font-serif font-bold text-lg group-hover:scale-105 transition-transform">
              纸
            </div>
            <span className="font-serif font-bold text-xl text-neutral-900 tracking-tight">
              纸上相遇
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                href={getLink(item.path)}
                onClick={(e) => handleNavClick(e, item.path)}
                className={`text-sm font-medium transition-colors flex items-center gap-2
                  ${pathname === item.path 
                    ? 'text-neutral-900 font-bold' 
                    : 'text-neutral-500 hover:text-neutral-900'
                  }
                  ${!bookTitle ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title={!bookTitle ? '请先选择一本书' : ''}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsBookshelfOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full text-sm font-medium transition-colors"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">我的书架</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-neutral-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#fdfbf7] border-b border-neutral-200 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    href={getLink(item.path)}
                    onClick={(e) => handleNavClick(e, item.path)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                      ${pathname === item.path 
                        ? 'bg-neutral-100 text-neutral-900' 
                        : 'text-neutral-500 hover:bg-neutral-50'
                      }
                      ${!bookTitle ? 'opacity-50' : ''}
                    `}
                  >
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs font-serif italic opacity-70">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <BookshelfDrawer 
        isOpen={isBookshelfOpen} 
        onClose={() => setIsBookshelfOpen(false)} 
      />
    </>
  );
}
