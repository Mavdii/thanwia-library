import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuthStore, useAdminStore, useUIStore } from '@/store';
import { adminBooksApi } from '@/lib/supabase-admin';
import { bookTypeLabels, formatNumber } from '@/lib/utils';
import type { Book } from '@/types';

export function ManageBooks() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setActiveTab } = useAdminStore();
  const { showToast } = useUIStore();

  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
    setActiveTab('books');
    
    // Load books and subjects
    const loadData = async () => {
      try {
        const booksData = await adminBooksApi.getAllBooks();
        setBooks(booksData);
      } catch (error) {
        console.error('Error loading data:', error);
        showToast('حدث خطأ في تحميل البيانات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, navigate, setActiveTab, showToast]);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
      try {
        await adminBooksApi.deleteBook(id);
        setBooks(books.filter(b => b.id !== id));
        showToast('تم حذف الكتاب بنجاح', 'success');
      } catch (error) {
        console.error('Error deleting book:', error);
        showToast('حدث خطأ أثناء حذف الكتاب', 'error');
      }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const book = books.find(b => b.id === id);
      if (!book) return;
      
      await adminBooksApi.updateBook(id, { is_published: !book.is_published });
      setBooks(books.map(b => 
        b.id === id ? { ...b, is_published: !b.is_published } : b
      ));
      showToast('تم تحديث حالة النشر', 'success');
    } catch (error) {
      console.error('Error updating book:', error);
      showToast('حدث خطأ أثناء تحديث الكتاب', 'error');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-['Cairo']">إدارة الكتب</h1>
          <p className="text-gray-400 text-sm">إدارة وتحرير الكتب في المكتبة</p>
        </div>
        <button 
          onClick={() => navigate('/admin/books/add')}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          إضافة كتاب
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في الكتب..."
            className="glass-input w-full pr-12"
          />
        </div>
      </div>

      {/* Books Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-4 px-4 font-medium text-gray-400">الكتاب</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">المادة</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">النوع</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">التحميلات</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">المشاهدات</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">الحالة</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4"><div className="h-4 skeleton w-32" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-24" /></td>
                  </tr>
                ))
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center flex-shrink-0">
                          {book.cover_image_url ? (
                            <img src={book.cover_image_url} alt="" className="w-full h-full object-cover rounded" />
                          ) : (
                            <span className="text-xs text-gray-500">لا توجد صورة</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-gray-400 text-sm">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {book.subject?.name || 'غير محدد'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-300">
                        {bookTypeLabels[book.book_type]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['JetBrains_Mono'] text-gray-300">
                        {formatNumber(book.download_count)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['JetBrains_Mono'] text-gray-300">
                        {formatNumber(book.view_count)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(book.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          book.is_published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {book.is_published ? 'منشور' : 'مسودة'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/books/${book.section?.slug || 'general'}/${book.subject?.slug || 'general'}/${book.slug}`}
                          target="_blank"
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="عرض"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => navigate(`/admin/books/edit/${book.slug}`)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400">لا توجد نتائج</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredBooks.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              عرض {filteredBooks.length} من {books.length} كتاب
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
                السابق
              </button>
              <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
                التالي
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
