import { Settings } from "lucide-react";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { cn } from "../utils/cn";

export function Header() {
  const scrollDirection = useScrollDirection();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 glass-header px-6 py-4 flex items-center justify-between transition-transform duration-300",
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline font-extrabold text-xs shadow-sm">
          G L
        </div>
        <h1 className="font-headline text-2xl font-extrabold text-on-surface">Guild Hub</h1>
      </div>
      <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
        <Settings className="w-6 h-6 text-on-surface-variant" />
      </button>
    </header>
  );
}
