'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingQuotes from '@/components/LoadingQuotes';
import GlassLoading from '@/components/GlassLoading';
import { Character } from '@/lib/types';

function CharacterSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookTitle = searchParams.get('title');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookTitle) {
      router.push('/');
      return;
    }

    const fetchCharacters = async () => {
      try {
        const res = await fetch('/api/characters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookTitle }),
        });
        const data = await res.json();
        setCharacters(data.characters || []);
      } catch (e) {
        console.error('Failed to fetch characters:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [bookTitle, router]);

  const handleSelectCharacter = (character: Character) => {
    sessionStorage.setItem('selected_character', JSON.stringify(character));
    router.push(`/chat?title=${encodeURIComponent(bookTitle || '')}`);
  };

  if (!bookTitle) return null;

  if (loading) {
    return <GlassLoading title="正在召集书中人" subtitle="准备角色列表..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> 返回
      </button>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900">选择对话角色</h1>
          <p className="text-neutral-500">你想在《{bookTitle}》中与谁交流？</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((char, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelectCharacter(char)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                  <span className="text-2xl text-white font-serif">{char.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-900">{char.name}</h3>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">{char.role}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-neutral-600 line-clamp-2">{char.intro}</p>
              </div>
              
              <div className="mt-auto flex flex-wrap gap-2">
                {char.styleTag.split(/[,，、\s]+/).slice(0, 3).map((tag, i) => tag.trim() && (
                  <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CharacterSelectionPage() {
  return (
    <Suspense fallback={<GlassLoading title="准备角色" subtitle="正在加载..." />}>
      <CharacterSelectionContent />
    </Suspense>
  );
}
