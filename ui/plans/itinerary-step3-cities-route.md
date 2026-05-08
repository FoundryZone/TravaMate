# TravaMate UI — Itinerary Step 3: Cities & Route

## Context
Step 3 of the 4-step itinerary MVP. Builds on the destination selected in Step 2 by letting the user choose specific cities to visit, order them into a route, pick their flight origin, and see the route on an interactive map. Uses Leaflet + OpenStreetMap (no API key required).

---

## File Manifest

### Create
```
src/types/citiesRoute.ts
src/data/sourceAirports.ts
src/data/destinationCities.ts
src/hooks/useCitiesRouteForm.ts
src/components/CitiesRouteStep/CitiesRouteStep.tsx
src/components/CitiesRouteStep/CitiesRouteStep.module.css
src/components/SourceCityPicker/SourceCityPicker.tsx
src/components/SourceCityPicker/SourceCityPicker.module.css
src/components/CityDropdown/CityDropdown.tsx
src/components/CityDropdown/CityDropdown.module.css
src/components/RouteMap/RouteMap.tsx
src/components/RouteMap/RouteMap.module.css
```

### Modify
```
src/components/DestinationStep/DestinationStep.tsx   — onNext: () => void  →  onNext: (ids: string[]) => void
src/components/ItineraryForm/ItineraryForm.tsx       — add step 3, step2 summary, wire CitiesRouteStep
```

### Install
```
leaflet  react-leaflet  @types/leaflet
```

---

## TypeScript Types

**`src/types/citiesRoute.ts`**
```ts
export interface SourceAirport {
  id: string;
  name: string;
  country: string;
  iata: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface DestinationCity {
  id: string;
  name: string;
  emoji: string;
  coordinates: [number, number];
}

export interface DestinationCitiesGroup {
  destinationId: string;
  gatewayAirportId: string;
  cities: DestinationCity[];
  mapCenter: [number, number];
  mapZoom: number;
}

export interface RouteCity {
  id: string;
  nights: number;
}

export interface CitiesRouteState {
  sourceAirport: SourceAirport | null;
  routeCities: RouteCity[];
  aiOptimized: boolean;
}
```

---

## Static Data

**`src/data/sourceAirports.ts`**
8 major Indian airports: Pune (PNQ), Mumbai (BOM), Delhi (DEL), Bangalore (BLR), Chennai (MAA), Hyderabad (HYD), Kolkata (CCU), Ahmedabad (AMD).

**`src/data/destinationCities.ts`**
Cities grouped by destination ID (matches INDIA_DESTINATIONS in DestinationPicker):
- `spiti-valley`: Kaza, Chandratal Lake, Key Monastery, Hikkim, Langza — gateway: DEL
- `manali`: Mall Road, Solang Valley, Rohtang Pass, Old Manali — gateway: DEL
- `pune`: Shaniwarwada, Koregaon Park — gateway: PNQ
- `mumbai`: Marine Drive, Juhu Beach, Bandra — gateway: BOM

Each city carries `coordinates: [lat, lng]` for map rendering.

---

## Hook — `src/hooks/useCitiesRouteForm.ts`
```ts
'use client'
- CitiesRouteState: { sourceAirport, routeCities, aiOptimized }
- setSourceAirport(airport | null)
- addCity(id)        — appends { id, nights: 0 } if not already present
- removeCity(id)
- updateNights(id, delta)  — clamps to ≥ 0
- toggleAiOptimized()
- isNextEnabled: sourceAirport !== null && routeCities.length > 0
```

---

## Architecture

```
ItineraryForm ('use client' — orchestrator)
├── currentStep: 1 | 2 | 3
├── step1Summary: string
├── step2DestinationIds: string[]
├── step2Summary: string          ← "${emoji} ${name}" of first selected destination
├── ProgressIndicator
│     stepSummaries: { 1: step1Summary, 2: step2Summary }
├── [step 1] TravelDetailsStep
├── [step 2] DestinationStep
│     onNext: (ids) => handleStep2Next(ids)
└── [step 3] CitiesRouteStep
      destinationIds: step2DestinationIds
      onNext: () => handleStep3Next()
      onBack: () => setCurrentStep(2)
```

---

## CitiesRouteStep UI Layout

```
<main class="content">              ← two-column grid
  <div class="leftPanel">           ← scrollable
    [card] Source City
      "Where are you flying from?"
      <SourceCityPicker />          ← searchable dropdown

    [card] Cities to Visit
      "Cities to visit"
      <CityDropdown />              ← multi-select dropdown (Add / Remove)
      [if routeCities.length > 0]
        "Your route"  •  N cities
        [routeList]
          [routeItem] ⁞⁞ [N] cityEmoji cityName  −  N nights  +  ×

    [card] AI Route Optimization
      sparkle icon  "AI Route Optimization"  [toggle]
      "Let AI find the best route order"

  <div class="rightPanel">          ← map, sticky
    <RouteMap />                    ← Leaflet, dynamic ssr:false
    <p class="mapCaption">          ← "N cities • AI optimized" or "N cities"
```

**Footer (fixed):**
```
[← Back]  ....  [Next →]
```
Next is disabled until: `sourceAirport !== null && routeCities.length > 0`.

---

## SourceCityPicker

- Input shows selected airport: `"${name} ${country}  ${iata}"`
- On click: opens dropdown list filtered by typed text
- Each option: `"${name} ${country}  ${iata}"`
- Clear button (×) removes selection
- Keyboard: type to filter, click to select, Escape closes

---

## CityDropdown

- Trigger: `"Select or search cities…"` input with ↑↓ chevron
- Open state: shows list of available cities (from `destinationCities.ts` for the selected destination)
- Each city row: circular emoji avatar  |  city name  |  `+ Add` or `× Remove` button
- Added cities show `× Remove` (red-tinted); un-added show `+ Add` (purple)
- Cities already in `routeCities` show Remove; others show Add
- Click outside closes dropdown

---

## RouteMap

- Library: Leaflet + OpenStreetMap tiles (no API key)
- SSR: disabled via `dynamic(() => import('./RouteMap'), { ssr: false })` in CitiesRouteStep
- Markers: numbered `DivIcon` (purple circle, white number) at each city coordinate
- Polyline: connects cities in route order (purple, 2px)
- Auto-fits map bounds when cities change; falls back to `mapCenter`/`mapZoom` when empty
- Shows "Select cities to see your route" placeholder text when no cities selected

---

## DestinationStep Change

```diff
- onNext: () => void
+ onNext: (ids: string[]) => void

  // Next button:
- onClick={onNext}
+ onClick={() => onNext(state.selectedIds)}
```

---

## ItineraryForm Changes

```ts
const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
const [step2DestinationIds, setStep2DestinationIds] = useState<string[]>([]);
const [step2Summary, setStep2Summary] = useState<string>('');

function handleStep2Next(ids: string[]) {
  setStep2DestinationIds(ids);
  const first = ALL_PLACES.find(p => ids.includes(p.id));
  setStep2Summary(first ? `${first.emoji} ${first.name}` : '');
  setCurrentStep(3);
}

function handleStep3Back() { setCurrentStep(2); }
function handleStep3Next() { /* Step 4 — future */ }
```

```tsx
<ProgressIndicator
  currentStep={currentStep}
  totalSteps={4}
  stepSummaries={{ 1: step1Summary, 2: step2Summary }}
/>
{currentStep === 3 && (
  <CitiesRouteStep
    destinationIds={step2DestinationIds}
    onNext={handleStep3Next}
    onBack={handleStep3Back}
  />
)}
```

---

## Implementation Order
1. `src/types/citiesRoute.ts`
2. `src/data/sourceAirports.ts`
3. `src/data/destinationCities.ts`
4. `src/hooks/useCitiesRouteForm.ts`
5. `RouteMap` component (Leaflet, SSR-disabled wrapper)
6. `SourceCityPicker` component
7. `CityDropdown` component
8. `CitiesRouteStep` component
9. Update `DestinationStep` — onNext signature
10. Update `ItineraryForm` — step 3 wiring

---

## Validation
- Next disabled until `sourceAirport` selected AND `routeCities.length > 0`
- Progress bar: steps 1 & 2 show ✓ + summary pills, step 3 active
- Back returns to step 2 (step 3 state resets to fresh via new hook instance)
- Map: updates markers/polyline reactively when cities added/removed
- Map: shows all city markers when ≥1 city selected; fits bounds automatically
- `npm run build` — zero TypeScript errors
