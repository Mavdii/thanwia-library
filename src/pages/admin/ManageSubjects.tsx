import { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Save, X, Folder, BookOpen } from 'lucide-react';
import { adminSubjectsApi, adminSectionsApi } from '@/lib/supabase-admin';
import { useUIStore } from '@/store';

interface Section {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  section_id: string;
  description: string;
  icon: string;
  section?: Section;
}

export function ManageSubjects() {
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);
  const { showToast } = useUIStore();

  const [newSection, setNewSection] = useState({ name: '', slug: '', description: '' });
  const [newSubject, setNewSubject] = useState({ 
    name: '', 
    slug: '', 
    section_id: '', 
    description: '', 
    icon: '📚' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch sections
      const sectionsData = await adminSectionsApi.getAllSections();
      setSections((sectionsData || []) as any);

      // Fetch subjects with sections
      const subjectsData = await adminSubjectsApi.getAllSubjects();
      
      // Manually join sections to subjects
      const subjectsWithSections = subjectsData.map(subject => {
        const section = sectionsData.find(s => s.id === subject.section_id);
        return {
          ...subject,
          section
        };
      });
      
      setSubjects((subjectsWithSections || []) as any);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('حدث خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع المواد المرتبطة به.')) {
      return;
    }

    try {
      await adminSectionsApi.deleteSection(id);
      showToast('تم حذف القسم بنجاح', 'success');
      fetchData();
    } catch (error) {
      console.error('Error deleting section:', error);
      showToast('حدث خطأ في حذف القسم', 'error');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      return;
    }

    try {
      await adminSubjectsApi.deleteSubject(id);
      showToast('تم حذف المادة بنجاح', 'success');
      fetchData();
    } catch (error) {
      console.error('Error deleting subject:', error);
      showToast('حدث خطأ في حذف المادة', 'error');
    }
  };

  const handleAddSection = async () => {
    if (!newSection.name || !newSection.slug) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    try {
      await adminSectionsApi.createSection(newSection);
      showToast('تم إضافة القسم بنجاح', 'success');
      setNewSection({ name: '', slug: '', description: '' });
      setAddingSection(false);
      fetchData();
    } catch (error) {
      console.error('Error adding section:', error);
      showToast('حدث خطأ في إضافة القسم', 'error');
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.slug || !newSubject.section_id) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    try {
      await adminSubjectsApi.createSubject(newSubject);
      showToast('تم إضافة المادة بنجاح', 'success');
      setNewSubject({ name: '', slug: '', section_id: '', description: '', icon: '📚' });
      setAddingSubject(false);
      fetchData();
    } catch (error) {
      console.error('Error adding subject:', error);
      showToast('حدث خطأ في إضافة المادة', 'error');
    }
  };

  const handleUpdateSection = async (id: string, data: Partial<Section>) => {
    try {
      await adminSectionsApi.updateSection(id, data);
      showToast('تم تحديث القسم بنجاح', 'success');
      setEditingSection(null);
      fetchData();
    } catch (error) {
      console.error('Error updating section:', error);
      showToast('حدث خطأ في تحديث القسم', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Cairo'] mb-2 text-[var(--text-primary)]">
          إدارة الأقسام والمواد
        </h1>
        <p className="text-[var(--text-secondary)]">
          إضافة وتعديل وحذف الأقسام والمواد الدراسية
        </p>
      </div>

      {/* Sections */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-['Cairo'] flex items-center gap-2 text-[var(--text-primary)]">
            <Folder className="w-6 h-6" />
            الأقسام
          </h2>
          <button
            onClick={() => setAddingSection(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة قسم
          </button>
        </div>

        {addingSection && (
          <div className="glass-card p-4 mb-4 border-2 border-purple-500/30">
            <h3 className="font-bold mb-4 text-[var(--text-primary)]">قسم جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="اسم القسم"
                value={newSection.name}
                onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Slug (مثال: thanawya-amma)"
                value={newSection.slug}
                onChange={(e) => setNewSection({ ...newSection, slug: e.target.value })}
                className="glass-input"
              />
            </div>
            <textarea
              placeholder="الوصف"
              value={newSection.description}
              onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
              className="glass-input w-full mb-4"
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleAddSection} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                حفظ
              </button>
              <button
                onClick={() => {
                  setAddingSection(false);
                  setNewSection({ name: '', slug: '', description: '' });
                }}
                className="btn-ghost flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                إلغاء
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="glass-card p-4 hover:bg-white/10 transition-colors">
              {editingSection === section.id ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      defaultValue={section.name}
                      onBlur={(e) => handleUpdateSection(section.id, { name: e.target.value })}
                      className="glass-input"
                    />
                    <input
                      type="text"
                      defaultValue={section.slug}
                      onBlur={(e) => handleUpdateSection(section.id, { slug: e.target.value })}
                      className="glass-input"
                    />
                  </div>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="btn-ghost text-sm"
                  >
                    إغلاق
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{section.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{section.slug}</p>
                    {section.description && (
                      <p className="text-sm text-[var(--text-muted)] mt-1">{section.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSection(section.id)}
                      className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-['Cairo'] flex items-center gap-2 text-[var(--text-primary)]">
            <BookOpen className="w-6 h-6" />
            المواد الدراسية
          </h2>
          <button
            onClick={() => setAddingSubject(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة مادة
          </button>
        </div>

        {addingSubject && (
          <div className="glass-card p-4 mb-4 border-2 border-purple-500/30">
            <h3 className="font-bold mb-4 text-[var(--text-primary)]">مادة جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="اسم المادة"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Slug (مثال: math)"
                value={newSubject.slug}
                onChange={(e) => setNewSubject({ ...newSubject, slug: e.target.value })}
                className="glass-input"
              />
              <select
                value={newSubject.section_id}
                onChange={(e) => setNewSubject({ ...newSubject, section_id: e.target.value })}
                className="glass-input"
              >
                <option value="">اختر القسم</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="أيقونة (emoji)"
                value={newSubject.icon}
                onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })}
                className="glass-input"
              />
            </div>
            <textarea
              placeholder="الوصف"
              value={newSubject.description}
              onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
              className="glass-input w-full mb-4"
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleAddSubject} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                حفظ
              </button>
              <button
                onClick={() => {
                  setAddingSubject(false);
                  setNewSubject({ name: '', slug: '', section_id: '', description: '', icon: '📚' });
                }}
                className="btn-ghost flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                إلغاء
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {subjects.map((subject) => (
            <div key={subject.id} className="glass-card p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{subject.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{subject.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {subject.slug} • {subject.section?.name}
                    </p>
                    {subject.description && (
                      <p className="text-sm text-[var(--text-muted)] mt-1">{subject.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
