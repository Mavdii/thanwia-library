import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Upload, 
  ChevronDown,
  Save,
  Sparkles,
  Link as LinkIcon,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuthStore, useAdminStore, useUIStore } from '@/store';
import { adminBooksApi, adminSubjectsApi, adminSectionsApi, adminStorageApi } from '@/lib/supabase-admin';
import { generateSlug, bookTypeLabels, gradeLabels, generateSeoTitle, generateSeoDescription } from '@/lib/utils';
import type { BookType, Grade, Section, Subject } from '@/types';

const bookTypes = Object.entries(bookTypeLabels).map(([value, label]) => ({ value, label }));
const grades = Object.entries(gradeLabels).map(([value, label]) => ({ value, label }));

export function EditBook() {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const { isAuthenticated } = useAuthStore();
  const { setActiveTab } = useAdminStore();
  const { showToast } = useUIStore();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [bookType, setBookType] = useState<BookType>('external_book');
  const [grade, setGrade] = useState<Grade>('third');
  const [telegramLink, setTelegramLink] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [currentCoverUrl, setCurrentCoverUrl] = useState('');
  
  // SEO state
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [tableOfContents, setTableOfContents] = useState('');
  
  // Options
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
    setActiveTab('books');
    
    // Load data
    const loadData = async () => {
      try {
        const [sectionsData, subjectsData] = await Promise.all([
          adminSectionsApi.getAllSections(),
          adminSubjectsApi.getAllSubjects(),
        ]);
        setSections(sectionsData);
        setSubjects(subjectsData);

        // Load book data
        if (bookId) {
          const bookData = await adminBooksApi.getBookBySlug(bookId);
          if (bookData) {
            setTitle(bookData.title);
            setSlug(bookData.slug);
            setDescription(bookData.description || '');
            setAuthor(bookData.author || '');
            setSubjectId(bookData.subject_id);
            setBookType(bookData.book_type);
            setGrade(bookData.grade || 'third');
            setTelegramLink(bookData.telegram_link);
            setCurrentCoverUrl(bookData.cover_image_url || '');
            setSeoTitle(bookData.seo_title || '');
            setSeoDescription(bookData.seo_description || '');
            setSeoKeywords(bookData.seo_keywords?.join(', ') || '');
            setTableOfContents(bookData.table_of_contents?.join('\n') || '');
            setIsFeatured(bookData.is_featured);
            setIsPublished(bookData.is_published);
            
            // Find section from subject
            const subject = subjectsData.find(s => s.id === bookData.subject_id);
            if (subject) {
              setSectionId(subject.section_id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showToast('حدث خطأ في تحميل البيانات', 'error');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, navigate, setActiveTab, showToast, bookId]);

  // Filter subjects by section
  const filteredSubjects = subjects.filter(s => s.section_id === sectionId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoGenerateSeo = () => {
    const subject = subjects.find(s => s.id === subjectId);
    const section = sections.find(s => s.id === sectionId);
    
    if (title && subject && section) {
      setSeoTitle(generateSeoTitle(title, subject.name, section.name));
      setSeoDescription(generateSeoDescription(title, bookType, subject.name, grade, section.name));
      setSeoKeywords(`${title}, ${subject.name}, ${section.name}, تحميل مجاني`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload new cover image if exists
      let coverImageUrl = currentCoverUrl;
      if (coverImage) {
        const imagePath = `${Date.now()}-${coverImage.name}`;
        coverImageUrl = await adminStorageApi.uploadImage(coverImage, imagePath);
      }
      
      // Prepare book data
      const bookData = {
        title,
        slug: slug || generateSlug(title),
        description: description || null,
        author: author || null,
        subject_id: subjectId,
        book_type: bookType,
        grade: grade || null,
        cover_image_url: coverImageUrl,
        telegram_link: telegramLink,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        seo_keywords: seoKeywords ? seoKeywords.split(',').map(k => k.trim()) : null,
        table_of_contents: tableOfContents ? tableOfContents.split('\n').filter(line => line.trim()) : null,
        is_featured: isFeatured,
        is_published: isPublished,
      };
      
      // Get book ID from slug
      const book = await adminBooksApi.getBookBySlug(bookId!);
      if (book) {
        await adminBooksApi.updateBook(book.id, bookData);
        showToast('تم تحديث الكتاب بنجاح!', 'success');
        navigate('/admin/books');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      showToast('حدث خطأ أثناء تحديث الكتاب', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || isLoadingData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/books')}
          className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-['Cairo']">تعديل الكتاب</h1>
          <p className="text-gray-400 text-sm">تحديث معلومات الكتاب</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-bold font-['Cairo'] mb-6 flex items-center gap-2">
            <span className="w-6 h-1 bg-purple-500 rounded-full" />
            المعلومات الأساسية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                اسم الكتاب <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: كتاب الامتحان في الرياضيات"
                className="glass-input w-full"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-2">
                الرابط (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kitab-al-imtihan-riyadiyat"
                className="glass-input w-full font-['JetBrains_Mono'] text-sm"
                dir="ltr"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2">
                اسم المؤلف
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="مثال: د. أحمد حسن"
                className="glass-input w-full"
              />
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                القسم <span className="text-red-400">*</span>
              </label>
              <select
                value={sectionId}
                onChange={(e) => {
                  setSectionId(e.target.value);
                  setSubjectId('');
                }}
                className="glass-input w-full"
                required
              >
                <option value="">اختر القسم</option>
                {sections.map(section => (
                  <option key={section.id} value={section.id}>{section.name}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">
                المادة <span className="text-red-400">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="glass-input w-full"
                required
                disabled={!sectionId}
              >
                <option value="">اختر المادة</option>
                {filteredSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            {/* Book Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                نوع الكتاب <span className="text-red-400">*</span>
              </label>
              <select
                value={bookType}
                onChange={(e) => setBookType(e.target.value as BookType)}
                className="glass-input w-full"
                required
              >
                {bookTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium mb-2">
                الصف الدراسي
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as Grade)}
                className="glass-input w-full"
              >
                {grades.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {/* Telegram Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                رابط التيليجرام <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  value={telegramLink}
                  onChange={(e) => setTelegramLink(e.target.value)}
                  placeholder="https://t.me/maktabat_thanawya/123"
                  className="glass-input w-full pr-12"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                وصف الكتاب
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصفاً مختصراً للكتاب..."
                className="glass-input w-full h-32 resize-none"
              />
            </div>
          </div>
        </GlassCard>

        {/* Cover Image */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-bold font-['Cairo'] mb-6 flex items-center gap-2">
            <span className="w-6 h-1 bg-purple-500 rounded-full" />
            صورة الغلاف
          </h2>

          <div className="flex items-center gap-6">
            <div className="w-32 h-40 rounded-xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10 flex items-center justify-center overflow-hidden">
              {coverPreview ? (
                <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : currentCoverUrl ? (
                <img src={currentCoverUrl} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div>
              <label className="btn-ghost inline-flex items-center gap-2 cursor-pointer mb-2">
                <Upload className="w-5 h-5" />
                {currentCoverUrl ? 'تغيير الصورة' : 'اختر صورة'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-gray-500 text-sm">
                يفضل صورة بأبعاد 3:4
              </p>
            </div>
          </div>
        </GlassCard>

        {/* SEO Section */}
        <GlassCard className="p-6">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-['Cairo'] flex items-center gap-2">
              <span className="w-6 h-1 bg-green-500 rounded-full" />
              إعدادات SEO
              <span className="text-xs font-normal text-gray-400">(اختياري)</span>
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAutoGenerateSeo}
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                توليد تلقائي
              </button>
              <button
                type="button"
                onClick={() => setShowSeoSection(!showSeoSection)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${showSeoSection ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSeoSection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 space-y-6">
                  {/* SEO Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      عنوان SEO
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="عنوان مخصص لظهور في نتائج البحث"
                      className="glass-input w-full"
                    />
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      وصف SEO
                      <span className="text-gray-500 text-xs mr-2">
                        ({seoDescription.length}/160)
                      </span>
                    </label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value.slice(0, 160))}
                      placeholder="وصف مختصر يظهر في نتائج البحث (160 حرف كحد أقصى)"
                      className="glass-input w-full h-24 resize-none"
                      maxLength={160}
                    />
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الكلمات المفتاحية
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="كتاب امتحان، رياضيات، ثالث ثانوي"
                      className="glass-input w-full"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      افصل بين الكلمات بفاصلة
                    </p>
                  </div>

                  {/* Table of Contents */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      محتويات الكتاب
                    </label>
                    <textarea
                      value={tableOfContents}
                      onChange={(e) => setTableOfContents(e.target.value)}
                      placeholder="اكتب كل فصل في سطر منفصل"
                      className="glass-input w-full h-32 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Options */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-bold font-['Cairo'] mb-6 flex items-center gap-2">
            <span className="w-6 h-1 bg-purple-500 rounded-full" />
            الخيارات
          </h2>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
              />
              <span>تمييز الكتاب (يظهر في الصفحة الرئيسية)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
              />
              <span>نشر الكتاب</span>
            </label>
          </div>
        </GlassCard>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/books')}
            className="btn-ghost"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
