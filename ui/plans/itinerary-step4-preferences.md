# TravaMate UI — Itinerary Step 4: Preferences

## Context
Final step of the 4-step itinerary MVP. Collects budget range, dietary requirement, and optional free-text notes before submitting. All four steps are now marked done in the progress bar. The "Next" button is replaced by a "✨ Plan my itinerary" CTA. The footer also carries a beta-disclaimer line.

---

## File Manifest

### Create
```
src/types/preferences.ts
src/hooks/usePreferencesForm.ts
src/components/BudgetRangePicker/BudgetRangePicker.tsx
src/components/BudgetRangePicker/BudgetRangePicker.module.css
src/components/PreferencesStep/PreferencesStep.tsx
src/components/PreferencesStep/PreferencesStep.module.css
```

### Modify
```
src/components/CitiesRouteStep/CitiesRouteStep.tsx  — onNext: () => void → onNext: (summary: string) => void
src/components/ItineraryForm/ItineraryForm.tsx      — add step 4, step3Summary state, render PreferencesStep
```

---

## TypeScript Types

**`src/types/preferences.ts`**
```ts
export type DietaryOption = 'veg' | 'non-veg' | 'both';

export interface PreferencesState {
  budgetMin: string;   // numeric string; empty = not set
  budgetMax: string;
  dietary: DietaryOption | null;
  notes: string;       // optional free text
}
```

---

## Hook — `src/hooks/usePreferencesForm.ts`
```ts
'use client'
- PreferencesState: { budgetMin: '', budgetMax: '', dietary: null, notes: '' }
- setBudgetMin(val: string)  — strips non-numeric characters
- setBudgetMax(val: string)  — strips non-numeric characters
- setDietary(option: DietaryOption)  — single-select; clicking active option deselects
- setNotes(val: string)
- isNextEnabled:
    budgetMin !== '' && Number(budgetMin) > 0
    && budgetMax !== '' && Number(budgetMax) > 0
    && Number(budgetMin) < Number(budgetMax)
    && dietary !== null
```

---

## Architecture

```
ItineraryForm
├── currentStep: 1 | 2 | 3 | 4
├── step3Summary: string     ← "CityA ..." if multiple cities, "CityA" if one
├── ProgressIndicator
│     stepSummaries: { 1, 2, 3 }
└── [step 4] PreferencesStep
      onBack: () => setCurrentStep(3)
      onSubmit: () => handleSubmit()
```

**CitiesRouteStep change:**
```diff
- onNext: () => void
+ onNext: (summary: string) => void

  // Next button onClick:
- onClick={onNext}
+ onClick={() => {
+   const names = routeCities.map(rc => cityName(rc.id));
+   const summary = names.length === 1 ? names[0] : names.length > 1 ? `${names[0]} ...` : '';
+   onNext(summary);
+ }}
```

---

## PreferencesStep UI Layout

```
<main class="content">            ← single column, max-width 720px, centred
  [card] Preferred Stay Budget Range
    <BudgetRangePicker />
      Row: [Min label + ₹ input]  —  [Max label + ₹ input]

  [card] Any dietary requirements?
    Pill row: [Veg]  [Non-Veg]  [Both]
    (single-select; selected pill: purple bg + white text)

  [card] Anything else we should know?  (optional)
    Textarea: placeholder "✨ Share any interests, requirements or things to avoid."

<footer class="footer">           ← fixed bottom
  [← Back]   [disclaimer text]   [✨ Plan my itinerary]
```

**Footer layout:** `display: grid; grid-template-columns: auto 1fr auto`
- Left: Back button
- Center: "TravaMate AI is in beta, some results may not be fully accurate.\nThis may take up to 2 minutes." — small muted centered text
- Right: "✨ Plan my itinerary" button (purple, rounded pill; disabled state same as other steps)

---

## BudgetRangePicker

Props: `{ min: string; max: string; onMinChange: (v: string) => void; onMaxChange: (v: string) => void }`

Layout:
```
[Min]            [Max]
₹ [___input___]  —  ₹ [___input___]
```
- Inputs are `type="text"` with `inputMode="numeric"` to show numeric keyboard on mobile
- ₹ prefix is inside the input box (styled with left padding or a prefix span)
- Rounded pill border (border-radius: var(--radius-pill))
- Focus: purple border

---

## Enabled / Disabled Logic
Button label: "✨ Plan my itinerary"
Enabled when:
- `budgetMin` is a positive number
- `budgetMax` is a positive number
- `budgetMin < budgetMax`
- `dietary` is not null

Notes field is **optional** — does not affect the enabled state.

---

## Implementation Order
1. `src/types/preferences.ts`
2. `src/hooks/usePreferencesForm.ts`
3. `BudgetRangePicker` component
4. `PreferencesStep` component
5. Update `CitiesRouteStep` — `onNext(summary)`
6. Update `ItineraryForm` — step 4 wiring

---

## Verification
- Steps 1–3 show ✓ + summaries in progress bar when on step 4
- Budget: only accepts numbers; Non-numeric chars stripped on input
- Budget: "Plan my itinerary" stays disabled if min ≥ max, or either field empty
- Dietary: single-select pill; clicking same pill again deselects
- Notes: optional textarea; does not gate the submit button
- Back returns to step 3 (step 4 state resets via fresh hook instance)
- "✨ Plan my itinerary" button disabled state matches other Next buttons visually
- `npm run build` — zero TypeScript errors
