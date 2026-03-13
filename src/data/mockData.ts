/// <reference types="vite/client" />

export interface Player {
  name: string;
  score: number;
  diff?: number;
}

export interface PlayerStats {
  pve: number;
  gathering: number;
  objectives: number;
  transport: number;
  hellgates: number;
  total: number;
}

export type Timeframe = "Total" | "1 Day" | "1 Week" | "2 Weeks";

// Dynamically import all ranking_history.json files in the data folder
const modules = import.meta.glob('./*/ranking_history.json', { eager: true });

const guildData: Record<string, Record<string, Record<string, number>>> = {};

for (const path in modules) {
  const fileContent = (modules[path] as any).default || (modules[path] as any);
  for (const category in fileContent) {
    if (!guildData[category]) guildData[category] = {};
    for (const dateKey in fileContent[category]) {
      guildData[category][dateKey] = fileContent[category][dateKey];
    }
  }
}

const allDates = new Set<string>();
for (const category in guildData) {
  for (const date in guildData[category]) {
    allDates.add(date);
  }
}
const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));
const LATEST_DATE = sortedDates[0] || "2026-03-12";

function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().split('T')[0];
}

export function getCategories(): string[] {
  return Object.keys(guildData);
}

export function getAllPlayers(): Player[] {
  return getTopPlayers("All", "Total", 10000);
}

export function getTopPlayers(categoryName: string, timeframe: Timeframe = "Total", limit: number = 50): Player[] {
  if (!LATEST_DATE) return [];

  let daysToSubtract = 0;
  if (timeframe === "1 Day") daysToSubtract = 1;
  else if (timeframe === "1 Week") daysToSubtract = 7;
  else if (timeframe === "2 Weeks") daysToSubtract = 14;

  const targetDate = daysToSubtract > 0 ? subtractDays(LATEST_DATE, daysToSubtract) : LATEST_DATE;

  const getScoresForDate = (date: string) => {
    const playerTotals: Record<string, number> = {};
    const categories = (!categoryName || categoryName === "All") ? Object.keys(guildData) : [categoryName];
    
    for (const cat of categories) {
      const catData = guildData[cat]?.[date] || {};
      for (const [playerName, score] of Object.entries(catData)) {
        playerTotals[playerName] = (playerTotals[playerName] || 0) + (score as number);
      }
    }
    return playerTotals;
  };

  const latestScores = getScoresForDate(LATEST_DATE);
  
  if (timeframe === "Total") {
    return Object.entries(latestScores)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } else {
    const pastScores = getScoresForDate(targetDate);
    const playersWithDiff = Object.entries(latestScores).map(([name, score]) => {
      const pastScore = pastScores[name] || 0;
      const diff = score - pastScore;
      return { name, score, diff };
    });

    return playersWithDiff
      .sort((a, b) => b.diff - a.diff)
      .slice(0, limit);
  }
}

export interface CategoryStats {
  category: string;
  shortName: string;
  score: number;
  maxScore: number;
}

export const shortCategoryNames: Record<string, string> = {
  "PvE (Terras Distantes)": "PvE",
  "Coleta": "Coleta",
  "Castelos e Postos Avancados": "Castelos",
  "Contrabandistas": "Contrabando",
  "Nucleos de Poder": "Núcleos",
  "As Profundezas": "Profundezas",
  "Masmorras Corrompidas": "Corrompidas",
  "Tesouros das Terras Distantes": "Tesouros",
  "Aranhas de Cristal": "Aranhas",
  "Cristais de Poder": "Cristais",
  "Hellgates": "Hellgates"
};

export function getPlayerCategoryStats(playerName: string): CategoryStats[] {
  if (!LATEST_DATE) return [];

  const categories = getCategories();
  const stats: CategoryStats[] = [];

  for (const cat of categories) {
    const catData = guildData[cat]?.[LATEST_DATE] || {};
    const score = catData[playerName] || 0;
    
    let maxScore = 0;
    for (const p in catData) {
      if (catData[p] > maxScore) {
        maxScore = catData[p];
      }
    }
    
    maxScore = Math.max(maxScore, 100);

    stats.push({
      category: cat,
      shortName: shortCategoryNames[cat] || cat,
      score,
      maxScore
    });
  }

  return stats;
}

export function getPlayerHistory(playerName: string): { date: string; score: number }[] {
  const history: { date: string; score: number }[] = [];
  
  // Sort dates chronologically (oldest to newest)
  const chronologicalDates = [...sortedDates].reverse();
  
  for (const date of chronologicalDates) {
    let totalScore = 0;
    for (const category in guildData) {
      const catData = guildData[category]?.[date] || {};
      totalScore += (catData[playerName] || 0);
    }
    
    // Only add data points if the player has a score, or if we want to show 0s
    // We'll add it anyway to show the timeline properly
    history.push({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      score: totalScore
    });
  }
  
  return history;
}

export function getGuildHistory(): { date: string; score: number }[] {
  const history: { date: string; score: number }[] = [];
  const chronologicalDates = [...sortedDates].reverse();
  
  for (const date of chronologicalDates) {
    let totalScore = 0;
    for (const category in guildData) {
      const catData = guildData[category]?.[date] || {};
      for (const score of Object.values(catData)) {
        totalScore += (score as number);
      }
    }
    
    history.push({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      score: totalScore
    });
  }
  
  return history;
}

export function getGuildFocusDistribution(): { name: string; value: number }[] {
  if (!LATEST_DATE) return [];
  
  const distribution: { name: string; value: number }[] = [];
  for (const category in guildData) {
    const catData = guildData[category]?.[LATEST_DATE] || {};
    let totalScore = 0;
    for (const score of Object.values(catData)) {
      totalScore += (score as number);
    }
    
    if (totalScore > 0) {
      distribution.push({
        name: shortCategoryNames[category] || category,
        value: totalScore
      });
    }
  }
  
  return distribution.sort((a, b) => b.value - a.value);
}

export function getGuildGrowth(): { percentage: number; absolute: number } {
  if (sortedDates.length < 2) return { percentage: 0, absolute: 0 };
  
  const today = sortedDates[0];
  const yesterday = sortedDates[1];
  
  const getTotalForDate = (date: string) => {
    let total = 0;
    for (const cat in guildData) {
      const catData = guildData[cat]?.[date] || {};
      for (const score of Object.values(catData)) {
        total += (score as number);
      }
    }
    return total;
  };
  
  const todayTotal = getTotalForDate(today);
  const yesterdayTotal = getTotalForDate(yesterday);
  
  if (yesterdayTotal === 0) return { percentage: 100, absolute: todayTotal };
  
  const absolute = todayTotal - yesterdayTotal;
  const percentage = (absolute / yesterdayTotal) * 100;
  
  return { percentage, absolute };
}

export function getPlayerStats(playerName: string): PlayerStats {
  const stats = {
    pve: 0,
    gathering: 0,
    objectives: 0,
    transport: 0,
    hellgates: 0,
    total: 0
  };

  const safeGet = (cat: string) => guildData[cat]?.[LATEST_DATE]?.[playerName] || 0;

  stats.pve = safeGet("PvE (Terras Distantes)") + safeGet("As Profundezas") + safeGet("Masmorras Corrompidas");
  stats.gathering = safeGet("Coleta") + safeGet("Tesouros das Terras Distantes") + safeGet("Aranhas de Cristal");
  stats.objectives = safeGet("Castelos e Postos Avancados") + safeGet("Nucleos de Poder") + safeGet("Cristais de Poder");
  stats.transport = safeGet("Contrabandistas");
  stats.hellgates = safeGet("Hellgates");

  stats.total = stats.pve + stats.gathering + stats.objectives + stats.transport + stats.hellgates;

  return stats;
}

export function getMaxStats(): PlayerStats {
  const maxStats = {
    pve: 0,
    gathering: 0,
    objectives: 0,
    transport: 0,
    hellgates: 0,
    total: 0
  };

  if (!LATEST_DATE) return maxStats;

  const allPlayers = new Set<string>();
  for (const cat in guildData) {
    const catData = guildData[cat]?.[LATEST_DATE] || {};
    for (const playerName in catData) {
      allPlayers.add(playerName);
    }
  }

  for (const playerName of allPlayers) {
    const stats = getPlayerStats(playerName);
    if (stats.pve > maxStats.pve) maxStats.pve = stats.pve;
    if (stats.gathering > maxStats.gathering) maxStats.gathering = stats.gathering;
    if (stats.objectives > maxStats.objectives) maxStats.objectives = stats.objectives;
    if (stats.transport > maxStats.transport) maxStats.transport = stats.transport;
    if (stats.hellgates > maxStats.hellgates) maxStats.hellgates = stats.hellgates;
    if (stats.total > maxStats.total) maxStats.total = stats.total;
  }

  // Ensure a minimum to avoid division by zero in charts
  maxStats.pve = Math.max(maxStats.pve, 100);
  maxStats.gathering = Math.max(maxStats.gathering, 100);
  maxStats.objectives = Math.max(maxStats.objectives, 100);
  maxStats.transport = Math.max(maxStats.transport, 100);
  maxStats.hellgates = Math.max(maxStats.hellgates, 100);

  return maxStats;
}
