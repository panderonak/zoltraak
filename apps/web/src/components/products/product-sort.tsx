"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@zoltraak/ui/components/select";
import type { SortOption } from "./product";

interface ProductSortProps {
  value: SortOption | "";
  onChange: (value: SortOption | "") => void;
}

// Map from UI label → API sort param value
const SORT_OPTIONS: { label: string; value: SortOption | "" }[] = [
  { label: "Default", value: "" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
      <label className="whitespace-nowrap font-medium text-foreground text-sm">
        Sort by:
      </label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as SortOption | "")}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value === "" ? "__default__" : opt.value}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
