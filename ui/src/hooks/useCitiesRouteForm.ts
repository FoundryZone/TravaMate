'use client';

import { useState } from 'react';
import type { SourceAirport, CitiesRouteState } from '@/types/citiesRoute';

export function useCitiesRouteForm() {
  const [state, setState] = useState<CitiesRouteState>({
    sourceAirport: null,
    routeCities: [],
    aiOptimized: false,
  });

  function setSourceAirport(airport: SourceAirport | null) {
    setState(prev => ({ ...prev, sourceAirport: airport }));
  }

  function addCity(id: string) {
    setState(prev => {
      if (prev.routeCities.some(c => c.id === id)) return prev;
      return { ...prev, routeCities: [...prev.routeCities, { id, nights: 0 }] };
    });
  }

  function removeCity(id: string) {
    setState(prev => ({
      ...prev,
      routeCities: prev.routeCities.filter(c => c.id !== id),
    }));
  }

  function updateNights(id: string, delta: number) {
    setState(prev => ({
      ...prev,
      routeCities: prev.routeCities.map(c =>
        c.id === id ? { ...c, nights: Math.max(0, c.nights + delta) } : c
      ),
    }));
  }

  function toggleAiOptimized() {
    setState(prev => ({ ...prev, aiOptimized: !prev.aiOptimized }));
  }

  const isNextEnabled =
    state.sourceAirport !== null && state.routeCities.length > 0;

  return {
    state,
    setSourceAirport,
    addCity,
    removeCity,
    updateNights,
    toggleAiOptimized,
    isNextEnabled,
  };
}
