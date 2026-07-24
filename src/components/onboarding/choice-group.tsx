"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export function ChoiceGroup({
  name,
  options,
  defaultValue = "",
}: {
  name: string;
  options: readonly { id: string; label: string }[];
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      <input type="hidden" name={name} value={value} />
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          onClick={() => setValue((current) => (current === option.id ? "" : option.id))}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            value === option.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-input text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
