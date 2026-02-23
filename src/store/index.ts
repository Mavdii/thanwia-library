import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, Subject, Section, BookType, Grade } from '@/types';

// Auth Store
interface AuthState {
  user: { email: string; isAdmin: boolean } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simple admin auth - in production, use Supabase Auth
        if (email === 'admin@gmail.com' && password === 'admin#123') {
          set({ user: { email, isAdmin: true }, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Books Store
interface BooksState {
  books: Book[];
  featuredBooks: Book[];
  latestBooks: Book[];
  subjects: Subject[];
  sections: Section[];
  isLoading: boolean;
  error: string | null;
  selectedSubject: string | null;
  selectedType: BookType | null;
  selectedGrade: Grade | null;
  searchQuery: string;
  setBooks: (books: Book[]) => void;
  setFeaturedBooks: (books: Book[]) => void;
  setLatestBooks: (books: Book[]) => void;
  setSubjects: (subjects: Subject[]) => void;
  setSections: (sections: Section[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedSubject: (subject: string | null) => void;
  setSelectedType: (type: BookType | null) => void;
  setSelectedGrade: (grade: Grade | null) => void;
  setSearchQuery: (query: string) => void;
  getBooksBySubject: (subjectId: string) => Book[];
  getBookBySlug: (slug: string) => Book | undefined;
  getFilteredBooks: () => Book[];
  incrementDownloadCount: (bookId: string) => void;
  incrementViewCount: (bookId: string) => void;
}

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],
  featuredBooks: [],
  latestBooks: [],
  subjects: [],
  sections: [],
  isLoading: false,
  error: null,
  selectedSubject: null,
  selectedType: null,
  selectedGrade: null,
  searchQuery: '',
  
  setBooks: (books) => set({ books }),
  setFeaturedBooks: (featuredBooks) => set({ featuredBooks }),
  setLatestBooks: (latestBooks) => set({ latestBooks }),
  setSubjects: (subjects) => set({ subjects }),
  setSections: (sections) => set({ sections }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedSubject: (selectedSubject) => set({ selectedSubject }),
  setSelectedType: (selectedType) => set({ selectedType }),
  setSelectedGrade: (selectedGrade) => set({ selectedGrade }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  getBooksBySubject: (subjectId) => {
    return get().books.filter(book => book.subject_id === subjectId);
  },
  
  getBookBySlug: (slug) => {
    return get().books.find(book => book.slug === slug);
  },
  
  getFilteredBooks: () => {
    const { books, selectedType, selectedGrade, searchQuery } = get();
    return books.filter(book => {
      const matchesType = !selectedType || book.book_type === selectedType;
      const matchesGrade = !selectedGrade || book.grade === selectedGrade;
      const matchesSearch = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesGrade && matchesSearch;
    });
  },
  
  incrementDownloadCount: (bookId) => {
    set(state => ({
      books: state.books.map(book =>
        book.id === bookId
          ? { ...book, download_count: book.download_count + 1 }
          : book
      ),
    }));
  },
  
  incrementViewCount: (bookId) => {
    set(state => ({
      books: state.books.map(book =>
        book.id === bookId
          ? { ...book, view_count: book.view_count + 1 }
          : book
      ),
    }));
  },
}));

// UI Store
interface UIState {
  isMobileMenuOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setMobileMenuOpen: (open: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  toast: null,
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));

// Admin Store
interface AdminState {
  isSidebarOpen: boolean;
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isSidebarOpen: true,
  activeTab: 'dashboard',
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
