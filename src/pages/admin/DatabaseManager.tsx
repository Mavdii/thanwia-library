import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, Database, RefreshCw, Undo2, CheckSquare, Square, Filter } from 'lucide-react';
import { adminDatabaseApi, adminBookRequestsApi, adminBooksApi } from '@/lib/supabase-admin';
import { useUIStore } from '@/store';
import { formatDate } from '@/lib/utils';

interface TestBook {
  id: string;
  title: string;
  author: string;
  created_at: string;
  reason: string;
  confidence: number;
}

export function DatabaseManager() {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { showToast } = useUIStore();

  // Test data deletion state
  const [testBooks, setTestBooks] = useState<TestBook[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'all' | 'suspected' | 'published'>('suspected');
  const [loadingTestBooks, setLoadingTestBooks] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [undoActionId, setUndoActionId] = useState<string | null>(null);
  const [undoTimer, setUndoTimer] = useState<number>(0);

  useEffect(() => {
    loadTestBooks();
    loadAllBooks();
  }, []);

  // Undo countdown timer
  useEffect(() => {
    if (undoTimer > 0) {
      const timer = setTimeout(() => setUndoTimer(undoTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (undoTimer === 0 && undoActionId) {
      // Auto hard delete after 60 seconds
      setUndoActionId(null);
    }
  }, [undoTimer, undoActionId]);

  const loadTestBooks = async () => {
    try {
      setLoadingTestBooks(true);
      const detected = await adminDatabaseApi.detectTestBooks();
      setTestBooks(detected as any);
      
      // Auto-select high confidence test books
      const highConfidence = detected
        .filter(b => b.confidence >= 80)
        .map(b => b.id);
      setSelectedBooks(new Set(highConfidence));
    } catch (error) {
      console.error('Error loading test books:', error);
      showToast('حدث خطأ في تحميل البيانات التجريبية', 'error');
    } finally {
      setLoadingTestBooks(false);
    }
  };

  const loadAllBooks = async () => {
    try {
      const books = await adminBooksApi.getAllBooks();
      setAllBooks(books);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const handleDeleteAllBooks = async () => {
    if (confirmText !== 'حذف الكل') {
      showToast('يرجى كتابة "حذف الكل" للتأكيد', 'error');
      return;
    }

    try {
      setLoading(true);
      await adminDatabaseApi.deleteAllBooks();
      showToast('تم حذف جميع الكتب بنجاح', 'success');
      setConfirmText('');
      loadAllBooks();
      loadTestBooks();
    } catch (error) {
      console.error('Error deleting books:', error);
      showToast('حدث خطأ في حذف الكتب', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllRequests = async () => {
    try {
      setLoading(true);
      await adminBookRequestsApi.deleteAllRequests();
      showToast('تم حذف جميع الطلبات بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting requests:', error);
      showToast('حدث خطأ في حذف الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetStats = async () => {
    try {
      setLoading(true);
      await adminDatabaseApi.resetBookStats();
      showToast('تم إعادة تعيين الإحصائيات بنجاح', 'success');
    } catch (error) {
      console.error('Error resetting stats:', error);
      showToast('حدث خطأ في إعادة تعيين الإحصائيات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookSelection = (bookId: string) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const selectAll = () => {
    const filtered = getFilteredBooks();
    setSelectedBooks(new Set(filtered.map(b => b.id)));
  };

  const deselectAll = () => {
    setSelectedBooks(new Set());
  };

  const getFilteredBooks = () => {
    if (filterMode === 'suspected') {
      return testBooks;
    } else if (filterMode === 'published') {
      return allBooks.filter(b => b.is_published);
    } else {
      return allBooks;
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBooks.size === 0) {
      showToast('لم يتم تحديد أي كتب', 'error');
      return;
    }

    if (selectedBooks.size > 50) {
      showToast('لا يمكن حذف أكثر من 50 كتاب في المرة الواحدة', 'error');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const bookIds = Array.from(selectedBooks);
      const result = await adminDatabaseApi.softDeleteBooks(bookIds, 'admin@gmail.com');

      showToast(`تم حذف ${result.deleted_count} كتاب مؤقتاً. لديك 60 ثانية للتراجع`, 'success');
      
      // Set undo timer
      setUndoActionId(result.action_id);
      setUndoTimer(60);

      // Reload data
      loadAllBooks();
      loadTestBooks();
      setSelectedBooks(new Set());

      // Auto hard delete after 60 seconds
      setTimeout(async () => {
        try {
          await adminDatabaseApi.autoHardDeleteExpired();
          setUndoActionId(null);
          setUndoTimer(0);
          showToast('تم الحذف النهائي للكتب', 'info');
        } catch (error) {
          console.error('Error auto hard deleting:', error);
        }
      }, 60000);
    } catch (error: any) {
      console.error('Error deleting books:', error);
      showToast(error.message || 'حدث خطأ أثناء حذف الكتب', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!undoActionId) return;

    try {
      setLoading(true);
      const restoredCount = await adminDatabaseApi.undoSoftDelete(undoActionId);
      showToast(`تم استرجاع ${restoredCount} كتاب بنجاح`, 'success');
      
      setUndoActionId(null);
      setUndoTimer(0);
      
      loadAllBooks();
      loadTestBooks();
    } catch (error: any) {
      console.error('Error undoing delete:', error);
      showToast(error.message || 'حدث خطأ أثناء التراجع', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = getFilteredBooks();
  const selectedCount = selectedBooks.size;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Cairo'] mb-2 text-[var(--text-primary)]">
          إدارة قاعدة البيانات
        </h1>
        <p className="text-[var(--text-secondary)]">
          حذف البيانات التجريبية وإعادة تعيين الإحصائيات
        </p>
      </div>

      {/* Warning Banner */}
      <div className="glass-card p-6 mb-8 border-2 border-red-500/30 bg-red-500/5">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-2">تحذير هام</h3>
            <p className="text-[var(--text-secondary)] mb-2">
              العمليات التالية لا يمكن التراجع عنها بعد 60 ثانية. تأكد من أنك تريد حذف البيانات قبل المتابعة.
            </p>
            <p className="text-[var(--text-secondary)]">
              يُنصح بعمل نسخة احتياطية من قاعدة البيانات قبل تنفيذ أي عملية حذف.
            </p>
          </div>
        </div>
      </div>

      {/* Undo Banner */}
      {undoActionId && undoTimer > 0 && (
        <div className="glass-card p-6 mb-8 border-2 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-amber-400">تم الحذف المؤقت</h3>
                <p className="text-[var(--text-secondary)]">
                  سيتم الحذف النهائي بعد {undoTimer} ثانية
                </p>
              </div>
            </div>
            <button
              onClick={handleUndo}
              disabled={loading}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Undo2 className="w-5 h-5" />
              تراجع عن الحذف
            </button>
          </div>
        </div>
      )}

      {/* Test Data Deletion Section */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-['Cairo'] text-[var(--text-primary)] mb-2">
              حذف البيانات التجريبية
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">
              اكتشاف وحذف الكتب التجريبية تلقائياً
            </p>
          </div>
          <button
            onClick={loadTestBooks}
            disabled={loadingTestBooks}
            className="btn-ghost flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${loadingTestBooks ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilterMode('suspected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterMode === 'suspected'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" />
            المشتبه بها ({testBooks.length})
          </button>
          <button
            onClick={() => setFilterMode('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterMode === 'published'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            المنشورة فقط ({allBooks.filter(b => b.is_published).length})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            الكل ({allBooks.length})
          </button>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between mb-4 p-4 rounded-lg bg-white/5">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAll}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              تحديد الكل
            </button>
            <button
              onClick={deselectAll}
              className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              إلغاء الكل
            </button>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            محدد: <span className="text-[var(--text-primary)] font-bold">{selectedCount}</span> من {filteredBooks.length}
          </div>
        </div>

        {/* Books Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4 font-medium text-gray-400 w-12"></th>
                <th className="text-right py-3 px-4 font-medium text-gray-400">العنوان</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400">المؤلف</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400">تاريخ الإنشاء</th>
                {filterMode === 'suspected' && (
                  <>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">السبب</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">الثقة</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {loadingTestBooks ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
                    <p className="text-gray-400">جاري التحميل...</p>
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    لا توجد كتب
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      selectedBooks.has(book.id) ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedBooks.has(book.id)}
                        onChange={() => toggleBookSelection(book.id)}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 text-[var(--text-primary)]">{book.title}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{book.author || '-'}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] text-sm">
                      {formatDate(book.created_at)}
                    </td>
                    {filterMode === 'suspected' && (
                      <>
                        <td className="py-3 px-4 text-[var(--text-secondary)] text-sm">
                          {book.reason}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              book.confidence >= 80
                                ? 'bg-red-500/20 text-red-400'
                                : book.confidence >= 50
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {book.confidence}%
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Button */}
        {selectedCount > 0 && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div>
              <p className="text-red-400 font-bold">سيتم حذف {selectedCount} كتاب</p>
              <p className="text-sm text-[var(--text-secondary)]">
                سيكون لديك 60 ثانية للتراجع عن الحذف
              </p>
            </div>
            <button
              onClick={handleDeleteSelected}
              disabled={loading}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              حذف المحدد نهائياً
            </button>
          </div>
        )}
      </div>

      {/* Other Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delete All Books */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Cairo'] text-[var(--text-primary)]">
                حذف جميع الكتب
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                حذف جميع الكتب والمذكرات من قاعدة البيانات
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              اكتب "حذف الكل" للتأكيد:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="حذف الكل"
              className="glass-input w-full"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleDeleteAllBooks}
            disabled={loading || confirmText !== 'حذف الكل'}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                حذف جميع الكتب
              </>
            )}
          </button>
        </div>

        {/* Delete All Requests */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Cairo'] text-[var(--text-primary)]">
                حذف جميع الطلبات
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                حذف جميع طلبات الكتب من الطلاب
              </p>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-4">
            سيتم حذف جميع طلبات الكتب المقدمة من الطلاب. هذه العملية لا يمكن التراجع عنها.
          </p>

          <button
            onClick={handleDeleteAllRequests}
            disabled={loading}
            className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                حذف جميع الطلبات
              </>
            )}
          </button>
        </div>

        {/* Reset Stats */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Cairo'] text-[var(--text-primary)]">
                إعادة تعيين الإحصائيات
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                إعادة تعيين عدادات التحميل والمشاهدات
              </p>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-4">
            سيتم إعادة تعيين جميع عدادات التحميل والمشاهدات إلى صفر لجميع الكتب.
          </p>

          <button
            onClick={handleResetStats}
            disabled={loading}
            className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                جاري إعادة التعيين...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                إعادة تعيين الإحصائيات
              </>
            )}
          </button>
        </div>

        {/* Database Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Cairo'] text-[var(--text-primary)]">
                معلومات قاعدة البيانات
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                معلومات عن البيانات المخزنة
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-[var(--text-secondary)]">إجمالي الكتب:</span>
              <span className="text-[var(--text-primary)] font-bold">{allBooks.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-[var(--text-secondary)]">كتب مشتبه بها:</span>
              <span className="text-red-400 font-bold">{testBooks.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-[var(--text-secondary)]">كتب منشورة:</span>
              <span className="text-green-400 font-bold">
                {allBooks.filter(b => b.is_published).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold font-['Cairo'] mb-4 text-red-400">
              تأكيد الحذف
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              أنت على وشك حذف {selectedCount} كتاب. سيكون لديك 60 ثانية للتراجع عن الحذف.
            </p>
            
            <div className="mb-6 max-h-60 overflow-y-auto">
              <h4 className="font-bold mb-2 text-[var(--text-primary)]">الكتب المحددة:</h4>
              <ul className="space-y-1">
                {Array.from(selectedBooks).slice(0, 20).map(id => {
                  const book = filteredBooks.find(b => b.id === id);
                  return book ? (
                    <li key={id} className="text-sm text-[var(--text-secondary)]">
                      • {book.title}
                    </li>
                  ) : null;
                })}
                {selectedCount > 20 && (
                  <li className="text-sm text-[var(--text-muted)]">
                    ... و {selectedCount - 20} كتاب آخر
                  </li>
                )}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                نعم، احذف الآن
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="flex-1 btn-ghost"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
