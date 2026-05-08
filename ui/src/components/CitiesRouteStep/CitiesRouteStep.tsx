'use client';

import dynamic from 'next/dynamic';
import { useCitiesRouteForm } from '@/hooks/useCitiesRouteForm';
import { DESTINATION_CITIES } from '@/data/destinationCities';
import { SOURCE_AIRPORTS } from '@/data/sourceAirports';
import SourceCityPicker from '@/components/SourceCityPicker/SourceCityPicker';
import CityDropdown from '@/components/CityDropdown/CityDropdown';
import type { MapCity } from '@/components/RouteMap/RouteMap';
import styles from './CitiesRouteStep.module.css';

const RouteMap = dynamic(() => import('@/components/RouteMap/RouteMap'), { ssr: false });

const DEFAULT_CENTER: [number, number] = [22.5, 78.0];
const DEFAULT_ZOOM = 5;

interface CitiesRouteStepProps {
  destinationIds: string[];
  onNext: (summary: string) => void;
  onBack: () => void;
}

export default function CitiesRouteStep({ destinationIds, onNext, onBack }: CitiesRouteStepProps) {
  const {
    state,
    setSourceAirport,
    addCity,
    removeCity,
    updateNights,
    toggleAiOptimized,
    isNextEnabled,
  } = useCitiesRouteForm();

  const destinationGroups = DESTINATION_CITIES.filter(g =>
    destinationIds.includes(g.destinationId)
  );

  const availableCities = destinationGroups.flatMap(g => g.cities);

  const mapCenter = destinationGroups[0]?.mapCenter ?? DEFAULT_CENTER;
  const mapZoom = destinationGroups[0]?.mapZoom ?? DEFAULT_ZOOM;

  const gatewayAirport = destinationGroups[0]
    ? SOURCE_AIRPORTS.find(a => a.id === destinationGroups[0].gatewayAirportId)
    : null;

  const mapCities: MapCity[] = state.routeCities
    .map((rc, idx) => {
      const city = availableCities.find(c => c.id === rc.id);
      if (!city) return null;
      return { ...city, index: idx + 1 };
    })
    .filter((c): c is MapCity => c !== null);

  return (
    <>
      <main className={styles.content}>
        <div className={styles.leftPanel}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Where are you flying from?</h2>
            <SourceCityPicker value={state.sourceAirport} onChange={setSourceAirport} />
            {state.sourceAirport && gatewayAirport && (
              <p className={styles.flightNote}>
                ✈ {state.sourceAirport.name} → {gatewayAirport.name}
                <span className={styles.flightTag}>Air</span>
              </p>
            )}
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Cities to visit</h2>
            {availableCities.length === 0 ? (
              <p className={styles.emptyNote}>
                No cities available for the selected destination.
              </p>
            ) : (
              <CityDropdown
                availableCities={availableCities}
                selectedIds={state.routeCities.map(c => c.id)}
                onAdd={addCity}
                onRemove={removeCity}
              />
            )}

            {state.routeCities.length > 0 && (
              <div className={styles.routeSection}>
                <div className={styles.routeHeader}>
                  <span className={styles.routeLabel}>Your route</span>
                  <span className={styles.cityCount}>
                    🌙 {state.routeCities.length} {state.routeCities.length === 1 ? 'city' : 'cities'}
                  </span>
                </div>

                <ul className={styles.routeList}>
                  {state.routeCities.map((rc, idx) => {
                    const city = availableCities.find(c => c.id === rc.id);
                    if (!city) return null;
                    return (
                      <li key={rc.id} className={styles.routeItem}>
                        <span className={styles.dragHandle}>⁞⁞</span>
                        <span className={styles.cityIndex}>{idx + 1}</span>
                        <span className={styles.cityEmoji}>{city.emoji}</span>
                        <span className={styles.routeCityName}>{city.name}</span>
                        <div className={styles.nightsControl}>
                          <button
                            className={styles.nightsBtn}
                            onClick={() => updateNights(rc.id, -1)}
                            aria-label="Decrease nights"
                          >
                            −
                          </button>
                          <span className={styles.nightsValue}>
                            {rc.nights > 0 ? rc.nights : '−'}
                            <span className={styles.nightsLabel}>nights</span>
                          </span>
                          <button
                            className={styles.nightsBtn}
                            onClick={() => updateNights(rc.id, 1)}
                            aria-label="Increase nights"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className={styles.removeCity}
                          onClick={() => removeCity(rc.id)}
                          aria-label={`Remove ${city.name}`}
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>

          <section className={styles.card}>
            <div className={styles.aiRow}>
              <div className={styles.aiInfo}>
                <span className={styles.aiIcon}>✨</span>
                <div>
                  <p className={styles.aiTitle}>AI Route Optimization</p>
                  <p className={styles.aiSubtitle}>Let AI find the best route order</p>
                </div>
              </div>
              <button
                className={`${styles.toggle} ${state.aiOptimized ? styles.toggleOn : ''}`}
                onClick={toggleAiOptimized}
                role="switch"
                aria-checked={state.aiOptimized}
                aria-label="Toggle AI route optimization"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </section>
        </div>

        <div className={styles.rightPanel}>
          <RouteMap
            cities={mapCities}
            center={mapCenter}
            zoom={mapZoom}
            aiOptimized={state.aiOptimized}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          &lsaquo; Back
        </button>
        <button
          className={`${styles.nextBtn} ${isNextEnabled ? styles.nextEnabled : styles.nextDisabled}`}
          disabled={!isNextEnabled}
          onClick={() => {
            const names = state.routeCities
              .map(rc => availableCities.find(c => c.id === rc.id)?.name ?? '')
              .filter(Boolean);
            const summary = names.length === 1
              ? names[0]
              : names.length > 1
              ? `${names[0]} ...`
              : '';
            onNext(summary);
          }}
        >
          Next &rsaquo;
        </button>
      </footer>
    </>
  );
}
