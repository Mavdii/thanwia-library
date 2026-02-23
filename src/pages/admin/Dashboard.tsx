import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Download, 
  Eye, 
  Users, 
  Plus, 
  List,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuthStore, useAdminStore } from '@/store';
import { formatNumber } from '@/lib/utils';
import { adminDatabaseApi, adminBooksApi } from '@/lib/supabase-admin';

interface Book {
  id: string;
  title: string;
  author: string;
  download_count: number;
  created_at: string;
}

interface Stats {
  totalBooks: number;
  totalDownloads: number;
  totalViews: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setActiveTab } = useAdminStore();
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, totalDownloads: 0, totalViews: 0 });
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [topDownloads, setTopDownloads] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
    setActiveTab('dashboard');
  }, [isAuthenticated, navigate, setActiveTab]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch statistics using admin API
      const statsData = await adminDatabaseApi.getStatistics();
      
      setStats({
        totalBooks: Number(statsData.total_books) || 0,
        totalDownloads: Number(statsData.total_downloads) || 0,
        totalViews: Number(statsData.total_views) || 0,
      });

      // Fetch recent books
      const allBooks = await adminBooksApi.getAllBooks();
      const recentBooksData = allBooks
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);
      setRecentBooks(recentBooksData as any);

      // Fetch top downloads
      const topDownloadsData = allBooks
        .sort((a, b) => b.download_count - a.download_count)
        .slice(0, 3);
      setTopDownloads(topDownloadsData as any);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const statsCards = [
    { label: 'إجمالي الكتب', value: stats.totalBooks, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'إجمالي التحميلات', value: stats.totalDownloads, icon: Download, color: 'from-green-500 to-emerald-500' },
    { label: 'إجمالي المشاهدات', value: stats.totalViews, icon: Eye, color: 'from-purple-500 to-pink-500' },
    { label: 'الزوار اليوم', value: 0, icon: Users, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-['Cairo'] text-[var(--text-primary)]">لوحة التحكم</h1>
          <p className="text-[var(--text-secondary)] text-sm">نظرة عامة على إحصائيات المكتبة</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            عرض الموقع
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-20 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[var(--text-secondary)] text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold font-['JetBrains_Mono'] text-[var(--text-primary)]">
                        {formatNumber(stat.value)}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold font-['Cairo'] mb-4">إجراءات سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/admin/books/add')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة كتاب جديد
          </button>
          <button 
            onClick={() => navigate('/admin/books')}
            className="btn-ghost flex items-center gap-2"
          >
            <List className="w-5 h-5" />
            إدارة الكتب
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-['Cairo'] text-[var(--text-primary)]">آخر الكتب المضافة</h2>
            <button 
              onClick={() => navigate('/admin/books')}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              عرض الكل
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 animate-pulse">
                  <div className="h-12 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : recentBooks.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              لا توجد كتب بعد
            </div>
          ) : (
            <div className="space-y-3">
              {recentBooks.map((book, index) => (
                <div 
                  key={book.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-['JetBrains_Mono'] text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[var(--text-primary)]">{book.title}</p>
                      <p className="text-[var(--text-secondary)] text-xs">{book.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--text-secondary)] text-xs">
                    <Download className="w-3 h-3" />
                    {formatNumber(book.download_count)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Top Downloads */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-['Cairo'] text-[var(--text-primary)]">الأكثر تحميلاً</h2>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 animate-pulse">
                  <div className="h-12 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : topDownloads.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              لا توجد بيانات
            </div>
          ) : (
            <div className="space-y-3">
              {topDownloads.map((book, index) => (
                <div 
                  key={book.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-['JetBrains_Mono'] text-sm ${
                      index === 0 ? 'bg-amber-500/20 text-amber-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300' :
                      'bg-orange-600/20 text-orange-400'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="font-medium text-sm text-[var(--text-primary)]">{book.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <Download className="w-3 h-3" />
                    {formatNumber(book.download_count)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
