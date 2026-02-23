import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { SubjectSEO } from '@/components/seo/SubjectSEO';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BookCard } from '@/components/ui/BookCard';
import { BookTypeFilter, GradeFilter } from '@/components/ui/FilterPills';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { booksApi, subjectsApi, sectionsApi } from '@/lib/supabase';
import type { Book, Subject, Section, BookType, Grade } from '@/types';

export function SubjectBooks() {
  const { sectionSlug, subjectSlug } = useParams<{ sectionSlug: string; subjectSlug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [selectedType, setSelectedType] = useState<BookType | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const filteredBooks = books.filter(book => {
    const matchesType = !selectedType || book.book_type === selectedType;
    const matchesGrade = !selectedGrade || book.grade === selectedGrade;
    return matchesType && matchesGrade;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!sectionSlug || !subjectSlug) return;
      
      setIsLoading(true);
      try {
        const sectionData = await sectionsApi.getSectionBySlug(sectionSlug);
        const subjectData = await subjectsApi.getSubjectBySlug(subjectSlug);
        
        if (sectionData) setSection(sectionData);
        if (subjectData) {
          setSubject(subjectData);
          const booksData = await booksApi.getBooksBySubject(subjectData.id);
          setBooks(booksData);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sectionSlug, subjectSlug]);

  return (
    <>
      {subject && section && (
        <SubjectSEO 
          subject={subject} 
          section={section} 
          url={`https://maktabat-thanawya.com/${sectionSlug}/${subjectSlug}`}
        />
      )}

      <section className="pt-28 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { label: section?.name || '', href: `/${sectionSlug}` },
                { label: subject?.name || '' },
              ]} 
            />
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Cairo']">
                  كتب ومذكرات {subject?.name || ''}
                </h1>
                <p className="text-gray-400">{section?.name || ''}</p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div>
              <h3 className="text-sm text-gray-400 mb-2">نوع الكتاب</h3>
              <BookTypeFilter selected={selectedType} onSelect={setSelectedType} />
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-2">الصف الدراسي</h3>
              <GradeFilter selected={selectedGrade} onSelect={setSelectedGrade} />
            </div>
          </motion.div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-400">
              تم العثور على <span className="text-white font-bold">{filteredBooks.length}</span> كتاب
            </p>
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredBooks.map((book, index) => (
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
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold font-['Cairo'] mb-2">لا توجد نتائج</h3>
              <p className="text-gray-400">جرب تغيير الفلاتر للعثور على ما تبحث عنه</p>
            </div>
          )}

          {/* Back */}
          <div className="mt-12">
            <Link 
              to={`/${sectionSlug}`} 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للقسم</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
