import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import { DestinationCardData, BudgetTier } from '../types/travel';

interface DestinationExplorerProps {
  onSelectDestination: (dest: DestinationCardData) => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onSelectDestination,
}) => {
  const [activeRegion, setActiveRegion] = useState<'All' | 'Asia' | 'Europe' | 'Americas' | 'Tropical'>('All');

  const filteredDestinations =
    activeRegion === 'All'
      ? POPULAR_DESTINATIONS
      : POPULAR_DESTINATIONS.filter((d) => d.region === activeRegion);

  return (
    <section id="destinations" className="py-20 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Global Destinations</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Explore Trending Voyages
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
              Tap any destination to instantly pre-fill your trip itinerary parameters into the AI agent workflow.
            </p>
          </div>

          {/* Region Tabs (Interactive controls) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            {(['All', 'Europe', 'Asia', 'Americas', 'Tropical'] as const).map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeRegion === region
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/40 flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top tags */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10">
                      {dest.country}
                    </span>
                    <span className="font-mono text-amber-300 text-[11px] px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dest.flightHoursApprox}
                    </span>
                  </div>

                  {/* Bottom title on image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-md">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Agent Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.popularHighlights.map((hl, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Estimated cost preview */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Est. daily cost:</span>
                    <span className="font-mono text-amber-400 font-semibold">
                      ${dest.estimatedDailyPerPerson['Mid-range']}/day (Mid-range)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectDestination(dest)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer group/btn border border-slate-700 hover:border-amber-400 shadow-sm"
                >
                  <span>Plan Trip to {dest.name.split('&')[0].trim()}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
