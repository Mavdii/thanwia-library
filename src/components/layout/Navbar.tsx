import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, BookOpen } from 'lucide-react';
import { useUIStore } from '@/store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'ثانوي عام', href: '/thanawya-amma' },
  { label: 'ثانوي أزهري', href: '/thanawya-azhar' },
  { label: 'البحث', href: '/search' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-navbar py-4' : 'py-6 bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all group-hover:scale-105">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-['Cairo'] hidden sm:block text-[var(--text-primary)]">
              مكتبة <span className="text-gradient-purple">الثانوية</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-5 py-2.5 rounded-xl text-base font-semibold font-['Cairo'] transition-all ${
                  isActive(link.href)
                    ? 'text-purple-400 bg-purple-500/15 shadow-lg shadow-purple-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <Link
              to="/search"
              className="w-11 h-11 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 dark:hover:bg-white/10 hover:border-purple-500/30 transition-all hover:scale-105"
              title="البحث"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 dark:hover:bg-white/10 transition-all"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-navbar border-t border-white/5 dark:border-white/5 mt-0">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-5 py-3.5 rounded-xl text-lg font-semibold font-['Cairo'] transition-all ${
                  isActive(link.href)
                    ? 'text-purple-400 bg-purple-500/15 shadow-lg shadow-purple-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
