'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Loader2, Sparkles, Ghost, MessageSquare, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{title: string, author: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (bookTitle.length > 1 && !loading) {
         try {
           const res = await fetch(`/api/bookSearch?q=${encodeURIComponent(bookTitle)}`);
           const data = await res.json();
           setSuggestions(data.suggestions);
           setShowSuggestions(true);
         } catch (e) {
           console.error(e);
         }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [bookTitle]);

  const handleStart = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bookTitle.trim()) return;

    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const params = new URLSearchParams();
    params.set('title', bookTitle);
    if (author) params.set('author', author);
    
    router.push(`/book?${params.toString()}`);
    setLoading(false);
  };

  const modules = [
    {
      title: "进入故事",
      enTitle: "Enter the Story",
      desc: "穿越成为书中角色，亲历那些关键时刻，做出你的选择。",
      color: "hover:border-neutral-300 hover:bg-neutral-50/50"
    },
    {
      title: "与之交谈",
      enTitle: "Speak with the Book",
      desc: "让书本来阅读你。通过深度对话，发现你与这本书的灵魂共鸣。",
      color: "hover:border-neutral-300 hover:bg-neutral-50/50"
    },
    {
      title: "带走一些",
      enTitle: "Take Something With You",
      desc: "弱水三千，只取一瓢。在纷繁的文字中，带走一个改变你生活的念头。",
      color: "hover:border-neutral-300 hover:bg-neutral-50/50"
    }
  ];

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-16 relative z-10"
      >
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-2xl mx-auto pt-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-neutral-900 leading-tight">
            纸上相遇
          </h1>
          <p className="text-sm md:text-base text-neutral-400 font-medium uppercase tracking-[0.2em]">
            Meet Between Pages
          </p>
          <p className="text-lg md:text-xl text-neutral-500 font-serif leading-relaxed max-w-lg mx-auto">
            和书中人物聊一会儿，比读完整本书更快理解它。
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-xl mx-auto">
          <form onSubmit={handleStart} className="space-y-6 relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-neutral-200/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white p-2 rounded-2xl shadow-lg shadow-neutral-100/50 border border-neutral-100 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => {
                      setBookTitle(e.target.value);
                      if(e.target.value.length === 0) setShowSuggestions(false);
                    }}
                    onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                    placeholder="输入书名，开始对话..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-lg outline-none placeholder:text-neutral-400 text-neutral-900 font-serif"
                    required
                  />
                  {/* Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-50">
                      {suggestions.map((s, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setBookTitle(s.title);
                            setAuthor(s.author);
                            setShowSuggestions(false);
                          }}
                          className="px-6 py-4 hover:bg-neutral-50 cursor-pointer flex justify-between items-center group transition-colors border-b border-neutral-50 last:border-0"
                        >
                          <span className="font-serif text-lg text-neutral-800">{s.title}</span>
                          <span className="text-sm text-neutral-400 group-hover:text-neutral-600">{s.author}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !bookTitle.trim()}
                  className="bg-neutral-900 text-[#fdfbf7] px-8 py-4 md:py-0 rounded-xl font-medium hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>开始阅读 <ArrowRight size={18} /></>}
                </button>
              </div>
            </div>
            
            {/* Optional Author Input (Collapsible or subtle) */}
            <input
               type="text"
               value={author}
               onChange={(e) => setAuthor(e.target.value)}
               placeholder="作者（可选）"
               className="w-full text-center bg-transparent text-sm outline-none placeholder:text-neutral-300 text-neutral-500 hover:placeholder:text-neutral-400 transition-colors"
            />
          </form>
        </div>

        {/* Module Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-neutral-200/50">
          {modules.map((m, i) => (
            <div key={i} className={`group p-6 rounded-2xl bg-white border border-neutral-100 transition-all duration-300 hover:shadow-md ${m.color}`}>
              <h3 className="text-xl font-serif font-bold text-neutral-900 mb-2">{m.title}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">{m.enTitle}</p>
              <p className="text-neutral-500 leading-relaxed text-sm">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
