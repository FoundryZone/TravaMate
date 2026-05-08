import type { DestinationCitiesGroup } from '@/types/citiesRoute';

export const DESTINATION_CITIES: DestinationCitiesGroup[] = [
  {
    destinationId: 'spiti-valley',
    gatewayAirportId: 'del',
    mapCenter: [32.25, 78.05],
    mapZoom: 10,
    cities: [
      { id: 'kaza',            name: 'Kaza',            emoji: '🏔️', coordinates: [32.2276, 78.0718], image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&h=150' },
      { id: 'chandratal-lake', name: 'Chandratal Lake', emoji: '🌊', coordinates: [32.4897, 77.6143], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&h=150' },
      { id: 'key-monastery',   name: 'Key Monastery',   emoji: '🛕', coordinates: [32.3000, 78.0110], image: 'https://images.unsplash.com/photo-1575986767340-5d17ae767ab0?auto=format&fit=crop&w=200&h=150' },
      { id: 'hikkim',          name: 'Hikkim',           emoji: '🌐', coordinates: [32.2500, 78.0450], image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=200&h=150' },
      { id: 'langza',          name: 'Langza',           emoji: '🦕', coordinates: [32.3550, 78.0580], image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=200&h=150' },
    ],
  },
  {
    destinationId: 'manali',
    gatewayAirportId: 'del',
    mapCenter: [32.2396, 77.1887],
    mapZoom: 11,
    cities: [
      { id: 'mall-road-manali', name: 'Mall Road',     emoji: '🛍️', coordinates: [32.2396, 77.1887], image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&h=150' },
      { id: 'solang-valley',    name: 'Solang Valley',  emoji: '⛷️', coordinates: [32.3222, 77.1537], image: 'https://images.unsplash.com/photo-1530092376999-9b18e3f3e2e8?auto=format&fit=crop&w=200&h=150' },
      { id: 'rohtang-pass',     name: 'Rohtang Pass',   emoji: '🏔️', coordinates: [32.3724, 77.2402], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&h=150' },
      { id: 'old-manali',       name: 'Old Manali',     emoji: '🏘️', coordinates: [32.2498, 77.1795], image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&h=150' },
    ],
  },
  {
    destinationId: 'pune',
    gatewayAirportId: 'pnq',
    mapCenter: [18.5204, 73.8567],
    mapZoom: 12,
    cities: [
      { id: 'shaniwarwada',  name: 'Shaniwarwada',  emoji: '🏛️', coordinates: [18.5204, 73.8567], image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=200&h=150' },
      { id: 'koregaon-park', name: 'Koregaon Park', emoji: '🌳', coordinates: [18.5362, 73.8932], image: 'https://images.unsplash.com/photo-1500534314209-a157d2173bf1?auto=format&fit=crop&w=200&h=150' },
    ],
  },
  {
    destinationId: 'mumbai',
    gatewayAirportId: 'bom',
    mapCenter: [18.9220, 72.8347],
    mapZoom: 12,
    cities: [
      { id: 'marine-drive', name: 'Marine Drive', emoji: '🌊', coordinates: [18.9434, 72.8240], image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=200&h=150' },
      { id: 'juhu-beach',   name: 'Juhu Beach',   emoji: '🏖️', coordinates: [19.0976, 72.8267], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&h=150' },
      { id: 'bandra',       name: 'Bandra',        emoji: '🏙️', coordinates: [19.0596, 72.8295], image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=200&h=150' },
    ],
  },
];
