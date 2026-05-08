'use client';

import { useTravelDetailsForm } from '@/hooks/useTravelDetailsForm';
import ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator';
import TravelerCounter from '@/components/TravelerCounter/TravelerCounter';
import OccasionPicker from '@/components/OccasionPicker/OccasionPicker';
import DateModePicker from '@/components/DateModePicker/DateModePicker';
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import FlexibleOptions from '@/components/FlexibleOptions/FlexibleOptions';
import styles from './TravelDetailsForm.module.css';

export default function TravelDetailsForm() {
  const {
    state,
    setTravelerCount,
    setOccasion,
    setDateMode,
    setDateRange,
    setFlexDuration,
    toggleFlexMonth,
    isNextEnabled,
  } = useTravelDetailsForm();

  return (
    <div className={styles.page}>
      <ProgressIndicator currentStep={1} totalSteps={4} />

      <main className={styles.content}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Who&apos;s traveling?</h2>
          <div className={styles.counters}>
            <TravelerCounter
              label="Adults"
              subLabel="Age 13+"
              count={state.travelers.adults}
              min={1}
              onIncrement={() => setTravelerCount('adults', 1)}
              onDecrement={() => setTravelerCount('adults', -1)}
            />
            <div className={styles.divider} />
            <TravelerCounter
              label="Children"
              subLabel="Age 2-12"
              count={state.travelers.children}
              min={0}
              onIncrement={() => setTravelerCount('children', 1)}
              onDecrement={() => setTravelerCount('children', -1)}
            />
            <div className={styles.divider} />
            <TravelerCounter
              label="Infants"
              subLabel="Under 2"
              count={state.travelers.infants}
              min={0}
              onIncrement={() => setTravelerCount('infants', 1)}
              onDecrement={() => setTravelerCount('infants', -1)}
            />
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>What&apos;s the occasion?</h2>
          <OccasionPicker selected={state.occasion} onSelect={setOccasion} />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>When do you want to travel?</h2>
          <DateModePicker mode={state.dateMode} onChange={setDateMode} />
          {state.dateMode === 'exact' && (
            <DateRangePicker range={state.dateRange} onChange={setDateRange} />
          )}
          {state.dateMode === 'flexible' && (
            <FlexibleOptions
              options={state.flexibleOptions}
              onDurationChange={setFlexDuration}
              onMonthToggle={toggleFlexMonth}
            />
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <button
          className={`${styles.nextBtn} ${isNextEnabled ? styles.nextEnabled : styles.nextDisabled}`}
          disabled={!isNextEnabled}
        >
          Next &rsaquo;
        </button>
      </footer>
    </div>
  );
}
