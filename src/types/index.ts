// Database Types

export type BookType = 'school_book' | 'external_book' | 'teacher_notes' | 'summary' | 'concepts_booklet';
export type Grade = 'first' | 'second' | 'third' | 'all';

export interface Section {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Track {
  id: string;
  section_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Subject {
  id: string;
  section_id: string;
  track_id: string | null;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  author: string | null;
  subject_id: string;
  book_type: BookType;
  grade: Grade | null;
  cover_image_url: string | null;
  telegram_link: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  table_of_contents: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  download_count: number;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string; // For soft delete
  // Joined fields
  subject?: Subject;
  section?: Section;
}

export interface DownloadClick {
  id: string;
  book_id: string;
  clicked_at: string;
}

export interface BookView {
  id: string;
  book_id: string;
  viewed_at: string;
  referrer: string | null;
}

export interface BookRequest {
  id: string;
  book_name: string;
  subject: string | null;
  section: string | null;
  requester_name: string | null;
  note: string | null;
  is_resolved: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

// UI Types

export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface BookTypeOption {
  value: BookType;
  label: string;
  color: string;
}

export interface GradeOption {
  value: Grade;
  label: string;
}

// SEO Types

export interface BookStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string | null;
  image: string | null;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    url: string;
  };
  inLanguage: string;
  educationalLevel: string;
  about: {
    '@type': string;
    name: string;
  };
  url: string;
  datePublished: string;
  dateModified: string;
}

export interface BreadcrumbItem {
  '@type': string;
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbStructuredData {
  '@context': string;
  '@type': string;
  itemListElement: BreadcrumbItem[];
}
