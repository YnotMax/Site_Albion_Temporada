import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "../utils/cn";
import { getTopPlayers, Timeframe, getCategories, shortCategoryNames } from "../data/mockData";
import { useState, useRef } from "react";

interface RankingsProps {
  onPlayerSelect: (playerName: string) => void;
}

export function Rankings({ onPlayerSelect }: RankingsProps) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [timeframe, setTimeframe] = useState<Timeframe>("1 Day");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filters = ["All", ...getCategories()];

  let players = getTopPlayers(filter, timeframe, 50);

  if (search) {
    players = players.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const getRole = (index: number) => {
    if (index === 0) return "Grandmaster";
    if (index < 3) return "Master";
    if (index < 10) return "Veteran";
    return "Member";
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pt-4 space-y-8 pb-24">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-[1.5px] text-primary uppercase">Leaderboard</span>
          <h2 className="text-4xl font-extrabold text-on-surface">Guild Rankings</h2>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg self-start md:self-auto">
          {(["Total", "1 Day", "1 Week", "2 Weeks"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap",
                timeframe === tf
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </section>

      {/* Search and Filters */}
      <section className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-outline" />
          </div>
          <input
            type="text"
            className="w-full bg-surface-container-low border-none rounded-full py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative flex items-center">
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 p-1.5 bg-surface-container-low/80 backdrop-blur-sm rounded-full shadow-sm border border-outline-variant/20 text-on-surface-variant hover:text-on-surface hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-2 md:px-8 w-full scroll-smooth"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors",
                  filter === f
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {f === "All" ? "All" : shortCategoryNames[f] || f}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 p-1.5 bg-surface-container-low/80 backdrop-blur-sm rounded-full shadow-sm border border-outline-variant/20 text-on-surface-variant hover:text-on-surface hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Rankings List */}
      <section className="space-y-4">
        {players.slice(0, 3).map((player, index) => (
          <div
            key={player.name}
            onClick={() => onPlayerSelect(player.name)}
            className="group cursor-pointer bg-surface-container-lowest rounded-lg p-6 flex items-center justify-between hover:shadow-[0_12px_40px_rgba(13,28,46,0.06)] transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-full font-black italic text-xl",
                  index === 0
                    ? "bg-gradient-to-br from-primary to-primary-container text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                )}
              >
                {index + 1}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-on-surface">{player.name}</span>
                  {player.diff !== undefined && (
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-high",
                      player.diff > 0 ? "text-emerald-500" : player.diff < 0 ? "text-red-500" : "text-on-surface-variant"
                    )}>
                      {player.diff > 0 ? "+" : ""}{player.diff.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      index === 0 ? "bg-tertiary" : index === 1 ? "bg-secondary" : "bg-tertiary-container"
                    )}
                  ></span>
                  {getRole(index)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-primary">{player.score.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-outline tracking-wider uppercase">
                {timeframe === "Total" ? "Season Score" : `${timeframe} Score`}
              </div>
            </div>
          </div>
        ))}

        {players.length > 3 && (
          <div className="bg-surface-container-low rounded-lg overflow-hidden">
            {players.slice(3).map((player, index) => (
              <div
                key={player.name}
                onClick={() => onPlayerSelect(player.name)}
                className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10 cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 text-sm font-bold text-outline text-center">{index + 4}</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-on-surface">{player.name}</span>
                      {player.diff !== undefined && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-surface-container-highest",
                          player.diff > 0 ? "text-emerald-500" : player.diff < 0 ? "text-red-500" : "text-on-surface-variant"
                        )}>
                          {player.diff > 0 ? "+" : ""}{player.diff > 1000 ? `${(player.diff / 1000).toFixed(1)}k` : player.diff}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-on-surface-variant">
                  {player.score > 1000 ? `${(player.score / 1000).toFixed(1)}k` : player.score}
                </span>
              </div>
            ))}
          </div>
        )}
        {players.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            No players found for this category.
          </div>
        )}
      </section>
    </main>
  );
}
