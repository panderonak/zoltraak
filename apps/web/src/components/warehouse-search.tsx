"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@zoltraak/ui/components/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@zoltraak/ui/components/command";
import debounce from "lodash.debounce";
import { HomeIcon, Loader2 } from "lucide-react";
import * as React from "react";
import { searchWarehouses } from "@/http/api";
import type { WarehousesSearch } from "@/types";

type WarehouseSearchProps = {
  onValueChange: (value: string) => void;
};

export function WarehouseSearch({ onValueChange }: WarehouseSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [debouncedInput, setDebouncedInput] = React.useState<string>("");
  const [searchInput, setSearchInput] = React.useState("");
  const [selected, setSelected] = React.useState("");

  const debouncedUpdate = React.useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedInput(value);
      }, 300),
    [],
  );

  React.useEffect(() => {
    debouncedUpdate(searchInput);
    return () => debouncedUpdate.cancel();
  }, [searchInput, debouncedUpdate]);

  React.useEffect(() => {
    if (!open) {
      setSearchInput("");
      setDebouncedInput("");
    }
  }, [open]);

  const { data: warehouses = [], isLoading } = useQuery<WarehousesSearch>({
    queryKey: ["warehouses", "search", debouncedInput],
    queryFn: () => searchWarehouses(debouncedInput.trim()),
    enabled: open && debouncedInput.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });

  function handleSelect(id: string) {
    onValueChange(id);
    setOpen(false);
    setSearchInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full"
      >
        {selected ? selected : "Select Warehouse"}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Type to search..."
            value={searchInput}
            onValueChange={(value) => {
              setSearchInput(value);
            }}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center gap-x-2 py-6">
                <Loader2 className="size-5 animate-spin" />
                <span>Searching...</span>
              </div>
            )}

            {!isLoading &&
              searchInput.trim().length > 0 &&
              warehouses.length === 0 && (
                <CommandEmpty>No warehouse found.</CommandEmpty>
              )}

            {!isLoading && warehouses.length > 0 && (
              <CommandGroup heading="Name">
                {warehouses.map((warehouse) => (
                  <CommandItem
                    key={warehouse.id}
                    value={warehouse.name}
                    onSelect={() => {
                      handleSelect(warehouse.id);
                      setSelected(warehouse.name);
                    }}
                  >
                    <HomeIcon className="mr-2 size-4" />
                    <span> {warehouse.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
