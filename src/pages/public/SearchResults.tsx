import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BookCard } from '@/components/ui/BookCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { debounce } from '@/lib/utils';
import { booksApi } from '@/lib/supabase';
import type { Book } from '@/types';



export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const books = await booksApi.searchBooks(searchQuery);
      setResults(books);
    } catch (error) {
      console.error('Error searching books:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      performSearch(searchQuery);
    }, 300),
    [performSearch]
  );

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Update URL
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
    
    debouncedSearch(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
    setResults([]);
    setHasSearched(false);
  };

  const title = query 
    ? `نتائج البحث عن "${query}" | مكتبة الثانوية`
    : 'البحث | مكتبة الثانوية';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="ابحث في مكتبة الثانوية عن كتب ومذكرات الثانوية العامة والأزهرية" />
      </Helmet>

      <section className="pt-28 pb-16 min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-black font-['Cairo'] mb-4">
              البحث في المكتبة
            </h1>
            <p className="text-gray-400">
              ابحث عن كتب، مذكرات، أو مدرسين
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="اكتب اسم الكتاب أو المؤلف..."
                className="glass-input w-full pr-12 pl-12 py-4 text-lg"
                dir="rtl"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Results */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Results count */}
              <div className="mb-6">
                {isLoading ? (
                  <div className="h-6 skeleton w-32" />
                ) : (
                  <p className="text-gray-400">
                    تم العثور على <span className="text-white font-bold">{results.length}</span> نتيجة
                    {query && ` لـ "${query}"`}
                  </p>
                )}
              </div>

              {/* Results grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {results.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold font-['Cairo'] mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-400 mb-4">
                    لم نجد أي كتاب يطابق بحثك. جرب كلمات مختلفة.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['رياضيات', 'فيزياء', 'كيمياء', 'أحياء'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setQuery(suggestion);
                          setSearchParams({ q: suggestion });
                          performSearch(suggestion);
                        }}
                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}

          {/* Popular searches (when no search yet) */}
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-lg font-bold font-['Cairo'] mb-4">عمليات بحث شائعة</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['كتاب الامتحان', 'تلخيص', 'مذكرة', 'تفاضل وتكامل', 'فيزياء', 'كيمياء عضوية'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setSearchParams({ q: term });
                      performSearch(term);
                    }}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors border border-white/10 hover:border-purple-500/30"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
