import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Search, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuthStore, useAdminStore, useUIStore } from '@/store';
import { adminBookRequestsApi } from '@/lib/supabase-admin';
import type { BookRequest } from '@/types';

export function BookRequests() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setActiveTab } = useAdminStore();
  const { showToast } = useUIStore();

  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
    setActiveTab('requests');
    
    loadRequests();
  }, [isAuthenticated, navigate, setActiveTab]);

  const loadRequests = async () => {
    try {
      const data = await adminBookRequestsApi.getAllRequests();
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      showToast('حدث خطأ في تحميل الطلبات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await adminBookRequestsApi.updateRequest(id, { is_resolved: true });
      setRequests(requests.map(r => 
        r.id === id ? { ...r, is_resolved: true } : r
      ));
      showToast('تم تحديث حالة الطلب', 'success');
    } catch (error) {
      console.error('Error resolving request:', error);
      showToast('حدث خطأ أثناء تحديث الطلب', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    try {
      await adminBookRequestsApi.deleteRequest(id);
      setRequests(requests.filter(r => r.id !== id));
      showToast('تم حذف الطلب بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting request:', error);
      showToast('حدث خطأ أثناء حذف الطلب', 'error');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.book_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.subject && request.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.requester_name && request.requester_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pending' && !request.is_resolved) ||
      (filterStatus === 'resolved' && request.is_resolved);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => !r.is_resolved).length;
  const resolvedCount = requests.filter(r => r.is_resolved).length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-['Cairo']">طلبات الكتب</h1>
        <p className="text-gray-400 text-sm">إدارة طلبات الطلاب للكتب</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-4">
          <div className="text-gray-400 text-sm mb-1">إجمالي الطلبات</div>
          <div className="text-2xl font-bold">{requests.length}</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-gray-400 text-sm mb-1">قيد الانتظار</div>
          <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-gray-400 text-sm mb-1">تم التنفيذ</div>
          <div className="text-2xl font-bold text-green-400">{resolvedCount}</div>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في الطلبات..."
              className="glass-input w-full pr-12"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            قيد الانتظار
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'resolved'
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            تم التنفيذ
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-4 px-4 font-medium text-gray-400">اسم الكتاب</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">المادة</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">القسم</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">الطالب</th>
                <th className="text-right py-4 px-4 font-medium text-gray-400">التاريخ</th>
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
                    <td className="py-4 px-4"><div className="h-4 skeleton w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 skeleton w-24" /></td>
                  </tr>
                ))
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{request.book_name}</div>
                      {request.note && (
                        <div className="text-gray-400 text-sm mt-1">{request.note}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {request.subject || '-'}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {request.section || '-'}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {request.requester_name || 'غير محدد'}
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {new Date(request.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.is_resolved
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {request.is_resolved ? 'تم التنفيذ' : 'قيد الانتظار'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {!request.is_resolved && (
                          <button
                            onClick={() => handleResolve(request.id)}
                            className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 text-green-400 transition-colors"
                            title="تم التنفيذ"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="حذف"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400">لا توجد طلبات</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
