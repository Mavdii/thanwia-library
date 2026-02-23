import { Helmet } from 'react-helmet-async';
import type { Book, Subject, Section } from '@/types';

interface BookSEOProps {
  book: Book;
  subject: Subject;
  section: Section;
  url: string;
}

export function BookSEO({ book, subject, section, url }: BookSEOProps) {
  const title = book.seo_title || `${book.title} | ${subject.name} | مكتبة الثانوية`;
  const description = book.seo_description || 
    `تحميل ${book.title} مجاناً - ${book.book_type === 'school_book' ? 'كتاب المنهج' : 'مذكرة'} في مادة ${subject.name} للثانوية العامة. تحميل مباشر عبر تيليجرام.`;
  const keywords = book.seo_keywords?.join(', ') || 
    `${book.title}, ${subject.name}, ${section.name}, تحميل كتب ثانوية, مذكرات ثانوية`;

  // JSON-LD Structured Data
  const bookStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description || description,
    image: book.cover_image_url || 'https://maktabat-thanawya.com/og-default.jpg',
    author: {
      '@type': 'Person',
      name: book.author || 'مكتبة الثانوية',
    },
    publisher: {
      '@type': 'Organization',
      name: 'مكتبة الثانوية',
      url: 'https://maktabat-thanawya.com',
    },
    inLanguage: 'ar',
    educationalLevel: section.name,
    about: {
      '@type': 'Thing',
      name: subject.name,
    },
    url,
    datePublished: book.created_at,
    dateModified: book.updated_at,
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://maktabat-thanawya.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: section.name,
        item: `https://maktabat-thanawya.com/${section.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: subject.name,
        item: `https://maktabat-thanawya.com/${section.slug}/${subject.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: book.title,
        item: url,
      },
    ],
  };

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={`${book.title} — ${subject.name}`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={book.cover_image_url || 'https://maktabat-thanawya.com/og-default.jpg'} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:site_name" content="مكتبة الثانوية" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${book.title} | مكتبة الثانوية`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={book.cover_image_url || 'https://maktabat-thanawya.com/og-default.jpg'} />

      {/* Article Meta */}
      <meta property="article:section" content={subject.name} />
      <meta property="article:published_time" content={book.created_at} />
      <meta property="article:modified_time" content={book.updated_at} />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(bookStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
    </Helmet>
  );
}
