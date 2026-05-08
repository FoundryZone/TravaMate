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
  coordinates: [number, number]; // [lat, lng]
  image?: string;
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
