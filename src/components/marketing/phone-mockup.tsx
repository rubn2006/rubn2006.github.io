import { PlayCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-rose-400 via-orange-300 to-amber-200",
  "from-violet-400 via-fuchsia-300 to-pink-200",
  "from-emerald-400 via-teal-300 to-cyan-200",
  "from-sky-400 via-blue-300 to-indigo-200",
];

export function PhoneMockup({
  title,
  caption,
  gradientIndex = 0,
  className,
}: {
  title: string;
  caption?: string;
  gradientIndex?: number;
  className?: string;
}) {
  const gradient = GRADIENTS[gradientIndex % GRADIENTS.length];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative aspect-9/16 overflow-hidden rounded-2xl border shadow-sm">
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <PlayCircle className="size-10 text-white/90 drop-shadow" aria-hidden />
          <p className="text-sm font-medium text-white drop-shadow">{title}</p>
        </div>
        <span className="absolute top-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          Exemple illustratif
        </span>
      </div>
      {caption && <p className="text-muted-foreground text-center text-xs">{caption}</p>}
    </div>
  );
}
