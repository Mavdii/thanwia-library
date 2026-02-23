import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  BookOpen, 
  LogOut, 
  Menu,
  X,
  ChevronLeft,
  MessageSquare,
  FolderTree,
  Database
} from 'lucide-react';
import { useAuthStore, useAdminStore, useUIStore } from '@/store';

const navItems = [
  { label: 'الرئيسية', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'إضافة كتاب', href: '/admin/books/add', icon: Plus },
  { label: 'إدارة الكتب', href: '/admin/books', icon: BookOpen },
  { label: 'إدارة المواد', href: '/admin/subjects', icon: FolderTree },
  { label: 'طلبات الكتب', href: '/admin/requests', icon: MessageSquare },
  { label: 'قاعدة البيانات', href: '/admin/database', icon: Database },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen, setActiveTab } = useAdminStore();
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Set active tab based on current path
    const currentItem = navItems.find(item => location.pathname.startsWith(item.href));
    if (currentItem) {
      setActiveTab(currentItem.href.split('/').pop() || 'dashboard');
    }
  }, [location.pathname, setActiveTab]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:block fixed right-0 top-0 h-full admin-sidebar transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold font-['Cairo']">م</span>
              </div>
              {isSidebarOpen && (
                <span className="font-bold font-['Cairo']">لوحة التحكم</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`admin-sidebar-item ${isActive ? 'active' : ''} ${!isSidebarOpen && 'justify-center'}`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`admin-sidebar-item text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-auto ${!isSidebarOpen && 'justify-center'}`}
            title={!isSidebarOpen ? 'تسجيل الخروج' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-64 admin-sidebar">
            <div className="h-full flex flex-col p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/admin/dashboard" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <span className="text-lg font-bold font-['Cairo']">م</span>
                  </div>
                  <span className="font-bold font-['Cairo']">لوحة التحكم</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="admin-sidebar-item text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-auto"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:mr-64' : 'lg:mr-20'
        }`}
      >
        {/* Mobile Header */}
        <header className="lg:hidden glass-navbar p-4 flex items-center justify-between sticky top-0 z-30">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold font-['Cairo']">م</span>
            </div>
            <span className="font-bold font-['Cairo'] text-sm">لوحة التحكم</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Page Content */}
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
