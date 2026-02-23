// =====================================================
// LOCAL STORAGE DATABASE
// Replaces Supabase with browser localStorage + IndexedDB
// =====================================================

import type { Book, Subject, Section, BookRequest } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  BOOKS: 'maktabat_books',
  SUBJECTS: 'maktabat_subjects',
  SECTIONS: 'maktabat_sections',
  BOOK_REQUESTS: 'maktabat_book_requests',
  ADMIN_ACTIONS: 'maktabat_admin_actions',
};

// Helper functions
const generateId = () => crypto.randomUUID();

const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// Initialize default data
export const initializeDefaultData = () => {
  // Check if already initialized
  if (localStorage.getItem('maktabat_initialized')) {
    return;
  }

  // Default sections
  const sections: Section[] = [
    {
      id: generateId(),
      name: 'ثانوي عام',
      slug: 'thanawya-amma',
      description: 'جميع مواد الثانوية العامة - علمي وأدبي',
      color: '#8B5CF6',
      icon: '🎓',
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'ثانوي أزهري',
      slug: 'thanawya-azhar',
      description: 'جميع مواد الثانوية الأزهرية',
      color: '#10B981',
      icon: '📚',
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
    },
  ];

  saveToStorage(STORAGE_KEYS.SECTIONS, sections);

  // Default subjects for Thanawya Amma
  const ammaSection = sections.find(s => s.slug === 'thanawya-amma')!;
  const azharSection = sections.find(s => s.slug === 'thanawya-azhar')!;

  const subjects: Subject[] = [
    // Thanawya Amma
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'رياضيات', slug: 'math', icon: '🔢', color: null, description: 'مادة الرياضيات للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 1, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'فيزياء', slug: 'physics', icon: '⚛️', color: null, description: 'مادة الفيزياء للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 2, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'كيمياء', slug: 'chemistry', icon: '🧪', color: null, description: 'مادة الكيمياء للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 3, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'أحياء', slug: 'biology', icon: '🧬', color: null, description: 'مادة الأحياء للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 4, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'لغة عربية', slug: 'arabic', icon: '📖', color: null, description: 'مادة اللغة العربية للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 5, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'لغة إنجليزية', slug: 'english', icon: '🇬🇧', color: null, description: 'مادة اللغة الإنجليزية للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 6, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'تاريخ', slug: 'history', icon: '🏛️', color: null, description: 'مادة التاريخ للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 7, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'جغرافيا', slug: 'geography', icon: '🌍', color: null, description: 'مادة الجغرافيا للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 8, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'فلسفة', slug: 'philosophy', icon: '🤔', color: null, description: 'مادة الفلسفة والمنطق للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 9, created_at: new Date().toISOString() },
    { id: generateId(), section_id: ammaSection.id, track_id: null, name: 'علم نفس', slug: 'psychology', icon: '🧠', color: null, description: 'مادة علم النفس للثانوية العامة', seo_title: null, seo_description: null, is_active: true, sort_order: 10, created_at: new Date().toISOString() },
    
    // Thanawya Azhar
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'رياضيات', slug: 'azhar-math', icon: '🔢', color: null, description: 'مادة الرياضيات للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 1, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'فيزياء', slug: 'azhar-physics', icon: '⚛️', color: null, description: 'مادة الفيزياء للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 2, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'كيمياء', slug: 'azhar-chemistry', icon: '🧪', color: null, description: 'مادة الكيمياء للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 3, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'أحياء', slug: 'azhar-biology', icon: '🧬', color: null, description: 'مادة الأحياء للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 4, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'لغة عربية', slug: 'azhar-arabic', icon: '📖', color: null, description: 'مادة اللغة العربية للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 5, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'لغة إنجليزية', slug: 'azhar-english', icon: '🇬🇧', color: null, description: 'مادة اللغة الإنجليزية للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 6, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'تفسير', slug: 'azhar-tafseer', icon: '📚', color: null, description: 'مادة التفسير للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 7, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'حديث', slug: 'azhar-hadith', icon: '📜', color: null, description: 'مادة الحديث للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 8, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'فقه', slug: 'azhar-fiqh', icon: '⚖️', color: null, description: 'مادة الفقه للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 9, created_at: new Date().toISOString() },
    { id: generateId(), section_id: azharSection.id, track_id: null, name: 'توحيد', slug: 'azhar-tawheed', icon: '☪️', color: null, description: 'مادة التوحيد للثانوية الأزهرية', seo_title: null, seo_description: null, is_active: true, sort_order: 10, created_at: new Date().toISOString() },
  ];

  saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
  saveToStorage(STORAGE_KEYS.BOOKS, []);
  saveToStorage(STORAGE_KEYS.BOOK_REQUESTS, []);
  saveToStorage(STORAGE_KEYS.ADMIN_ACTIONS, []);

  localStorage.setItem('maktabat_initialized', 'true');
};

// Books API
export const localBooksApi = {
  async getAllBooks(): Promise<Book[]> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const subjects = getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
    const sections = getFromStorage<Section>(STORAGE_KEYS.SECTIONS);

    return books
      .filter(b => !b.deleted_at)
      .map(book => {
        const subject = subjects.find(s => s.id === book.subject_id);
        const section = subject ? sections.find(sec => sec.id === subject.section_id) : undefined;
        return { ...book, subject, section };
      })
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getFeaturedBooks(limit = 8): Promise<Book[]> {
    const allBooks = await this.getAllBooks();
    return allBooks
      .filter(b => b.is_published && b.is_featured)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  async getLatestBooks(limit = 8): Promise<Book[]> {
    const allBooks = await this.getAllBooks();
    return allBooks
      .filter(b => b.is_published)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  async getBookBySlug(slug: string): Promise<Book | null> {
    const allBooks = await this.getAllBooks();
    return allBooks.find(b => b.slug === slug && b.is_published) || null;
  },

  async getBooksBySubject(subjectId: string): Promise<Book[]> {
    const allBooks = await this.getAllBooks();
    return allBooks.filter(b => b.subject_id === subjectId && b.is_published);
  },

  async searchBooks(query: string): Promise<Book[]> {
    const allBooks = await this.getAllBooks();
    const lowerQuery = query.toLowerCase();
    return allBooks.filter(b => 
      b.is_published && (
        b.title.toLowerCase().includes(lowerQuery) ||
        (b.author && b.author.toLowerCase().includes(lowerQuery)) ||
        (b.description && b.description.toLowerCase().includes(lowerQuery))
      )
    );
  },

  async createBook(book: Partial<Book>): Promise<Book> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const newBook: Book = {
      id: generateId(),
      title: book.title!,
      slug: book.slug!,
      description: book.description || null,
      author: book.author || null,
      subject_id: book.subject_id!,
      book_type: book.book_type || 'external_book',
      grade: book.grade || null,
      cover_image_url: book.cover_image_url || null,
      telegram_link: book.telegram_link!,
      seo_title: book.seo_title || null,
      seo_description: book.seo_description || null,
      seo_keywords: book.seo_keywords || null,
      table_of_contents: book.table_of_contents || null,
      is_featured: book.is_featured || false,
      is_published: book.is_published !== undefined ? book.is_published : true,
      download_count: 0,
      view_count: 0,
      sort_order: book.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    books.push(newBook);
    saveToStorage(STORAGE_KEYS.BOOKS, books);
    return newBook;
  },

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const index = books.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Book not found');
    
    books[index] = {
      ...books[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.BOOKS, books);
    return books[index];
  },

  async deleteBook(id: string): Promise<void> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const filtered = books.filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.BOOKS, filtered);
  },

  async incrementDownloadCount(bookId: string): Promise<void> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.download_count = (book.download_count || 0) + 1;
      saveToStorage(STORAGE_KEYS.BOOKS, books);
    }
  },

  async incrementViewCount(bookId: string): Promise<void> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.view_count = (book.view_count || 0) + 1;
      saveToStorage(STORAGE_KEYS.BOOKS, books);
    }
  },
};

// Subjects API
export const localSubjectsApi = {
  async getAllSubjects(): Promise<Subject[]> {
    return getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS)
      .filter(s => s.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getSubjectsBySection(sectionId: string): Promise<Subject[]> {
    const subjects = await this.getAllSubjects();
    return subjects.filter(s => s.section_id === sectionId);
  },

  async getSubjectBySlug(slug: string): Promise<Subject | null> {
    const subjects = await this.getAllSubjects();
    return subjects.find(s => s.slug === slug) || null;
  },

  async createSubject(subject: Partial<Subject>): Promise<Subject> {
    const subjects = getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
    const newSubject: Subject = {
      id: generateId(),
      section_id: subject.section_id!,
      track_id: subject.track_id || null,
      name: subject.name!,
      slug: subject.slug!,
      icon: subject.icon || '📚',
      color: subject.color || null,
      description: subject.description || null,
      seo_title: subject.seo_title || null,
      seo_description: subject.seo_description || null,
      is_active: subject.is_active !== undefined ? subject.is_active : true,
      sort_order: subject.sort_order || 0,
      created_at: new Date().toISOString(),
    };
    subjects.push(newSubject);
    saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
    return newSubject;
  },

  async updateSubject(id: string, updates: Partial<Subject>): Promise<Subject> {
    const subjects = getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
    const index = subjects.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Subject not found');
    
    subjects[index] = { ...subjects[index], ...updates };
    saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
    return subjects[index];
  },

  async deleteSubject(id: string): Promise<void> {
    const subjects = getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
    const filtered = subjects.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SUBJECTS, filtered);
  },
};

// Sections API
export const localSectionsApi = {
  async getAllSections(): Promise<Section[]> {
    return getFromStorage<Section>(STORAGE_KEYS.SECTIONS)
      .filter(s => s.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getSectionBySlug(slug: string): Promise<Section | null> {
    const sections = await this.getAllSections();
    return sections.find(s => s.slug === slug) || null;
  },

  async createSection(section: Partial<Section>): Promise<Section> {
    const sections = getFromStorage<Section>(STORAGE_KEYS.SECTIONS);
    const newSection: Section = {
      id: generateId(),
      name: section.name!,
      slug: section.slug!,
      description: section.description || null,
      color: section.color || null,
      icon: section.icon || null,
      is_active: section.is_active !== undefined ? section.is_active : true,
      sort_order: section.sort_order || 0,
      created_at: new Date().toISOString(),
    };
    sections.push(newSection);
    saveToStorage(STORAGE_KEYS.SECTIONS, sections);
    return newSection;
  },

  async updateSection(id: string, updates: Partial<Section>): Promise<Section> {
    const sections = getFromStorage<Section>(STORAGE_KEYS.SECTIONS);
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Section not found');
    
    sections[index] = { ...sections[index], ...updates };
    saveToStorage(STORAGE_KEYS.SECTIONS, sections);
    return sections[index];
  },

  async deleteSection(id: string): Promise<void> {
    const sections = getFromStorage<Section>(STORAGE_KEYS.SECTIONS);
    const filtered = sections.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SECTIONS, filtered);
  },
};

// Book Requests API
export const localBookRequestsApi = {
  async createRequest(request: Partial<BookRequest>): Promise<BookRequest> {
    const requests = getFromStorage<BookRequest>(STORAGE_KEYS.BOOK_REQUESTS);
    const newRequest: BookRequest = {
      id: generateId(),
      book_name: request.book_name!,
      subject: request.subject || null,
      section: request.section || null,
      requester_name: request.requester_name || null,
      note: request.note || null,
      is_resolved: false,
      created_at: new Date().toISOString(),
    };
    requests.push(newRequest);
    saveToStorage(STORAGE_KEYS.BOOK_REQUESTS, requests);
    return newRequest;
  },

  async getAllRequests(): Promise<BookRequest[]> {
    return getFromStorage<BookRequest>(STORAGE_KEYS.BOOK_REQUESTS)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async updateRequest(id: string, updates: Partial<BookRequest>): Promise<BookRequest> {
    const requests = getFromStorage<BookRequest>(STORAGE_KEYS.BOOK_REQUESTS);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    requests[index] = { ...requests[index], ...updates };
    saveToStorage(STORAGE_KEYS.BOOK_REQUESTS, requests);
    return requests[index];
  },

  async deleteRequest(id: string): Promise<void> {
    const requests = getFromStorage<BookRequest>(STORAGE_KEYS.BOOK_REQUESTS);
    const filtered = requests.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.BOOK_REQUESTS, filtered);
  },

  async deleteAllRequests(): Promise<void> {
    saveToStorage(STORAGE_KEYS.BOOK_REQUESTS, []);
  },
};

// Storage API (for images - convert to base64)
export const localStorageApi = {
  async uploadImage(file: File, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Store in localStorage with path as key
        try {
          localStorage.setItem(`image_${path}`, base64);
          resolve(base64);
        } catch (error) {
          reject(new Error('Image too large for localStorage'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async deleteImage(path: string): Promise<void> {
    localStorage.removeItem(`image_${path}`);
  },
};

// Database operations
export const localDatabaseApi = {
  async deleteAllBooks(): Promise<void> {
    saveToStorage(STORAGE_KEYS.BOOKS, []);
  },

  async resetBookStats(): Promise<void> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    books.forEach(book => {
      book.download_count = 0;
      book.view_count = 0;
    });
    saveToStorage(STORAGE_KEYS.BOOKS, books);
  },

  async getStatistics() {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    return {
      total_books: books.length,
      total_downloads: books.reduce((sum, b) => sum + (b.download_count || 0), 0),
      total_views: books.reduce((sum, b) => sum + (b.view_count || 0), 0),
      published_books: books.filter(b => b.is_published).length,
      featured_books: books.filter(b => b.is_featured).length,
    };
  },

  async detectTestBooks() {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const testKeywords = ['test', 'تجربة', 'تجريبي', 'اختبار', 'sample', 'demo', 'مؤقت', 'temp', 'xxx', '123'];
    
    return books
      .filter(b => !b.deleted_at)
      .map(book => {
        const titleLower = book.title.toLowerCase();
        let reason = 'غير محدد';
        let confidence = 0;

        if (testKeywords.some(kw => titleLower.includes(kw))) {
          reason = 'عنوان يحتوي على كلمة تجريبية';
          confidence = 100;
        } else if (!book.telegram_link || book.telegram_link === '') {
          reason = 'رابط التيليجرام مفقود';
          confidence = 90;
        } else if (!book.description || book.description.length < 10) {
          reason = 'وصف مفقود أو قصير جداً';
          confidence = 50;
        }

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          created_at: book.created_at,
          reason,
          confidence,
        };
      })
      .filter(b => b.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence);
  },

  async softDeleteBooks(bookIds: string[], adminEmail?: string) {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    let deletedCount = 0;

    books.forEach(book => {
      if (bookIds.includes(book.id) && !book.deleted_at) {
        book.deleted_at = new Date().toISOString();
        deletedCount++;
      }
    });

    saveToStorage(STORAGE_KEYS.BOOKS, books);
    
    const actionId = generateId();
    const actions = getFromStorage(STORAGE_KEYS.ADMIN_ACTIONS);
    actions.push({
      id: actionId,
      action_type: 'soft_delete',
      target_ids: bookIds,
      count: deletedCount,
      admin_email: adminEmail,
      created_at: new Date().toISOString(),
    });
    saveToStorage(STORAGE_KEYS.ADMIN_ACTIONS, actions);

    return { deleted_count: deletedCount, action_id: actionId };
  },

  async undoSoftDelete(actionId: string) {
    const actions = getFromStorage<any>(STORAGE_KEYS.ADMIN_ACTIONS);
    const action = actions.find((a: any) => a.id === actionId);
    
    if (!action) throw new Error('Action not found');

    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    let restoredCount = 0;

    books.forEach(book => {
      if (action.target_ids && action.target_ids.includes(book.id) && book.deleted_at) {
        delete book.deleted_at;
        restoredCount++;
      }
    });

    saveToStorage(STORAGE_KEYS.BOOKS, books);
    return restoredCount;
  },

  async hardDeleteBooks(bookIds: string[]): Promise<number> {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const filtered = books.filter(b => !bookIds.includes(b.id));
    const deletedCount = books.length - filtered.length;
    
    saveToStorage(STORAGE_KEYS.BOOKS, filtered);
    return deletedCount;
  },

  async autoHardDeleteExpired() {
    const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
    const now = new Date().getTime();
    const filtered = books.filter(b => {
      if (!b.deleted_at) return true;
      const deletedTime = new Date(b.deleted_at).getTime();
      return now - deletedTime < 60000; // Keep if deleted less than 60 seconds ago
    });
    
    const deletedCount = books.length - filtered.length;
    saveToStorage(STORAGE_KEYS.BOOKS, filtered);
    return deletedCount;
  },
};
