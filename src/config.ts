// Site configuration
// Replace empty values with your content to customize the template

export interface SiteConfig {
  language: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface HeroConfig {
  brandLeft: string;
  brandRight: string;
  tagline: string;
  badge: string;
  since: string;
  email: string;
  heroImage: string;
  heroImageAlt: string;
  scrollText: string;
  copyrightText: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AboutConfig {
  label: string;
  headline: string;
  description: string;
  bottomText: string;
  galleryImages: GalleryImage[];
  stats: StatItem[];
}

export interface Exhibition {
  id: number;
  title: string;
  image: string;
  date: string;
}

export interface ExhibitionsConfig {
  label: string;
  headline: string;
  ctaText: string;
  exhibitions: Exhibition[];
}

export interface Collection {
  id: number;
  title: string;
  year: string;
  description: string;
  image: string;
}

export interface CollectionsConfig {
  label: string;
  headline: string;
  ctaText: string;
  collections: Collection[];
}

export interface TestimonialsConfig {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImage: string;
}

export interface InfoCard {
  icon: string;
  title: string;
  content: string;
}

export interface VisitConfig {
  label: string;
  headline: string;
  description: string;
  ctaText: string;
  infoCards: InfoCard[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  marqueeText: string;
  brandName: string;
  brandDescription: string;
  socialLinks: SocialLink[];
  quickLinks: FooterLink[];
  quickLinksTitle: string;
  contactTitle: string;
  contactItems: string[];
  bottomLinks: FooterLink[];
}

export const siteConfig: SiteConfig = {
  language: "",
  title: "",
  description: "",
};

export const heroConfig: HeroConfig = {
  brandLeft: "",
  brandRight: "",
  tagline: "",
  badge: "",
  since: "",
  email: "",
  heroImage: "",
  heroImageAlt: "",
  scrollText: "",
  copyrightText: "",
  navLinks: [],
  socialLinks: [],
};

export const aboutConfig: AboutConfig = {
  label: "",
  headline: "",
  description: "",
  bottomText: "",
  galleryImages: [],
  stats: [],
};

export const exhibitionsConfig: ExhibitionsConfig = {
  label: "",
  headline: "",
  ctaText: "",
  exhibitions: [],
};

export const collectionsConfig: CollectionsConfig = {
  label: "",
  headline: "",
  ctaText: "",
  collections: [],
};

export const testimonialsConfig: TestimonialsConfig = {
  quote: "",
  authorName: "",
  authorTitle: "",
  authorImage: "",
};

export const visitConfig: VisitConfig = {
  label: "",
  headline: "",
  description: "",
  ctaText: "",
  infoCards: [],
};

export const footerConfig: FooterConfig = {
  marqueeText: "",
  brandName: "",
  brandDescription: "",
  socialLinks: [],
  quickLinks: [],
  quickLinksTitle: "",
  contactTitle: "",
  contactItems: [],
  bottomLinks: [],
};
