import { useEffect, useState } from 'react';
import { BookOpen, FileText, GraduationCap, Download } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { booksApi } from '@/lib/supabase';

interface Stat {
  icon: React.ElementType;
  value: number;
  label: string;
}

interface StatsBarProps {
  stats?: Stat[];
}

// Simplified without animation for better performance
function AnimatedNumber({ value }: { value: number }) {
  return <span>{formatNumber(value)}</span>;
}

export function StatsBar({ stats: providedStats }: StatsBarProps) {
  const [realStats, setRealStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all books
        const allBooks = await booksApi.getAllBooks();
        const booksCount = allBooks.length;

        // Count subjects (we'll need to import subjectsApi too)
        const { subjectsApi } = await import('@/lib/supabase');
        const allSubjects = await subjectsApi.getAllSubjects();
        const subjectsCount = allSubjects.length;

        // Calculate total downloads
        const totalDownloads = allBooks.reduce((sum: number, book) => sum + (book.download_count || 0), 0);

        setRealStats([
          { icon: BookOpen, value: booksCount || 0, label: 'كتاب' },
          { icon: FileText, value: Math.floor((booksCount || 0) * 0.4), label: 'مذكرة' },
          { icon: GraduationCap, value: subjectsCount || 0, label: 'مادة' },
          { icon: Download, value: totalDownloads, label: 'تحميل' },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use default stats on error
        setRealStats([
          { icon: BookOpen, value: 0, label: 'كتاب' },
          { icon: FileText, value: 0, label: 'مذكرة' },
          { icon: GraduationCap, value: 0, label: 'مادة' },
          { icon: Download, value: 0, label: 'تحميل' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (!providedStats) {
      fetchStats();
    } else {
      setRealStats(providedStats);
      setLoading(false);
    }
  }, [providedStats]);

  const statsToDisplay = providedStats || realStats;

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stats-pill animate-pulse">
            <div className="w-4 h-4 bg-white/10 rounded" />
            <div className="w-12 h-4 bg-white/10 rounded" />
            <div className="w-16 h-4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {statsToDisplay.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="stats-pill"
          >
            <Icon className="w-4 h-4 text-purple-400" />
            <span className="text-[var(--text-primary)] font-bold">
              +<AnimatedNumber value={stat.value} />
            </span>
            <span className="text-[var(--text-secondary)]">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
