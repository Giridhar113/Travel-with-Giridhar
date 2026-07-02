const destinationSearch = document.getElementById("destinationSearch");
let destinationCards = document.querySelectorAll(".destination-card");
const noDestinations = document.getElementById("noDestinations");
const savedCount = document.getElementById("savedCount");
const clearSavedButton = document.getElementById("clearSaved");
const filterChips = document.querySelectorAll(".filter-chip");
const filterStatus = document.getElementById("filterStatus");
const destinationBudgetFilter = document.getElementById("destinationBudgetFilter");
const destinationSeasonFilter = document.getElementById("destinationSeasonFilter");
const savedDestinationsKey = "travelGuideSavedDestinations";
const themePreferenceKey = "travelGuideTheme";
let activeDestinationFilter = "all";

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRupeeAmount(value) {
  return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
}

function getDestinationSeasonTokens(card) {
  if (card.dataset.season) {
    return normalizeSearchText(card.dataset.season).split(" ").filter(Boolean);
  }

  const seasonText = normalizeSearchText(
    card.querySelector(".best-time") ? card.querySelector(".best-time").textContent : ""
  );
  const tokens = [];

  if (/oct|nov|dec|jan|feb|mar/.test(seasonText)) {
    tokens.push("oct-mar");
  }

  if (/apr|may|jun/.test(seasonText)) {
    tokens.push("apr-jun");
  }

  if (/jul|aug|sep/.test(seasonText)) {
    tokens.push("jul-sep");
  }

  card.dataset.season = tokens.join(" ");
  return tokens;
}

function refreshDestinationCards() {
  destinationCards = document.querySelectorAll("#destinationsGrid .destination-card");
  return Array.from(destinationCards);
}

function getStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

const destinationImages = {
  beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=70",
  adventure:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=70",
  culture:
    "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=700&auto=format&fit=crop&q=70",
  city:
    "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=700&auto=format&fit=crop&q=70",
  family:
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&auto=format&fit=crop&q=70",
  romantic:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&auto=format&fit=crop&q=70",
  nature:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&auto=format&fit=crop&q=70",
  desert:
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&auto=format&fit=crop&q=70",
};

const extraDestinations = [
  { name: "Kerala, India", price: "From Rs. 26,000", category: "nature family romantic", tags: ["Nature", "Family"], best: "Best: Sep-Mar", image: "nature", desc: "Backwaters, houseboats, greenery, and peaceful resort stays.", detail: "Cruise through backwaters, enjoy local meals, visit waterfalls, and relax in calm nature resorts." },
  { name: "Jaipur, India", price: "From Rs. 20,000", category: "culture family", tags: ["Culture", "Family"], best: "Best: Oct-Mar", image: "desert", desc: "Royal palaces, forts, markets, food, and heritage stays.", detail: "Explore Amer Fort, City Palace, colorful bazaars, local food, and evening cultural experiences." },
  { name: "Kashmir, India", price: "From Rs. 32,000", category: "romantic family adventure", tags: ["Romantic", "Adventure"], best: "Best: Mar-Oct", image: "adventure", desc: "Lakes, valleys, snow views, gardens, and peaceful stays.", detail: "Enjoy Srinagar, Gulmarg, houseboats, gardens, snow activities, and scenic mountain drives." },
  { name: "Ladakh, India", price: "From Rs. 38,000", category: "adventure culture", tags: ["Adventure", "Culture"], best: "Best: May-Sep", image: "adventure", desc: "High-altitude landscapes, monasteries, lakes, and road trips.", detail: "Visit Pangong Lake, Nubra Valley, monasteries, mountain passes, and scenic desert valleys." },
  { name: "Andaman, India", price: "From Rs. 42,000", category: "beach romantic family", tags: ["Beach", "Family"], best: "Best: Oct-May", image: "beach", desc: "Clear beaches, island hopping, snorkeling, and quiet stays.", detail: "Plan Havelock, Radhanagar Beach, cellular jail visit, water activities, and relaxed island time." },
  { name: "Maldives", price: "From Rs. 90,000", category: "beach romantic", tags: ["Beach", "Romantic"], best: "Best: Nov-Apr", image: "beach", desc: "Luxury island resorts, clear water, snorkeling, and slow days.", detail: "Choose beach villas, speedboat transfers, snorkeling, sunset dinners, and peaceful island stays." },
  { name: "Phuket, Thailand", price: "From Rs. 46,000", category: "beach family adventure", tags: ["Beach", "Adventure"], best: "Best: Nov-Apr", image: "beach", desc: "Island tours, beaches, nightlife, and water adventures.", detail: "Visit Phi Phi islands, Patong, viewpoints, night markets, and beach activity spots." },
  { name: "Bangkok, Thailand", price: "From Rs. 40,000", category: "culture family city", tags: ["Culture", "Family"], best: "Best: Nov-Feb", image: "city", desc: "Temples, shopping streets, street food, and city energy.", detail: "Explore temples, floating markets, malls, local food streets, and evening river views." },
  { name: "London, UK", price: "From Rs. 110,000", category: "culture family city", tags: ["Culture", "Family"], best: "Best: Apr-Sep", image: "city", desc: "Museums, landmarks, shopping, parks, and royal sights.", detail: "Visit Big Ben, London Eye, museums, parks, shopping streets, and heritage neighborhoods." },
  { name: "Swiss Alps, Switzerland", price: "From Rs. 125,000", category: "romantic family adventure", tags: ["Romantic", "Adventure"], best: "Best: Apr-Oct", image: "adventure", desc: "Snow peaks, scenic trains, lakes, and mountain villages.", detail: "Plan Interlaken, Lucerne, Jungfrau region, lake cruises, and scenic train routes." },
  { name: "Amsterdam, Netherlands", price: "From Rs. 90,000", category: "culture romantic city", tags: ["Culture", "Romantic"], best: "Best: Apr-Oct", image: "city", desc: "Canals, museums, cycling streets, cafes, and city walks.", detail: "Enjoy canal cruises, art museums, flower markets, cycling routes, and cozy cafes." },
  { name: "Istanbul, Turkey", price: "From Rs. 75,000", category: "culture romantic family", tags: ["Culture", "Romantic"], best: "Best: Apr-Jun", image: "culture", desc: "Historic mosques, markets, Bosphorus views, and local food.", detail: "Visit Hagia Sophia, bazaars, Bosphorus cruise, heritage lanes, and Turkish food spots." },
  { name: "Seoul, South Korea", price: "From Rs. 88,000", category: "culture city family", tags: ["Culture", "Family"], best: "Best: Mar-May", image: "city", desc: "Modern streets, palaces, cafes, shopping, and culture.", detail: "Explore palaces, shopping districts, food streets, cafes, and city viewpoints." },
  { name: "Sydney, Australia", price: "From Rs. 120,000", category: "beach family city", tags: ["Beach", "Family"], best: "Best: Sep-Nov", image: "city", desc: "Harbor views, beaches, city attractions, and coastal walks.", detail: "Visit Opera House, Bondi Beach, harbor cruises, museums, and coastal neighborhoods." },
  { name: "Queenstown, New Zealand", price: "From Rs. 135,000", category: "adventure romantic nature", tags: ["Adventure", "Nature"], best: "Best: Dec-Feb", image: "adventure", desc: "Adventure sports, lakes, mountains, and scenic drives.", detail: "Enjoy lake views, adventure activities, mountain rides, day trips, and peaceful stays." },
  { name: "Cairo, Egypt", price: "From Rs. 82,000", category: "culture family adventure", tags: ["Culture", "Family"], best: "Best: Oct-Apr", image: "desert", desc: "Pyramids, museums, river views, and ancient history.", detail: "Visit pyramids, Egyptian Museum, Nile views, markets, and heritage sites." },
  { name: "Cape Town, South Africa", price: "From Rs. 105,000", category: "adventure beach nature", tags: ["Adventure", "Nature"], best: "Best: Nov-Mar", image: "nature", desc: "Mountains, beaches, coastal routes, wildlife, and city views.", detail: "Explore Table Mountain, beaches, coastal drives, vineyards, and local experiences." },
  { name: "Barcelona, Spain", price: "From Rs. 86,000", category: "beach culture city", tags: ["Beach", "Culture"], best: "Best: May-Jun", image: "city", desc: "Architecture, beaches, food streets, and creative city life.", detail: "Visit Sagrada Familia, beaches, Gothic Quarter, markets, and evening plazas." },
  { name: "Venice, Italy", price: "From Rs. 78,000", category: "romantic culture", tags: ["Romantic", "Culture"], best: "Best: Apr-Jun", image: "romantic", desc: "Canals, gondolas, old streets, and romantic views.", detail: "Enjoy canal rides, old squares, island visits, cafes, and sunset walks." },
  { name: "Prague, Czech Republic", price: "From Rs. 72,000", category: "culture romantic city", tags: ["Culture", "Romantic"], best: "Best: May-Sep", image: "city", desc: "Castles, bridges, old town lanes, cafes, and history.", detail: "Explore Prague Castle, Charles Bridge, old town squares, markets, and viewpoints." },
  { name: "Hampi, India", price: "From Rs. 16,000", category: "culture adventure", tags: ["Culture", "Adventure"], best: "Best: Oct-Feb", image: "culture", desc: "Ancient ruins, boulders, temples, and unique landscapes.", detail: "Visit heritage ruins, river spots, viewpoints, temples, and relaxed backpacker cafes." },
  { name: "Mysore, India", price: "From Rs. 14,000", category: "culture family", tags: ["Culture", "Family"], best: "Best: Oct-Mar", image: "culture", desc: "Palaces, gardens, temples, food, and weekend comfort.", detail: "Explore Mysore Palace, Brindavan Gardens, markets, temples, and local food." },
  { name: "Ooty, India", price: "From Rs. 18,000", category: "nature family romantic", tags: ["Nature", "Family"], best: "Best: Oct-Jun", image: "nature", desc: "Tea gardens, lakes, viewpoints, and cool-weather stays.", detail: "Enjoy botanical gardens, lake boating, tea estates, toy train rides, and hill views." },
  { name: "Coorg, India", price: "From Rs. 20,000", category: "nature romantic family", tags: ["Nature", "Romantic"], best: "Best: Oct-Mar", image: "nature", desc: "Coffee estates, waterfalls, forest stays, and scenic roads.", detail: "Plan coffee plantation walks, waterfalls, viewpoints, local food, and peaceful stays." },
  { name: "Rishikesh, India", price: "From Rs. 17,000", category: "adventure culture", tags: ["Adventure", "Culture"], best: "Best: Sep-Apr", image: "adventure", desc: "River rafting, yoga, cafes, temples, and mountain views.", detail: "Try rafting, riverside cafes, yoga centers, suspension bridges, and evening aarti." },
  { name: "Varanasi, India", price: "From Rs. 18,000", category: "culture family", tags: ["Culture", "Family"], best: "Best: Oct-Mar", image: "culture", desc: "Ghats, spiritual walks, boat rides, and heritage lanes.", detail: "Experience sunrise boat rides, temple walks, evening aarti, local food, and old lanes." },
  { name: "Udaipur, India", price: "From Rs. 24,000", category: "romantic culture family", tags: ["Romantic", "Culture"], best: "Best: Oct-Mar", image: "romantic", desc: "Lakes, palaces, rooftop cafes, markets, and royal stays.", detail: "Visit City Palace, lakes, heritage hotels, markets, boat rides, and sunset points." },
  { name: "Jaisalmer, India", price: "From Rs. 28,000", category: "adventure culture romantic", tags: ["Adventure", "Culture"], best: "Best: Nov-Feb", image: "desert", desc: "Desert camps, forts, dunes, music, and heritage stays.", detail: "Enjoy dune safari, desert camp, fort walks, cultural nights, and market visits." },
  { name: "Darjeeling, India", price: "From Rs. 25,000", category: "nature family romantic", tags: ["Nature", "Family"], best: "Best: Mar-May", image: "nature", desc: "Tea estates, mountain views, toy train, and cafes.", detail: "Visit tea gardens, Tiger Hill, toy train routes, monasteries, and local cafes." },
  { name: "Shillong, India", price: "From Rs. 30,000", category: "nature adventure family", tags: ["Nature", "Adventure"], best: "Best: Oct-Apr", image: "nature", desc: "Waterfalls, lakes, caves, scenic roads, and fresh weather.", detail: "Explore waterfalls, caves, viewpoints, local markets, and day trips around Meghalaya." },
  { name: "Pondicherry, India", price: "From Rs. 17,000", category: "beach culture romantic", tags: ["Beach", "Culture"], best: "Best: Oct-Mar", image: "beach", desc: "French streets, beaches, cafes, art, and slow travel.", detail: "Walk through White Town, visit beaches, cafes, Auroville, and heritage streets." },
  { name: "Lakshadweep, India", price: "From Rs. 55,000", category: "beach romantic adventure", tags: ["Beach", "Adventure"], best: "Best: Oct-May", image: "beach", desc: "Blue lagoons, coral islands, snorkeling, and quiet beaches.", detail: "Plan island stays, water activities, lagoon views, beach walks, and peaceful evenings." },
  { name: "Mauritius", price: "From Rs. 95,000", category: "beach romantic family", tags: ["Beach", "Romantic"], best: "Best: May-Dec", image: "beach", desc: "Island resorts, beaches, waterfalls, and scenic coastal drives.", detail: "Enjoy resort stays, beach activities, nature parks, shopping, and coastal sightseeing." },
  { name: "Baku, Azerbaijan", price: "From Rs. 68,000", category: "city culture family", tags: ["City", "Culture"], best: "Best: Apr-Jun", image: "city", desc: "Modern skyline, old city lanes, food, and Caspian views.", detail: "Visit Flame Towers, old city, boulevard, museums, markets, and day trips." },
  { name: "Kathmandu, Nepal", price: "From Rs. 35,000", category: "culture adventure family", tags: ["Culture", "Adventure"], best: "Best: Sep-Nov", image: "culture", desc: "Temples, mountain views, local markets, and short hikes.", detail: "Explore heritage squares, stupas, local food, nearby viewpoints, and cultural walks." },
  { name: "Bhutan", price: "From Rs. 58,000", category: "culture nature family", tags: ["Culture", "Nature"], best: "Best: Mar-May", image: "nature", desc: "Monasteries, valleys, peaceful towns, and scenic drives.", detail: "Visit Paro, Thimphu, Punakha, monasteries, viewpoints, and calm mountain valleys." },
  { name: "Vietnam", price: "From Rs. 62,000", category: "culture family adventure", tags: ["Culture", "Family"], best: "Best: Feb-Apr", image: "culture", desc: "Cities, food streets, bays, lantern towns, and history.", detail: "Plan Hanoi, Ha Long Bay, Da Nang, Hoi An, local markets, and food walks." },
  { name: "Malaysia", price: "From Rs. 45,000", category: "family city culture", tags: ["Family", "Culture"], best: "Best: Dec-Apr", image: "city", desc: "City attractions, islands, shopping, food, and family fun.", detail: "Visit Kuala Lumpur, Genting, Langkawi, malls, theme parks, and food streets." },
  { name: "Hong Kong", price: "From Rs. 82,000", category: "city family culture", tags: ["City", "Family"], best: "Best: Oct-Dec", image: "city", desc: "Skyline views, shopping, theme parks, and harbor nights.", detail: "Enjoy Victoria Peak, harbor views, Disneyland, markets, and city food spots." },
  { name: "Doha, Qatar", price: "From Rs. 60,000", category: "city family culture", tags: ["City", "Family"], best: "Best: Nov-Mar", image: "city", desc: "Museums, skyline, desert experiences, souqs, and waterfronts.", detail: "Visit Souq Waqif, museums, skyline points, desert activities, and waterfront walks." },
];

const extraTravelPackages = [
  { title: "Kerala Backwater Deluxe", destination: "Kerala, India", duration: "4 Days / 3 Nights", price: "Rs. 30,000", amount: 30000, image: "nature", group: true, features: ["Houseboat stay", "Backwater cruise", "Meals and local sightseeing"] },
  { title: "Jaipur Heritage Break", destination: "Jaipur, India", duration: "3 Days / 2 Nights", price: "Rs. 20,000", amount: 20000, image: "desert", group: true, features: ["Heritage hotel", "Fort and palace tour", "Market visit"] },
  { title: "Kashmir Valley Escape", destination: "Kashmir, India", duration: "5 Days / 4 Nights", price: "Rs. 38,000", amount: 38000, image: "adventure", group: true, features: ["Houseboat experience", "Gulmarg day trip", "Private transfers"] },
  { title: "Ladakh Road Adventure", destination: "Ladakh, India", duration: "6 Days / 5 Nights", price: "Rs. 48,000", amount: 48000, image: "adventure", group: true, features: ["Nubra and Pangong", "Monastery visits", "Adventure route support"] },
  { title: "Andaman Island Holiday", destination: "Andaman, India", duration: "5 Days / 4 Nights", price: "Rs. 52,000", amount: 52000, image: "beach", group: true, features: ["Havelock stay", "Ferry transfers", "Snorkeling assistance"] },
  { title: "Phuket Island Fun", destination: "Phuket, Thailand", duration: "4 Days / 3 Nights", price: "Rs. 48,000", amount: 48000, image: "beach", group: false, features: ["Island tour", "Beach stay", "Airport transfers"] },
  { title: "Bangkok Shopping Tour", destination: "Bangkok, Thailand", duration: "4 Days / 3 Nights", price: "Rs. 42,000", amount: 42000, image: "city", group: true, features: ["City hotel", "Temple tour", "Shopping route"] },
  { title: "London Classic Explorer", destination: "London, UK", duration: "6 Days / 5 Nights", price: "Rs. 118,000", amount: 118000, image: "city", group: false, features: ["Landmark tour", "Museum visits", "Transport support"] },
  { title: "Swiss Alps Scenic Tour", destination: "Swiss Alps, Switzerland", duration: "6 Days / 5 Nights", price: "Rs. 135,000", amount: 135000, image: "adventure", group: false, features: ["Scenic train", "Mountain day trip", "Lake city stay"] },
  { title: "Amsterdam Canal Holiday", destination: "Amsterdam, Netherlands", duration: "4 Days / 3 Nights", price: "Rs. 92,000", amount: 92000, image: "city", group: false, features: ["Canal cruise", "Museum route", "Central hotel"] },
  { title: "Istanbul Culture Tour", destination: "Istanbul, Turkey", duration: "5 Days / 4 Nights", price: "Rs. 78,000", amount: 78000, image: "culture", group: true, features: ["Old city tour", "Bosphorus cruise", "Market walk"] },
  { title: "Seoul City Lights", destination: "Seoul, South Korea", duration: "5 Days / 4 Nights", price: "Rs. 90,000", amount: 90000, image: "city", group: false, features: ["Palace visits", "Shopping streets", "Cafe districts"] },
  { title: "Sydney Harbor Trip", destination: "Sydney, Australia", duration: "6 Days / 5 Nights", price: "Rs. 128,000", amount: 128000, image: "city", group: false, features: ["Harbor tour", "Beach day", "City attractions"] },
  { title: "Queenstown Adventure", destination: "Queenstown, New Zealand", duration: "6 Days / 5 Nights", price: "Rs. 140,000", amount: 140000, image: "adventure", group: false, features: ["Adventure activities", "Lake stay", "Scenic drives"] },
  { title: "Cairo Pyramid Journey", destination: "Cairo, Egypt", duration: "5 Days / 4 Nights", price: "Rs. 86,000", amount: 86000, image: "desert", group: true, features: ["Pyramid visit", "Museum tour", "Nile evening"] },
  { title: "Cape Town Nature Tour", destination: "Cape Town, South Africa", duration: "6 Days / 5 Nights", price: "Rs. 110,000", amount: 110000, image: "nature", group: false, features: ["Table Mountain", "Coastal drive", "City stay"] },
  { title: "Barcelona Beach City", destination: "Barcelona, Spain", duration: "5 Days / 4 Nights", price: "Rs. 88,000", amount: 88000, image: "city", group: true, features: ["City tour", "Beach time", "Food market visit"] },
  { title: "Venice Romantic Stay", destination: "Venice, Italy", duration: "4 Days / 3 Nights", price: "Rs. 80,000", amount: 80000, image: "romantic", group: false, features: ["Canal ride", "Island visit", "Central stay"] },
  { title: "Prague Old Town Tour", destination: "Prague, Czech Republic", duration: "4 Days / 3 Nights", price: "Rs. 74,000", amount: 74000, image: "city", group: true, features: ["Castle route", "Old town walk", "Cafe evenings"] },
  { title: "Hampi Heritage Trail", destination: "Hampi, India", duration: "3 Days / 2 Nights", price: "Rs. 16,000", amount: 16000, image: "culture", group: true, features: ["Ruins tour", "Temple visits", "Local transport"] },
  { title: "Mysore Palace Weekend", destination: "Mysore, India", duration: "2 Days / 1 Night", price: "Rs. 14,000", amount: 14000, image: "culture", group: true, features: ["Palace visit", "Garden evening", "Food stops"] },
  { title: "Ooty Hill Station", destination: "Ooty, India", duration: "3 Days / 2 Nights", price: "Rs. 18,000", amount: 18000, image: "nature", group: true, features: ["Hill stay", "Lake visit", "Tea garden route"] },
  { title: "Coorg Coffee Retreat", destination: "Coorg, India", duration: "3 Days / 2 Nights", price: "Rs. 21,000", amount: 21000, image: "nature", group: true, features: ["Coffee estate stay", "Waterfall visit", "Nature walks"] },
  { title: "Rishikesh River Adventure", destination: "Rishikesh, India", duration: "3 Days / 2 Nights", price: "Rs. 19,000", amount: 19000, image: "adventure", group: true, features: ["Rafting support", "Cafe walk", "Evening aarti"] },
  { title: "Varanasi Spiritual Trip", destination: "Varanasi, India", duration: "3 Days / 2 Nights", price: "Rs. 18,000", amount: 18000, image: "culture", group: true, features: ["Boat ride", "Ghat walk", "Temple route"] },
  { title: "Udaipur Lake Holiday", destination: "Udaipur, India", duration: "3 Days / 2 Nights", price: "Rs. 26,000", amount: 26000, image: "romantic", group: true, features: ["Lake view stay", "Palace visit", "Boat ride"] },
  { title: "Jaisalmer Desert Camp", destination: "Jaisalmer, India", duration: "3 Days / 2 Nights", price: "Rs. 28,000", amount: 28000, image: "desert", group: true, features: ["Desert camp", "Dune safari", "Cultural night"] },
  { title: "Darjeeling Tea Trail", destination: "Darjeeling, India", duration: "4 Days / 3 Nights", price: "Rs. 27,000", amount: 27000, image: "nature", group: true, features: ["Tea gardens", "Toy train", "Tiger Hill"] },
  { title: "Shillong Waterfall Tour", destination: "Shillong, India", duration: "5 Days / 4 Nights", price: "Rs. 34,000", amount: 34000, image: "nature", group: true, features: ["Waterfalls", "Caves", "Scenic drives"] },
  { title: "Pondicherry Cafe Break", destination: "Pondicherry, India", duration: "3 Days / 2 Nights", price: "Rs. 17,000", amount: 17000, image: "beach", group: true, features: ["White Town stay", "Beach time", "Auroville visit"] },
  { title: "Lakshadweep Lagoon Plan", destination: "Lakshadweep, India", duration: "5 Days / 4 Nights", price: "Rs. 58,000", amount: 58000, image: "beach", group: false, features: ["Island stay", "Lagoon view", "Water activities"] },
  { title: "Mauritius Island Escape", destination: "Mauritius", duration: "5 Days / 4 Nights", price: "Rs. 98,000", amount: 98000, image: "beach", group: false, features: ["Resort stay", "Island tour", "Beach activities"] },
  { title: "Baku City Break", destination: "Baku, Azerbaijan", duration: "4 Days / 3 Nights", price: "Rs. 70,000", amount: 70000, image: "city", group: true, features: ["Old city tour", "Boulevard walk", "Day trip support"] },
  { title: "Kathmandu Valley Tour", destination: "Kathmandu, Nepal", duration: "4 Days / 3 Nights", price: "Rs. 36,000", amount: 36000, image: "culture", group: true, features: ["Temple route", "Market walk", "Viewpoint visit"] },
  { title: "Bhutan Peaceful Journey", destination: "Bhutan", duration: "5 Days / 4 Nights", price: "Rs. 62,000", amount: 62000, image: "nature", group: false, features: ["Valley drives", "Monastery visits", "Culture walks"] },
  { title: "Vietnam Discovery", destination: "Vietnam", duration: "6 Days / 5 Nights", price: "Rs. 66,000", amount: 66000, image: "culture", group: true, features: ["City route", "Bay cruise", "Food walks"] },
  { title: "Malaysia Family Holiday", destination: "Malaysia", duration: "5 Days / 4 Nights", price: "Rs. 48,000", amount: 48000, image: "family", group: true, features: ["Kuala Lumpur", "Genting day trip", "Shopping support"] },
];

function createTagMarkup(tags) {
  return tags
    .map(function (tag) {
      return `<span class="tag">${tag}</span>`;
    })
    .join("");
}

function createFeatureMarkup(features) {
  return features
    .map(function (feature) {
      return `<li>${feature}</li>`;
    })
    .join("");
}

function renderExtraDestinations() {
  const destinationsGrid = document.getElementById("destinationsGrid");

  if (!destinationsGrid) {
    return;
  }

  extraDestinations.forEach(function (destination) {
    const article = document.createElement("article");
    const keywords = normalizeSearchText(
      `${destination.name} ${destination.category} ${destination.desc} ${destination.tags.join(" ")}`
    );

    article.className = "card destination-card";
    article.dataset.category = destination.category;
    article.dataset.destination = keywords;
    article.tabIndex = 0;
    article.innerHTML = `
      <img src="${destinationImages[destination.image] || destinationImages.city}" alt="${destination.name} travel view" />
      <div class="card-content">
        <div class="card-meta">
          <h2>${destination.name}</h2>
          <span class="price">${destination.price}</span>
        </div>
        <div class="tag-row">
          ${createTagMarkup(destination.tags)}
          <span class="best-time">${destination.best}</span>
        </div>
        <p>${destination.desc}</p>
        <details>
          <summary>View Details</summary>
          <p>${destination.detail}</p>
        </details>
      </div>
    `;

    destinationsGrid.appendChild(article);
  });

  destinationCards = document.querySelectorAll(".destination-card");
}

function renderExtraPackages() {
  const packageGrid = document.querySelector(".package-grid");

  if (!packageGrid) {
    return;
  }

  extraTravelPackages.forEach(function (travelPackage) {
    const article = document.createElement("article");
    const bookingUrl = `contact.html?package=${encodeURIComponent(
      travelPackage.title
    )}&destination=${encodeURIComponent(travelPackage.destination)}#bookingForm`;

    article.className = "card package-card";
    article.innerHTML = `
      <img src="${destinationImages[travelPackage.image] || destinationImages.city}" alt="${travelPackage.title}" />
      <div class="card-content">
        <div class="card-meta">
          <h2>${travelPackage.title}</h2>
          <span class="price">${travelPackage.price}</span>
        </div>
        ${
          travelPackage.group
            ? '<span class="group-badge">Group of 6+ gets 10% off</span>'
            : ""
        }
        <p>${travelPackage.duration}</p>
        <ul class="feature-list">
          ${createFeatureMarkup(travelPackage.features)}
        </ul>
        <a href="${bookingUrl}" class="btn">Book Now</a>
      </div>
    `;

    packageGrid.appendChild(article);
  });
}

renderExtraDestinations();
renderExtraPackages();

function getSavedDestinations() {
  try {
    return JSON.parse(getStorageItem(savedDestinationsKey)) || [];
  } catch (error) {
    return [];
  }
}

function setSavedDestinations(destinations) {
  setStorageItem(savedDestinationsKey, JSON.stringify(destinations));
}

function updateSavedCount(savedDestinations) {
  if (savedCount) {
    savedCount.textContent = `Saved destinations: ${savedDestinations.length}`;
  }
}

function setupSavedDestinations() {
  if (!destinationCards.length) {
    return;
  }

  let savedDestinations = getSavedDestinations();
  updateSavedCount(savedDestinations);

  destinationCards.forEach(function (card) {
    const destinationName = card.querySelector("h2").textContent.trim();
    const actionRow = document.createElement("div");
    const planLink = document.createElement("a");
    const saveButton = document.createElement("button");

    actionRow.className = "destination-actions";
    planLink.href = `contact.html?destination=${encodeURIComponent(
      destinationName
    )}#bookingForm`;
    planLink.className = "btn";
    planLink.textContent = "Plan Trip";
    saveButton.type = "button";
    saveButton.className = "btn btn-outline save-btn";
    actionRow.appendChild(planLink);
    actionRow.appendChild(saveButton);
    card.querySelector(".card-content").appendChild(actionRow);

    function updateButton() {
      const isSaved = savedDestinations.includes(destinationName);

      card.classList.toggle("is-saved", isSaved);
      saveButton.classList.toggle("is-saved", isSaved);
      saveButton.textContent = isSaved ? "Saved" : "Save Destination";
      saveButton.setAttribute("aria-pressed", String(isSaved));
    }

    saveButton.addEventListener("click", function () {
      const isSaved = savedDestinations.includes(destinationName);

      if (isSaved) {
        savedDestinations = savedDestinations.filter(function (name) {
          return name !== destinationName;
        });
      } else {
        savedDestinations.push(destinationName);
      }

      setSavedDestinations(savedDestinations);
      updateSavedCount(savedDestinations);
      updateButton();
    });

    updateButton();
  });

  if (clearSavedButton) {
    clearSavedButton.addEventListener("click", function () {
      savedDestinations = [];
      setSavedDestinations(savedDestinations);
      updateSavedCount(savedDestinations);

      destinationCards.forEach(function (card) {
        card.classList.remove("is-saved");
        const saveButton = card.querySelector(".save-btn");
        if (saveButton) {
          saveButton.classList.remove("is-saved");
          saveButton.textContent = "Save Destination";
          saveButton.setAttribute("aria-pressed", "false");
        }
      });
    });
  }
}

setupSavedDestinations();

function applyDestinationFilters() {
  const cards = refreshDestinationCards();

  if (!cards.length) {
    return;
  }

  const searchText = destinationSearch
    ? normalizeSearchText(destinationSearch.value)
    : "";
  const maxBudget =
    destinationBudgetFilter && destinationBudgetFilter.value !== "all"
      ? Number(destinationBudgetFilter.value)
      : Infinity;
  const seasonFilter = destinationSeasonFilter
    ? destinationSeasonFilter.value
    : "all";
  let visibleCount = 0;

  cards.forEach(function (card) {
    const content = normalizeSearchText(card.textContent);
    const keywords = normalizeSearchText(card.dataset.destination);
    const categories = normalizeSearchText(card.dataset.category)
      .split(" ")
      .filter(Boolean);
    const price =
      parseRupeeAmount(card.dataset.price) ||
      parseRupeeAmount(card.querySelector(".price") ? card.querySelector(".price").textContent : "");
    const seasonTokens = getDestinationSeasonTokens(card);
    const haystack = `${content} ${keywords} ${categories.join(" ")}`;
    const matchesSearch =
      !searchText || haystack.includes(searchText);
    const matchesCategory =
      activeDestinationFilter === "all" || categories.includes(activeDestinationFilter);
    const matchesBudget = !price || price <= maxBudget;
    const matchesSeason =
      seasonFilter === "all" || seasonTokens.includes(seasonFilter);
    const isVisible = matchesSearch && matchesCategory && matchesBudget && matchesSeason;

    card.toggleAttribute("hidden", !isVisible);
    card.style.display = isVisible ? "" : "none";
    card.classList.toggle("is-filtered-out", !isVisible);
    card.classList.toggle("is-visible", isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (noDestinations) {
    noDestinations.hidden = visibleCount > 0;
  }

  if (filterStatus) {
    const filterLabel =
      activeDestinationFilter === "all"
        ? "all"
        : activeDestinationFilter.charAt(0).toUpperCase() +
          activeDestinationFilter.slice(1);
    const searchLabel = searchText ? ` matching "${searchText}"` : "";
    filterStatus.textContent = `Showing ${visibleCount} ${filterLabel} destination${
      visibleCount === 1 ? "" : "s"
    }${searchLabel}.`;
  }
}

function showVisibleDestinationCards() {
  refreshDestinationCards().forEach(function (card) {
    if (!card.classList.contains("is-filtered-out")) {
      card.removeAttribute("hidden");
      card.style.display = "";
      card.classList.add("is-visible");
    }
  });
}

function resetDestinationControls() {
  if (!document.body.classList.contains("destinations-page")) {
    return;
  }

  activeDestinationFilter = "all";

  if (destinationSearch) {
    destinationSearch.value = "";
  }

  filterChips.forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.filter === "all");
  });
}

if (destinationSearch) {
  destinationSearch.addEventListener("input", applyDestinationFilters);
}

[destinationBudgetFilter, destinationSeasonFilter].forEach(function (control) {
  if (control) {
    control.addEventListener("change", applyDestinationFilters);
  }
});

if (filterChips.length) {
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeDestinationFilter = normalizeSearchText(chip.dataset.filter || "all") || "all";

      filterChips.forEach(function (button) {
        button.classList.toggle("is-active", button === chip);
      });

      applyDestinationFilters();
    });
  });

}

if (destinationSearch || filterChips.length) {
  resetDestinationControls();
  applyDestinationFilters();
  showVisibleDestinationCards();
}

const contactForm = document.getElementById("contactForm");
const bookingForm = document.getElementById("bookingForm");

function addUniqueSelectOption(select, text) {
  if (!select || !text) {
    return;
  }

  const exists = Array.from(select.options).some(function (option) {
    return option.textContent.trim().toLowerCase() === text.trim().toLowerCase();
  });

  if (exists) {
    return;
  }

  const newOption = document.createElement("option");
  newOption.value = text;
  newOption.textContent = text;
  select.appendChild(newOption);
}

function populateBookingOptions() {
  if (!bookingForm) {
    return;
  }

  const destinationSelect = bookingForm.elements.destination;
  const packageSelect = bookingForm.elements.package;

  extraDestinations.forEach(function (destination) {
    addUniqueSelectOption(destinationSelect, destination.name);
  });

  extraTravelPackages.forEach(function (travelPackage) {
    addUniqueSelectOption(packageSelect, travelPackage.title);
  });
}

function setSelectByText(select, text) {
  if (!select || !text) {
    return;
  }

  const matchingOption = Array.from(select.options).find(function (option) {
    return option.textContent.trim().toLowerCase() === text.trim().toLowerCase();
  });

  if (matchingOption) {
    select.value = matchingOption.value;
    return;
  }

  addUniqueSelectOption(select, text);
  select.value = text;
}

function setupBookingPrefill() {
  if (!bookingForm) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const selectedDestination = params.get("destination");
  const selectedPackage = params.get("package");
  const bookingHint = document.getElementById("bookingHint");
  const destinationSelect = bookingForm.elements.destination;
  const packageSelect = bookingForm.elements.package;
  const notesField = bookingForm.elements.bookingNotes;

  populateBookingOptions();
  setSelectByText(destinationSelect, selectedDestination);
  setSelectByText(packageSelect, selectedPackage);

  if (selectedPackage && notesField && !notesField.value) {
    notesField.value = `I am interested in the ${selectedPackage} package.`;
  }

  if (bookingHint && (selectedDestination || selectedPackage)) {
    bookingHint.textContent = selectedPackage
      ? `Selected package: ${selectedPackage}`
      : `Selected destination: ${selectedDestination}`;
  }
}

setupBookingPrefill();

function setupGlobalControls() {
  const themeToggle = document.createElement("button");
  const backToTop = document.createElement("button");
  const savedTheme = getStorageItem(themePreferenceKey);

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  themeToggle.type = "button";
  themeToggle.className = "theme-toggle";
  themeToggle.setAttribute("aria-label", "Toggle dark mode");
  themeToggle.innerHTML = '<i class="fas fa-circle-half-stroke"></i>';

  themeToggle.addEventListener("click", function () {
    const isLightMode = document.body.classList.toggle("light-mode");
    setStorageItem(themePreferenceKey, isLightMode ? "light" : "dark");
  });

  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("is-visible", window.scrollY > 450);
  });

  document.body.appendChild(themeToggle);
  document.body.appendChild(backToTop);
}

setupGlobalControls();

function setupBasicSlider(sliderId, slideSelector, intervalMs) {
  const slider = document.getElementById(sliderId);

  if (!slider) {
    return;
  }

  const slides = Array.from(slider.querySelectorAll(slideSelector));
  const dots = Array.from(slider.querySelectorAll("[data-slide-index]"));
  const controls = slider.querySelectorAll("[data-slider-control]");
  let activeIndex = 0;
  let autoTimer;

  if (!slides.length) {
    return;
  }

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  function startAutoSlide() {
    window.clearInterval(autoTimer);
    autoTimer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, intervalMs);
  }

  controls.forEach(function (control) {
    control.addEventListener("click", function () {
      const direction = control.dataset.sliderControl === "next" ? 1 : -1;
      showSlide(activeIndex + direction);
      startAutoSlide();
    });
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.dataset.slideIndex));
      startAutoSlide();
    });
  });

  showSlide(0);
  startAutoSlide();
}

function setupHomeSlider() {
  setupBasicSlider("homeTravelSlider", ".slider-slide", 4500);
}

function setupHeroSlider() {
  setupBasicSlider("heroSlider", ".hero-slide", 5200);
}

function setupReviewSlider() {
  setupBasicSlider("reviewSlider", ".review-slide", 4200);
}

setupHeroSlider();
setupHomeSlider();
setupReviewSlider();

const aiPlannerForm = document.getElementById("aiPlannerForm");
const aiPlannerResult = document.getElementById("aiPlannerResult");
const surpriseTripButton = document.getElementById("surpriseTrip");
const budgetRange = document.getElementById("budgetRange");
const budgetOutput = document.getElementById("budgetOutput");
const budgetAdvice = document.getElementById("budgetAdvice");
const budgetComparisonIntro = document.getElementById("budgetComparisonIntro");
const budgetComparisonCards = document.getElementById("budgetComparisonCards");

const smartTripOptions = [
  {
    destination: "Goa, India",
    packageName: "Goa Beach Escape",
    styles: ["beach", "family", "romantic"],
    baseBudget: 18000,
    idealDays: 3,
    summary: "A relaxed beach trip with nightlife, food, and water activities.",
    itinerary: [
      "Day 1: Check in, beach walk, and sunset dinner",
      "Day 2: Water sports, local market, and evening cafes",
      "Day 3: Fort visit, beach time, and return travel",
    ],
  },
  {
    destination: "Manali, India",
    packageName: "Manali Adventure Holiday",
    styles: ["adventure", "family"],
    baseBudget: 24000,
    idealDays: 4,
    summary: "A mountain plan with snow views, cafes, and adventure activities.",
    itinerary: [
      "Day 1: Arrive, hotel check-in, and local cafe walk",
      "Day 2: Solang Valley, snow point, and adventure activities",
      "Day 3: Sightseeing, shopping, and river valley views",
      "Day 4: Breakfast, short nature stop, and return travel",
    ],
  },
  {
    destination: "Bali, Indonesia",
    packageName: "Premium Bali Tour",
    styles: ["beach", "romantic", "luxury"],
    baseBudget: 45000,
    idealDays: 5,
    summary: "A tropical international escape with beaches, temples, and sunsets.",
    itinerary: [
      "Day 1: Arrival, resort check-in, and beach sunset",
      "Day 2: Temple tour, local markets, and cultural show",
      "Day 3: Waterfall visit, rice terraces, and cafes",
      "Day 4: Beach club, shopping, and leisure time",
      "Day 5: Breakfast, final photos, and airport transfer",
    ],
  },
  {
    destination: "Paris, France",
    packageName: "Paris City Escape",
    styles: ["romantic", "culture", "luxury"],
    baseBudget: 62000,
    idealDays: 4,
    summary: "A city break focused on landmarks, museums, food, and river views.",
    itinerary: [
      "Day 1: Arrival, hotel check-in, and evening city walk",
      "Day 2: Eiffel Tower, cafes, and Seine river experience",
      "Day 3: Museum visit, shopping street, and local food",
      "Day 4: Breakfast, photos, and return transfer",
    ],
  },
  {
    destination: "Dubai, UAE",
    packageName: "Dubai Desert Luxury",
    styles: ["luxury", "family", "adventure"],
    baseBudget: 58000,
    idealDays: 4,
    summary: "A modern city trip with skyline views, shopping, and desert safari.",
    itinerary: [
      "Day 1: Arrival, hotel check-in, and marina evening",
      "Day 2: City tour, mall visit, and Burj Khalifa area",
      "Day 3: Desert safari, dinner, and cultural show",
      "Day 4: Beach stop, shopping, and airport transfer",
    ],
  },
  {
    destination: "Rajasthan, India",
    packageName: "Rajasthan Royal Tour",
    styles: ["culture", "family", "romantic"],
    baseBudget: 35000,
    idealDays: 6,
    summary: "A heritage trip with forts, palaces, markets, and royal stays.",
    itinerary: [
      "Day 1: Jaipur arrival, heritage hotel check-in, and market walk",
      "Day 2: Forts, palace visits, and local food",
      "Day 3: Drive to Jodhpur with sightseeing stops",
      "Day 4: Blue city walk, fort visit, and rooftop dinner",
      "Day 5: Udaipur lakes, palace views, and shopping",
      "Day 6: Breakfast, final photos, and return travel",
    ],
  },
];

function formatRupees(amount) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(amount);
}

const packageBudgetOptions = [
  {
    name: "Goa Beach Escape",
    destination: "Goa, India",
    duration: "3 Days / 2 Nights",
    price: 18000,
    bestFor: "Budget beach trip",
  },
  {
    name: "Manali Adventure Holiday",
    destination: "Manali, India",
    duration: "4 Days / 3 Nights",
    price: 24000,
    bestFor: "Adventure and family travel",
  },
  {
    name: "Kerala Backwater Retreat",
    destination: "Kerala, India",
    duration: "4 Days / 3 Nights",
    price: 26000,
    bestFor: "Nature and houseboat stay",
  },
  {
    name: "Rajasthan Royal Tour",
    destination: "Rajasthan, India",
    duration: "6 Days / 5 Nights",
    price: 35000,
    bestFor: "Heritage and culture",
  },
  {
    name: "Premium Bali Tour",
    destination: "Bali, Indonesia",
    duration: "5 Days / 4 Nights",
    price: 40000,
    bestFor: "Couples and beaches",
  },
  {
    name: "Singapore Family Fun",
    destination: "Singapore",
    duration: "4 Days / 3 Nights",
    price: 50000,
    bestFor: "Family attractions",
  },
  {
    name: "Dubai Desert Luxury",
    destination: "Dubai, UAE",
    duration: "4 Days / 3 Nights",
    price: 58000,
    bestFor: "Shopping and city fun",
  },
  {
    name: "Paris City Escape",
    destination: "Paris, France",
    duration: "4 Days / 3 Nights",
    price: 62000,
    bestFor: "Romantic city break",
  },
  {
    name: "Rome Heritage Journey",
    destination: "Rome, Italy",
    duration: "5 Days / 4 Nights",
    price: 70000,
    bestFor: "History and food",
  },
  {
    name: "Santorini Honeymoon Tour",
    destination: "Santorini, Greece",
    duration: "5 Days / 4 Nights",
    price: 75000,
    bestFor: "Honeymoon and sunsets",
  },
  {
    name: "Tokyo Culture Tour",
    destination: "Tokyo, Japan",
    duration: "6 Days / 5 Nights",
    price: 85000,
    bestFor: "Culture and city life",
  },
  {
    name: "Maldives Island Stay",
    destination: "Maldives",
    duration: "5 Days / 4 Nights",
    price: 90000,
    bestFor: "Luxury island stay",
  },
  {
    name: "New York City Explorer",
    destination: "New York, USA",
    duration: "5 Days / 4 Nights",
    price: 98000,
    bestFor: "Landmarks and shopping",
  },
].concat(
  extraTravelPackages.map(function (travelPackage) {
    return {
      name: travelPackage.title,
      destination: travelPackage.destination,
      duration: travelPackage.duration,
      price: travelPackage.amount,
      bestFor: travelPackage.features[0],
    };
  })
).sort(function (first, second) {
  return first.price - second.price;
});

function getNearestBudgetPackages(budget) {
  return packageBudgetOptions
    .map(function (travelPackage) {
      return {
        ...travelPackage,
        difference: Math.abs(travelPackage.price - budget),
      };
    })
    .sort(function (first, second) {
      return first.difference - second.difference || first.price - second.price;
    })
    .slice(0, 3);
}

function getBudgetRelationText(price, budget) {
  const difference = Math.abs(price - budget);

  if (difference === 0) {
    return "Exact budget match";
  }

  if (price < budget) {
    return `${formatRupees(difference)} under budget`;
  }

  return `${formatRupees(difference)} above budget`;
}

function getBudgetTag(price, budget, index) {
  if (index === 0) {
    return "Closest Match";
  }

  return price <= budget ? "Under Budget" : "Near Budget";
}

function renderBudgetComparison(matches, budget) {
  if (!budgetComparisonCards) {
    return;
  }

  if (budgetComparisonIntro) {
    budgetComparisonIntro.textContent = `Showing packages closest to ${formatRupees(
      budget
    )}.`;
  }

  budgetComparisonCards.innerHTML = matches
    .map(function (travelPackage, index) {
      const bookingUrl = `contact.html?package=${encodeURIComponent(
        travelPackage.name
      )}&destination=${encodeURIComponent(travelPackage.destination)}#bookingForm`;

      return `
        <article class="compare-card${index === 0 ? " is-best" : ""}">
          <span>${getBudgetTag(travelPackage.price, budget, index)}</span>
          <h3>${travelPackage.name}</h3>
          <p>${travelPackage.destination}</p>
          <p>${travelPackage.duration}</p>
          <strong>${formatRupees(travelPackage.price)}</strong>
          <small>${travelPackage.bestFor}</small>
          <small class="compare-difference">${getBudgetRelationText(
            travelPackage.price,
            budget
          )}</small>
          <a href="${bookingUrl}" class="btn btn-small">Book Now</a>
        </article>
      `;
    })
    .join("");
}

function updateBudgetEstimator() {
  if (!budgetRange || !budgetOutput || !budgetAdvice) {
    return;
  }

  const budget = Number(budgetRange.value);
  const matches = getNearestBudgetPackages(budget);
  const match = matches[0];

  budgetOutput.textContent = formatRupees(budget);
  budgetAdvice.textContent = `${match.name} is the closest match. ${getBudgetRelationText(
    match.price,
    budget
  )}.`;
  renderBudgetComparison(matches, budget);
}

if (budgetRange) {
  budgetRange.addEventListener("input", updateBudgetEstimator);
  updateBudgetEstimator();
}

function findSmartTrip({ budget, days, travelers, travelType }) {
  return smartTripOptions
    .map(function (trip) {
      const estimatedCost = Math.round(
        trip.baseBudget * travelers * Math.max(days / trip.idealDays, 0.85)
      );
      const styleScore = trip.styles.includes(travelType) ? 45 : 12;
      const budgetScore = budget >= estimatedCost ? 35 : Math.max(0, 35 - (estimatedCost - budget) / 1500);
      const dayScore = Math.max(0, 20 - Math.abs(days - trip.idealDays) * 4);

      return {
        ...trip,
        estimatedCost,
        score: styleScore + budgetScore + dayScore,
      };
    })
    .sort(function (first, second) {
      return second.score - first.score;
    })[0];
}

function renderSmartTrip(trip, days, travelType) {
  if (!aiPlannerResult || !trip) {
    return;
  }

  const itinerary = trip.itinerary
    .slice(0, Math.min(days, trip.itinerary.length))
    .map(function (item) {
      return `<li>${item}</li>`;
    })
    .join("");
  const bookingUrl = `contact.html?package=${encodeURIComponent(
    trip.packageName
  )}&destination=${encodeURIComponent(trip.destination)}#bookingForm`;

  aiPlannerResult.innerHTML = `
    <span class="ai-pill">Best match</span>
    <h3>${trip.destination}</h3>
    <p>${trip.summary}</p>
    <div class="ai-result-meta">
      <span>${formatRupees(trip.estimatedCost)} estimated</span>
      <span>${days} day plan</span>
      <span>${travelType} style</span>
    </div>
    <ul class="ai-itinerary">${itinerary}</ul>
    <a href="${bookingUrl}" class="btn">Book This Plan</a>
  `;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setAiPlannerLoading(isLoading) {
  if (!aiPlannerForm) {
    return;
  }

  const submitButton = aiPlannerForm.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  if (!submitButton.dataset.defaultText) {
    submitButton.dataset.defaultText = submitButton.textContent.trim();
  }

  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Generating..." : submitButton.dataset.defaultText;
}

function renderGeneratedTripPlan(planData, inputs) {
  if (!aiPlannerResult) {
    return;
  }

  const lines = String(planData.plan || "")
    .split(/\n+/)
    .map(function (line) {
      return line.trim();
    })
    .filter(Boolean);
  const planItems = lines
    .map(function (line) {
      return `<li>${escapeHtml(line)}</li>`;
    })
    .join("");
  const bookingUrl = `contact.html?package=${encodeURIComponent(
    "AI Trip Plan"
  )}&destination=${encodeURIComponent(planData.destination || "Custom Trip")}#bookingForm`;

  aiPlannerResult.innerHTML = `
    <span class="ai-pill">Claude plan</span>
    <h3>${escapeHtml(planData.destination || "Custom Trip Plan")}</h3>
    <p>Estimated cost: ${escapeHtml(planData.estimatedCost || `Rs. ${Number(inputs.budget).toLocaleString("en-IN")}`)}</p>
    <div class="ai-result-meta">
      <span>${escapeHtml(String(inputs.days))} day plan</span>
      <span>${escapeHtml(String(inputs.travelers))} traveler(s)</span>
      <span>${escapeHtml(inputs.travelType)} style</span>
    </div>
    <ul class="ai-itinerary">${planItems}</ul>
    <a href="${bookingUrl}" class="btn">Book This Plan</a>
  `;
}

async function generateClaudeTripPlan(inputs) {
  const response = await fetch("/api/ai-planner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });
  const data = await response.json().catch(function () {
    return {};
  });

  if (!response.ok) {
    throw new Error(data.error || "Claude planner request failed.");
  }

  return data;
}

if (aiPlannerForm) {
  aiPlannerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const budget = Number(document.getElementById("aiBudget").value);
    const days = Number(document.getElementById("aiDays").value);
    const travelers = Number(document.getElementById("aiTravelers").value);
    const travelType = document.getElementById("aiTravelType").value;
    const plannerInputs = { budget, days, travelers, travelType };

    setAiPlannerLoading(true);

    try {
      const generatedPlan = await generateClaudeTripPlan(plannerInputs);
      renderGeneratedTripPlan(generatedPlan, plannerInputs);
    } catch (error) {
      console.error("Claude planner failed:", error);
      const trip = findSmartTrip(plannerInputs);
      renderSmartTrip(trip, days, travelType);
      showToast(
        "Claude planner is not configured yet. Showing a local plan for now.",
        "error"
      );
    } finally {
      setAiPlannerLoading(false);
    }
  });
}

if (surpriseTripButton) {
  surpriseTripButton.addEventListener("click", function () {
    const randomTrip =
      smartTripOptions[Math.floor(Math.random() * smartTripOptions.length)];
    const travelType = randomTrip.styles[0];

    document.getElementById("aiBudget").value = randomTrip.baseBudget * 2;
    document.getElementById("aiDays").value = randomTrip.idealDays;
    document.getElementById("aiTravelers").value = 2;
    document.getElementById("aiTravelType").value = travelType;
    renderSmartTrip(randomTrip, randomTrip.idealDays, travelType);
  });
}

// EmailJS config - replace with your credentials.
const emailJsConfig = {
  publicKey: "07_pX4KHdEQuQPzbb",
  serviceId: "service_200l461",
  bookingTemplateId: "template_1t7ejfe",
  feedbackTemplateId: "template_9f26bcf",
  autoReplyTemplateId: "",
  ownerEmail: "giridhar.parlapalli@gmail.com",
};
const emailJsWhatsAppUrl =
  `https://wa.me/${
    window.TRAVEL_SITE_CONFIG ? window.TRAVEL_SITE_CONFIG.whatsappNumber : "918179721034"
  }?text=Hi%2C%20I%20tried%20the%20website%20form%20and%20want%20to%20plan%20a%20trip.`;
let emailJsInitialized = false;

function getFormValue(form, fieldName) {
  const field = form.elements[fieldName];
  return field ? String(field.value || "").trim() : "";
}

function isEmailJsValueConfigured(value) {
  return Boolean(value && !String(value).startsWith("YOUR_"));
}

function hasEmailJsCredentials(templateId) {
  return (
    isEmailJsValueConfigured(emailJsConfig.publicKey) &&
    isEmailJsValueConfigured(emailJsConfig.serviceId) &&
    isEmailJsValueConfigured(templateId)
  );
}

function getConfiguredTemplateId(primaryTemplateId, fallbackTemplateId) {
  return isEmailJsValueConfigured(primaryTemplateId)
    ? primaryTemplateId
    : fallbackTemplateId;
}

function getToastContainer() {
  let toastContainer = document.getElementById("toastContainer");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    toastContainer.setAttribute("aria-atomic", "true");
    document.body.appendChild(toastContainer);
  }

  return toastContainer;
}

function showToast(message, type, action) {
  const toast = document.createElement("div");
  toast.className = `site-toast site-toast--${type || "info"}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  const toastMessage = document.createElement("span");
  toastMessage.textContent = message;
  toast.appendChild(toastMessage);

  if (action) {
    const actionLink = document.createElement("a");
    actionLink.href = action.href;
    actionLink.target = "_blank";
    actionLink.rel = "noreferrer";
    actionLink.textContent = action.label;
    toast.appendChild(actionLink);
  }

  getToastContainer().appendChild(toast);

  window.setTimeout(function () {
    toast.classList.add("is-hiding");
    toast.addEventListener(
      "transitionend",
      function () {
        toast.remove();
      },
      { once: true }
    );
  }, 6500);
}

function setFormLoading(form, isLoading) {
  const submitButton = form.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  const buttonText = submitButton.querySelector(".btn-text");

  if (!submitButton.dataset.defaultText) {
    submitButton.dataset.defaultText = buttonText
      ? buttonText.textContent
      : submitButton.textContent.trim();
  }

  submitButton.disabled = isLoading;
  submitButton.classList.toggle("is-loading", isLoading);

  if (buttonText) {
    buttonText.textContent = isLoading
      ? "Sending..."
      : submitButton.dataset.defaultText;
  }
}

function getEmailJsClient(templateId, formLabel) {
  if (!window.emailjs) {
    throw new Error("EmailJS SDK is not loaded. Check your internet connection or CDN script.");
  }

  if (!isEmailJsValueConfigured(emailJsConfig.publicKey)) {
    throw new Error("EmailJS public key is missing.");
  }

  if (!isEmailJsValueConfigured(emailJsConfig.serviceId)) {
    throw new Error("EmailJS service ID is missing.");
  }

  if (!isEmailJsValueConfigured(templateId)) {
    throw new Error(`${formLabel || "EmailJS"} template ID is missing. Add the template ID in script.js.`);
  }

  if (!emailJsInitialized) {
    window.emailjs.init({ publicKey: emailJsConfig.publicKey });
    emailJsInitialized = true;
  }

  return window.emailjs;
}

function sendEmailJs(templateId, templateParams, formLabel) {
  return getEmailJsClient(templateId, formLabel).send(
    emailJsConfig.serviceId,
    templateId,
    templateParams
  );
}

function getFormSendErrorMessage(error) {
  if (error && error.text) {
    return `Form error: ${error.text}`;
  }

  if (error && error.message) {
    return `Form error: ${error.message}`;
  }

  return "Something went wrong. Please WhatsApp us directly.";
}

function sendAutoReply(templateParams) {
  if (!isEmailJsValueConfigured(emailJsConfig.autoReplyTemplateId)) {
    return Promise.resolve();
  }

  return sendEmailJs(emailJsConfig.autoReplyTemplateId, templateParams, "Auto reply").catch(function (error) {
    console.warn("EmailJS auto reply failed:", error);
  });
}

function isFormspreeForm(form) {
  return Boolean(form && form.action && form.action.includes("formspree.io"));
}

function sendFormspree(form, templateParams) {
  if (!isFormspreeForm(form) || form.action.includes("YOUR_")) {
    return Promise.reject(
      new Error("Formspree endpoint is missing. Replace the YOUR_FORM_ID placeholder in contact.html.")
    );
  }

  const formData = new FormData(form);

  Object.entries(templateParams).forEach(function ([key, value]) {
    formData.set(key, value);
  });

  return fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      return response;
    }

    return response.json().catch(function () {
      return {};
    }).then(function (data) {
      const message =
        data && data.errors && data.errors[0] && data.errors[0].message
          ? data.errors[0].message
          : "Formspree submission failed.";
      throw new Error(message);
    });
  });
}

function attachEmailJsSubmit(form, buildParams, templateId, successMessage, formLabel) {
  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (form.dataset.sending === "true") {
      return;
    }

    form.dataset.sending = "true";
    setFormLoading(form, true);

    const templateParams = buildParams(form);

    Promise.resolve()
      .then(function () {
        if (isFormspreeForm(form)) {
          return sendFormspree(form, templateParams);
        }

        return sendEmailJs(templateId, templateParams, formLabel);
      })
      .then(function () {
        return isFormspreeForm(form) ? Promise.resolve() : sendAutoReply(templateParams);
      })
      .then(function () {
        showToast(successMessage, "success");
        form.reset();
        setupBookingPrefill();
      })
      .catch(function (error) {
        console.error("Form send failed:", error);
        showToast(getFormSendErrorMessage(error), "error", {
          href: emailJsWhatsAppUrl,
          label: "WhatsApp us",
        });
      })
      .finally(function () {
        form.dataset.sending = "false";
        setFormLoading(form, false);
      });
  });
}

attachEmailJsSubmit(
  bookingForm,
  function (form) {
    return {
      from_name: getFormValue(form, "bookingName"),
      from_email: getFormValue(form, "bookingEmail"),
      customer_email: getFormValue(form, "bookingEmail"),
      to_email: emailJsConfig.ownerEmail,
      owner_email: emailJsConfig.ownerEmail,
      reply_to: getFormValue(form, "bookingEmail"),
      phone: `+91 ${getFormValue(form, "bookingPhone")}`,
      destination: getFormValue(form, "destination"),
      package_name: getFormValue(form, "package"),
      travel_type: getFormValue(form, "travelType"),
      approx_budget: getFormValue(form, "approxBudget")
        ? `Rs. ${Number(getFormValue(form, "approxBudget")).toLocaleString("en-IN")}`
        : "Not provided",
      travel_date: getFormValue(form, "travelDate"),
      travelers: getFormValue(form, "travelers"),
      travel_notes: getFormValue(form, "bookingNotes") || "No special requests added.",
      emi_needed: getFormValue(form, "emiNeeded"),
      preferred_contact: getFormValue(form, "preferredContact"),
      travelers_type: getFormValue(form, "travelersType"),
    };
  },
  emailJsConfig.bookingTemplateId,
  "Your booking request was sent! We'll reply within 2 hours.",
  "Booking"
);

attachEmailJsSubmit(
  contactForm,
  function (form) {
    const customerEmail = getFormValue(form, "email");

    return {
      from_name: getFormValue(form, "name"),
      from_email: customerEmail,
      customer_email: customerEmail,
      to_email: emailJsConfig.ownerEmail,
      owner_email: emailJsConfig.ownerEmail,
      reply_to: customerEmail,
      feedback_type: getFormValue(form, "feedbackType") || "General Message",
      feedback_rating: getFormValue(form, "feedbackRating") || "Not rated",
      message: getFormValue(form, "message"),
    };
  },
  emailJsConfig.feedbackTemplateId,
  "Your feedback was sent! Thank you for rating Travel with Giridhar.",
  "Feedback"
);

const animatedItems = document.querySelectorAll(
  ".page-hero, .stats-band, .card:not(.destination-card), .panel, .search-panel, .stat-box, .trend-card, .ai-planner-shell, .emi-banner, .emi-package-card, .blog-card, .gallery-item, .contact-info-card, .not-found-card"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  animatedItems.forEach(function (item, index) {
    item.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
    item.classList.add("reveal-on-scroll");
    revealObserver.observe(item);
  });

  setTimeout(showVisibleDestinationCards, 500);
  setTimeout(function () {
    animatedItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }, 900);
} else {
  animatedItems.forEach(function (item) {
    item.classList.add("is-visible");
  });
}
