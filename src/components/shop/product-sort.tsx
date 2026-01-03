'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ProductSortProps {
  onSortChange?: (value: string) => void;
}

export function ProductSort({ onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 hidden sm:inline">Sortieren nach:</span>
      <Select onValueChange={onSortChange} defaultValue="relevance">
        <SelectTrigger className="w-[180px] bg-white border-slate-200">
          <SelectValue placeholder="Sortierung" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevanz</SelectItem>
          <SelectItem value="price-asc">Preis aufsteigend</SelectItem>
          <SelectItem value="price-desc">Preis absteigend</SelectItem>
          <SelectItem value="newest">Neuheiten</SelectItem>
          <SelectItem value="rating">Bewertung</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
