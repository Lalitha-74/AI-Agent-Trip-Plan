import React from 'react';
import { Send, Cpu, CalendarDays, MailCheck, Sparkles, Check, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartPlanning: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartPlanning }) => {
  const steps = [
    {
      num: '01',
      title: 'Submit Your Trip Brief',
      subtitle: 'Webhook Ingestion',
      description:
        'Tell us where you want to travel, your dates, traveler count, and budget preference (Budget, Mid-range, or Luxury). Your input triggers our n8n automation pipeline.',
      icon: Send,
      color: 'from-amber-500 to-amber-600',
    },
    {
      num: '02',
      title: 'Autonomous Multi-Agent Search',
      subtitle: 'Real-time Aggregation',
      description:
        'n8n agents concurrently query live flight schedules, scour boutique accommodation platforms, and cross-reference verified foodie databases & local hidden gems.',
      icon: Cpu,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      num: '03',
      title: 'Algorithmic Route Optimization',
      subtitle: 'Fatigue-Free Pacing',
      description:
        'Our algorithms arrange daily visits by geographic proximity, open hours, and seasonal lighting—ensuring you spend time experiencing instead of in traffic.',
      icon: CalendarDays,
      color: 'from-rose-500 to-rose-600',
    },
    {
      num: '04',
      title: 'Comprehensive Inbox Delivery',
      subtitle: 'Ready-to-Book Plan',
      description:
        'A polished, hyper-personalized travel portfolio with direct booking references, dining reservations, and interactive maps lands right in your inbox.',
      icon: MailCheck,
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workflow Automation</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            How The AI Travel Agent Works
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Behind every submission is a orchestrated n8n workflow designed to eliminate 20+ hours of tedious travel research.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-3xl font-extrabold text-slate-700 group-hover:text-amber-500/80 transition-colors">
                      {step.num}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-lg shadow-black/40`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                    {step.subtitle}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Autonomous & Instant</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Diagram Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h4 className="font-display font-bold text-xl text-white">Ready to experience AI travel curation?</h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Tell us your destination, departure hub, and budget. Our live n8n workflow will begin searching right away.
            </p>
          </div>
          <button
            onClick={onStartPlanning}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Plan My Next Voyage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
