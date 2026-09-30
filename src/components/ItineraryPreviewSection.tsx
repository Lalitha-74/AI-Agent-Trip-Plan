import React, { useState } from 'react';
import {
  Sparkles,
  Plane,
  Building,
  Utensils,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { BudgetTier } from '../types/travel';
import { generateSmartItinerary } from '../utils/itineraryGenerator';

interface ItineraryPreviewSectionProps {
  onSelectForPlanner: (dest: string, budget: BudgetTier) => void;
}

export const ItineraryPreviewSection: React.FC<ItineraryPreviewSectionProps> = ({
  onSelectForPlanner,
}) => {
  const [selectedDestination, setSelectedDestination] = useState('Tokyo & Kyoto, Japan');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('Mid-range');
  const [activeTab, setActiveTab] = useState<'schedule' | 'flights' | 'hotels' | 'dining'>('schedule');

  const sampleDestinations = [
    { name: 'Tokyo & Kyoto, Japan', origin: 'San Francisco (SFO)' },
    { name: 'Amalfi Coast & Rome, Italy', origin: 'New York (JFK)' },
    { name: 'Bali & Ubud, Indonesia', origin: 'Singapore (SIN)' },
    { name: 'Reykjavik & South Coast, Iceland', origin: 'London (LHR)' },
  ];

  const currentOrigin =
    sampleDestinations.find((d) => d.name === selectedDestination)?.origin || 'New York (JFK)';

  const itinerary = generateSmartItinerary(
    selectedDestination,
    currentOrigin,
    '2026-11-05',
    7,
    2,
    selectedBudget
  );

  return (
    <section id="live-preview" className="py-20 relative bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Output Simulator</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            See What Your AI Travel Agent Delivers
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Explore a simulated sample of the comprehensive dossier compiled for your specific destination and budget class.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
          {/* Destination Selector */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium mr-1">Destination:</span>
            {sampleDestinations.map((d) => (
              <button
                key={d.name}
                onClick={() => setSelectedDestination(d.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedDestination === d.name
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {d.name.split('&')[0].trim()}
              </button>
            ))}
          </div>

          {/* Budget Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full md:w-auto justify-end">
            {(['Budget', 'Mid-range', 'Luxury'] as BudgetTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedBudget(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedBudget === tier
                    ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Viewer Container */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/50">
          {/* Top Bar with Category Tabs */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  {selectedDestination} (7-Day Plan)
                </h3>
                <span className="text-[11px] text-slate-400">
                  Departure from {currentOrigin} · Tier: <strong className="text-amber-400">{selectedBudget}</strong>
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'schedule' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily Itinerary
              </button>
              <button
                onClick={() => setActiveTab('flights')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'flights' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Flight Intel
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'hotels' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stays & Hotels
              </button>
              <button
                onClick={() => setActiveTab('dining')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dining' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Foodie Guide
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-6">
            {activeTab === 'schedule' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itinerary.schedule.slice(0, 4).map((day) => (
                  <div key={day.day} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                      <span className="font-display font-bold text-amber-400 text-sm">
                        Day {day.day}: {day.title.split('(')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        Optimized Route
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Morning:</span>
                        <p className="text-slate-300 mt-0.5">{day.morning}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Afternoon:</span>
                        <p className="text-slate-300 mt-0.5">{day.afternoon}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Evening:</span>
                        <p className="text-slate-300 mt-0.5">{day.evening}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Culinary Highlight:</span>
                      <span className="text-amber-300 font-semibold">{day.foodHighlight}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'flights' && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {currentOrigin} ➔ {selectedDestination}
                      </h4>
                      <p className="text-xs text-slate-400">Live multi-carrier routing comparison</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Estimated Average Fare</span>
                    <p className="text-2xl font-bold font-mono text-amber-400">
                      ~${itinerary.flightInfo.estimatedFarePerPerson} USD
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-semibold">Recommended Airlines:</span>
                    <p className="text-white font-medium">{itinerary.flightInfo.recommendedAirlines.join(', ')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-semibold">Flight Time Approx:</span>
                    <p className="text-white font-medium">{itinerary.flightInfo.avgFlightDuration}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-semibold">Booking Window Strategy:</span>
                    <p className="text-white font-medium">{itinerary.flightInfo.bestBookingWindow}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {itinerary.accommodation.categoryName}
                      </h4>
                      <p className="text-xs text-slate-400">Selected for optimal safety, transit, and aesthetics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Target Nightly Rate</span>
                    <p className="text-2xl font-bold font-mono text-amber-400">
                      ~${itinerary.accommodation.avgNightlyRate}/night
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Curated Properties for {selectedDestination}:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {itinerary.accommodation.topPicks.map((pick, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                          Featured Stay 0{i + 1}
                        </span>
                        <h5 className="font-bold text-white text-sm">{pick}</h5>
                        <p className="text-xs text-slate-400">Verified guest reviews & prime district accessibility.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dining' && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Local Culinary Strategy</h4>
                      <p className="text-xs text-slate-400">{itinerary.dining.style}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Food Budget Guidance</span>
                    <p className="text-2xl font-bold font-mono text-amber-400">
                      ~${itinerary.dining.avgDailyFoodCost}/day/guest
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Signature Regional Delicacies to Savor:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {itinerary.dining.mustTryDishes.map((dish, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-xs font-medium text-slate-200">{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Callout */}
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Want this custom itinerary tailored to your exact dates and party?
            </span>
            <button
              onClick={() => onSelectForPlanner(selectedDestination, selectedBudget)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <span>Load Into Travel Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
