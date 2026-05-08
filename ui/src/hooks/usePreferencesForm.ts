'use client';

import { useState } from 'react';
import type { DietaryOption, PreferencesState } from '@/types/preferences';

export function usePreferencesForm() {
  const [state, setState] = useState<PreferencesState>({
    budgetMin: '',
    budgetMax: '',
    dietary: null,
    notes: '',
  });

  function setBudgetMin(val: string) {
    setState(prev => ({ ...prev, budgetMin: val.replace(/\D/g, '') }));
  }

  function setBudgetMax(val: string) {
    setState(prev => ({ ...prev, budgetMax: val.replace(/\D/g, '') }));
  }

  function setDietary(option: DietaryOption) {
    setState(prev => ({
      ...prev,
      dietary: prev.dietary === option ? null : option,
    }));
  }

  function setNotes(val: string) {
    setState(prev => ({ ...prev, notes: val }));
  }

  const min = Number(state.budgetMin);
  const max = Number(state.budgetMax);

  const isNextEnabled =
    state.budgetMin !== '' &&
    state.budgetMax !== '' &&
    min > 0 &&
    max > 0 &&
    min < max &&
    state.dietary !== null;

  return { state, setBudgetMin, setBudgetMax, setDietary, setNotes, isNextEnabled };
}
