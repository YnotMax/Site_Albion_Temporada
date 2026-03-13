import { LayoutDashboard, Trophy, Target, User } from "lucide-react";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { cn } from "../utils/cn";

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const scrollDirection = useScrollDirection();
  const tabs = [
    { id: "rankings", label: "Rankings", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "strategy", label: "Strategy", icon: Target },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 glass-header border-t border-outline-variant/15 px-6 py-3 z-50 transition-transform duration-300",
        scrollDirection === "down" ? "translate-y-full" : "translate-y-0"
      )}
    >
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className={cn(
                  "px-5 py-1 rounded-full transition-colors",
                  isActive
                    ? "bg-primary text-on-primary"
                    : "group-hover:bg-surface-container-high text-on-surface-variant"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive ? "text-on-primary" : "text-on-surface-variant")} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold",
                  isActive ? "text-primary" : "text-on-surface-variant"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
