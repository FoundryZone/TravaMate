'use client';

import { useState, useEffect } from 'react';
import ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator';
import TravelDetailsStep from '@/components/TravelDetailsStep/TravelDetailsStep';
import DestinationStep from '@/components/DestinationStep/DestinationStep';
import CitiesRouteStep from '@/components/CitiesRouteStep/CitiesRouteStep';
import PreferencesStep from '@/components/PreferencesStep/PreferencesStep';
import ItineraryResult from '@/components/ItineraryResult/ItineraryResult';
import { INDIA_DESTINATIONS } from '@/components/DestinationPicker/DestinationPicker';
import styles from './ItineraryForm.module.css';

const ALL_PLACES = INDIA_DESTINATIONS.flatMap(g => g.places);

type AppView = 'form' | 'loading' | 'result';

export default function ItineraryForm() {
  const [view, setView] = useState<AppView>('form');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [step1Summary, setStep1Summary] = useState<string>('');
  const [step2DestinationIds, setStep2DestinationIds] = useState<string[]>([]);
  const [step2Summary, setStep2Summary] = useState<string>('');
  const [step3Summary, setStep3Summary] = useState<string>('');

  useEffect(() => {
    if (view !== 'loading') return;
    const timer = setTimeout(() => setView('result'), 2800);
    return () => clearTimeout(timer);
  }, [view]);

  function handleStep1Next(summary: string) {
    setStep1Summary(summary);
    setCurrentStep(2);
  }

  function handleStep2Back() { setCurrentStep(1); }

  function handleStep2Next(ids: string[]) {
    setStep2DestinationIds(ids);
    const first = ALL_PLACES.find(p => ids.includes(p.id));
    setStep2Summary(first ? `${first.emoji} ${first.name}` : '');
    setCurrentStep(3);
  }

  function handleStep3Back() { setCurrentStep(2); }

  function handleStep3Next(summary: string) {
    setStep3Summary(summary);
    setCurrentStep(4);
  }

  function handleStep4Back() { setCurrentStep(3); }

  function handleStep4Submit() {
    setView('loading');
  }

  function handleModifyPlan() {
    setView('form');
    setCurrentStep(1);
    setStep1Summary('');
    setStep2DestinationIds([]);
    setStep2Summary('');
    setStep3Summary('');
  }

  if (view === 'loading') {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner} />
          <p className={styles.loadingTitle}>Planning your itinerary...</p>
          <p className={styles.loadingSubtitle}>
            TravaMate AI is crafting the perfect route for your group
          </p>
          <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return <ItineraryResult onModify={handleModifyPlan} />;
  }

  return (
    <div className={styles.page}>
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={4}
        stepSummaries={{ 1: step1Summary, 2: step2Summary, 3: step3Summary }}
      />
      {currentStep === 1 && <TravelDetailsStep onNext={handleStep1Next} />}
      {currentStep === 2 && (
        <DestinationStep onNext={handleStep2Next} onBack={handleStep2Back} />
      )}
      {currentStep === 3 && (
        <CitiesRouteStep
          destinationIds={step2DestinationIds}
          onNext={handleStep3Next}
          onBack={handleStep3Back}
        />
      )}
      {currentStep === 4 && (
        <PreferencesStep onSubmit={handleStep4Submit} onBack={handleStep4Back} />
      )}
    </div>
  );
}
