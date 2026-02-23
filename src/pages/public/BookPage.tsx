import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Download, 
  Eye, 
  Calendar, 
  User, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  ScrollText, 
  Layers,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BookSEO } from '@/components/seo/BookSEO';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { BookCard } from '@/components/ui/BookCard';
import { GlassCard } from '@/components/ui/GlassCard';

import { useUIStore } from '@/store';
import { booksApi, subjectsApi, sectionsApi } from '@/lib/supabase';
import { 
  bookTypeLabels, 
  gradeLabels, 
  formatNumber, 
  formatDate,
  generateBodyDescription 
} from '@/lib/utils';
import type { Book, Subject, Section } from '@/types';

// Book type icons
const bookTypeIcons: Record<string, React.ElementType> = {
  school_book: BookOpen,
  external_book: ScrollText,
  teacher_notes: FileText,
  summary: Layers,
  concepts_booklet: GraduationCap,
};



export function BookPage() {
  const { sectionSlug, subjectSlug, bookSlug } = useParams<{
    sectionSlug: string;
    subjectSlug: string;
    bookSlug: string;
  }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState<Book | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const { showToast } = useUIStore();

  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://maktabat-thanawya.com/books/${sectionSlug}/${subjectSlug}/${bookSlug}`;

  useEffect(() => {
    const fetchData = async () => {
      if (!bookSlug) return;
      
      setIsLoading(true);
      try {
        const bookData = await booksApi.getBookBySlug(bookSlug);
        if (bookData) {
          setBook(bookData);
          
          // Get subject and section data
          if (bookData.subject) {
            setSubject(bookData.subject);
          } else if (subjectSlug) {
            const subjectData = await subjectsApi.getSubjectBySlug(subjectSlug);
            setSubject(subjectData);
          }
          
          if (bookData.section) {
            setSection(bookData.section);
          } else if (sectionSlug) {
            const sectionData = await sectionsApi.getSectionBySlug(sectionSlug);
            setSection(sectionData);
          }
          
          // Increment view count
          await booksApi.incrementViewCount(bookData.id);
          
          // Get related books from same subject
          const related = await booksApi.getBooksBySubject(bookData.subject_id);
          setRelatedBooks(related.filter(b => b.id !== bookData.id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookSlug, subjectSlug, sectionSlug]);

  const handleDownload = async () => {
    if (book) {
      try {
        await booksApi.incrementDownloadCount(book.id);
        showToast('جاري التحويل إلى تيليجرام...', 'success');
        window.open(book.telegram_link, '_blank');
      } catch (error) {
        console.error('Error incrementing download count:', error);
        // Still open the link even if increment fails
        window.open(book.telegram_link, '_blank');
      }
    }
  };

  if (!book && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-bold font-['Cairo'] mb-4">الكتاب غير موجود</h1>
          <p className="text-gray-400 mb-6">عذراً، الكتاب المطلوب غير متوفر</p>
          <Link to="/">
            <button className="btn-primary">العودة للرئيسية</button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const TypeIcon = book ? bookTypeIcons[book.book_type] || BookOpen : BookOpen;
  const bookTypeLabel = book ? bookTypeLabels[book.book_type] : '';
  const gradeLabel = book?.grade ? gradeLabels[book.grade] : '';
  const description = book?.description || (book && subject ? generateBodyDescription(book.title, subject.name, book.book_type, book.author) : '');

  return (
    <>
      {book && subject && section && (
        <BookSEO 
          book={book} 
          subject={subject} 
          section={section} 
          url={currentUrl}
        />
      )}

      <section className="pt-28 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { label: section?.name || '', href: `/${sectionSlug}` },
                { label: subject?.name || '', href: `/${sectionSlug}/${subjectSlug}` },
                { label: book?.title || '' },
              ]} 
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] rounded-2xl skeleton" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 skeleton w-3/4" />
                <div className="h-4 skeleton w-1/2" />
                <div className="h-32 skeleton" />
              </div>
            </div>
          ) : book ? (
            <>
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Cover Image */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:col-span-1"
                >
                  <div className="sticky top-28">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10">
                      {book.cover_image_url ? (
                        <img
                          src={book.cover_image_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center">
                            <TypeIcon className="w-16 h-16 text-purple-400/50" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Book Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:col-span-2"
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="book-type-badge badge-external">
                      <TypeIcon className="w-3 h-3 ml-1" />
                      {bookTypeLabel}
                    </span>
                    {subject && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {subject.name}
                      </span>
                    )}
                    {gradeLabel && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {gradeLabel}
                      </span>
                    )}
                    {book.is_featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        مميز
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Cairo'] mb-4">
                    {book.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                    {book.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{book.author}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(book.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span className="font-['JetBrains_Mono']">{formatNumber(book.download_count)} تحميل</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="font-['JetBrains_Mono']">{formatNumber(book.view_count)} مشاهدة</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent mb-6" />

                  {/* Download Button */}
                  <button 
                    onClick={handleDownload}
                    className="btn-download mb-6"
                  >
                    <Download className="w-5 h-5" />
                    اضغط هنا للتحميل
                    <ExternalLink className="w-4 h-4 opacity-50" />
                  </button>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-gray-400 text-sm">مشاركة:</span>
                    <ShareButtons title={book.title} url={currentUrl} />
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold font-['Cairo'] mb-4 flex items-center gap-2">
                      <span className="w-6 h-1 bg-purple-500 rounded-full" />
                      وصف الكتاب
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Table of Contents */}
                  {book.table_of_contents && book.table_of_contents.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold font-['Cairo'] mb-4 flex items-center gap-2">
                        <span className="w-6 h-1 bg-purple-500 rounded-full" />
                        محتويات الكتاب
                      </h2>
                      <ul className="space-y-2">
                        {book.table_of_contents.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 text-gray-300">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-400 font-['JetBrains_Mono']">
                              {index + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Related Books */}
              <div className="border-t border-white/10 pt-12">
                <h2 className="text-2xl font-bold font-['Cairo'] mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                  كتب ذات صلة
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {relatedBooks.map((relatedBook, index) => (
                    <motion.div
                      key={relatedBook.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <BookCard book={relatedBook} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* Back */}
          <div className="mt-12">
            <Link 
              to={`/${sectionSlug}/${subjectSlug}`} 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للمواد</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
