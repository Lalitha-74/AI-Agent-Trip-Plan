import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Mail,
  Plane,
  Building,
  Utensils,
  Calendar,
  Sparkles,
  Download,
  Share2,
  ExternalLink,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { TripFormData, GeneratedItinerary } from '../types/travel';
import { generateSmartItinerary } from '../utils/itineraryGenerator';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TripFormData | null;
  onPlanAnother: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  data,
  onPlanAnother,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'flights' | 'hotels' | 'dining'>('schedule');

  if (!isOpen || !data) return null;

  const itinerary: GeneratedItinerary = generateSmartItinerary(
    data.destination,
    data.travellingFrom,
    data.startDate,
    data.numberOfDays,
    data.travelers,
    data.budget
  );

  const handleDownload = () => {
    const textContent = `
========================================
VOYAGE AI TRAVEL AGENT - TRIP BRIEF
========================================
Guest Name: ${data.name}
Email Target: ${data.email}
Route: ${data.travellingFrom} -> ${data.destination}
Start Date: ${data.startDate}
Duration: ${data.numberOfDays} Days
Party Size: ${data.travelers} Travelers
Budget Tier: ${data.budget}

FLIGHT RECOMMENDATIONS:
- Recommended Airlines: ${itinerary.flightInfo.recommendedAirlines.join(', ')}
- Est. Flight Duration: ${itinerary.flightInfo.avgFlightDuration}
- Booking Advice: ${itinerary.flightInfo.bestBookingWindow}

CURATED STAYS:
- Style: ${itinerary.accommodation.categoryName}
- Featured Picks: ${itinerary.accommodation.topPicks.join(', ')}

GASTRONOMY HIGHLIGHTS:
- Dining Style: ${itinerary.dining.style}
- Must-Try Dishes: ${itinerary.dining.mustTryDishes.join(', ')}

DAILY SCHEDULE:
${itinerary.schedule
  .map(
    (s) => `
[Day ${s.day}]: ${s.title}
Morning: ${s.morning}
Afternoon: ${s.afternoon}
Evening: ${s.evening}
Food Highlight: ${s.foodHighlight}
`
  )
  .join('\n')}

========================================
Sent via n8n Travel Automation Workflow
========================================
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VoyageAI-${data.destination.replace(/[^a-zA-Z0-9]/g, '_')}-Plan.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-white">Trip Inquiry Dispatched!</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  n8n Workflow Running
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Your voyage inquiry has been submitted to the AI Travel Agent. A complete travel brief with live flight tickets, boutique hotel reservations, and custom maps will arrive at <span className="text-amber-400 font-semibold">{data.email}</span>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Quick Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">Destination</span>
              <span className="font-bold text-white text-sm">{data.destination}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Departure</span>
              <span className="font-bold text-white text-sm">{data.startDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Length & Guests</span>
              <span className="font-bold text-white text-sm">
                {data.numberOfDays} Days · {data.travelers} {data.travelers === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Budget Tier</span>
              <span className="font-bold text-amber-400 text-sm">{data.budget}</span>
            </div>
          </div>

          {/* Workflow Pipeline Tracker */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Autonomous Agent Processing Pipeline
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. Webhook Triggered</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2. Live Flights Queried</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                <span>3. Stays & Food Match</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>4. Inbox Dispatch</span>
              </div>
            </div>
          </div>

          {/* Live Preview Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-white">Instant Itinerary Simulation</h4>
                <p className="text-xs text-slate-400">Generated preview tailored to your {data.budget} preference</p>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'schedule' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Daily Plan
                </button>
                <button
                  onClick={() => setActiveTab('flights')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'flights' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Flights
                </button>
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'hotels' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Stays
                </button>
                <button
                  onClick={() => setActiveTab('dining')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'dining' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Gastronomy
                </button>
              </div>
            </div>

            {/* Tab: Daily Schedule */}
            {activeTab === 'schedule' && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {itinerary.schedule.map((day) => (
                  <div key={day.day} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-amber-400 text-sm">
                        Day {day.day} — {day.title}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Full day
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-amber-300 font-semibold block text-[10px] uppercase">Morning</span>
                        <p className="text-slate-300 mt-0.5">{day.morning}</p>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-amber-300 font-semibold block text-[10px] uppercase">Afternoon</span>
                        <p className="text-slate-300 mt-0.5">{day.afternoon}</p>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-amber-300 font-semibold block text-[10px] uppercase">Evening & Dining</span>
                        <p className="text-slate-300 mt-0.5">{day.evening}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Flights */}
            {activeTab === 'flights' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white text-base">
                      {data.travellingFrom} ➔ {data.destination}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Est. {itinerary.flightInfo.avgFlightDuration}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Top Recommended Carriers:</span>
                    <p className="font-semibold text-white">
                      {itinerary.flightInfo.recommendedAirlines.join(' · ')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Est. Airfare per Guest:</span>
                    <p className="font-semibold text-amber-400 font-mono text-sm">
                      ~${itinerary.flightInfo.estimatedFarePerPerson.toLocaleString()} USD
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-slate-300">Booking Insight:</strong> {itinerary.flightInfo.bestBookingWindow}
                </p>
              </div>
            )}

            {/* Tab: Hotels */}
            {activeTab === 'hotels' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white text-base">
                      {itinerary.accommodation.categoryName}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                    ~${itinerary.accommodation.avgNightlyRate}/night
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-400">Hand-Picked Properties for this Tier:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {itinerary.accommodation.topPicks.map((pick, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-amber-400 font-semibold block">Pick 0{i + 1}</span>
                        <p className="font-medium text-white mt-1">{pick}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Dining */}
            {activeTab === 'dining' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white text-base">Curated Gastronomy</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    ~${itinerary.dining.avgDailyFoodCost}/day/guest
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-400">Must-Taste Regional Dishes:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {itinerary.dining.mustTryDishes.map((dish, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-slate-200 font-medium">{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Trip Summary (.txt)</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onPlanAnother();
              }}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Plan Another Trip
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
            >
              Done & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
