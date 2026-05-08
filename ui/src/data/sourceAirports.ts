import type { SourceAirport } from '@/types/citiesRoute';

export const SOURCE_AIRPORTS: SourceAirport[] = [
  { id: 'pnq', name: 'Pune',      country: 'India', iata: 'PNQ', coordinates: [18.5793, 73.9089] },
  { id: 'bom', name: 'Mumbai',    country: 'India', iata: 'BOM', coordinates: [19.0896, 72.8656] },
  { id: 'del', name: 'Delhi',     country: 'India', iata: 'DEL', coordinates: [28.5562, 77.1000] },
  { id: 'blr', name: 'Bangalore', country: 'India', iata: 'BLR', coordinates: [13.1979, 77.7063] },
  { id: 'maa', name: 'Chennai',   country: 'India', iata: 'MAA', coordinates: [12.9941, 80.1709] },
  { id: 'hyd', name: 'Hyderabad', country: 'India', iata: 'HYD', coordinates: [17.2403, 78.4294] },
  { id: 'ccu', name: 'Kolkata',   country: 'India', iata: 'CCU', coordinates: [22.6550, 88.4472] },
  { id: 'amd', name: 'Ahmedabad', country: 'India', iata: 'AMD', coordinates: [23.0771, 72.6347] },
];
