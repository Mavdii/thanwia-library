# دليل رفع المشروع على Vercel

## المتطلبات الأساسية

1. حساب على [Vercel](https://vercel.com)
2. تثبيت Vercel CLI (اختياري):
```bash
npm install -g vercel
```

## خطوات الرفع

### الطريقة الأولى: من خلال موقع Vercel (موصى بها)

1. **ادخل على موقع Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخول أو أنشئ حساب جديد

2. **استيراد المشروع**
   - اضغط على "Add New Project"
   - اختر "Import Git Repository"
   - اختر المستودع الخاص بك من GitHub/GitLab/Bitbucket

3. **إعدادات المشروع**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

4. **متغيرات البيئة (Environment Variables)**
   أضف المتغيرات التالية في إعدادات المشروع:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   VITE_APP_NAME=مكتبة الثانوية
   VITE_APP_URL=https://your-domain.vercel.app
   ```

5. **رفع المشروع**
   - اضغط على "Deploy"
   - انتظر حتى ينتهي البناء والرفع

### الطريقة الثانية: من خلال Vercel CLI

1. **تسجيل الدخول**
```bash
vercel login
```

2. **رفع المشروع**
```bash
vercel
```

3. **رفع للإنتاج**
```bash
vercel --prod
```

## بعد الرفع

### 1. إعداد Domain مخصص (اختياري)
- اذهب إلى إعدادات المشروع في Vercel
- اختر "Domains"
- أضف النطاق الخاص بك

### 2. تحديث متغيرات البيئة
- تأكد من تحديث `VITE_APP_URL` بالرابط النهائي للموقع

### 3. اختبار الموقع
- تأكد من عمل جميع الصفحات
- اختبر لوحة الإدارة (admin@gmail.com / admin#123)
- تأكد من عمل localStorage بشكل صحيح

## التحديثات التلقائية

عند ربط المشروع بـ Git:
- كل push للفرع الرئيسي (main/master) سيؤدي لرفع تلقائي للإنتاج
- الفروع الأخرى ستحصل على preview deployments

## استكشاف الأخطاء

### خطأ في البناء (Build Error)
```bash
# جرب تنظيف المشروع محلياً
npm run clean
npm run install:legacy
npm run build
```

### مشاكل في متغيرات البيئة
- تأكد من إضافة جميع المتغيرات في إعدادات Vercel
- تأكد من البادئة `VITE_` لجميع المتغيرات

### مشاكل في التوجيه (Routing)
- ملف `vercel.json` يحتوي على إعدادات التوجيه الصحيحة
- تأكد من عدم تعديله

## الأمان

⚠️ **مهم جداً:**
- لا تضع `VITE_SUPABASE_SERVICE_ROLE_KEY` في الكود
- استخدم متغيرات البيئة فقط
- لا ترفع ملف `.env` على Git

## الأداء

المشروع محسّن للأداء:
- Code splitting تلقائي
- Caching للملفات الثابتة
- Compression تلقائي من Vercel

## الدعم

للمزيد من المعلومات:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
