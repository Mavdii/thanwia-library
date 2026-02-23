import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { SubjectSEO } from '@/components/seo/SubjectSEO';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SubjectCard } from '@/components/ui/SubjectCard';
import { SkeletonSubjectCard } from '@/components/ui/SkeletonCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { sectionsApi, subjectsApi } from '@/lib/supabase';
import type { Section, Subject } from '@/types';

export function SectionPage() {
  const { sectionSlug } = useParams<{ sectionSlug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<Section | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!sectionSlug) return;
      
      setIsLoading(true);
      try {
        const sectionData = await sectionsApi.getSectionBySlug(sectionSlug);
        if (sectionData) {
          setSection(sectionData);
          const subjectsData = await subjectsApi.getSubjectsBySection(sectionData.id);
          setSubjects(subjectsData);
        }
      } catch (error) {
        console.error('Error fetching section data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sectionSlug]);

  if (!section && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-bold font-['Cairo'] mb-4">القسم غير موجود</h1>
          <p className="text-gray-400 mb-6">عذراً، القسم المطلوب غير متوفر</p>
          <Link to="/">
            <button className="btn-primary">العودة للرئيسية</button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const isAzhar = sectionSlug === 'thanawya-azhar';
  const Icon = isAzhar ? BookOpen : GraduationCap;
  const gradient = isAzhar ? 'from-emerald-600 to-teal-600' : 'from-purple-600 to-blue-600';

  return (
    <>
      {section && (
        <SubjectSEO 
          subject={{ 
            ...section, 
            section_id: section.id,
            track_id: null,
            icon: null,
            color: null,
            seo_title: null,
            seo_description: null,
            is_active: true,
            sort_order: 0,
          }} 
          section={section} 
          url={`https://maktabat-thanawya.com/${section.slug}`}
        />
      )}

      <section className="pt-28 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={[{ label: section?.name || '' }]} />
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Cairo'] mb-4">
              {section?.name}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {section?.description}
            </p>
          </motion.div>

          {/* Subjects Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold font-['Cairo'] mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
              المواد الدراسية
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonSubjectCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <SubjectCard subject={subject} sectionSlug={sectionSlug || 'thanawya-amma'} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
