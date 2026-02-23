import { Link } from 'react-router-dom';
import { BookOpen, Heart, ExternalLink } from 'lucide-react';

const quickLinks = [
  { label: 'ثانوي عام', href: '/thanawya-amma' },
  { label: 'ثانوي أزهري', href: '/thanawya-azhar' },
  { label: 'البحث', href: '/search' },
  { label: 'طلب كتاب', href: '/request' },
];

const subjects = [
  { label: 'رياضيات', href: '/thanawya-amma/math' },
  { label: 'فيزياء', href: '/thanawya-amma/physics' },
  { label: 'كيمياء', href: '/thanawya-amma/chemistry' },
  { label: 'أحياء', href: '/thanawya-amma/biology' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="glass-card rounded-t-[32px] rounded-b-none border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold font-['Cairo'] text-[var(--text-primary)]">
                  مكتبة <span className="text-gradient-purple">الثانوية</span>
                </span>
              </Link>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
                منصة رقمية متكاملة لطلاب الثانوية العامة والأزهرية في مصر. 
                تحميل مجاني لجميع الكتب والمذكرات عبر تيليجرام.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://t.me/maktabat_thanawya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-[#0088CC]/10 border border-[#0088CC]/30 flex items-center justify-center text-[#0088CC] hover:bg-[#0088CC]/20 transition-all hover:scale-105"
                  aria-label="تيليجرام"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold font-['Cairo'] mb-5 text-[var(--text-primary)]">روابط سريعة</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-[var(--text-secondary)] hover:text-purple-400 transition-colors text-base flex items-center gap-2 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subjects */}
            <div>
              <h3 className="text-xl font-bold font-['Cairo'] mb-5 text-[var(--text-primary)]">المواد الدراسية</h3>
              <ul className="space-y-3">
                {subjects.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-[var(--text-secondary)] hover:text-purple-400 transition-colors text-base flex items-center gap-2 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold font-['Cairo'] mb-5 text-[var(--text-primary)]">تواصل معنا</h3>
              <div className="space-y-3 text-base text-[var(--text-secondary)]">
                <p className="font-medium">للاستفسارات والاقتراحات</p>
                <a
                  href="mailto:contact@maktabat-thanawya.com"
                  className="text-purple-400 hover:text-purple-300 transition-colors block font-medium"
                >
                  contact@maktabat-thanawya.com
                </a>
                <p className="pt-2 font-medium">
                  قناة التيليجرام للتحديثات
                </p>
                <a
                  href="https://t.me/maktabat_thanawya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0088CC] hover:text-[#0099DD] transition-colors flex items-center gap-2 font-medium"
                >
                  @maktabat_thanawya
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[var(--text-muted)] text-base text-center sm:text-right font-medium">
                © {currentYear} مكتبة الثانوية. جميع الحقوق محفوظة.
              </p>
              <p className="text-[var(--text-muted)] text-base flex items-center gap-1 font-medium">
                صنع بـ <Heart className="w-4 h-4 text-red-500 fill-red-500" /> لطلاب الثانوية
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
