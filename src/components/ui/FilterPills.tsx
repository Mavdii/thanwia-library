import { bookTypeLabels, gradeLabels } from '@/lib/utils';
import type { BookType, Grade } from '@/types';

interface FilterPillsProps {
  options: { value: string; label: string }[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  allLabel?: string;
}

export function FilterPills({ options, selected, onSelect, allLabel = 'الكل' }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`filter-pill ${!selected ? 'active' : ''}`}
      >
        {allLabel}
      </button>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`filter-pill ${selected === option.value ? 'active' : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Book type filter
const bookTypeOptions = Object.entries(bookTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

export function BookTypeFilter({ 
  selected, 
  onSelect 
}: { 
  selected: BookType | null; 
  onSelect: (type: BookType | null) => void;
}) {
  return (
    <FilterPills
      options={bookTypeOptions}
      selected={selected}
      onSelect={(value) => onSelect(value as BookType | null)}
      allLabel="جميع الأنواع"
    />
  );
}

// Grade filter
const gradeOptions = Object.entries(gradeLabels).map(([value, label]) => ({
  value,
  label,
}));

export function GradeFilter({ 
  selected, 
  onSelect 
}: { 
  selected: Grade | null; 
  onSelect: (grade: Grade | null) => void;
}) {
  return (
    <FilterPills
      options={gradeOptions}
      selected={selected}
      onSelect={(value) => onSelect(value as Grade | null)}
      allLabel="جميع الصفوف"
    />
  );
}
