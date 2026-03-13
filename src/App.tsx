/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { Rankings } from "./components/Rankings";
import { PlayerProfile } from "./components/PlayerProfile";
import { Strategy } from "./components/Strategy";

export default function App() {
  const [currentTab, setCurrentTab] = useState("rankings");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedPlayer(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayerSelect = (playerName: string) => {
    setSelectedPlayer(playerName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRankings = () => {
    setSelectedPlayer(null);
    setCurrentTab("rankings");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pt-20 pb-24">
      <Header />
      
      {selectedPlayer ? (
        <PlayerProfile playerName={selectedPlayer} onBack={handleBackToRankings} onPlayerSelect={handlePlayerSelect} />
      ) : (
        <>
          {currentTab === "dashboard" && <Dashboard onNavigate={handleTabChange} />}
          {currentTab === "rankings" && <Rankings onPlayerSelect={handlePlayerSelect} />}
          {currentTab === "strategy" && <Strategy />}
          {currentTab === "profile" && (
            <PlayerProfile playerName="Coxazzz" onBack={() => handleTabChange("rankings")} onPlayerSelect={handlePlayerSelect} />
          )}
        </>
      )}

      <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
    </div>
  );
}
