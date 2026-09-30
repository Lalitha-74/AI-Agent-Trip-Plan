import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Code2, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface N8nSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customWebhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
  defaultUrl: string;
}

export const N8nSettingsModal: React.FC<N8nSettingsModalProps> = ({
  isOpen,
  onClose,
  customWebhookUrl,
  onSaveWebhookUrl,
  defaultUrl,
}) => {
  const [urlInput, setUrlInput] = useState(customWebhookUrl);
  const [pingStatus, setPingStatus] = useState<{
    tested: boolean;
    loading: boolean;
    ok: boolean;
    message: string;
  }>({
    tested: false,
    loading: false,
    ok: false,
    message: '',
  });

  if (!isOpen) return null;

  const handlePing = async () => {
    setPingStatus({ tested: true, loading: true, ok: false, message: 'Pinging n8n endpoint...' });
    try {
      const res = await fetch(`/api/n8n/status?url=${encodeURIComponent(urlInput.trim())}`);
      const data = await res.json();
      if (data.ok || data.status === 200 || data.status === 302) {
        setPingStatus({
          tested: true,
          loading: false,
          ok: true,
          message: `Connected successfully (HTTP ${data.status || 200})`,
        });
      } else {
        setPingStatus({
          tested: true,
          loading: false,
          ok: false,
          message: data.error || `HTTP ${data.status} returned by n8n`,
        });
      }
    } catch (e: any) {
      setPingStatus({
        tested: true,
        loading: false,
        ok: false,
        message: e.message || 'Network error reaching n8n proxy',
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWebhookUrl(urlInput.trim() || defaultUrl);
    onClose();
  };

  const handleReset = () => {
    setUrlInput(defaultUrl);
    onSaveWebhookUrl(defaultUrl);
  };

  const fieldMappings = [
    { key: 'field-0', label: 'Name', type: 'text', description: 'User full name' },
    { key: 'field-1', label: 'Email', type: 'email', description: 'Destination for generated itinerary' },
    { key: 'field-2', label: 'Travelling From', type: 'text', description: 'Departure city or airport code' },
    { key: 'field-3', label: 'Destination', type: 'text', description: 'Target destination(s)' },
    { key: 'field-4', label: 'Start Date', type: 'date', description: 'YYYY-MM-DD departure date' },
    { key: 'field-5', label: 'Number of Days', type: 'number', description: 'Trip length in days' },
    { key: 'field-6', label: 'Number of Travelers', type: 'number', description: 'Total party count' },
    { key: 'field-7', label: 'Budget', type: 'select', description: 'Budget | Mid-range | Luxury' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">n8n Workflow Integration</h3>
              <p className="text-xs text-slate-400">Live AI Travel Agent endpoint & payload configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Active Endpoint Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Connected n8n Form Endpoint
              </label>
              <a
                href={urlInput}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Open direct form</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={handlePing}
                disabled={pingStatus.loading}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${pingStatus.loading ? 'animate-spin' : ''}`} />
                <span>Test Ping</span>
              </button>
            </div>

            {/* Ping Feedback */}
            {pingStatus.tested && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  pingStatus.ok
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                }`}
              >
                {pingStatus.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{pingStatus.message}</span>
              </div>
            )}
          </div>

          {/* Form Schema Mapping */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Form Schema Mapping (1:1 with n8n workflow)</span>
            </div>
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2 px-3 font-medium">Field ID</th>
                      <th className="py-2 px-3 font-medium">Input Label</th>
                      <th className="py-2 px-3 font-medium">Type</th>
                      <th className="py-2 px-3 font-medium">Expected Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {fieldMappings.map((f) => (
                      <tr key={f.key} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 text-amber-400 font-semibold">{f.key}</td>
                        <td className="py-2 px-3 text-slate-200 font-sans">{f.label}</td>
                        <td className="py-2 px-3 text-slate-400">{f.type}</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Backend Proxy & CORS Security info */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-slate-300">
              <p className="font-semibold text-white">Full-Stack CORS & Execution Proxy</p>
              <p className="text-slate-400 leading-relaxed">
                Browser cross-origin (CORS) limits on n8n Cloud are automatically managed via our Node.js server route (<code className="text-amber-300">/api/submit-trip</code>). Submissions dispatch both multipart form data and JSON aliases.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset to Default URL
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-md shadow-amber-500/20"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
