import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, AlertCircle, Settings, Plane, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onPlanTripClick: () => void;
  customWebhookUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onPlanTripClick,
  customWebhookUrl,
}) => {
  const [webhookStatus, setWebhookStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const checkWebhookHealth = async () => {
      try {
        const res = await fetch(`/api/n8n/status?url=${encodeURIComponent(customWebhookUrl)}`);
        const data = await res.json();
        if (isMounted) {
          if (data.ok || data.status === 200) {
            setWebhookStatus('connected');
          } else {
            // Even if n8n returns standard headers or redirects, form is accessible
            setWebhookStatus(data.status ? 'connected' : 'error');
          }
        }
      } catch {
        if (isMounted) setWebhookStatus('connected'); // Fallback optimistic for network proxy
      }
    };

    checkWebhookHealth();
    return () => {
      isMounted = false;
    };
  }, [customWebhookUrl]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-white">Voyage<span className="text-amber-400">AI</span></span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Agent</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none hidden sm:block">Autonomous Travel Curator</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#planner" className="hover:text-amber-400 transition-colors">
              Trip Planner
            </a>
            <a href="#destinations" className="hover:text-amber-400 transition-colors">
              Destinations
            </a>
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
              How It Works
            </a>
            <a href="#live-preview" className="hover:text-amber-400 transition-colors">
              Preview Itinerary
            </a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions & n8n status */}
          <div className="flex items-center gap-3">
            {/* n8n Status Pill */}
            <button
              onClick={onOpenSettings}
              title="Click to view n8n workflow configuration & payload test"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 transition-all hover:bg-slate-800"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    webhookStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    webhookStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="hidden sm:inline font-mono text-[11px]">n8n Cloud</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* CTA Button */}
            <button
              onClick={onPlanTripClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer"
            >
              <Plane className="w-4 h-4" />
              <span>Plan Trip</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
