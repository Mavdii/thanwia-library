import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { HomeSEO } from '@/components/seo/HomeSEO';
import { StatsBar } from '@/components/ui/StatsBar';
import { SubjectCard } from '@/components/ui/SubjectCard';
import { BookCard } from '@/components/ui/BookCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { SkeletonCard, SkeletonSubjectCard } from '@/components/ui/SkeletonCard';
import { useBooksStore } from '@/store';
import { booksApi, subjectsApi, sectionsApi } from '@/lib/supabase';

export function Home() {
  const { 
    latestBooks, 
    subjects, 
    sections, 
    setLatestBooks, 
    setSubjects, 
    setSections,
    isLoading, 
    setLoading 
  } = useBooksStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksData, subjectsData, sectionsData] = await Promise.all([
          booksApi.getLatestBooks(8),
          subjectsApi.getAllSubjects(),
          sectionsApi.getAllSections(),
        ]);
        setLatestBooks(booksData);
        setSubjects(subjectsData);
        setSections(sectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLatestBooks, setSubjects, setSections, setLoading]);

  const thanawyaAmma = sections.find(s => s.slug === 'thanawya-amma');

  return (
    <>
      <HomeSEO />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="section-badge">
                <Sparkles className="w-4 h-4" />
                مكتبة رقمية مجانية 100%
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-['Cairo'] mb-6 leading-tight"
            >
              مكتبة <span className="text-gradient">الثانوية</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-300">
                حمّل كل كتبك مجاناً
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              أكبر مكتبة رقمية لطلاب الثانوية العامة والأزهرية في مصر.
              كتب، مذكرات، تلخيصات - كلها مجانية وتحميل مباشر.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link to="/thanawya-amma">
                <button className="btn-primary flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  تصفح الكتب
                </button>
              </Link>
              <Link to="/search">
                <button className="btn-ghost flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  ابحث عن كتاب
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StatsBar />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections Cards */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Cairo'] mb-4">اختر قسمك</h2>
            <p className="text-gray-400">كتب ومذكرات لجميع أقسام الثانوية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Thanawya Amma */}
            <Link to="/thanawya-amma">
              <GlassCard className="h-full p-8 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-['Cairo'] mb-3">ثانوي عام</h3>
                  <p className="text-gray-400 mb-4">
                    جميع مواد الثانوية العامة - علمي وأدبي
                  </p>
                  <div className="flex items-center text-purple-400 font-medium">
                    <span>تصفح الكتب</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </div>
                {/* Background glow */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-colors" />
              </GlassCard>
            </Link>

            {/* Thanawya Azhar */}
            <Link to="/thanawya-azhar">
              <GlassCard className="h-full p-8 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-['Cairo'] mb-3">ثانوي أزهري</h3>
                  <p className="text-gray-400 mb-4">
                    جميع مواد الثانوية الأزهرية
                  </p>
                  <div className="flex items-center text-emerald-400 font-medium">
                    <span>تصفح الكتب</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </div>
                {/* Background glow */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl group-hover:bg-emerald-600/30 transition-colors" />
              </GlassCard>
            </Link>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Cairo'] mb-4">تصفح حسب المادة</h2>
            <p className="text-gray-400">اختر المادة الدراسية للوصول إلى كتبها</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonSubjectCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.slice(0, 6).map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  sectionSlug={thanawyaAmma?.slug || 'thanawya-amma'} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Books */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold font-['Cairo'] mb-2">أحدث الإضافات</h2>
              <p className="text-gray-400">آخر الكتب والمذكرات المضافة للمكتبة</p>
            </div>
            <Link 
              to="/thanawya-amma" 
              className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {latestBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link to="/thanawya-amma">
                  <button className="btn-ghost">عرض الكل</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Cairo'] mb-4">كيفية الاستخدام</h2>
            <p className="text-gray-400">ثلاث خطوات بسيطة للحصول على كتابك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'ابحث عن كتابك', desc: 'استخدم البحث أو تصفح حسب المادة' },
              { step: '2', title: 'اختر الكتاب', desc: 'شاهد تفاصيل الكتاب والوصف' },
              { step: '3', title: 'حمّل مجاناً', desc: 'تحميل مباشر عبر تيليجرام' },
            ].map((item) => (
              <GlassCard key={item.step} className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold font-['JetBrains_Mono']">{item.step}</span>
                </div>
                <h3 className="font-bold font-['Cairo'] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
