import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 hover:text-purple-400 transition-colors">
        <Home className="w-4 h-4" />
        <span>الرئيسية</span>
      </Link>
      
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4 breadcrumb-separator" />
          {item.href ? (
            <Link to={item.href} className="hover:text-purple-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
