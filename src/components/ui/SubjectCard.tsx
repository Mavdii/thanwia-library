import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Microscope, 
  BookOpen, 
  Languages, 
  Clock, 
  Globe, 
  Brain, 
  Heart, 
  TrendingUp, 
  BarChart3,
  Book,
  Beaker
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import type { Subject } from '@/types';

interface SubjectCardProps {
  subject: Subject;
  sectionSlug: string;
}

const subjectIcons: Record<string, React.ElementType> = {
  'رياضيات': Calculator,
  'فيزياء': Atom,
  'كيمياء': FlaskConical,
  'أحياء': Microscope,
  'لغة عربية': BookOpen,
  'لغة إنجليزية': Languages,
  'تاريخ': Clock,
  'جغرافيا': Globe,
  'فلسفة': Brain,
  'علم نفس': Heart,
  'اقتصاد': TrendingUp,
  'إحصاء': BarChart3,
  'تفاضل وتكامل': Calculator,
  'هندسة': Calculator,
  'دين': Book,
  'فقه': Book,
  'تفسير': Book,
  'حديث': Book,
  'عقيدة': Brain,
  'علوم': Beaker,
};

const subjectColors: Record<string, string> = {
  'رياضيات': 'from-blue-500 to-cyan-500',
  'فيزياء': 'from-purple-500 to-pink-500',
  'كيمياء': 'from-green-500 to-emerald-500',
  'أحياء': 'from-rose-500 to-red-500',
  'لغة عربية': 'from-amber-500 to-orange-500',
  'لغة إنجليزية': 'from-indigo-500 to-blue-500',
  'تاريخ': 'from-yellow-600 to-amber-600',
  'جغرافيا': 'from-teal-500 to-cyan-500',
  'فلسفة': 'from-violet-500 to-purple-500',
  'علم نفس': 'from-pink-500 to-rose-500',
  'اقتصاد': 'from-emerald-500 to-green-500',
  'إحصاء': 'from-sky-500 to-blue-500',
};

export function SubjectCard({ subject, sectionSlug }: SubjectCardProps) {
  const Icon = subjectIcons[subject.name] || Book;
  const gradientColor = subjectColors[subject.name] || 'from-purple-500 to-blue-500';

  return (
    <Link to={`/${sectionSlug}/${subject.slug}`}>
      <GlassCard className="h-full p-6 group">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-['Cairo'] text-lg mb-1 group-hover:text-purple-400 transition-colors">
              {subject.name}
            </h3>
            {subject.description && (
              <p className="text-gray-400 text-sm line-clamp-2">
                {subject.description}
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
