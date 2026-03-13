import { Map, ShieldAlert, Swords } from "lucide-react";

export function Strategy() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-4 pb-8 space-y-8">
      <section className="space-y-2">
        <span className="text-xs font-bold tracking-[1.5px] text-primary uppercase">War Room</span>
        <h2 className="text-4xl font-extrabold text-on-surface">Strategy Map</h2>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-xl bento-shadow border-t-4 border-secondary">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-headline text-xl font-bold">Defense Priority</h3>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Hold the choke points at Sector B. We expect heavy resistance from rival alliances during the 18:00 UTC timer.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl bento-shadow border-t-4 border-primary">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Swords className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-headline text-xl font-bold">Attack Targets</h3>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Push into the northern territories. Gathering teams should focus on T8 nodes while the ZvZ zerg distracts the main enemy force.
          </p>
        </div>
        
        <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl bento-shadow flex flex-col items-center justify-center min-h-[300px] text-center border-2 border-dashed border-outline-variant/30">
          <Map className="w-16 h-16 text-outline-variant mb-4 opacity-50" />
          <h3 className="font-headline text-xl font-bold text-on-surface-variant">Interactive Map Coming Soon</h3>
          <p className="text-sm text-outline mt-2 max-w-md">
            We are integrating live territory data. Soon you will be able to see real-time guild movements and objective timers here.
          </p>
        </div>
      </div>
    </main>
  );
}
