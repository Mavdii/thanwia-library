import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, BookOpen, User, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUIStore } from '@/store';
import { bookRequestsApi } from '@/lib/supabase';

export function RequestBook() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  
  const [bookName, setBookName] = useState('');
  const [subject, setSubject] = useState('');
  const [section, setSection] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await bookRequestsApi.createRequest({
        book_name: bookName,
        subject: subject || null,
        section: section || null,
        requester_name: requesterName || null,
        note: note || null,
        is_resolved: false,
      });

      showToast('تم إرسال طلبك بنجاح! سنعمل على توفير الكتاب قريباً', 'success');
      
      // Reset form
      setBookName('');
      setSubject('');
      setSection('');
      setRequesterName('');
      setNote('');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      showToast('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-16 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cairo'] mb-4">
            اطلب كتاباً
          </h1>
          <p className="text-gray-400 text-lg">
            لم تجد الكتاب الذي تبحث عنه؟ اطلبه الآن وسنعمل على توفيره
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  اسم الكتاب <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    placeholder="مثال: كتاب الامتحان في الفيزياء"
                    className="glass-input w-full pr-12"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  المادة
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: فيزياء"
                  className="glass-input w-full"
                />
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  القسم
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="">اختر القسم</option>
                  <option value="ثانوي عام">ثانوي عام</option>
                  <option value="ثانوي أزهري">ثانوي أزهري</option>
                </select>
              </div>

              {/* Requester Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  اسمك (اختياري)
                </label>
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="اسمك"
                    className="glass-input w-full pr-12"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  ملاحظات إضافية
                </label>
                <div className="relative">
                  <div className="absolute right-4 top-4 text-gray-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="أي معلومات إضافية تساعدنا في إيجاد الكتاب..."
                    className="glass-input w-full h-32 resize-none pr-12"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isLoading ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
            </form>
          </GlassCard>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <GlassCard className="p-6">
            <h3 className="font-bold font-['Cairo'] mb-3 flex items-center gap-2">
              <span className="w-6 h-1 bg-purple-500 rounded-full" />
              ملاحظات مهمة
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>سنعمل على توفير الكتاب في أقرب وقت ممكن</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>يمكنك متابعة الموقع للتحقق من إضافة الكتاب</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>جميع الكتب متاحة للتحميل مجاناً</span>
              </li>
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
