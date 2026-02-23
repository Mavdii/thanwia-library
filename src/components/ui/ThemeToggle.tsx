import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 transition-colors hover:bg-white/20 dark:hover:bg-white/20"
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
        animate={{
          left: theme === 'dark' ? '2px' : 'calc(100% - 26px)',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-white" />
        )}
      </motion.div>
    </button>
  );
}
