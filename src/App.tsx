/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripPlannerForm } from './components/TripPlannerForm';
import { DestinationExplorer } from './components/DestinationExplorer';
import { HowItWorks } from './components/HowItWorks';
import { ItineraryPreviewSection } from './components/ItineraryPreviewSection';
import { ReviewsAndFAQ } from './components/ReviewsAndFAQ';
import { Footer } from './components/Footer';
import { N8nSettingsModal } from './components/N8nSettingsModal';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { TripFormData, DestinationCardData, BudgetTier } from './types/travel';

const DEFAULT_N8N_URL = 'https://lalitha-22.app.n8n.cloud/form/d5cd234c-64d2-42e0-abe6-b11dd1d15aa8';

export default function App() {
  const [customWebhookUrl, setCustomWebhookUrl] = useState<string>(DEFAULT_N8N_URL);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<TripFormData | null>(null);

  const [plannerInitialData, setPlannerInitialData] = useState<Partial<TripFormData>>({
    travellingFrom: 'San Francisco (SFO)',
    destination: 'Tokyo & Kyoto, Japan',
    numberOfDays: 7,
    travelers: 2,
    budget: 'Mid-range',
  });

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickStart = (origin: string, dest: string, date: string) => {
    setPlannerInitialData((prev) => ({
      ...prev,
      travellingFrom: origin,
      destination: dest,
      startDate: date,
    }));
    scrollToPlanner();
  };

  const handleSelectDestination = (dest: DestinationCardData) => {
    setPlannerInitialData((prev) => ({
      ...prev,
      destination: `${dest.name}, ${dest.country}`,
      numberOfDays: dest.defaultDays,
      budget: dest.defaultBudget,
    }));
    scrollToPlanner();
  };

  const handleSelectForPlanner = (dest: string, budget: BudgetTier) => {
    setPlannerInitialData((prev) => ({
      ...prev,
      destination: dest,
      budget: budget,
    }));
    scrollToPlanner();
  };

  const handleFormSuccess = (data: TripFormData) => {
    setSubmittedData(data);
    setIsSuccessOpen(true);
  };

  const handlePlanAnother = () => {
    setIsSuccessOpen(false);
    scrollToPlanner();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPlanTripClick={scrollToPlanner}
        customWebhookUrl={customWebhookUrl}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero with interactive quick search */}
        <Hero
          onQuickStart={handleQuickStart}
          onExploreDestinations={() => {
            const el = document.getElementById('destinations');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* The Core Trip Planner Form (Mapped to n8n field-0 ... field-7) */}
        <TripPlannerForm
          initialData={plannerInitialData}
          customWebhookUrl={customWebhookUrl}
          onSuccess={handleFormSuccess}
        />

        {/* Curated Global Destinations Grid */}
        <DestinationExplorer onSelectDestination={handleSelectDestination} />

        {/* How the n8n Agent Works Workflow */}
        <HowItWorks onStartPlanning={scrollToPlanner} />

        {/* Interactive Itinerary Output Simulator */}
        <ItineraryPreviewSection onSelectForPlanner={handleSelectForPlanner} />

        {/* Explorer Testimonials and FAQs */}
        <ReviewsAndFAQ />
      </main>

      {/* Footer with n8n links */}
      <Footer
        onOpenSettings={() => setIsSettingsOpen(true)}
        customWebhookUrl={customWebhookUrl}
      />

      {/* n8n Configuration & Transparency Modal */}
      <N8nSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customWebhookUrl={customWebhookUrl}
        onSaveWebhookUrl={setCustomWebhookUrl}
        defaultUrl={DEFAULT_N8N_URL}
      />

      {/* Submission Success & Itinerary Delivery Modal */}
      <SubmissionSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        data={submittedData}
        onPlanAnother={handlePlanAnother}
      />
    </div>
  );
}
