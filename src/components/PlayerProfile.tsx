import { TrendingUp, Trophy, Swords, ArrowLeft, Search, Clock, Activity, Target, Zap } from "lucide-react";
import { getPlayerCategoryStats, getAllPlayers, getPlayerHistory, getPlayerPerformanceInsights } from "../data/mockData";
import { cn } from "../utils/cn";
import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface PlayerProfileProps {
  playerName: string;
  onBack: () => void;
  onPlayerSelect?: (playerName: string) => void;
}

export function PlayerProfile({ playerName, onBack, onPlayerSelect }: PlayerProfileProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const categoryStats = getPlayerCategoryStats(playerName);
  const performanceHistory = getPlayerHistory(playerName);
  const insights = getPlayerPerformanceInsights(playerName);

  const radarData = categoryStats.map(stat => ({
    subject: stat.shortName,
    fullCategory: stat.category,
    A: stat.score,
    fullMark: stat.maxScore
  }));

  const allPlayers = getAllPlayers();
  const searchResults = search 
    ? allPlayers.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  const handleSelect = (name: string) => {
    setSearch("");
    setShowDropdown(false);
    if (onPlayerSelect) {
      onPlayerSelect(name);
    }
  };

  // Calculate Favorite Category
  const favoriteCategory = [...categoryStats].sort((a, b) => b.score - a.score)[0];
  const totalScore = categoryStats.reduce((sum, stat) => sum + stat.score, 0);
  const favoritePercentage = totalScore > 0 ? Math.round((favoriteCategory.score / totalScore) * 100) : 0;

  // Calculate Rank and Tier
  const playerRankIndex = allPlayers.findIndex(p => p.name === playerName);
  const playerRank = playerRankIndex !== -1 ? playerRankIndex + 1 : "?";
  
  const getTitle = (categoryShortName: string) => {
    const titles: Record<string, string> = {
      "PvE": "Caçador de Monstros",
      "Coleta": "Mestre Coletor",
      "Castelos": "Senhor da Guerra",
      "Contrabando": "Mestre dos Transportes",
      "Núcleos": "Especialista em Objetivos",
      "Profundezas": "Explorador das Profundezas",
      "Corrompidas": "Duelista Corrompido",
      "Tesouros": "Caçador de Tesouros",
      "Aranhas": "Caçador de Aranhas",
      "Cristais": "Guardião de Cristais",
      "Hellgates": "Gladiador Infernal"
    };
    return titles[categoryShortName] || "Membro da Guilda";
  };

  const playerTitle = favoriteCategory ? getTitle(favoriteCategory.shortName) : "Membro da Guilda";

  const getTier = (rank: number | string) => {
    if (rank === "?") return { name: "Desconhecido", color: "text-on-surface-variant", icon: TrendingUp };
    const numericRank = typeof rank === 'string' ? parseInt(rank, 10) : rank;
    if (numericRank <= 10) return { name: "Elite da Guilda", color: "text-amber-500", icon: Trophy };
    if (numericRank <= 50) return { name: "Veterano", color: "text-tertiary", icon: Swords };
    return { name: "Membro Ativo", color: "text-primary", icon: TrendingUp };
  };

  const tier = getTier(playerRank);
  const TierIcon = tier.icon;

  return (
    <main className="max-w-7xl mx-auto px-6 pt-4 space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Rankings
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
            <Clock className="w-3.5 h-3.5" />
            Last Updated: Today, 14:30
          </div>
        </div>

        {/* Player Search Bar */}
        <div className="relative w-full md:w-72 z-50">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-on-surface-variant" />
          </div>
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm border border-outline-variant/20"
          />
          
          {/* Search Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden">
              {searchResults.map(p => (
                <button
                  key={p.name}
                  onClick={() => handleSelect(p.name)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-surface-container-low transition-colors border-b border-outline-variant/10 last:border-0"
                >
                  <span className="font-bold">{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Player Identity Section */}
      <section className="flex flex-col md:flex-row items-center gap-6 bg-surface-container-low p-6 rounded-xl">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-highest bento-shadow">
            <img
              alt={`${playerName} Avatar`}
              className="w-full h-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}`}
            />
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-3">
            <h2 className="font-headline text-5xl font-extrabold text-on-surface leading-none">{playerName}</h2>
            <div className="text-on-surface-variant font-bold pb-1 relative group cursor-help">
              <span className="text-2xl text-on-surface">{totalScore.toLocaleString()}</span> pts
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-container-highest text-on-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Sum of all points across all categories
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <span className="bg-surface-container-high px-4 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wider relative group cursor-help">
              {playerTitle}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-container-highest text-on-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg normal-case tracking-normal">
                Title based on your highest scoring category
              </div>
            </span>
            <span className={`flex items-center gap-1.5 font-bold text-sm ${tier.color} relative group cursor-help`}>
              <TierIcon className="w-4 h-4" />
              {tier.name} {playerRank !== "?" && `(#${playerRank})`}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-container-highest text-on-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Current tier and overall leaderboard position
              </div>
            </span>
          </div>
          
          {/* Quick Stats Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-on-surface-variant border-t border-outline-variant/20 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-medium">Active this week</span>
            </div>
            <div className="flex items-center gap-2 relative group cursor-help">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-medium">Top Score: {favoriteCategory ? favoriteCategory.score.toLocaleString() : 0}</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-container-highest text-on-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Highest score achieved in a single category
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-tertiary" />
              <span className="font-medium">{favoritePercentage}% Focus in {favoriteCategory ? favoriteCategory.shortName : "None"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Insights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <div key={insight.timeframe} className="bg-surface-container-lowest p-6 rounded-xl bento-shadow border-t-4 border-secondary flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {insight.timeframe === "1 Day" ? "Last 24 Hours" : insight.timeframe === "1 Week" ? "Last 7 Days" : "All Time"}
              </h3>
              <Zap className="w-4 h-4 text-secondary" />
            </div>
            
            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-black text-on-surface">
                {insight.totalGained > 1000000 ? `${(insight.totalGained / 1000000).toFixed(2)}M` : insight.totalGained.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-on-surface-variant mb-1">pts</span>
            </div>
            
            <div className="flex-1">
              {insight.categories.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 pb-2">Top Categories</p>
                  {insight.categories.slice(0, 3).map((cat, idx) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-4 text-center font-black text-on-surface-variant/40 text-xs">{idx + 1}</span>
                        <span className="font-bold text-on-surface">{cat.name}</span>
                      </div>
                      <span className="font-black text-secondary">
                        +{cat.gained > 1000 ? `${(cat.gained / 1000).toFixed(1)}k` : cat.gained}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-on-surface-variant italic opacity-50 flex items-center justify-center h-full">No activity recorded.</div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Radar Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 bento-shadow flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          <div className="absolute top-6 left-6 z-10">
            <h3 className="font-headline text-2xl font-bold">Tactical Proficiency</h3>
            <p className="text-on-surface-variant text-sm mt-1">Skill distribution across all roles</p>
          </div>
          <div className="w-full h-full max-h-[320px] mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#dce9ff" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#434655", fontSize: 11, fontWeight: "bold" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, "dataMax"]} tick={false} axisLine={false} />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), "Score"]}
                  labelFormatter={(label) => {
                    const dataPoint = radarData.find(d => d.subject === label);
                    return dataPoint ? dataPoint.fullCategory : label;
                  }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Radar
                  name={playerName}
                  dataKey="A"
                  stroke="#004ac6"
                  strokeWidth={3}
                  fill="#2563eb"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats Bento */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Favorite Category */}
          <div className="bg-surface-container-lowest p-6 rounded-xl bento-shadow flex flex-col justify-between h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Swords className="w-6 h-6 text-on-secondary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                  Favorite Category
                </p>
                <p className="font-headline font-bold text-lg leading-tight">
                  {favoriteCategory ? favoriteCategory.shortName : "None"}
                </p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed">
              {favoritePercentage}% of total engagement spent in {favoriteCategory ? favoriteCategory.category : "this category"}.
            </p>
          </div>
        </div>

        {/* Bottom Section: Score Trend Line Chart */}
        <div className="lg:col-span-12 bg-surface-container-lowest rounded-xl p-6 bento-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-headline text-2xl font-bold">Performance History</h3>
              <p className="text-on-surface-variant text-sm">Historical score trend over the season</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-full text-xs font-semibold">
                <div className="w-2 h-2 rounded-full bg-primary"></div> Total Score
              </div>
            </div>
          </div>

          {/* Line Chart Visualization */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce9ff" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#434655", fontSize: 12, fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#434655", fontSize: 12 }}
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                  width={60}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), "Total Score"]}
                  labelStyle={{ color: '#1a1c23', fontWeight: 'bold', marginBottom: '4px' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
