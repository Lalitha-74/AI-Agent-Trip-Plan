import React, { useState } from 'react';
import { Plane, Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck, Compass, HeartHandshake } from 'lucide-react';
import { POPULAR_ORIGINS } from '../data/destinations';

interface HeroProps {
  onQuickStart: (origin: string, dest: string, date: string) => void;
  onExploreDestinations: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickStart, onExploreDestinations }) => {
  const [origin, setOrigin] = useState('San Francisco (SFO)');
  const [destination, setDestination] = useState('Tokyo & Kyoto, Japan');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickStart(origin, destination, date);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Powered by n8n Autonomous Travel Automation</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1]">
            Your Personal AI Travel Agent. <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Live Flights, Stays & Secret Spots.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Enter your trip details. Our multi-agent n8n workflow searches live airfare, hand-picked boutique hotels, and authentic gastronomy—generating a bespoke day-by-day itinerary delivered directly to your inbox.
          </p>

          {/* Interactive Quick Launch Bar */}
          <div className="pt-4">
            <form
              onSubmit={handleHeroSubmit}
              className="bg-slate-900/90 border border-slate-700/80 p-2 sm:p-2.5 rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-xl max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-left"
            >
              {/* Origin */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Travelling From</span>
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. New York (JFK)"
                  className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none mt-1"
                  required
                />
              </div>

              {/* Destination */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Destination</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Amalfi Coast, Italy"
                  className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none mt-1"
                  required
                />
              </div>

              {/* Departure Date */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Departure Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none mt-1 [color-scheme:dark]"
                  required
                />
              </div>

              {/* Launch CTA */}
              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[52px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm rounded-xl px-5 py-3 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Plane className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>Curate My Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Origin Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">Popular origins:</span>
            {POPULAR_ORIGINS.slice(0, 5).map((pop) => (
              <button
                key={pop}
                type="button"
                onClick={() => setOrigin(pop)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:text-slate-200 transition-colors cursor-pointer text-[11px]"
              >
                {pop.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5 justify-center sm:justify-start text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Plane className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Live Airline Scraping</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Zero Commission Fees</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Local Hidden Gems</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Exact Budget Matching</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
