import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Arabic to Latin slug converter
const arabicToLatinMap: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'a', 'آ': 'a', 'ى': 'a', 'ة': 'a',
  'ب': 'b',
  'ت': 't',
  'ث': 'th',
  'ج': 'j',
  'ح': 'h',
  'خ': 'kh',
  'د': 'd',
  'ذ': 'dh',
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'sh',
  'ص': 's',
  'ض': 'd',
  'ط': 't',
  'ظ': 'z',
  'ع': 'a',
  'غ': 'gh',
  'ف': 'f',
  'ق': 'q',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'و': 'w',
  'ي': 'y',
  'ؤ': 'w',
  'ئ': 'y',
  ' ': '-',
};

export function generateSlug(arabicTitle: string): string {
  const slug = arabicTitle
    .split('')
    .map(c => arabicToLatinMap[c] || c)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase()
    .substring(0, 80);
  
  // Remove trailing dash
  return slug.replace(/-$/, '');
}

// Book type labels
export const bookTypeLabels: Record<string, string> = {
  school_book: 'كتاب المنهج',
  external_book: 'الكتاب الخارجي',
  teacher_notes: 'مذكرة المدرس',
  summary: 'ملخص',
  concepts_booklet: 'كتيب المفاهيم',
};

// Grade labels
export const gradeLabels: Record<string, string> = {
  first: 'الصف الأول الثانوي',
  second: 'الصف الثاني الثانوي',
  third: 'الصف الثالث الثانوي',
  all: 'جميع الصفوف',
};

// Section labels
export const sectionLabels: Record<string, string> = {
  'thanawya-amma': 'ثانوي عام',
  'thanawya-azhar': 'ثانوي أزهري',
};

// SEO Templates
export function generateSeoTitle(bookTitle: string, subjectName: string, sectionName: string): string {
  return `${bookTitle} | ${subjectName} | ${sectionName}`;
}

export function generateSeoDescription(
  bookTitle: string,
  bookType: string,
  subjectName: string,
  grade: string,
  sectionName: string
): string {
  const gradeLabel = gradeLabels[grade] || 'الثانوية العامة';
  const typeLabel = bookTypeLabels[bookType] || 'كتاب';
  return `تحميل ${bookTitle} مجاناً — ${typeLabel} في مادة ${subjectName} لـ${gradeLabel}. ${sectionName}. تحميل مباشر عبر تيليجرام بدون إعلانات.`;
}

export function generateBodyDescription(
  bookTitle: string,
  subjectName: string,
  bookType: string,
  author?: string | null
): string {
  const typeLabel = bookTypeLabels[bookType] || 'كتاب';
  let description = `يُعدّ "${bookTitle}" من أبرز المراجع التعليمية في مادة ${subjectName} للثانوية العامة.`;
  
  if (author) {
    description += ` يقدمه ${author} بأسلوب مبسط وشامل.`;
  }
  
  description += ` يتميز هذا ${typeLabel} بتغطية شاملة لجميع محاور المنهج الدراسي المقرر، ويساعد الطالب على الاستيعاب السريع والمراجعة الفعّالة. يمكنك تحميله مجاناً عبر الرابط أدناه.`;
  
  return description;
}

// Format numbers with Arabic numerals
export function formatNumber(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => {
    const n = parseInt(d);
    return isNaN(n) ? d : arabicNumerals[n];
  }).join('');
}

// Format date to Arabic
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('ar-EG', options);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Share on WhatsApp
export function shareOnWhatsApp(text: string, url: string): string {
  const message = `${text}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

// Share on Telegram
export function shareOnTelegram(text: string, url: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

// Get book type color
export function getBookTypeColor(bookType: string): string {
  const colors: Record<string, string> = {
    school_book: 'badge-school',
    external_book: 'badge-external',
    teacher_notes: 'badge-notes',
    summary: 'badge-summary',
    concepts_booklet: 'badge-concepts',
  };
  return colors[bookType] || 'badge-school';
}

// Get subject icon (fallback)
export function getSubjectIcon(subjectName: string): string {
  const icons: Record<string, string> = {
    'رياضيات': 'Calculator',
    'فيزياء': 'Atom',
    'كيمياء': 'FlaskConical',
    'أحياء': 'Microscope',
    'لغة عربية': 'BookOpen',
    'لغة إنجليزية': 'Languages',
    'تاريخ': 'Clock',
    'جغرافيا': 'Globe',
    'فلسفة': 'Brain',
    'علم نفس': 'Heart',
    'اقتصاد': 'TrendingUp',
    'إحصاء': 'BarChart3',
  };
  return icons[subjectName] || 'Book';
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Debounce function
export function debounce(
  func: (query: string) => void,
  wait: number
): (query: string) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (query: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(query), wait);
  };
}
