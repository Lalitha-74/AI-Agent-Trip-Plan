import React from 'react';
import { Compass, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenSettings: () => void;
  customWebhookUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSettings, customWebhookUrl }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Voyage<span className="text-amber-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Autonomous AI Travel Agent searching live airfare, curated boutique hotels, and authentic dining recommendations. Powered by enterprise n8n automation workflows.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Booking Markups</span>
              </span>
              <span>·</span>
              <span>Direct Carrier Links</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-slate-200 text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#planner" className="hover:text-amber-400 transition-colors">
                  Trip Planner
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-amber-400 transition-colors">
                  Featured Destinations
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  How The Agent Works
                </a>
              </li>
              <li>
                <a href="#live-preview" className="hover:text-amber-400 transition-colors">
                  Sample Dossier Preview
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* n8n Integration info */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-slate-200 text-xs uppercase tracking-wider">
              n8n Cloud Workflow
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connected to active n8n instance. Submissions are processed via secure server proxy.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={onOpenSettings}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <span>View Webhook Specs & Payload</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <a
                href={customWebhookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-500 hover:text-slate-400 truncate max-w-xs font-mono"
              >
                {customWebhookUrl}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} VoyageAI · Autonomous Travel Agent Engine.</p>
          <div className="flex items-center gap-4">
            <span>Built for n8n Workflow Automation</span>
            <span>·</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
