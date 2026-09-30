export type BudgetTier = 'Budget' | 'Mid-range' | 'Luxury';

export interface TripFormData {
  name: string;             // field-0
  email: string;            // field-1
  travellingFrom: string;   // field-2
  destination: string;      // field-3
  startDate: string;        // field-4
  numberOfDays: number;     // field-5
  travelers: number;        // field-6
  budget: BudgetTier;       // field-7
  specialNotes?: string;
}

export interface DestinationCardData {
  id: string;
  name: string;
  country: string;
  region: 'Asia' | 'Europe' | 'Americas' | 'Tropical';
  tagline: string;
  image: string;
  defaultDays: number;
  defaultBudget: BudgetTier;
  flightHoursApprox: string;
  popularHighlights: string[];
  estimatedDailyPerPerson: {
    Budget: number;
    'Mid-range': number;
    Luxury: number;
  };
}

export interface DayItinerary {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  foodHighlight: string;
}

export interface GeneratedItinerary {
  destination: string;
  travelingFrom: string;
  startDate: string;
  days: number;
  travelers: number;
  budget: BudgetTier;
  flightInfo: {
    recommendedAirlines: string[];
    avgFlightDuration: string;
    estimatedFarePerPerson: number;
    bestBookingWindow: string;
  };
  accommodation: {
    categoryName: string;
    avgNightlyRate: number;
    features: string[];
    topPicks: string[];
  };
  dining: {
    style: string;
    avgDailyFoodCost: number;
    mustTryDishes: string[];
    curatedSpots: string[];
  };
  schedule: DayItinerary[];
}
