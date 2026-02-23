import { Link } from 'react-router-dom';
import { Home, Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

export function NotFound() {
  return (
    <section className="pt-28 pb-16 min-h-screen flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-8 sm:p-12 text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl font-black font-['Cairo'] bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                404
              </h1>
            </div>

            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-purple-400" />
            </div>

            {/* Message */}
            <h2 className="text-2xl sm:text-3xl font-bold font-['Cairo'] mb-4">
              الصفحة غير موجودة
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                العودة للرئيسية
              </Link>
              <Link to="/search" className="btn-ghost flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                البحث عن كتاب
              </Link>
            </div>

            {/* Suggestions */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-sm font-medium text-gray-400 mb-4">
                قد تكون مهتماً بـ:
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  to="/thanawya-amma"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors"
                >
                  ثانوي عام
                </Link>
                <Link
                  to="/thanawya-azhar"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors"
                >
                  ثانوي أزهري
                </Link>
                <Link
                  to="/request"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors"
                >
                  اطلب كتاباً
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
