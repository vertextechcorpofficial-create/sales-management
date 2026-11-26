"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchableOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  /** Optional server-side search handler; when provided, client-side filtering is bypassed. */
  onSearchChange?: (search: string) => void;
  /** Controlled search value when using async/server-side search. */
  searchValue?: string;
  /** Shows a loading indicator inside the dropdown while fetching remote options. */
  loading?: boolean;
  /** Fallback selected option when value isn't in the current paginated page of options. */
  selectedOptionOverride?: SearchableOption | null;
  /** Caps rendered DOM items in client-side mode to prevent main-thread lag. */
  maxVisibleOptions?: number;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  allowClear = false,
  onSearchChange,
  searchValue,
  loading = false,
  selectedOptionOverride = null,
  maxVisibleOptions = 100,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalSearch, setInternalSearch] = React.useState("");

  const isServerSearch = typeof onSearchChange === "function";
  const currentSearch = isServerSearch ? (searchValue ?? internalSearch) : internalSearch;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setInternalSearch("");
      if (isServerSearch) {
        onSearchChange("");
      }
    }
  };

  const handleSearchInputChange = (val: string) => {
    setInternalSearch(val);
    if (isServerSearch) {
      onSearchChange(val);
    }
  };

  const selectedOption = React.useMemo(() => {
    const found = options.find((opt) => opt.value === value);
    if (found) return found;
    if (selectedOptionOverride && selectedOptionOverride.value === value) {
      return selectedOptionOverride;
    }
    return undefined;
  }, [options, value, selectedOptionOverride]);

  const { visibleOptions, totalMatches } = React.useMemo(() => {
    if (isServerSearch) {
      return { visibleOptions: options, totalMatches: options.length };
    }
    const q = currentSearch.trim().toLowerCase();
    const matched = q
      ? options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(q) ||
            (opt.subLabel && opt.subLabel.toLowerCase().includes(q)) ||
            opt.value.toLowerCase().includes(q)
        )
      : options;
    return {
      visibleOptions: matched.slice(0, maxVisibleOptions),
      totalMatches: matched.length,
    };
  }, [options, isServerSearch, currentSearch, maxVisibleOptions]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal text-left truncate h-9 px-3 border-input bg-background hover:bg-accent/40 hover:text-accent-foreground dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 transition-colors",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.subLabel && (
              <span className="text-xs text-muted-foreground truncate border border-border/60 rounded px-1.5 py-0.5 bg-muted/40 font-mono text-[11px]">
                {selectedOption.subLabel}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] min-w-[280px] p-0 shadow-lg border border-border bg-popover text-popover-foreground rounded-lg"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={currentSearch}
            onValueChange={handleSearchInputChange}
            className="h-9 border-b"
          />
          <CommandList className="max-h-60 overflow-y-auto p-1">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Searching...</span>
              </div>
            ) : (
              <>
                {visibleOptions.length === 0 && (
                  <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                    No results found.
                  </CommandEmpty>
                )}
                <CommandGroup>
                  {allowClear && value && (
                    <CommandItem
                      value="__clear__"
                      onSelect={() => {
                        onValueChange("");
                        handleOpenChange(false);
                      }}
                      className="text-xs text-muted-foreground italic cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    >
                      Clear selection
                    </CommandItem>
                  )}
                  {visibleOptions.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => {
                        onValueChange(opt.value);
                        handleOpenChange(false);
                      }}
                      className="flex items-center justify-between py-2 px-2.5 rounded-md cursor-pointer hover:bg-accent/60 aria-selected:bg-accent"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="truncate text-sm font-medium">{opt.label}</span>
                        {opt.subLabel && (
                          <span className="truncate text-xs text-muted-foreground">{opt.subLabel}</span>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0 text-primary transition-opacity",
                          value === opt.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  {!isServerSearch && totalMatches > maxVisibleOptions && (
                    <div className="py-1.5 px-2 text-center text-[11px] text-muted-foreground border-t border-border/50 mt-1">
                      Showing top {maxVisibleOptions} of {totalMatches}. Type to refine search.
                    </div>
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
