'use client';

import { useState } from 'react';
import type { DestinationState } from '@/types/destination';

export function useDestinationForm() {
  const [state, setState] = useState<DestinationState>({ selectedIds: [] });

  function toggleDestination(id: string) {
    setState(prev => ({
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter(s => s !== id)
        : [...prev.selectedIds, id],
    }));
  }

  function removeDestination(id: string) {
    setState(prev => ({
      selectedIds: prev.selectedIds.filter(s => s !== id),
    }));
  }

  const isNextEnabled = state.selectedIds.length > 0;

  return { state, toggleDestination, removeDestination, isNextEnabled };
}
