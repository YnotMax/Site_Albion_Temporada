import { TrendingUp, ArrowRight, Users, Target, Zap, Award } from "lucide-react";
import { 
  getTopPlayers, 
  getGuildHistory, 
  getGuildFocusDistribution, 
  getGuildGrowth,
  getAllPlayers
} from "../data/mockData";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onPlayerSelect: (playerName: string) => void;
}

const COLORS = [
  '#6750A4', '#625B71', '#7D5260', '#B3261E', '#21005D', 
  '#106D1E', '#0061A4', '#914D00', '#6B5E40', '#4A662C', '#006A6A'
];

export function Dashboard({ onNavigate, onPlayerSelect }: DashboardProps) {
  const guildHistory = getGuildHistory();
  const focusDistribution = getGuildFocusDistribution();
  const growth = getGuildGrowth();
  const allPlayers = getAllPlayers();
  const risingStars = getTopPlayers("All", "1 Day", 3);
  
  const latestTotal = guildHistory[guildHistory.length - 1]?.score || 0;

  const categoryLeaders = [
    { id: "PvE (Terras Distantes)", label: "PvE Master", color: "bg-primary", explanation: "Liderando em abates de monstros e exploração de masmorras nas Terras Distantes." },
    { id: "Coleta", label: "Gathering Legend", color: "bg-secondary", explanation: "O maior extrator de recursos raros e materiais valiosos da guilda." },
    { id: "Castelos e Postos Avancados", label: "Siege Expert", color: "bg-tertiary", explanation: "Especialista em conquista de territórios e defesa de castelos estratégicos." },
    { id: "Contrabandistas", label: "Smuggler King", color: "bg-emerald-500", explanation: "Mestre em transporte de mercadorias valiosas através de rotas perigosas." },
    { id: "Nucleos de Poder", label: "Power Core Carrier", color: "bg-indigo-500", explanation: "Especialista em capturar e escoltar Núcleos de Poder para fortalecer os esconderijos da guilda." },
  ].map(cat => ({
    ...cat,
    player: getTopPlayers(cat.id, "1 Day", 1)[0]
  })).filter(cat => cat.player);

  const milestones = [
    { label: "Weekly PvE Goal", current: focusDistribution.find(d => d.name === "PvE")?.value || 0, target: 5000000, color: "bg-primary" },
    { label: "Guild Power Cores", current: focusDistribution.find(d => d.name === "Núcleos")?.value || 0, target: 1000000, color: "bg-indigo-500" },
    { label: "Castle Conquests", current: focusDistribution.find(d => d.name === "Castelos")?.value || 0, target: 2000000, color: "bg-tertiary" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 pt-4 pb-24 space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-[1.5px] text-primary uppercase">Overview</span>
          <h2 className="text-4xl font-extrabold text-on-surface">Guild Dashboard</h2>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-xl border border-outline-variant/10">
          <div className="px-4 py-2 text-center border-r border-outline-variant/20">
            <span className="block text-[10px] font-bold text-on-surface-variant uppercase">Active Today</span>
            <span className="text-xl font-black text-primary">{allPlayers.length}</span>
          </div>
          <div className="px-4 py-2 text-center">
            <span className="block text-[10px] font-bold text-on-surface-variant uppercase">Growth</span>
            <span className={`text-xl font-black ${growth.percentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {growth.percentage >= 0 ? '+' : ''}{growth.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl bento-shadow border border-outline-variant/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Guild Points</span>
              <h3 className="text-3xl font-black text-on-surface mt-1">
                {latestTotal > 1000000 ? `${(latestTotal / 1000000).toFixed(2)}M` : latestTotal.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Award className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${growth.percentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
            <span className={`text-sm font-bold ${growth.percentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {growth.absolute > 0 ? '+' : ''}{growth.absolute.toLocaleString()} today
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl bento-shadow border border-outline-variant/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Top Rising Star</span>
              <h3 className="text-3xl font-black text-on-surface mt-1">{risingStars[0]?.name || "N/A"}</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-bold text-secondary">+{risingStars[0]?.diff?.toLocaleString()} pts in 24h</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl bento-shadow border border-outline-variant/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Guild Members</span>
              <h3 className="text-3xl font-black text-on-surface mt-1">{allPlayers.length}</h3>
            </div>
            <div className="p-3 bg-tertiary/10 rounded-xl">
              <Users className="w-6 h-6 text-tertiary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-bold text-on-surface-variant">Tracking active contributors</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guild Activity Trend */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-2xl bento-shadow border border-outline-variant/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-on-surface">Guild Activity Trend</h3>
              <p className="text-sm text-on-surface-variant">Total points generated over time</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={guildHistory}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6750A4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6750A4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E1E1" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#625B71' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#625B71' }}
                  tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString()}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FDFBFF', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#6750A4' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6750A4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Guild Focus Distribution */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl bento-shadow border border-outline-variant/5">
          <h3 className="text-xl font-black text-on-surface mb-2">Guild Focus</h3>
          <p className="text-sm text-on-surface-variant mb-6">Point distribution by category</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={focusDistribution.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {focusDistribution.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {focusDistribution.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="font-bold text-on-surface-variant">{item.name}</span>
                </div>
                <span className="font-black text-on-surface">
                  {((item.value / latestTotal) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Milestones & Rising Stars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Milestones */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl bento-shadow border border-outline-variant/5">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-black text-on-surface">Guild Milestones</h3>
          </div>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  <span>{m.label}</span>
                  <span>{((m.current / m.target) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${m.color} transition-all duration-1000`} 
                    style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-outline">
                  <span>{m.current.toLocaleString()} pts</span>
                  <span>Goal: {m.target.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rising Stars */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl bento-shadow border border-outline-variant/5">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h3 className="text-xl font-black text-on-surface">Rising Stars</h3>
          </div>
          <div className="space-y-4">
            {risingStars.map((p, i) => (
              <button 
                key={p.name} 
                onClick={() => onPlayerSelect(p.name)}
                className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/5 hover:bg-surface-container-high transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-sm group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    {i + 1}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-on-surface">{p.name}</h4>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">+{p.diff?.toLocaleString()} pts</span>
                  </div>
                </div>
                <div className="p-2 bg-surface-container-high rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Category Leaders */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl bento-shadow border border-outline-variant/5">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-tertiary" />
            <h3 className="text-xl font-black text-on-surface">Category Leaders</h3>
          </div>
          <div className="space-y-3">
            {categoryLeaders.slice(0, 5).map((leader) => (
              <button 
                key={leader.id} 
                onClick={() => onPlayerSelect(leader.player.name)}
                className="w-full flex items-center justify-between p-3 hover:bg-surface-container-low rounded-lg transition-colors group cursor-help relative"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-6 rounded-full ${leader.color}`}></div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-on-surface">{leader.player.name}</h4>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">{leader.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-on-surface">
                    {leader.player.score > 1000 ? `${(leader.player.score / 1000).toFixed(1)}k` : leader.player.score}
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-surface-container-highest text-on-surface text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-outline-variant/20">
                  <p className="font-bold mb-1 text-primary">{leader.label}</p>
                  <p className="leading-relaxed">{leader.explanation}</p>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate("rankings")}
            className="mt-6 w-full py-3 rounded-xl bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all"
          >
            Full Leaderboard
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </main>
  );
}

