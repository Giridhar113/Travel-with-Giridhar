(function () {
  const destinationImages = {
  "beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=70",
  "adventure": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=70",
  "culture": "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=700&auto=format&fit=crop&q=70",
  "city": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=700&auto=format&fit=crop&q=70",
  "family": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&auto=format&fit=crop&q=70",
  "romantic": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&auto=format&fit=crop&q=70",
  "nature": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&auto=format&fit=crop&q=70",
  "desert": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&auto=format&fit=crop&q=70"
};
  const baseDestinations = [
  {
    "id": "bali-indonesia",
    "name": "Bali, Indonesia",
    "destination": "Bali, Indonesia",
    "price": "From Rs. 45,000",
    "amount": 45000,
    "category": "beach romantic culture",
    "tags": [
      "Beach",
      "Romantic"
    ],
    "best": "Best: Apr-Oct",
    "bestTimeToVisit": "Apr-Oct",
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Beach and temple landscape in Bali",
    "desc": "Tropical paradise with beaches and culture.",
    "description": "Tropical paradise with beaches and culture.",
    "detail": "Enjoy scenic beaches, peaceful temples, local markets, and sunset views across Bali's most loved coastal spots."
  },
  {
    "id": "paris-france",
    "name": "Paris, France",
    "destination": "Paris, France",
    "price": "From Rs. 65,000",
    "amount": 65000,
    "category": "romantic culture",
    "tags": [
      "Romantic",
      "Culture"
    ],
    "best": "Best: Apr-Jun",
    "bestTimeToVisit": "Apr-Jun",
    "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Eiffel Tower and Paris city view",
    "desc": "City of love and iconic landmarks.",
    "description": "City of love and iconic landmarks.",
    "detail": "Visit the Eiffel Tower, charming cafes, museums, shopping streets, and beautiful evening river views."
  },
  {
    "id": "goa-india",
    "name": "Goa, India",
    "destination": "Goa, India",
    "price": "From Rs. 18,000",
    "amount": 18000,
    "category": "beach family romantic",
    "tags": [
      "Beach",
      "Family"
    ],
    "best": "Best: Nov-Feb",
    "bestTimeToVisit": "Nov-Feb",
    "image": "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Palm trees and beach in Goa",
    "desc": "Relaxing beaches, nightlife, and coastal food.",
    "description": "Relaxing beaches, nightlife, and coastal food.",
    "detail": "Discover beach stays, water sports, local markets, churches, and a lively evening atmosphere."
  },
  {
    "id": "manali-india",
    "name": "Manali, India",
    "destination": "Manali, India",
    "price": "From Rs. 22,000",
    "amount": 22000,
    "category": "adventure family",
    "tags": [
      "Adventure",
      "Family"
    ],
    "best": "Best: Oct-Feb",
    "bestTimeToVisit": "Oct-Feb",
    "image": "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Snow mountains and valley in Manali",
    "desc": "Mountain views, adventure sports, and fresh air.",
    "description": "Mountain views, adventure sports, and fresh air.",
    "detail": "Experience valleys, snow points, cafes, trekking routes, and adventure activities in the Himalayas."
  },
  {
    "id": "santorini-greece",
    "name": "Santorini, Greece",
    "destination": "Santorini, Greece",
    "price": "From Rs. 72,000",
    "amount": 72000,
    "category": "beach romantic",
    "tags": [
      "Romantic",
      "Beach"
    ],
    "best": "Best: Apr-Oct",
    "bestTimeToVisit": "Apr-Oct",
    "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "White buildings and sea view in Santorini",
    "desc": "Beautiful island views, white houses, and romantic sunsets.",
    "description": "Beautiful island views, white houses, and romantic sunsets.",
    "detail": "Explore cliffside villages, blue-domed churches, volcanic beaches, local cafes, and peaceful sunset viewpoints."
  },
  {
    "id": "dubai-uae",
    "name": "Dubai, UAE",
    "destination": "Dubai, UAE",
    "price": "From Rs. 55,000",
    "amount": 55000,
    "category": "family adventure",
    "tags": [
      "Family",
      "Adventure"
    ],
    "best": "Best: Nov-Mar",
    "bestTimeToVisit": "Nov-Mar",
    "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Dubai skyline with modern buildings",
    "desc": "Modern skyline, desert adventures, shopping, and luxury stays.",
    "description": "Modern skyline, desert adventures, shopping, and luxury stays.",
    "detail": "Visit iconic towers, enjoy desert safari experiences, explore malls, beaches, markets, and evening city views."
  },
  {
    "id": "singapore",
    "name": "Singapore",
    "destination": "Singapore",
    "price": "From Rs. 48,000",
    "amount": 48000,
    "category": "family culture",
    "tags": [
      "Family",
      "Culture"
    ],
    "best": "Best: Feb-Apr",
    "bestTimeToVisit": "Feb-Apr",
    "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Singapore skyline and waterfront",
    "desc": "Clean city views, gardens, family attractions, and shopping.",
    "description": "Clean city views, gardens, family attractions, and shopping.",
    "detail": "Discover Gardens by the Bay, Sentosa, waterfront walks, food courts, shopping streets, and night attractions."
  },
  {
    "id": "tokyo-japan",
    "name": "Tokyo, Japan",
    "destination": "Tokyo, Japan",
    "price": "From Rs. 82,000",
    "amount": 82000,
    "category": "culture family",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Mar-May",
    "bestTimeToVisit": "Mar-May",
    "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Tokyo city street with bright lights",
    "desc": "Culture, technology, temples, shopping streets, and food.",
    "description": "Culture, technology, temples, shopping streets, and food.",
    "detail": "Experience traditional shrines, neon streets, theme cafes, shopping districts, gardens, and authentic Japanese cuisine."
  },
  {
    "id": "new-york-usa",
    "name": "New York, USA",
    "destination": "New York, USA",
    "price": "From Rs. 95,000",
    "amount": 95000,
    "category": "family culture",
    "tags": [
      "Family",
      "Culture"
    ],
    "best": "Best: Apr-Jun",
    "bestTimeToVisit": "Apr-Jun",
    "image": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "New York city skyline and street",
    "desc": "Big city energy, famous landmarks, parks, and shopping.",
    "description": "Big city energy, famous landmarks, parks, and shopping.",
    "detail": "Visit Times Square, Central Park, skyline viewpoints, museums, shopping avenues, and classic city attractions."
  },
  {
    "id": "rome-italy",
    "name": "Rome, Italy",
    "destination": "Rome, Italy",
    "price": "From Rs. 68,000",
    "amount": 68000,
    "category": "culture romantic",
    "tags": [
      "Culture",
      "Romantic"
    ],
    "best": "Best: Apr-Jun",
    "bestTimeToVisit": "Apr-Jun",
    "image": "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Historic architecture in Rome",
    "desc": "Historic monuments, Italian food, culture, and city walks.",
    "description": "Historic monuments, Italian food, culture, and city walks.",
    "detail": "Explore ancient landmarks, charming streets, local markets, museums, cafes, and unforgettable Italian cuisine."
  }
];
  const extraDestinations = [
  {
    "name": "Kerala, India",
    "price": "From Rs. 26,000",
    "category": "nature family romantic",
    "tags": [
      "Nature",
      "Family"
    ],
    "best": "Best: Sep-Mar",
    "image": "nature",
    "desc": "Backwaters, houseboats, greenery, and peaceful resort stays.",
    "detail": "Cruise through backwaters, enjoy local meals, visit waterfalls, and relax in calm nature resorts."
  },
  {
    "name": "Jaipur, India",
    "price": "From Rs. 20,000",
    "category": "culture family",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Oct-Mar",
    "image": "desert",
    "desc": "Royal palaces, forts, markets, food, and heritage stays.",
    "detail": "Explore Amer Fort, City Palace, colorful bazaars, local food, and evening cultural experiences."
  },
  {
    "name": "Kashmir, India",
    "price": "From Rs. 32,000",
    "category": "romantic family adventure",
    "tags": [
      "Romantic",
      "Adventure"
    ],
    "best": "Best: Mar-Oct",
    "image": "adventure",
    "desc": "Lakes, valleys, snow views, gardens, and peaceful stays.",
    "detail": "Enjoy Srinagar, Gulmarg, houseboats, gardens, snow activities, and scenic mountain drives."
  },
  {
    "name": "Ladakh, India",
    "price": "From Rs. 38,000",
    "category": "adventure culture",
    "tags": [
      "Adventure",
      "Culture"
    ],
    "best": "Best: May-Sep",
    "image": "adventure",
    "desc": "High-altitude landscapes, monasteries, lakes, and road trips.",
    "detail": "Visit Pangong Lake, Nubra Valley, monasteries, mountain passes, and scenic desert valleys."
  },
  {
    "name": "Andaman, India",
    "price": "From Rs. 42,000",
    "category": "beach romantic family",
    "tags": [
      "Beach",
      "Family"
    ],
    "best": "Best: Oct-May",
    "image": "beach",
    "desc": "Clear beaches, island hopping, snorkeling, and quiet stays.",
    "detail": "Plan Havelock, Radhanagar Beach, cellular jail visit, water activities, and relaxed island time."
  },
  {
    "name": "Maldives",
    "price": "From Rs. 90,000",
    "category": "beach romantic",
    "tags": [
      "Beach",
      "Romantic"
    ],
    "best": "Best: Nov-Apr",
    "image": "beach",
    "desc": "Luxury island resorts, clear water, snorkeling, and slow days.",
    "detail": "Choose beach villas, speedboat transfers, snorkeling, sunset dinners, and peaceful island stays."
  },
  {
    "name": "Phuket, Thailand",
    "price": "From Rs. 46,000",
    "category": "beach family adventure",
    "tags": [
      "Beach",
      "Adventure"
    ],
    "best": "Best: Nov-Apr",
    "image": "beach",
    "desc": "Island tours, beaches, nightlife, and water adventures.",
    "detail": "Visit Phi Phi islands, Patong, viewpoints, night markets, and beach activity spots."
  },
  {
    "name": "Bangkok, Thailand",
    "price": "From Rs. 40,000",
    "category": "culture family city",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Nov-Feb",
    "image": "city",
    "desc": "Temples, shopping streets, street food, and city energy.",
    "detail": "Explore temples, floating markets, malls, local food streets, and evening river views."
  },
  {
    "name": "London, UK",
    "price": "From Rs. 110,000",
    "category": "culture family city",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Apr-Sep",
    "image": "city",
    "desc": "Museums, landmarks, shopping, parks, and royal sights.",
    "detail": "Visit Big Ben, London Eye, museums, parks, shopping streets, and heritage neighborhoods."
  },
  {
    "name": "Swiss Alps, Switzerland",
    "price": "From Rs. 125,000",
    "category": "romantic family adventure",
    "tags": [
      "Romantic",
      "Adventure"
    ],
    "best": "Best: Apr-Oct",
    "image": "adventure",
    "desc": "Snow peaks, scenic trains, lakes, and mountain villages.",
    "detail": "Plan Interlaken, Lucerne, Jungfrau region, lake cruises, and scenic train routes."
  },
  {
    "name": "Amsterdam, Netherlands",
    "price": "From Rs. 90,000",
    "category": "culture romantic city",
    "tags": [
      "Culture",
      "Romantic"
    ],
    "best": "Best: Apr-Oct",
    "image": "city",
    "desc": "Canals, museums, cycling streets, cafes, and city walks.",
    "detail": "Enjoy canal cruises, art museums, flower markets, cycling routes, and cozy cafes."
  },
  {
    "name": "Istanbul, Turkey",
    "price": "From Rs. 75,000",
    "category": "culture romantic family",
    "tags": [
      "Culture",
      "Romantic"
    ],
    "best": "Best: Apr-Jun",
    "image": "culture",
    "desc": "Historic mosques, markets, Bosphorus views, and local food.",
    "detail": "Visit Hagia Sophia, bazaars, Bosphorus cruise, heritage lanes, and Turkish food spots."
  },
  {
    "name": "Seoul, South Korea",
    "price": "From Rs. 88,000",
    "category": "culture city family",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Mar-May",
    "image": "city",
    "desc": "Modern streets, palaces, cafes, shopping, and culture.",
    "detail": "Explore palaces, shopping districts, food streets, cafes, and city viewpoints."
  },
  {
    "name": "Sydney, Australia",
    "price": "From Rs. 120,000",
    "category": "beach family city",
    "tags": [
      "Beach",
      "Family"
    ],
    "best": "Best: Sep-Nov",
    "image": "city",
    "desc": "Harbor views, beaches, city attractions, and coastal walks.",
    "detail": "Visit Opera House, Bondi Beach, harbor cruises, museums, and coastal neighborhoods."
  },
  {
    "name": "Queenstown, New Zealand",
    "price": "From Rs. 135,000",
    "category": "adventure romantic nature",
    "tags": [
      "Adventure",
      "Nature"
    ],
    "best": "Best: Dec-Feb",
    "image": "adventure",
    "desc": "Adventure sports, lakes, mountains, and scenic drives.",
    "detail": "Enjoy lake views, adventure activities, mountain rides, day trips, and peaceful stays."
  },
  {
    "name": "Cairo, Egypt",
    "price": "From Rs. 82,000",
    "category": "culture family adventure",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Oct-Apr",
    "image": "desert",
    "desc": "Pyramids, museums, river views, and ancient history.",
    "detail": "Visit pyramids, Egyptian Museum, Nile views, markets, and heritage sites."
  },
  {
    "name": "Cape Town, South Africa",
    "price": "From Rs. 105,000",
    "category": "adventure beach nature",
    "tags": [
      "Adventure",
      "Nature"
    ],
    "best": "Best: Nov-Mar",
    "image": "nature",
    "desc": "Mountains, beaches, coastal routes, wildlife, and city views.",
    "detail": "Explore Table Mountain, beaches, coastal drives, vineyards, and local experiences."
  },
  {
    "name": "Barcelona, Spain",
    "price": "From Rs. 86,000",
    "category": "beach culture city",
    "tags": [
      "Beach",
      "Culture"
    ],
    "best": "Best: May-Jun",
    "image": "city",
    "desc": "Architecture, beaches, food streets, and creative city life.",
    "detail": "Visit Sagrada Familia, beaches, Gothic Quarter, markets, and evening plazas."
  },
  {
    "name": "Venice, Italy",
    "price": "From Rs. 78,000",
    "category": "romantic culture",
    "tags": [
      "Romantic",
      "Culture"
    ],
    "best": "Best: Apr-Jun",
    "image": "romantic",
    "desc": "Canals, gondolas, old streets, and romantic views.",
    "detail": "Enjoy canal rides, old squares, island visits, cafes, and sunset walks."
  },
  {
    "name": "Prague, Czech Republic",
    "price": "From Rs. 72,000",
    "category": "culture romantic city",
    "tags": [
      "Culture",
      "Romantic"
    ],
    "best": "Best: May-Sep",
    "image": "city",
    "desc": "Castles, bridges, old town lanes, cafes, and history.",
    "detail": "Explore Prague Castle, Charles Bridge, old town squares, markets, and viewpoints."
  },
  {
    "name": "Hampi, India",
    "price": "From Rs. 16,000",
    "category": "culture adventure",
    "tags": [
      "Culture",
      "Adventure"
    ],
    "best": "Best: Oct-Feb",
    "image": "culture",
    "desc": "Ancient ruins, boulders, temples, and unique landscapes.",
    "detail": "Visit heritage ruins, river spots, viewpoints, temples, and relaxed backpacker cafes."
  },
  {
    "name": "Mysore, India",
    "price": "From Rs. 14,000",
    "category": "culture family",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Oct-Mar",
    "image": "culture",
    "desc": "Palaces, gardens, temples, food, and weekend comfort.",
    "detail": "Explore Mysore Palace, Brindavan Gardens, markets, temples, and local food."
  },
  {
    "name": "Ooty, India",
    "price": "From Rs. 18,000",
    "category": "nature family romantic",
    "tags": [
      "Nature",
      "Family"
    ],
    "best": "Best: Oct-Jun",
    "image": "nature",
    "desc": "Tea gardens, lakes, viewpoints, and cool-weather stays.",
    "detail": "Enjoy botanical gardens, lake boating, tea estates, toy train rides, and hill views."
  },
  {
    "name": "Coorg, India",
    "price": "From Rs. 20,000",
    "category": "nature romantic family",
    "tags": [
      "Nature",
      "Romantic"
    ],
    "best": "Best: Oct-Mar",
    "image": "nature",
    "desc": "Coffee estates, waterfalls, forest stays, and scenic roads.",
    "detail": "Plan coffee plantation walks, waterfalls, viewpoints, local food, and peaceful stays."
  },
  {
    "name": "Rishikesh, India",
    "price": "From Rs. 17,000",
    "category": "adventure culture",
    "tags": [
      "Adventure",
      "Culture"
    ],
    "best": "Best: Sep-Apr",
    "image": "adventure",
    "desc": "River rafting, yoga, cafes, temples, and mountain views.",
    "detail": "Try rafting, riverside cafes, yoga centers, suspension bridges, and evening aarti."
  },
  {
    "name": "Varanasi, India",
    "price": "From Rs. 18,000",
    "category": "culture family",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Oct-Mar",
    "image": "culture",
    "desc": "Ghats, spiritual walks, boat rides, and heritage lanes.",
    "detail": "Experience sunrise boat rides, temple walks, evening aarti, local food, and old lanes."
  },
  {
    "name": "Udaipur, India",
    "price": "From Rs. 24,000",
    "category": "romantic culture family",
    "tags": [
      "Romantic",
      "Culture"
    ],
    "best": "Best: Oct-Mar",
    "image": "romantic",
    "desc": "Lakes, palaces, rooftop cafes, markets, and royal stays.",
    "detail": "Visit City Palace, lakes, heritage hotels, markets, boat rides, and sunset points."
  },
  {
    "name": "Jaisalmer, India",
    "price": "From Rs. 28,000",
    "category": "adventure culture romantic",
    "tags": [
      "Adventure",
      "Culture"
    ],
    "best": "Best: Nov-Feb",
    "image": "desert",
    "desc": "Desert camps, forts, dunes, music, and heritage stays.",
    "detail": "Enjoy dune safari, desert camp, fort walks, cultural nights, and market visits."
  },
  {
    "name": "Darjeeling, India",
    "price": "From Rs. 25,000",
    "category": "nature family romantic",
    "tags": [
      "Nature",
      "Family"
    ],
    "best": "Best: Mar-May",
    "image": "nature",
    "desc": "Tea estates, mountain views, toy train, and cafes.",
    "detail": "Visit tea gardens, Tiger Hill, toy train routes, monasteries, and local cafes."
  },
  {
    "name": "Shillong, India",
    "price": "From Rs. 30,000",
    "category": "nature adventure family",
    "tags": [
      "Nature",
      "Adventure"
    ],
    "best": "Best: Oct-Apr",
    "image": "nature",
    "desc": "Waterfalls, lakes, caves, scenic roads, and fresh weather.",
    "detail": "Explore waterfalls, caves, viewpoints, local markets, and day trips around Meghalaya."
  },
  {
    "name": "Pondicherry, India",
    "price": "From Rs. 17,000",
    "category": "beach culture romantic",
    "tags": [
      "Beach",
      "Culture"
    ],
    "best": "Best: Oct-Mar",
    "image": "beach",
    "desc": "French streets, beaches, cafes, art, and slow travel.",
    "detail": "Walk through White Town, visit beaches, cafes, Auroville, and heritage streets."
  },
  {
    "name": "Lakshadweep, India",
    "price": "From Rs. 55,000",
    "category": "beach romantic adventure",
    "tags": [
      "Beach",
      "Adventure"
    ],
    "best": "Best: Oct-May",
    "image": "beach",
    "desc": "Blue lagoons, coral islands, snorkeling, and quiet beaches.",
    "detail": "Plan island stays, water activities, lagoon views, beach walks, and peaceful evenings."
  },
  {
    "name": "Mauritius",
    "price": "From Rs. 95,000",
    "category": "beach romantic family",
    "tags": [
      "Beach",
      "Romantic"
    ],
    "best": "Best: May-Dec",
    "image": "beach",
    "desc": "Island resorts, beaches, waterfalls, and scenic coastal drives.",
    "detail": "Enjoy resort stays, beach activities, nature parks, shopping, and coastal sightseeing."
  },
  {
    "name": "Baku, Azerbaijan",
    "price": "From Rs. 68,000",
    "category": "city culture family",
    "tags": [
      "City",
      "Culture"
    ],
    "best": "Best: Apr-Jun",
    "image": "city",
    "desc": "Modern skyline, old city lanes, food, and Caspian views.",
    "detail": "Visit Flame Towers, old city, boulevard, museums, markets, and day trips."
  },
  {
    "name": "Kathmandu, Nepal",
    "price": "From Rs. 35,000",
    "category": "culture adventure family",
    "tags": [
      "Culture",
      "Adventure"
    ],
    "best": "Best: Sep-Nov",
    "image": "culture",
    "desc": "Temples, mountain views, local markets, and short hikes.",
    "detail": "Explore heritage squares, stupas, local food, nearby viewpoints, and cultural walks."
  },
  {
    "name": "Bhutan",
    "price": "From Rs. 58,000",
    "category": "culture nature family",
    "tags": [
      "Culture",
      "Nature"
    ],
    "best": "Best: Mar-May",
    "image": "nature",
    "desc": "Monasteries, valleys, peaceful towns, and scenic drives.",
    "detail": "Visit Paro, Thimphu, Punakha, monasteries, viewpoints, and calm mountain valleys."
  },
  {
    "name": "Vietnam",
    "price": "From Rs. 62,000",
    "category": "culture family adventure",
    "tags": [
      "Culture",
      "Family"
    ],
    "best": "Best: Feb-Apr",
    "image": "culture",
    "desc": "Cities, food streets, bays, lantern towns, and history.",
    "detail": "Plan Hanoi, Ha Long Bay, Da Nang, Hoi An, local markets, and food walks."
  },
  {
    "name": "Malaysia",
    "price": "From Rs. 45,000",
    "category": "family city culture",
    "tags": [
      "Family",
      "Culture"
    ],
    "best": "Best: Dec-Apr",
    "image": "city",
    "desc": "City attractions, islands, shopping, food, and family fun.",
    "detail": "Visit Kuala Lumpur, Genting, Langkawi, malls, theme parks, and food streets."
  },
  {
    "name": "Hong Kong",
    "price": "From Rs. 82,000",
    "category": "city family culture",
    "tags": [
      "City",
      "Family"
    ],
    "best": "Best: Oct-Dec",
    "image": "city",
    "desc": "Skyline views, shopping, theme parks, and harbor nights.",
    "detail": "Enjoy Victoria Peak, harbor views, Disneyland, markets, and city food spots."
  },
  {
    "name": "Doha, Qatar",
    "price": "From Rs. 60,000",
    "category": "city family culture",
    "tags": [
      "City",
      "Family"
    ],
    "best": "Best: Nov-Mar",
    "image": "city",
    "desc": "Museums, skyline, desert experiences, souqs, and waterfronts.",
    "detail": "Visit Souq Waqif, museums, skyline points, desert activities, and waterfront walks."
  }
];
  const basePackages = [
  {
    "id": "premium-bali-tour",
    "title": "Premium Bali Tour",
    "name": "Premium Bali Tour",
    "destination": "Bali, Indonesia",
    "price": 40000,
    "amount": 40000,
    "priceText": "Rs. 40,000",
    "duration": "5 Days / 4 Nights",
    "days": 5,
    "tags": [
      "Beach",
      "Romantic",
      "Luxury",
      "International"
    ],
    "category": "beach romantic luxury international",
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Bali beach tour",
    "description": "Couples and beach lovers",
    "features": [
      "Includes hotel accommodation",
      "Airport pickup and local transport",
      "Guided sightseeing and beach activities"
    ],
    "inclusions": [
      "Includes hotel accommodation",
      "Airport pickup and local transport",
      "Guided sightseeing and beach activities"
    ],
    "bestFor": "Couples and beach lovers",
    "bestTimeToVisit": "Apr-Oct",
    "popularity": 92,
    "group": true
  },
  {
    "id": "paris-city-escape",
    "title": "Paris City Escape",
    "name": "Paris City Escape",
    "destination": "Paris, France",
    "price": 62000,
    "amount": 62000,
    "priceText": "Rs. 62,000",
    "duration": "4 Days / 3 Nights",
    "days": 4,
    "tags": [
      "Romantic",
      "Luxury",
      "International"
    ],
    "category": "romantic luxury international",
    "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Paris city tour",
    "description": "Romantic city travel",
    "features": [
      "Comfort hotel stay",
      "City tour and landmark visits",
      "Museum and evening river experience"
    ],
    "inclusions": [
      "Comfort hotel stay",
      "City tour and landmark visits",
      "Museum and evening river experience"
    ],
    "bestFor": "Romantic city travel",
    "bestTimeToVisit": "Apr-Jun",
    "popularity": 86,
    "group": false
  },
  {
    "id": "goa-beach-escape",
    "title": "Goa Beach Escape",
    "name": "Goa Beach Escape",
    "destination": "Goa, India",
    "price": 18000,
    "amount": 18000,
    "priceText": "Rs. 18,000",
    "duration": "3 Days / 2 Nights",
    "days": 3,
    "tags": [
      "Beach",
      "Budget",
      "Family"
    ],
    "category": "beach budget family",
    "image": "services1.jpg",
    "imageAlt": "Goa beach package",
    "description": "Budget beach trips",
    "features": [
      "Beachside accommodation",
      "Local transport and sightseeing",
      "Water sports assistance"
    ],
    "inclusions": [
      "Beachside accommodation",
      "Local transport and sightseeing",
      "Water sports assistance"
    ],
    "bestFor": "Budget beach trips",
    "bestTimeToVisit": "Nov-Feb",
    "popularity": 96,
    "group": true
  },
  {
    "id": "manali-adventure-holiday",
    "title": "Manali Adventure Holiday",
    "name": "Manali Adventure Holiday",
    "destination": "Manali, India",
    "price": 24000,
    "amount": 24000,
    "priceText": "Rs. 24,000",
    "duration": "4 Days / 3 Nights",
    "days": 4,
    "tags": [
      "Adventure",
      "Family",
      "Budget",
      "Hill Station"
    ],
    "category": "adventure family budget hill station",
    "image": "services2.jpg",
    "imageAlt": "Manali mountain package",
    "description": "Friends and families",
    "features": [
      "Mountain view hotel stay",
      "Local sightseeing and transport",
      "Adventure activity assistance"
    ],
    "inclusions": [
      "Mountain view hotel stay",
      "Local sightseeing and transport",
      "Adventure activity assistance"
    ],
    "bestFor": "Friends and families",
    "bestTimeToVisit": "Oct-Feb",
    "popularity": 90,
    "group": true
  },
  {
    "id": "santorini-honeymoon-tour",
    "title": "Santorini Honeymoon Tour",
    "name": "Santorini Honeymoon Tour",
    "destination": "Santorini, Greece",
    "price": 75000,
    "amount": 75000,
    "priceText": "Rs. 75,000",
    "duration": "5 Days / 4 Nights",
    "days": 5,
    "tags": [
      "Honeymoon",
      "Romantic",
      "Luxury",
      "International",
      "Beach"
    ],
    "category": "honeymoon romantic luxury international beach",
    "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Santorini island package",
    "description": "Honeymoon travel",
    "features": [
      "Sea view accommodation",
      "Island tour and sunset point visit",
      "Airport transfers included"
    ],
    "inclusions": [
      "Sea view accommodation",
      "Island tour and sunset point visit",
      "Airport transfers included"
    ],
    "bestFor": "Honeymoon travel",
    "bestTimeToVisit": "Apr-Oct",
    "popularity": 82,
    "group": false
  },
  {
    "id": "dubai-desert-luxury",
    "title": "Dubai Desert Luxury",
    "name": "Dubai Desert Luxury",
    "destination": "Dubai, UAE",
    "price": 58000,
    "amount": 58000,
    "priceText": "Rs. 58,000",
    "duration": "4 Days / 3 Nights",
    "days": 4,
    "tags": [
      "Luxury",
      "Family",
      "International",
      "Adventure"
    ],
    "category": "luxury family international adventure",
    "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Dubai city package",
    "description": "Families and shopping",
    "features": [
      "Premium hotel stay",
      "Desert safari and city tour",
      "Airport pickup and drop"
    ],
    "inclusions": [
      "Premium hotel stay",
      "Desert safari and city tour",
      "Airport pickup and drop"
    ],
    "bestFor": "Families and shopping",
    "bestTimeToVisit": "Nov-Mar",
    "popularity": 89,
    "group": false
  },
  {
    "id": "singapore-family-fun",
    "title": "Singapore Family Fun",
    "name": "Singapore Family Fun",
    "destination": "Singapore",
    "price": 50000,
    "amount": 50000,
    "priceText": "Rs. 50,000",
    "duration": "4 Days / 3 Nights",
    "days": 4,
    "tags": [
      "Family",
      "International",
      "Luxury"
    ],
    "category": "family international luxury",
    "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Singapore family package",
    "description": "Family city holidays",
    "features": [
      "Family-friendly hotel stay",
      "Sentosa and city attractions",
      "Daily breakfast and transfers"
    ],
    "inclusions": [
      "Family-friendly hotel stay",
      "Sentosa and city attractions",
      "Daily breakfast and transfers"
    ],
    "bestFor": "Family city holidays",
    "bestTimeToVisit": "Feb-Apr",
    "popularity": 84,
    "group": true
  },
  {
    "id": "tokyo-culture-tour",
    "title": "Tokyo Culture Tour",
    "name": "Tokyo Culture Tour",
    "destination": "Tokyo, Japan",
    "price": 85000,
    "amount": 85000,
    "priceText": "Rs. 85,000",
    "duration": "6 Days / 5 Nights",
    "days": 6,
    "tags": [
      "Adventure",
      "Family",
      "International"
    ],
    "category": "adventure family international",
    "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Tokyo culture package",
    "description": "Culture and food",
    "features": [
      "Comfort city hotel",
      "Temple, market, and city tours",
      "Local transport support"
    ],
    "inclusions": [
      "Comfort city hotel",
      "Temple, market, and city tours",
      "Local transport support"
    ],
    "bestFor": "Culture and food",
    "bestTimeToVisit": "Mar-May",
    "popularity": 80,
    "group": false
  },
  {
    "id": "new-york-city-explorer",
    "title": "New York City Explorer",
    "name": "New York City Explorer",
    "destination": "New York, USA",
    "price": 98000,
    "amount": 98000,
    "priceText": "Rs. 98,000",
    "duration": "5 Days / 4 Nights",
    "days": 5,
    "tags": [
      "Luxury",
      "Family",
      "International"
    ],
    "category": "luxury family international",
    "image": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "New York city package",
    "description": "City explorers",
    "features": [
      "Central city hotel stay",
      "Landmark and museum visits",
      "Guided city experience"
    ],
    "inclusions": [
      "Central city hotel stay",
      "Landmark and museum visits",
      "Guided city experience"
    ],
    "bestFor": "City explorers",
    "bestTimeToVisit": "Apr-Jun",
    "popularity": 78,
    "group": false
  },
  {
    "id": "rome-heritage-journey",
    "title": "Rome Heritage Journey",
    "name": "Rome Heritage Journey",
    "destination": "Rome, Italy",
    "price": 70000,
    "amount": 70000,
    "priceText": "Rs. 70,000",
    "duration": "5 Days / 4 Nights",
    "days": 5,
    "tags": [
      "Romantic",
      "International"
    ],
    "category": "romantic international",
    "image": "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Rome heritage package",
    "description": "History and food",
    "features": [
      "Historic city accommodation",
      "Monument and food walk tour",
      "Airport transfers included"
    ],
    "inclusions": [
      "Historic city accommodation",
      "Monument and food walk tour",
      "Airport transfers included"
    ],
    "bestFor": "History and food",
    "bestTimeToVisit": "Apr-Jun",
    "popularity": 81,
    "group": false
  },
  {
    "id": "kerala-backwater-retreat",
    "title": "Kerala Backwater Retreat",
    "name": "Kerala Backwater Retreat",
    "destination": "Kerala, India",
    "price": 26000,
    "amount": 26000,
    "priceText": "Rs. 26,000",
    "duration": "4 Days / 3 Nights",
    "days": 4,
    "tags": [
      "Family",
      "Romantic",
      "Budget"
    ],
    "category": "family romantic budget",
    "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Kerala backwater package",
    "description": "Slow family travel",
    "features": [
      "Houseboat and resort stay",
      "Backwater cruise experience",
      "Local sightseeing and meals"
    ],
    "inclusions": [
      "Houseboat and resort stay",
      "Backwater cruise experience",
      "Local sightseeing and meals"
    ],
    "bestFor": "Slow family travel",
    "bestTimeToVisit": "Sep-Mar",
    "popularity": 87,
    "group": false
  },
  {
    "id": "maldives-island-stay",
    "title": "Maldives Island Stay",
    "name": "Maldives Island Stay",
    "destination": "Maldives",
    "price": 90000,
    "amount": 90000,
    "priceText": "Rs. 90,000",
    "duration": "5 Days / 4 Nights",
    "days": 5,
    "tags": [
      "Beach",
      "Honeymoon",
      "Luxury",
      "International"
    ],
    "category": "beach honeymoon luxury international",
    "image": "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Maldives island package",
    "description": "Honeymoon and luxury",
    "features": [
      "Beach resort accommodation",
      "Speedboat transfers",
      "Snorkeling and leisure time"
    ],
    "inclusions": [
      "Beach resort accommodation",
      "Speedboat transfers",
      "Snorkeling and leisure time"
    ],
    "bestFor": "Honeymoon and luxury",
    "bestTimeToVisit": "Nov-Apr",
    "popularity": 88,
    "group": false
  },
  {
    "id": "rajasthan-royal-tour",
    "title": "Rajasthan Royal Tour",
    "name": "Rajasthan Royal Tour",
    "destination": "Rajasthan, India",
    "price": 35000,
    "amount": 35000,
    "priceText": "Rs. 35,000",
    "duration": "6 Days / 5 Nights",
    "days": 6,
    "tags": [
      "Family",
      "Budget"
    ],
    "category": "family budget culture heritage",
    "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&auto=format&fit=crop&q=70",
    "imageAlt": "Rajasthan palace package",
    "description": "Culture and heritage",
    "features": [
      "Heritage hotel stays",
      "Fort, palace, and market tours",
      "Private transport included"
    ],
    "inclusions": [
      "Heritage hotel stays",
      "Fort, palace, and market tours",
      "Private transport included"
    ],
    "bestFor": "Culture and heritage",
    "bestTimeToVisit": "Oct-Mar",
    "popularity": 85,
    "group": true
  }
];
  const extraPackages = [
  {
    "title": "Kerala Backwater Deluxe",
    "destination": "Kerala, India",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 30,000",
    "amount": 30000,
    "image": "nature",
    "group": true,
    "features": [
      "Houseboat stay",
      "Backwater cruise",
      "Meals and local sightseeing"
    ]
  },
  {
    "title": "Jaipur Heritage Break",
    "destination": "Jaipur, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 20,000",
    "amount": 20000,
    "image": "desert",
    "group": true,
    "features": [
      "Heritage hotel",
      "Fort and palace tour",
      "Market visit"
    ]
  },
  {
    "title": "Kashmir Valley Escape",
    "destination": "Kashmir, India",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 38,000",
    "amount": 38000,
    "image": "adventure",
    "group": true,
    "features": [
      "Houseboat experience",
      "Gulmarg day trip",
      "Private transfers"
    ]
  },
  {
    "title": "Ladakh Road Adventure",
    "destination": "Ladakh, India",
    "duration": "6 Days / 5 Nights",
    "price": "Rs. 48,000",
    "amount": 48000,
    "image": "adventure",
    "group": true,
    "features": [
      "Nubra and Pangong",
      "Monastery visits",
      "Adventure route support"
    ]
  },
  {
    "title": "Andaman Island Holiday",
    "destination": "Andaman, India",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 52,000",
    "amount": 52000,
    "image": "beach",
    "group": true,
    "features": [
      "Havelock stay",
      "Ferry transfers",
      "Snorkeling assistance"
    ]
  },
  {
    "title": "Phuket Island Fun",
    "destination": "Phuket, Thailand",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 48,000",
    "amount": 48000,
    "image": "beach",
    "group": false,
    "features": [
      "Island tour",
      "Beach stay",
      "Airport transfers"
    ]
  },
  {
    "title": "Bangkok Shopping Tour",
    "destination": "Bangkok, Thailand",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 42,000",
    "amount": 42000,
    "image": "city",
    "group": true,
    "features": [
      "City hotel",
      "Temple tour",
      "Shopping route"
    ]
  },
  {
    "title": "London Classic Explorer",
    "destination": "London, UK",
    "duration": "6 Days / 5 Nights",
    "price": "Rs. 118,000",
    "amount": 118000,
    "image": "city",
    "group": false,
    "features": [
      "Landmark tour",
      "Museum visits",
      "Transport support"
    ]
  },
  {
    "title": "Swiss Alps Scenic Tour",
    "destination": "Swiss Alps, Switzerland",
    "duration": "6 Days / 5 Nights",
    "price": "Rs. 135,000",
    "amount": 135000,
    "image": "adventure",
    "group": false,
    "features": [
      "Scenic train",
      "Mountain day trip",
      "Lake city stay"
    ]
  },
  {
    "title": "Amsterdam Canal Holiday",
    "destination": "Amsterdam, Netherlands",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 92,000",
    "amount": 92000,
    "image": "city",
    "group": false,
    "features": [
      "Canal cruise",
      "Museum route",
      "Central hotel"
    ]
  },
  {
    "title": "Istanbul Culture Tour",
    "destination": "Istanbul, Turkey",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 78,000",
    "amount": 78000,
    "image": "culture",
    "group": true,
    "features": [
      "Old city tour",
      "Bosphorus cruise",
      "Market walk"
    ]
  },
  {
    "title": "Seoul City Lights",
    "destination": "Seoul, South Korea",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 90,000",
    "amount": 90000,
    "image": "city",
    "group": false,
    "features": [
      "Palace visits",
      "Shopping streets",
      "Cafe districts"
    ]
  },
  {
    "title": "Sydney Harbor Trip",
    "destination": "Sydney, Australia",
    "duration": "6 Days / 5 Nights",
    "price": "Rs. 128,000",
    "amount": 128000,
    "image": "city",
    "group": false,
    "features": [
      "Harbor tour",
      "Beach day",
      "City attractions"
    ]
  },
  {
    "title": "Queenstown Adventure",
    "destination": "Queenstown, New Zealand",
    "duration": "6 Days / 5 Nights",
    "price": "Rs. 140,000",
    "amount": 140000,
    "image": "adventure",
    "group": false,
    "features": [
      "Adventure activities",
      "Lake stay",
      "Scenic drives"
    ]
  },
  {
    "title": "Cairo Pyramid Journey",
    "destination": "Cairo, Egypt",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 86,000",
    "amount": 86000,
    "image": "desert",
    "group": true,
    "features": [
      "Pyramid visit",
      "Museum tour",
      "Nile evening"
    ]
  },
  {
    "title": "Cape Town Nature Tour",
    "destination": "Cape Town, South Africa",
    "duration": "6 Days / 5 Nights",
    "price": "Rs. 110,000",
    "amount": 110000,
    "image": "nature",
    "group": false,
    "features": [
      "Table Mountain",
      "Coastal drive",
      "City stay"
    ]
  },
  {
    "title": "Barcelona Beach City",
    "destination": "Barcelona, Spain",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 88,000",
    "amount": 88000,
    "image": "city",
    "group": true,
    "features": [
      "City tour",
      "Beach time",
      "Food market visit"
    ]
  },
  {
    "title": "Venice Romantic Stay",
    "destination": "Venice, Italy",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 80,000",
    "amount": 80000,
    "image": "romantic",
    "group": false,
    "features": [
      "Canal ride",
      "Island visit",
      "Central stay"
    ]
  },
  {
    "title": "Prague Old Town Tour",
    "destination": "Prague, Czech Republic",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 74,000",
    "amount": 74000,
    "image": "city",
    "group": true,
    "features": [
      "Castle route",
      "Old town walk",
      "Cafe evenings"
    ]
  },
  {
    "title": "Hampi Heritage Trail",
    "destination": "Hampi, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 16,000",
    "amount": 16000,
    "image": "culture",
    "group": true,
    "features": [
      "Ruins tour",
      "Temple visits",
      "Local transport"
    ]
  },
  {
    "title": "Mysore Palace Weekend",
    "destination": "Mysore, India",
    "duration": "2 Days / 1 Night",
    "price": "Rs. 14,000",
    "amount": 14000,
    "image": "culture",
    "group": true,
    "features": [
      "Palace visit",
      "Garden evening",
      "Food stops"
    ]
  },
  {
    "title": "Ooty Hill Station",
    "destination": "Ooty, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 18,000",
    "amount": 18000,
    "image": "nature",
    "group": true,
    "features": [
      "Hill stay",
      "Lake visit",
      "Tea garden route"
    ]
  },
  {
    "title": "Coorg Coffee Retreat",
    "destination": "Coorg, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 21,000",
    "amount": 21000,
    "image": "nature",
    "group": true,
    "features": [
      "Coffee estate stay",
      "Waterfall visit",
      "Nature walks"
    ]
  },
  {
    "title": "Rishikesh River Adventure",
    "destination": "Rishikesh, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 19,000",
    "amount": 19000,
    "image": "adventure",
    "group": true,
    "features": [
      "Rafting support",
      "Cafe walk",
      "Evening aarti"
    ]
  },
  {
    "title": "Varanasi Spiritual Trip",
    "destination": "Varanasi, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 18,000",
    "amount": 18000,
    "image": "culture",
    "group": true,
    "features": [
      "Boat ride",
      "Ghat walk",
      "Temple route"
    ]
  },
  {
    "title": "Udaipur Lake Holiday",
    "destination": "Udaipur, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 26,000",
    "amount": 26000,
    "image": "romantic",
    "group": true,
    "features": [
      "Lake view stay",
      "Palace visit",
      "Boat ride"
    ]
  },
  {
    "title": "Jaisalmer Desert Camp",
    "destination": "Jaisalmer, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 28,000",
    "amount": 28000,
    "image": "desert",
    "group": true,
    "features": [
      "Desert camp",
      "Dune safari",
      "Cultural night"
    ]
  },
  {
    "title": "Darjeeling Tea Trail",
    "destination": "Darjeeling, India",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 27,000",
    "amount": 27000,
    "image": "nature",
    "group": true,
    "features": [
      "Tea gardens",
      "Toy train",
      "Tiger Hill"
    ]
  },
  {
    "title": "Shillong Waterfall Tour",
    "destination": "Shillong, India",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 34,000",
    "amount": 34000,
    "image": "nature",
    "group": true,
    "features": [
      "Waterfalls",
      "Caves",
      "Scenic drives"
    ]
  },
  {
    "title": "Pondicherry Cafe Break",
    "destination": "Pondicherry, India",
    "duration": "3 Days / 2 Nights",
    "price": "Rs. 17,000",
    "amount": 17000,
    "image": "beach",
    "group": true,
    "features": [
      "White Town stay",
      "Beach time",
      "Auroville visit"
    ]
  },
  {
    "title": "Lakshadweep Lagoon Plan",
    "destination": "Lakshadweep, India",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 58,000",
    "amount": 58000,
    "image": "beach",
    "group": false,
    "features": [
      "Island stay",
      "Lagoon view",
      "Water activities"
    ]
  },
  {
    "title": "Mauritius Island Escape",
    "destination": "Mauritius",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 98,000",
    "amount": 98000,
    "image": "beach",
    "group": false,
    "features": [
      "Resort stay",
      "Island tour",
      "Beach activities"
    ]
  },
  {
    "title": "Baku City Break",
    "destination": "Baku, Azerbaijan",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 70,000",
    "amount": 70000,
    "image": "city",
    "group": true,
    "features": [
      "Old city tour",
      "Boulevard walk",
      "Day trip support"
    ]
  },
  {
    "title": "Kathmandu Valley Tour",
    "destination": "Kathmandu, Nepal",
    "duration": "4 Days / 3 Nights",
    "price": "Rs. 36,000",
    "amount": 36000,
    "image": "culture",
    "group": true,
    "features": [
      "Temple route",
      "Market walk",
      "Viewpoint visit"
    ]
  },
  {
    "title": "Bhutan Peaceful Journey",
    "destination": "Bhutan",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 62,000",
    "amount": 62000,
    "image": "nature",
    "group": false,
    "features": [
      "Valley drives",
      "Monastery visits",
      "Culture walks"
    ]
  },
  {
    "title": "Vietnam Discovery",
    "destination": "Vietnam",
    "duration": "6 Days / 5 Nights",
    "price": "Rs. 66,000",
    "amount": 66000,
    "image": "culture",
    "group": true,
    "features": [
      "City route",
      "Bay cruise",
      "Food walks"
    ]
  },
  {
    "title": "Malaysia Family Holiday",
    "destination": "Malaysia",
    "duration": "5 Days / 4 Nights",
    "price": "Rs. 48,000",
    "amount": 48000,
    "image": "family",
    "group": true,
    "features": [
      "Kuala Lumpur",
      "Genting day trip",
      "Shopping support"
    ]
  }
];
  const budgetDestinations = [
  {
    "name": "Bali, Indonesia",
    "base": 22000,
    "flight": 28000,
    "international": true
  },
  {
    "name": "Paris, France",
    "base": 34000,
    "flight": 40000,
    "international": true
  },
  {
    "name": "Goa, India",
    "base": 9000,
    "flight": 15000,
    "international": false
  },
  {
    "name": "Manali, India",
    "base": 12000,
    "flight": 17000,
    "international": false
  },
  {
    "name": "Santorini, Greece",
    "base": 38000,
    "flight": 40000,
    "international": true
  },
  {
    "name": "Dubai, UAE",
    "base": 28000,
    "flight": 26000,
    "international": true
  },
  {
    "name": "Singapore",
    "base": 25000,
    "flight": 24000,
    "international": true
  },
  {
    "name": "Tokyo, Japan",
    "base": 37000,
    "flight": 39000,
    "international": true
  },
  {
    "name": "New York, USA",
    "base": 44000,
    "flight": 40000,
    "international": true
  },
  {
    "name": "Rome, Italy",
    "base": 33000,
    "flight": 39000,
    "international": true
  },
  {
    "name": "Kerala, India",
    "base": 13000,
    "flight": 16000,
    "international": false
  },
  {
    "name": "Maldives",
    "base": 41000,
    "flight": 30000,
    "international": true
  },
  {
    "name": "Rajasthan, India",
    "base": 16000,
    "flight": 17000,
    "international": false
  }
];

  function slug(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

  function parseAmount(value) { return Number(String(value || '').replace(/[^\d]/g, '')) || 0; }

  function normalizeDestination(item) { const amount = item.amount || parseAmount(item.price); const tags = Array.isArray(item.tags) ? item.tags : []; return { ...item, id: item.id || slug(item.name || item.destination), destination: item.destination || item.name, amount, description: item.description || item.desc || '', desc: item.desc || item.description || '', category: item.category || tags.join(' ').toLowerCase(), bestTimeToVisit: item.bestTimeToVisit || String(item.best || '').replace(/^Best:\s*/i, ''), imageAlt: item.imageAlt || `${item.name || item.destination} travel view` }; }

  function inferPackageTags(item) { if (Array.isArray(item.tags) && item.tags.length) return item.tags; const tags = []; const text = `${item.title || item.name || ''} ${item.destination || ''} ${item.image || ''}`.toLowerCase(); if (/beach|island|lagoon|andaman|phuket|mauritius|lakshadweep|pondicherry/.test(text)) tags.push('Beach'); if (/adventure|ladakh|rishikesh|queenstown|mountain|waterfall|cape town/.test(text)) tags.push('Adventure'); if (/family|mysore|malaysia|singapore/.test(text) || item.group) tags.push('Family'); if (/romantic|honeymoon|venice|udaipur|coorg/.test(text)) tags.push('Romantic'); if (/london|swiss|sydney|new york|maldives|luxury/.test(text)) tags.push('Luxury'); if (Number(item.amount || item.price || 0) <= 30000) tags.push('Budget'); if (!/india|bhutan|nepal/.test(String(item.destination || '').toLowerCase())) tags.push('International'); if (!tags.length) tags.push('Culture'); return Array.from(new Set(tags)); }

  function normalizePackage(item) { const amount = Number(item.amount || item.price || 0) || parseAmount(item.priceText); const tags = inferPackageTags(item); const title = item.title || item.name; return { ...item, id: item.id || slug(title), title, name: item.name || title, amount, price: Number(item.price || amount), priceText: item.priceText || `Rs. ${amount.toLocaleString('en-IN')}`, category: item.category || tags.join(' ').toLowerCase(), tags, description: item.description || item.bestFor || (item.features && item.features[0]) || '', features: item.features || item.inclusions || [], inclusions: item.inclusions || item.features || [], bestFor: item.bestFor || (item.features && item.features[0]) || 'Flexible travelers', bestTimeToVisit: item.bestTimeToVisit || '', days: item.days || parseAmount(String(item.duration).split(' ')[0]), imageAlt: item.imageAlt || `${title} package view`, group: Boolean(item.group) }; }

  const normalizedBaseDestinations = baseDestinations.map(normalizeDestination);
  const normalizedExtraDestinations = extraDestinations.map(normalizeDestination);
  const normalizedBasePackages = basePackages.map(normalizePackage);
  const normalizedExtraPackages = extraPackages.map(normalizePackage);

  window.TRAVEL_DATA = {
    destinationImages,
    baseDestinations: normalizedBaseDestinations,
    extraDestinations: normalizedExtraDestinations,
    destinations: normalizedBaseDestinations.concat(normalizedExtraDestinations),
    basePackages: normalizedBasePackages,
    extraPackages: normalizedExtraPackages,
    packages: normalizedBasePackages.concat(normalizedExtraPackages),
    budgetDestinations,
    featuredPackageTitles: ['Premium Bali Tour', 'Manali Adventure Holiday', 'Dubai Desert Luxury'],
    trendingPackageTitles: ['Goa Beach Escape', 'Kerala Backwater Retreat', 'Maldives Island Stay', 'Rajasthan Royal Tour', 'Singapore Family Fun'],
    dataDiscrepancies: [
      'index.html used Bali Premium Tour while the package catalog uses Premium Bali Tour.',
      'index.html used Kerala Backwater Escape while the package catalog uses Kerala Backwater Retreat.',
    ],
  };
})();
