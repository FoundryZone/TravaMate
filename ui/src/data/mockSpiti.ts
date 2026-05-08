export interface DayPlan {
  day: number;
  title: string;
  image: string;
  route: string;
  accommodation: string;
  travel?: { mode: string; duration: string };
  highlights: string[];
  note?: string;
}

export interface BudgetRow {
  item: string;
  amount: string;
  isTotal?: boolean;
}

export interface MockItinerary {
  title: string;
  destination: string;
  duration: string;
  groupSize: number;
  budget: string;
  coverImage: string;
  aiSummary: string[];
  aiReason: string;
  days: DayPlan[];
  budgetBreakdown: BudgetRow[];
  savingTips: string[];
  bestMonths: Array<{ month: string; recommended: boolean }>;
  healthTips: { carry: string[]; avoid: string[] };
  finalRecommendation: string[];
}

export const MOCK_SPITI: MockItinerary = {
  title: 'Spiti Valley Itinerary',
  destination: 'Spiti Valley, Himachal Pradesh',
  duration: '10 Days',
  groupSize: 4,
  budget: '₹80k – ₹1 lakh',
  coverImage: '/destinations/key-monastry.jpg',
  aiSummary: [
    'Take flights to/from Chandigarh',
    'Do the classic Shimla → Spiti → Manali circuit',
    'Use a private cab / shared tempo traveler locally',
    'Stay mostly in homestays + decent hotels',
    'Avoid over-rushing due to altitude',
  ],
  aiReason:
    'This route is recommended because altitude increases gradually and reduces AMS (Acute Mountain Sickness) risk.',
  days: [
    {
      day: 1,
      title: 'Pune → Chandigarh → Shimla',
      image: '/destinations/chandigarh.jpg',
      route: 'Flight from Pune to Chandigarh → Cab/Volvo to Shimla',
      accommodation: 'Shimla hotel',
      travel: { mode: 'Flight + Road', duration: 'Flight ~3–5 hrs · Road 4–5 hrs' },
      highlights: ['Mall Road', 'Christ Church', 'Relax and acclimatize'],
    },
    {
      day: 2,
      title: 'Shimla → Sangla / Chitkul',
      image: '/destinations/chitkul.jpg',
      route: 'Shimla → Rampur → Sangla Valley',
      accommodation: 'Chitkul or Sangla',
      highlights: [
        'Sutlej river views',
        'Apple orchards',
        'Indo-Tibet mountain landscapes',
      ],
      note: 'This gradual ascent helps your body adapt before entering Spiti.',
    },
    {
      day: 3,
      title: 'Chitkul → Kalpa',
      image: '/destinations/Kalpa.jpg',
      route: 'Chitkul → Kalpa (shorter, relaxed drive)',
      accommodation: 'Kalpa',
      highlights: [
        'Kinnaur Kailash views',
        'Peaceful Himalayan village vibe',
        'Sunset photography',
      ],
    },
    {
      day: 4,
      title: 'Kalpa → Nako → Tabo',
      image: '/destinations/tabo-stupa.jpg',
      route: 'Kalpa → Nako Lake → Gue Mummy (optional) → Tabo',
      accommodation: 'Tabo Monastery area',
      highlights: [
        'Nako Lake',
        'Landscape dramatically changes into cold desert terrain',
        'Ancient monastery experience',
      ],
    },
    {
      day: 5,
      title: 'Tabo → Dhankar → Kaza',
      image: '/destinations/dhankar.jpg',
      route: 'Tabo → Dhankar Monastery → Dhankar Lake (optional) → Kaza',
      accommodation: 'Kaza',
      highlights: [
        'Dhankar Monastery cliff views',
        'Core Spiti experience starts here',
        'Cafes and local markets in Kaza',
      ],
    },
    {
      day: 6,
      title: 'Kaza Local Sightseeing',
      image: '/destinations/key-monastry.jpg',
      route: 'Day trips around Kaza valley',
      accommodation: 'Kaza',
      highlights: [
        'Key Monastery',
        'Hikkim (world\'s highest post office)',
        'Komic & Langza villages',
        'Chicham Bridge',
      ],
      note: 'This is usually the best day of the trip.',
    },
    {
      day: 7,
      title: 'Kaza → Chandratal Lake',
      image: '/destinations/chandratal.jpg',
      route: 'Kaza → Kunzum Pass → Chandratal Lake',
      accommodation: 'Camps near Chandratal Lake',
      highlights: [
        'Most scenic road section of the trip',
        'High-altitude crescent lake',
        'Milky Way & stargazing',
      ],
      note: 'Road opening depends on snowfall. Usually open late May / June onward.',
    },
    {
      day: 8,
      title: 'Chandratal → Manali',
      image: '/destinations/manali-valley.jpg',
      route: 'Chandratal → Batal → Atal Tunnel → Manali',
      accommodation: 'Manali',
      highlights: [
        'One of the most adventurous road sections in India',
        'Atal Tunnel (world\'s longest high-altitude tunnel)',
        'Café hopping in Old Manali',
      ],
    },
    {
      day: 9,
      title: 'Manali — Leisure Day',
      image: '/destinations/manali-snow.jpg',
      route: 'Manali (buffer + leisure)',
      accommodation: 'Manali',
      highlights: ['Solang Valley', 'Hidimba Temple', 'Old Manali cafes & shopping'],
      note: 'Buffer day for weather/road delays — very common on this route.',
    },
    {
      day: 10,
      title: 'Manali → Chandigarh → Pune',
      image: '/destinations/pune-airport.jpg',
      route: 'Manali → Chandigarh (road) → Pune (flight)',
      accommodation: '—',
      travel: { mode: 'Road + Flight', duration: 'Road ~8–9 hrs · Flight ~3 hrs' },
      highlights: ['Early departure recommended', 'Fly back to Pune'],
    },
  ],
  budgetBreakdown: [
    { item: 'Flights Pune ↔ Chandigarh', amount: '₹32k – 45k' },
    { item: 'Hotels / Homestays', amount: '₹22k – 30k' },
    { item: 'Cab sharing / private cab', amount: '₹28k – 40k' },
    { item: 'Food', amount: '₹10k – 15k' },
    { item: 'Misc + permits', amount: '₹5k' },
    { item: 'Total (4 people)', amount: '₹90k – 1.2L', isTotal: true },
  ],
  savingTips: [
    'Book flights 1–2 months early',
    'Stay in homestays over commercial hotels',
    'Share an SUV/tempo traveler from Shimla',
    'Avoid luxury camps at Chandratal',
    'Travel in June or September (best value + weather)',
  ],
  bestMonths: [
    { month: 'June', recommended: true },
    { month: 'July', recommended: false },
    { month: 'August', recommended: false },
    { month: 'September', recommended: true },
  ],
  healthTips: {
    carry: ['Diamox (after doctor consultation)', 'ORS packets', 'Warm layers', 'Sunglasses', 'High-SPF sunscreen'],
    avoid: ['Heavy alcohol the first few days', 'Overexertion at Kaza / Chandratal'],
  },
  finalRecommendation: [
    'Flight to Chandigarh',
    'Private cab on the Chandigarh → Manali circuit',
    'Homestay-based accommodation',
    '1 mandatory buffer day',
  ],
};
