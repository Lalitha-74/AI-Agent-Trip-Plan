import React, { useState } from 'react';
import {
  Send,
  Calendar,
  Users,
  Clock,
  DollarSign,
  MapPin,
  Compass,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plane,
  Building,
  Utensils,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { TripFormData, BudgetTier } from '../types/travel';
import { POPULAR_ORIGINS } from '../data/destinations';

interface TripPlannerFormProps {
  initialData: Partial<TripFormData>;
  customWebhookUrl: string;
  onSuccess: (data: TripFormData) => void;
}

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  initialData,
  customWebhookUrl,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<TripFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    travellingFrom: initialData.travellingFrom || 'San Francisco, CA',
    destination: initialData.destination || 'Tokyo & Kyoto, Japan',
    startDate:
      initialData.startDate ||
      (() => {
        const d = new Date();
        d.setDate(d.getDate() + 21);
        return d.toISOString().split('T')[0];
      })(),
    numberOfDays: initialData.numberOfDays || 7,
    travelers: initialData.travelers || 2,
    budget: initialData.budget || 'Mid-range',
    specialNotes: initialData.specialNotes || '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Sync when initialData changes from external clicks (e.g. Hero or Destination cards)
  React.useEffect(() => {
    if (initialData.destination) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // Dynamic budget calculations
  const calculateEstimates = () => {
    const flightBase = formData.budget === 'Budget' ? 450 : formData.budget === 'Mid-range' ? 780 : 1650;
    const hotelNightly = formData.budget === 'Budget' ? 70 : formData.budget === 'Mid-range' ? 190 : 490;
    const foodDaily = formData.budget === 'Budget' ? 35 : formData.budget === 'Mid-range' ? 80 : 190;

    const totalFlight = flightBase * formData.travelers;
    // Assuming 2 travelers share 1 room, 3-4 share 2 rooms, etc.
    const roomsCount = Math.max(1, Math.ceil(formData.travelers / 2));
    const totalHotel = hotelNightly * (formData.numberOfDays - 1) * roomsCount;
    const totalFoodAndFun = foodDaily * formData.numberOfDays * formData.travelers;

    return {
      flightPerPerson: flightBase,
      totalFlight,
      hotelNightly,
      totalHotel,
      foodDaily,
      totalFoodAndFun,
      grandTotal: totalFlight + totalHotel + totalFoodAndFun,
    };
  };

  const estimates = calculateEstimates();

  const handleDateShortcut = (weeksAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + weeksAhead * 7);
    setFormData((prev) => ({ ...prev, startDate: d.toISOString().split('T')[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address so we can deliver your itinerary.');
      return;
    }
    if (!formData.travellingFrom.trim()) {
      setError('Please specify where you are travelling from.');
      return;
    }
    if (!formData.destination.trim()) {
      setError('Please enter your destination.');
      return;
    }
    if (!formData.startDate) {
      setError('Please choose a departure start date.');
      return;
    }

    setLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < 3 ? s + 1 : s));
    }, 700);

    try {
      // 1. Post to Express backend proxy (/api/submit-trip)
      const res = await fetch('/api/submit-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customWebhookUrl,
        }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (res.ok && data.success) {
        setLoadingStep(4);
        setTimeout(() => {
          setLoading(false);
          onSuccess(formData);
        }, 600);
      } else {
        // Fallback: If backend had an issue, attempt direct browser post with FormData
        console.warn('Backend proxy reported error, attempting direct n8n form submission fallback');
        const fbData = new FormData();
        fbData.append('field-0', formData.name);
        fbData.append('field-1', formData.email);
        fbData.append('field-2', formData.travellingFrom);
        fbData.append('field-3', formData.destination);
        fbData.append('field-4', formData.startDate);
        fbData.append('field-5', String(formData.numberOfDays));
        fbData.append('field-6', String(formData.travelers));
        fbData.append('field-7', formData.budget);

        try {
          await fetch(customWebhookUrl, {
            method: 'POST',
            body: fbData,
            mode: 'no-cors',
          });
          setLoadingStep(4);
          setTimeout(() => {
            setLoading(false);
            onSuccess(formData);
          }, 600);
        } catch {
          setLoading(false);
          setError(data.error || 'Unable to connect to the n8n workflow. Please check your connection.');
        }
      }
    } catch {
      clearInterval(stepInterval);
      // Direct client fallback
      try {
        const fbData = new FormData();
        fbData.append('field-0', formData.name);
        fbData.append('field-1', formData.email);
        fbData.append('field-2', formData.travellingFrom);
        fbData.append('field-3', formData.destination);
        fbData.append('field-4', formData.startDate);
        fbData.append('field-5', String(formData.numberOfDays));
        fbData.append('field-6', String(formData.travelers));
        fbData.append('field-7', formData.budget);

        await fetch(customWebhookUrl, {
          method: 'POST',
          body: fbData,
          mode: 'no-cors',
        });
        setLoading(false);
        onSuccess(formData);
      } catch (clientErr: any) {
        setLoading(false);
        setError('Submission failed. Please check your network connection and try again.');
      }
    }
  };

  const budgetOptions: {
    tier: BudgetTier;
    label: string;
    description: string;
    hotelStars: string;
    dining: string;
  }[] = [
    {
      tier: 'Budget',
      label: 'Budget Explorer',
      description: 'Authentic local stays, night markets & smart savings',
      hotelStars: '3-Star / Boutique Hostels',
      dining: 'Local street food & taverns',
    },
    {
      tier: 'Mid-range',
      label: 'Curated Comfort',
      description: '4-star design hotels, rooftop bistros & seamless rides',
      hotelStars: '4-Star Curated Design',
      dining: 'Top-rated bistros & cafes',
    },
    {
      tier: 'Luxury',
      label: 'Ultra Luxury',
      description: '5-star resorts, Michelin fine dining & private transfers',
      hotelStars: '5-Star Luxury & Villas',
      dining: 'Michelin & private chef',
    },
  ];

  return (
    <section id="planner" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Trip Curator</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Curate Your Dream Journey
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Every submission triggers our live n8n autonomous workflow to analyze real-time flights, verified boutique stays, and Michelin/local culinary guides.
          </p>
        </div>

        {/* Form Container with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/40">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Traveler Contact info (field-0 Name & field-1 Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* field-0: Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Full Name <span className="text-amber-400">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="field-0"
                    id="field-0"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-500">n8n payload: <span className="font-mono text-amber-400/80">field-0</span></p>
                </div>

                {/* field-1: Email */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Address <span className="text-amber-400">*</span></span>
                  </label>
                  <input
                    type="email"
                    name="field-1"
                    id="field-1"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@example.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-500">Where the AI itinerary will be sent</p>
                </div>
              </div>

              {/* Row 2: Route (field-2 Travelling From & field-3 Destination) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* field-2: Travelling From */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-amber-400" />
                    <span>Travelling From (Origin) <span className="text-amber-400">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="field-2"
                    id="field-2"
                    value={formData.travellingFrom}
                    onChange={(e) => setFormData({ ...formData, travellingFrom: e.target.value })}
                    placeholder="e.g. San Francisco (SFO)"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {/* Origin quick picks */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['SFO', 'JFK', 'LHR', 'DXB', 'SIN'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setFormData({ ...formData, travellingFrom: code })}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        +{code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* field-3: Destination */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Destination <span className="text-amber-400">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="field-3"
                    id="field-3"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Tokyo & Kyoto, Japan"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {/* Destination quick suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Tokyo', 'Amalfi', 'Bali', 'Iceland', 'Swiss Alps'].map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => setFormData({ ...formData, destination: dest })}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Dates & Duration & Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* field-4: Start Date */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Start Date <span className="text-amber-400">*</span></span>
                  </label>
                  <input
                    type="date"
                    name="field-4"
                    id="field-4"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors [color-scheme:dark]"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDateShortcut(2)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      +2 Wks
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDateShortcut(4)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      +1 Mo
                    </button>
                  </div>
                </div>

                {/* field-5: Number of Days */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Duration: {formData.numberOfDays} Days <span className="text-amber-400">*</span></span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="field-5"
                      id="field-5"
                      min={1}
                      max={60}
                      value={formData.numberOfDays}
                      onChange={(e) =>
                        setFormData({ ...formData, numberOfDays: Math.max(1, Number(e.target.value)) })
                      }
                      className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-center text-white focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="range"
                      min={2}
                      max={28}
                      value={formData.numberOfDays}
                      onChange={(e) => setFormData({ ...formData, numberOfDays: Number(e.target.value) })}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Ideal recommendation: 6 - 12 days</p>
                </div>

                {/* field-6: Number of Travelers */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Travelers: {formData.travelers} <span className="text-amber-400">*</span></span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelers: num })}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          formData.travelers === num
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {num === 1 ? '1 Solo' : num === 2 ? '2 Duo' : `${num} Pax`}
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name="field-6"
                    id="field-6"
                    value={formData.travelers}
                  />
                  <p className="text-[11px] text-slate-500">Single or group travel pacing</p>
                </div>
              </div>

              {/* Row 4: field-7 Budget Class */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Budget Class <span className="text-amber-400">*</span></span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {budgetOptions.map((opt) => {
                    const isSelected = formData.budget === opt.tier;
                    return (
                      <div
                        key={opt.tier}
                        onClick={() => setFormData({ ...formData, budget: opt.tier })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                            {opt.tier}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-2 leading-snug">{opt.description}</p>
                        <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{opt.hotelStars}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{opt.dining}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  name="field-7"
                  id="field-7"
                  value={formData.budget}
                />
              </div>

              {/* Submit CTA & Multi-step loading state */}
              <div className="pt-4 border-t border-slate-800">
                {loading ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-semibold text-white">
                        {loadingStep === 1 && 'Connecting to n8n Cloud Workflow...'}
                        {loadingStep === 2 && 'Scanning live flight APIs and airline routes...'}
                        {loadingStep === 3 && 'Curating boutique accommodations & Michelin guides...'}
                        {loadingStep === 4 && 'Trip brief ready! Finalizing delivery...'}
                      </span>
                    </div>
                    {/* Step progress bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-500"
                        style={{ width: `${(loadingStep / 4) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Target: {customWebhookUrl.split('/form/')[0]} (Workflow ID: d5cd234c...)
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-3 cursor-pointer group text-base"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>Submit Trip Inquiry to AI Travel Agent</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No credit card required. Autonomous itinerary generated and sent to your email.</span>
                </p>
              </div>
            </form>
          </div>

          {/* Sidebar: Real-time Live Voyage Breakdown (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl shadow-black/40 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    Live Voyage Estimate
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {formData.budget}
                </span>
              </div>

              {/* Trip Summary Chip */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Route</span>
                  <span className="font-semibold text-white truncate max-w-[170px] text-right">
                    {formData.travellingFrom.split('(')[0]} → {formData.destination.split(',')[0]}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-semibold text-white">{formData.numberOfDays} Days ({formData.numberOfDays - 1} Nights)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Party Size</span>
                  <span className="font-semibold text-white">
                    {formData.travelers} {formData.travelers === 1 ? 'Traveler' : 'Travelers'}
                  </span>
                </div>
              </div>

              {/* Estimated Budget Items */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Plane className="w-3.5 h-3.5 text-amber-400" />
                    <span>Flights ({formData.travelers} pax)</span>
                  </div>
                  <span className="font-mono text-slate-200">
                    ~${estimates.totalFlight.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>Accommodations</span>
                  </div>
                  <span className="font-mono text-slate-200">
                    ~${estimates.totalHotel.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    <span>Food & Activities</span>
                  </div>
                  <span className="font-mono text-slate-200">
                    ~${estimates.totalFoodAndFun.toLocaleString()}
                  </span>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">Estimated Total</p>
                    <p className="text-[11px] text-slate-400">Excl. shopping & tips</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold font-mono text-amber-400">
                      ${estimates.grandTotal.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      ~${Math.round(estimates.grandTotal / formData.travelers).toLocaleString()} / person
                    </p>
                  </div>
                </div>
              </div>

              {/* What the Agent will Search */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                <p className="font-semibold text-slate-300">Workflow Inclusions:</p>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Live price matching from 100+ airlines</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Curated hotel list matched to {formData.budget}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Day-by-day sightseeing & gastronomy agenda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
