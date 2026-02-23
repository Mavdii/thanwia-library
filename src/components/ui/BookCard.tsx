import { Link } from 'react-router-dom';
import { Download, BookOpen, FileText, GraduationCap, ScrollText, Layers } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { bookTypeLabels, getBookTypeColor, formatNumber } from '@/lib/utils';
import type { Book } from '@/types';

interface BookCardProps {
  book: Book;
}

const bookTypeIcons: Record<string, React.ElementType> = {
  school_book: BookOpen,
  external_book: ScrollText,
  teacher_notes: FileText,
  summary: Layers,
  concepts_booklet: GraduationCap,
};

export function BookCard({ book }: BookCardProps) {
  const TypeIcon = bookTypeIcons[book.book_type] || BookOpen;
  const badgeColor = getBookTypeColor(book.book_type);
  const sectionSlug = book.section?.slug || 'thanawya-amma';
  const subjectSlug = book.subject?.slug || 'general';

  return (
    <Link to={`/books/${sectionSlug}/${subjectSlug}/${book.slug}`}>
      <GlassCard className="h-full flex flex-col overflow-hidden group">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                <TypeIcon className="w-10 h-10 text-purple-400/50" />
              </div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent opacity-60" />
          
          {/* Book type badge */}
          <div className="absolute top-3 right-3">
            <span className={`book-type-badge ${badgeColor}`}>
              <TypeIcon className="w-3 h-3 ml-1" />
              {bookTypeLabels[book.book_type]}
            </span>
          </div>

          {/* Featured badge */}
          {book.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                مميز
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold font-['Cairo'] text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {book.title}
          </h3>
          
          {book.author && (
            <p className="text-gray-400 text-sm mb-3">
              {book.author}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="text-gray-500 text-sm">
              {book.subject?.name}
            </span>
            
            <div className="flex items-center gap-1 text-purple-400 text-sm">
              <Download className="w-4 h-4" />
              <span className="font-['JetBrains_Mono']">
                {formatNumber(book.download_count || 0)}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
