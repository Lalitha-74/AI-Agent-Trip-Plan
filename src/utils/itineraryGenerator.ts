import { BudgetTier, GeneratedItinerary } from '../types/travel';

export function generateSmartItinerary(
  destination: string,
  travelingFrom: string,
  startDate: string,
  days: number,
  travelers: number,
  budget: BudgetTier
): GeneratedItinerary {
  const destLower = destination.toLowerCase();

  // Determine budget multiplier & tier specifics
  const budgetRates = {
    Budget: {
      flightFactor: 420,
      hotelRate: 65,
      foodDaily: 35,
      hotelType: 'Top-rated Boutique Hostels & Modern Guest Suites',
      hotelPicks: ['CitizenM / Generator Boutique Suites', 'Local Certified Eco-Loft', 'Design Capsule Residence'],
      diningStyle: 'Local night markets, hidden artisan bakeries & beloved neighborhood bistros',
      foodPicks: ['Renowned street food alleys', 'Family-run tavern specialty', 'Authentic neighborhood market stalls'],
    },
    'Mid-range': {
      flightFactor: 750,
      hotelRate: 185,
      foodDaily: 75,
      hotelType: '4-Star Curated Design & Heritage Hotels',
      hotelPicks: ['Marriott Autograph Collection / Kimpton Design Hotel', 'Historic Townhouse Boutique', 'Panoramic City River Suites'],
      diningStyle: 'Michelin Bib Gourmand selections, farm-to-table dining & rooftop cocktail lounges',
      foodPicks: ['Award-winning bistro tasting', 'Sommelier curated wine bar', 'Seafood harbor-front dining'],
    },
    Luxury: {
      flightFactor: 1650,
      hotelRate: 490,
      foodDaily: 190,
      hotelType: '5-Star Ultra-Luxury Resorts, Aman, Four Seasons or Relais & Châteaux',
      hotelPicks: ['Four Seasons / Aman Sanctuary', 'Private Cliffside Pool Villa', 'Historic Palace Hotel Suite'],
      diningStyle: 'Michelin 2 & 3-Star fine dining, private chef experiences & rare vintage pairings',
      foodPicks: ['Multi-course Michelin chef tasting', 'Private sunset yacht champagne dinner', 'Historic cellar gastronomic experience'],
    },
  }[budget];

  // Specific destination flavors
  let isJapan = destLower.includes('japan') || destLower.includes('tokyo') || destLower.includes('kyoto');
  let isItaly = destLower.includes('italy') || destLower.includes('rome') || destLower.includes('amalfi') || destLower.includes('florence');
  let isBali = destLower.includes('bali') || destLower.includes('ubud') || destLower.includes('indonesia');
  let isIceland = destLower.includes('iceland') || destLower.includes('reykjavik');

  const mustTryDishes = isJapan
    ? ['Authentic Edomae Omakase Sushi', 'Hakata Tonkotsu Ramen', 'Wagyu A5 Sukiyaki', 'Kyoto Matcha Kaiseki']
    : isItaly
    ? ['Cacio e Pepe & Carbonara in Trastevere', 'Fresh Burrata & San Marzano Pomodoro', 'Amalfi Lemon Spaghetti', 'Artisanal Pistachio Gelato']
    : isBali
    ? ['Crispy Bebek Betutu Duck', 'Fresh Jimbaran Bay Grilled Red Snapper', 'Traditional Nasi Campur', 'Acai Smoothie Bowls by the rice fields']
    : isIceland
    ? ['Reykjavik Langoustine Soup', 'Fresh Arctic Char with Herb Butter', 'Rye Bread Ice Cream', 'Warm Cinnamon Snúður Buns']
    : ['Signature Regional Tasting Menu', 'Locally harvested artisanal dishes', 'Chef selection seasonal specialties', 'Traditional market pastries & roast coffee'];

  const airlines = isJapan
    ? ['ANA (All Nippon Airways)', 'Japan Airlines (JAL)', 'Singapore Airlines', 'Delta / United Direct']
    : isItaly
    ? ['ITA Airways', 'Emirates', 'Lufthansa', 'Air France / British Airways']
    : isBali
    ? ['Singapore Airlines', 'Qatar Airways', 'Cathay Pacific', 'Garuda Indonesia']
    : ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'Delta Air Lines'];

  // Generate dynamic days schedule up to the requested number of days
  const schedule = [];
  const startObj = new Date(startDate || Date.now());

  for (let i = 1; i <= Math.min(days, 14); i++) {
    const dayDate = new Date(startObj);
    dayDate.setDate(dayDate.getDate() + (i - 1));
    const formattedDate = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });

    if (i === 1) {
      schedule.push({
        day: 1,
        title: `Arrival & Welcome to ${destination} (${formattedDate})`,
        morning: `Touchdown at the primary airport from ${travelingFrom}. Seamless express transit or private transfer check-in at ${budgetRates.hotelPicks[0]}.`,
        afternoon: `Unpack, refresh, and take a gentle orientation stroll through the historic neighborhood alleys and scenic viewpoints.`,
        evening: `Golden hour welcome drinks followed by dinner highlighting ${mustTryDishes[0]}. Early rest to adjust comfortably to the time zone.`,
        foodHighlight: mustTryDishes[0],
      });
    } else if (i === 2) {
      schedule.push({
        day: 2,
        title: `Iconic Landmarks & Cultural Heart (${formattedDate})`,
        morning: `Early morning VIP or skip-the-line access to the most famous central historic monuments before crowds arrive.`,
        afternoon: `Guided cultural immersion with an accredited local expert; explore traditional artisan workshops and secret courtyards.`,
        evening: `Dine at ${budgetRates.foodPicks[0]} with panoramic sunset skyline or waterfront views.`,
        foodHighlight: mustTryDishes[1] || mustTryDishes[0],
      });
    } else if (i === 3) {
      schedule.push({
        day: 3,
        title: `Epicurean Journey & Hidden Neighborhoods (${formattedDate})`,
        morning: `Private culinary walking tour through vibrant local morning markets; taste fresh seasonal produce and rare delicacies.`,
        afternoon: `Leisurely afternoon exploring trendy boutique design districts, contemporary art galleries, or lush botanical gardens.`,
        evening: `Curated dining reservation featuring ${mustTryDishes[2] || 'chef seasonal tasting menu'}.`,
        foodHighlight: mustTryDishes[2] || 'Artisan local specialty',
      });
    } else if (i === days) {
      schedule.push({
        day: i,
        title: `Final Farewells & Souvenir Discovery (${formattedDate})`,
        morning: `Sunrise coffee stroll to your favorite viewpoint. Pick up bespoke local handicrafts, artisanal spices, or textiles.`,
        afternoon: `Late checkout and leisurely farewell lunch at a beloved neighborhood cafe.`,
        evening: `Transfer to the departure airport for your flight back to ${travelingFrom}. Journey completed!`,
        foodHighlight: 'Farewell regional dessert & espresso',
      });
    } else {
      schedule.push({
        day: i,
        title: `Day Excursion & Nature Immersion (${formattedDate})`,
        morning: `Scenic morning journey out to nearby coastal cliffs, mountain valleys, or historic UNESCO heritage towns.`,
        afternoon: `Outdoor exploration, private boat charter or scenic rail ride, followed by an authentic countryside tavern lunch.`,
        evening: `Return to central base; unwind at a serene spa or rooftop terrace with local vintage wines and artisanal cheeses.`,
        foodHighlight: mustTryDishes[i % mustTryDishes.length],
      });
    }
  }

  return {
    destination,
    travelingFrom,
    startDate,
    days,
    travelers,
    budget,
    flightInfo: {
      recommendedAirlines: airlines,
      avgFlightDuration: isJapan ? '11h 20m' : isItaly ? '9h 45m' : isBali ? '16h 15m' : '8h 30m',
      estimatedFarePerPerson: budgetRates.flightFactor,
      bestBookingWindow: '45-60 days before departure for optimal rates',
    },
    accommodation: {
      categoryName: budgetRates.hotelType,
      avgNightlyRate: budgetRates.hotelRate,
      features: [
        'Central prime location walking distance to transit',
        'Complimentary high-speed WiFi & concierge services',
        budget === 'Luxury' ? 'Private butler, spa access & bespoke airport transfers' : 'Curated local breakfast & boutique design aesthetic',
      ],
      topPicks: budgetRates.hotelPicks,
    },
    dining: {
      style: budgetRates.diningStyle,
      avgDailyFoodCost: budgetRates.foodDaily,
      mustTryDishes,
      curatedSpots: budgetRates.foodPicks,
    },
    schedule,
  };
}
