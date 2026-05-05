'use client';

import { useState } from 'react';
import { Button } from '@zoltraak/ui/components/button';
import { Separator } from '@zoltraak/ui/components/separator';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@zoltraak/ui/components/drawer';
import { X, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@zoltraak/ui/components/badge';

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function FilterContent({
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          {/* "All" pill */}
          <button
            onClick={() => onCategoryChange('')}
            className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === ''
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            All
          </button>

          <Separator />

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductFilters(props: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasFilter = props.selectedCategory !== '';

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:block w-56 shrink-0 pr-6 border-r border-border">
        <div className="sticky top-28">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            {hasFilter && (
              <button
                onClick={() => props.onCategoryChange('')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <FilterContent {...props} />
        </div>
      </div>

      {/* ── Mobile trigger ── */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2"
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilter && (
            <Badge className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
              1
            </Badge>
          )}
        </Button>
      </div>

      {/* ── Mobile drawer ── */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[80vh] overflow-y-auto">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X size={20} />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <FilterContent {...props} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
