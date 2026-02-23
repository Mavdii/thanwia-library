import { Helmet } from 'react-helmet-async';
import type { Subject, Section } from '@/types';

interface SubjectSEOProps {
  subject: Subject;
  section: Section;
  url: string;
}

export function SubjectSEO({ subject, section, url }: SubjectSEOProps) {
  const title = subject.seo_title || `كتب ومذكرات ${subject.name} — ${section.name}`;
  const description = subject.seo_description || 
    `تحميل أفضل كتب ومذكرات ${subject.name} لل${section.name} مجاناً. كتب خارجية، مذكرات مدرسين، تلخيصات وأكثر.`;

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://maktabat-thanawya.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: section.name,
        item: `https://maktabat-thanawya.com/${section.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: subject.name,
        item: url,
      },
    ],
  };

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:site_name" content="مكتبة الثانوية" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
    </Helmet>
  );
}
