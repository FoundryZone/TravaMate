'use client';

import { useState } from 'react';
import type {
  TravelDetailsState,
  Occasion,
  DateMode,
  DateRange,
  TravelerCounts,
  FlexDuration,
} from '@/types/itinerary';

export function useTravelDetailsForm() {
  const [state, setState] = useState<TravelDetailsState>({
    travelers: { adults: 1, children: 0, infants: 0 },
    occasion: null,
    dateMode: 'exact',
    dateRange: { from: undefined, to: undefined },
    flexibleOptions: { duration: null, months: [] },
  });

  function setTravelerCount(key: keyof TravelerCounts, delta: number) {
    setState(prev => {
      const min = key === 'adults' ? 1 : 0;
      const next = Math.max(min, prev.travelers[key] + delta);
      return { ...prev, travelers: { ...prev.travelers, [key]: next } };
    });
  }

  function setOccasion(occasion: Occasion) {
    setState(prev => ({ ...prev, occasion }));
  }

  function setDateMode(dateMode: DateMode) {
    setState(prev => ({
      ...prev,
      dateMode,
      dateRange: { from: undefined, to: undefined },
      flexibleOptions: { duration: null, months: [] },
    }));
  }

  function setDateRange(dateRange: DateRange) {
    setState(prev => ({ ...prev, dateRange }));
  }

  function setFlexDuration(duration: FlexDuration) {
    setState(prev => ({
      ...prev,
      flexibleOptions: { ...prev.flexibleOptions, duration },
    }));
  }

  function toggleFlexMonth(month: string) {
    setState(prev => {
      const months = prev.flexibleOptions.months.includes(month)
        ? prev.flexibleOptions.months.filter(m => m !== month)
        : [...prev.flexibleOptions.months, month];
      return { ...prev, flexibleOptions: { ...prev.flexibleOptions, months } };
    });
  }

  const isNextEnabled =
    state.travelers.adults >= 1 &&
    state.occasion !== null &&
    (
      (state.dateMode === 'exact' &&
        state.dateRange.from !== undefined &&
        state.dateRange.to !== undefined) ||
      (state.dateMode === 'flexible' &&
        state.flexibleOptions.duration !== null &&
        state.flexibleOptions.months.length > 0)
    );

  return {
    state,
    setTravelerCount,
    setOccasion,
    setDateMode,
    setDateRange,
    setFlexDuration,
    toggleFlexMonth,
    isNextEnabled,
  };
}
