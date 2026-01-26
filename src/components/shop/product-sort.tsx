'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

interface ProductSortProps {
  onSortChange?: (value: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function ProductSort({ onSortChange, viewMode = 'grid', onViewModeChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-4">
      {/* View Mode Toggle */}
      <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-white">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange?.('grid')}
          className={`px-3 py-1.5 rounded-md ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange?.('list')}
          className={`px-3 py-1.5 rounded-md ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Sort Select */}
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
    </div>
  );
}
