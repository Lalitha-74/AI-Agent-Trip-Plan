import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ReviewsAndFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const reviews = [
    {
      name: 'Dr. Marcus Vance',
      role: 'Global Tech Lead',
      trip: 'Tokyo & Kyoto (8 Days, Luxury)',
      comment:
        'The n8n agent found a boutique Machiya townhouse in Kyoto that didn’t even appear on top search engines. The daily food recommendations were Michelin-quality without waiting in tourist traps.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Sofia Al-Mansoor',
      role: 'Architect & Designer',
      trip: 'Amalfi & Positano (7 Days, Mid-range)',
      comment:
        'I received the complete travel brief in my inbox within minutes of submitting the form. The route pacing between Capri, Amalfi, and Ravello saved us from hours of coastal gridlock.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Liam & Maya Thorne',
      role: 'Adventure Photographers',
      trip: 'Iceland South Coast (6 Days, Budget)',
      comment:
        'Travelling Iceland on a budget is notoriously tough. This agent laid out campervan routes, geothermal hot springs that were free or low-cost, and northern lights viewing coordinates that were spot on.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does the n8n AI Travel Agent work?',
      a: 'When you submit the form, your parameters (origin, destination, dates, guests, and budget tier) are sent directly to our n8n webhook workflow. The workflow triggers automated nodes that concurrently search live flight aggregators, boutique hotel registers, and local gastronomy databases to synthesize a custom day-by-day dossier.',
    },
    {
      q: 'How quickly will I receive my itinerary?',
      a: 'The initial automated scan and itinerary dossier are synthesized immediately upon submission. You will see an instant simulation right on this website, and the complete itinerary portfolio with direct booking references arrives at your email inbox within a few minutes.',
    },
    {
      q: 'Is there any fee or booking commission?',
      a: 'No. VoyageAI is an autonomous discovery and curation service. All flight and hotel links provided in your itinerary dossier link directly to the official airlines, hotels, or booking partners at direct-to-consumer prices without hidden markups.',
    },
    {
      q: 'What if I need to modify my dates or destination?',
      a: 'Simply submit a new inquiry with your updated dates or preferences anytime! You can also click the settings gear icon in the header to inspect the connected n8n Cloud webhook or test the workflow endpoint.',
    },
    {
      q: 'Can I use this for multi-city journeys?',
      a: 'Yes! Simply enter multiple cities in the destination field (e.g., "Tokyo, Kyoto & Osaka" or "Rome, Florence & Venice"). The n8n agent will allocate your days intelligently across your selected hubs with high-speed rail recommendations.',
    },
  ];

  return (
    <section id="faq" className="py-20 relative bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Explorer Feedback</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Curated Experiences Worldwide
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Here is what travelers have to say about the autonomous itineraries produced by our AI Travel Agent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs">{rev.name}</h4>
                    <p className="text-[11px] text-amber-400/90">{rev.trip}</p>
                    <p className="text-[10px] text-slate-500">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-white text-sm sm:text-base">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
