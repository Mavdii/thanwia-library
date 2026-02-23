import { Helmet } from 'react-helmet-async';

export function HomeSEO() {
  const title = 'مكتبة الثانوية | تحميل كتب ومذكرات الثانوية العامة مجاناً';
  const description = 'منصة مكتبة الثانوية - أكبر مكتبة رقمية لطلاب الثانوية العامة والأزهرية في مصر. تحميل مجاني لجميع الكتب والمذكرات عبر تيليجرام.';
  const keywords = 'كتب ثانوية عامة, مذكرات ثانوية, تحميل كتب, ثانوي عام, ثانوي أزهري, مكتبة رقمية';
  const url = 'https://maktabat-thanawya.com';

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'مكتبة الثانوية',
    url,
    description,
    inLanguage: 'ar',
    publisher: {
      '@type': 'Organization',
      name: 'مكتبة الثانوية',
      url,
    },
  };

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'مكتبة الثانوية',
    url,
    logo: `${url}/logo.png`,
    description,
    sameAs: [
      'https://t.me/maktabat_thanawya',
    ],
  };

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}/og-default.jpg`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:site_name" content="مكتبة الثانوية" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}/og-default.jpg`} />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
    </Helmet>
  );
}
