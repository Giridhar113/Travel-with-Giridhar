(function () {
  const siteConfig = window.TRAVEL_SITE_CONFIG || {};
  const whatsappNumber = siteConfig.whatsappNumber || "918179721034";
  const savedTripsKey = "savedTrips";
  const localTestimonialsKey = "travelLocalTestimonials";
  const currencyPreferenceKey = "travelCurrencyPreference";
  const newsletterKey = "travelNewsletterEmail";
  const aiPlanHistoryKey = "travelAiPlanHistory";
  const usdConversionRate = 83;
  const quoteText =
    siteConfig.whatsappMessage || "Hi, I want to plan a trip with Travel with Giridhar.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(quoteText)}`;

  const basePackages = [
    { title: "Premium Bali Tour", destination: "Bali, Indonesia", price: 40000, duration: "5 Days / 4 Nights", days: 5, tags: ["Beach", "Romantic", "Luxury", "International"], image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop&q=75", inclusions: ["Hotel stay", "Airport transfers", "Temple and beach tour"], bestFor: "Couples and beach lovers", popularity: 92 },
    { title: "Paris City Escape", destination: "Paris, France", price: 62000, duration: "4 Days / 3 Nights", days: 4, tags: ["Romantic", "Luxury", "International"], image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=75", inclusions: ["Comfort hotel", "Landmark tour", "Museum route"], bestFor: "Romantic city travel", popularity: 86 },
    { title: "Goa Beach Escape", destination: "Goa, India", price: 18000, duration: "3 Days / 2 Nights", days: 3, tags: ["Beach", "Budget", "Family"], image: "services1.jpg", inclusions: ["Beachside stay", "Local sightseeing", "Water sports help"], bestFor: "Budget beach trips", popularity: 96 },
    { title: "Manali Adventure Holiday", destination: "Manali, India", price: 24000, duration: "4 Days / 3 Nights", days: 4, tags: ["Adventure", "Family", "Budget", "Hill Station"], image: "services2.jpg", inclusions: ["Mountain hotel", "Sightseeing", "Adventure assistance"], bestFor: "Friends and families", popularity: 90 },
    { title: "Santorini Honeymoon Tour", destination: "Santorini, Greece", price: 75000, duration: "5 Days / 4 Nights", days: 5, tags: ["Honeymoon", "Romantic", "Luxury", "International", "Beach"], image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&auto=format&fit=crop&q=75", inclusions: ["Sea view stay", "Island tour", "Airport transfers"], bestFor: "Honeymoon travel", popularity: 82 },
    { title: "Dubai Desert Luxury", destination: "Dubai, UAE", price: 58000, duration: "4 Days / 3 Nights", days: 4, tags: ["Luxury", "Family", "International", "Adventure"], image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=75", inclusions: ["Premium hotel", "Desert safari", "City tour"], bestFor: "Families and shopping", popularity: 89 },
    { title: "Singapore Family Fun", destination: "Singapore", price: 50000, duration: "4 Days / 3 Nights", days: 4, tags: ["Family", "International", "Luxury"], image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&auto=format&fit=crop&q=75", inclusions: ["Family hotel", "Sentosa attractions", "Transfers"], bestFor: "Family city holidays", popularity: 84 },
    { title: "Tokyo Culture Tour", destination: "Tokyo, Japan", price: 85000, duration: "6 Days / 5 Nights", days: 6, tags: ["Adventure", "Family", "International"], image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&auto=format&fit=crop&q=75", inclusions: ["City hotel", "Temple tours", "Transport support"], bestFor: "Culture and food", popularity: 80 },
    { title: "New York City Explorer", destination: "New York, USA", price: 98000, duration: "5 Days / 4 Nights", days: 5, tags: ["Luxury", "Family", "International"], image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=900&auto=format&fit=crop&q=75", inclusions: ["Central hotel", "Museum visits", "Landmark tour"], bestFor: "City explorers", popularity: 78 },
    { title: "Rome Heritage Journey", destination: "Rome, Italy", price: 70000, duration: "5 Days / 4 Nights", days: 5, tags: ["Romantic", "International"], image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=900&auto=format&fit=crop&q=75", inclusions: ["Historic hotel", "Food walk", "Airport transfers"], bestFor: "History and food", popularity: 81 },
    { title: "Kerala Backwater Retreat", destination: "Kerala, India", price: 26000, duration: "4 Days / 3 Nights", days: 4, tags: ["Family", "Romantic", "Budget"], image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop&q=75", inclusions: ["Houseboat stay", "Backwater cruise", "Meals"], bestFor: "Slow family travel", popularity: 87 },
    { title: "Maldives Island Stay", destination: "Maldives", price: 90000, duration: "5 Days / 4 Nights", days: 5, tags: ["Beach", "Honeymoon", "Luxury", "International"], image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&auto=format&fit=crop&q=75", inclusions: ["Beach resort", "Speedboat transfers", "Snorkeling"], bestFor: "Honeymoon and luxury", popularity: 88 },
    { title: "Rajasthan Royal Tour", destination: "Rajasthan, India", price: 35000, duration: "6 Days / 5 Nights", days: 6, tags: ["Family", "Budget"], image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&auto=format&fit=crop&q=75", inclusions: ["Heritage hotels", "Fort tours", "Private transport"], bestFor: "Culture and heritage", popularity: 85 }
  ];

  const budgetDestinations = [
    { name: "Bali, Indonesia", base: 22000, flight: 28000, international: true },
    { name: "Paris, France", base: 34000, flight: 40000, international: true },
    { name: "Goa, India", base: 9000, flight: 15000, international: false },
    { name: "Manali, India", base: 12000, flight: 17000, international: false },
    { name: "Santorini, Greece", base: 38000, flight: 40000, international: true },
    { name: "Dubai, UAE", base: 28000, flight: 26000, international: true },
    { name: "Singapore", base: 25000, flight: 24000, international: true },
    { name: "Tokyo, Japan", base: 37000, flight: 39000, international: true },
    { name: "New York, USA", base: 44000, flight: 40000, international: true },
    { name: "Rome, Italy", base: 33000, flight: 39000, international: true },
    { name: "Kerala, India", base: 13000, flight: 16000, international: false },
    { name: "Maldives", base: 41000, flight: 30000, international: true },
    { name: "Rajasthan, India", base: 16000, flight: 17000, international: false }
  ];

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function money(value) {
    if (getCurrencyPreference() === "USD") {
      return `$${Math.round(Number(value || 0) / usdConversionRate).toLocaleString("en-US")}`;
    }

    if (typeof formatRupees === "function") {
      return formatRupees(value);
    }
    return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
  }

  function getCurrencyPreference() {
    try {
      return localStorage.getItem(currencyPreferenceKey) === "USD" ? "USD" : "INR";
    } catch (error) {
      return "INR";
    }
  }

  function setCurrencyPreference(currency) {
    try {
      localStorage.setItem(currencyPreferenceKey, currency);
    } catch (error) {}
  }

  function formatStaticPrice(amount, currency) {
    if (currency === "USD") {
      return `$${Math.round(Number(amount || 0) / usdConversionRate).toLocaleString("en-US")}`;
    }

    return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function parseAmount(value) {
    const match = String(value || "").replace(/,/g, "").match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  function parseDays(value) {
    const match = String(value || "").match(/\d+/);
    return match ? Number(match[0]) : 3;
  }

  function ratingStarsMarkup(rating) {
    const value = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    return `${"&#9733;".repeat(value)}${"&#9734;".repeat(5 - value)}`;
  }

  let flexibleResultRowFrame = 0;

  function getGridColumnCount(grid) {
    const style = window.getComputedStyle(grid);

    if (style.display !== "grid") {
      return 1;
    }

    const template = style.gridTemplateColumns || "";
    const columns = template.split(/\s+/).filter(function (column) {
      return column && column !== "none";
    });

    return Math.max(columns.length, 1);
  }

  function isVisibleResultCard(card) {
    if (card.hidden || card.classList.contains("is-filtered-out") || card.classList.contains("is-v13-hidden")) {
      return false;
    }

    const style = window.getComputedStyle(card);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  function fillResultGridLastRow(gridSelector, cardSelector) {
    const grid = document.querySelector(gridSelector);

    if (!grid) {
      return;
    }

    const allCards = Array.from(grid.querySelectorAll(cardSelector));
    allCards.forEach(function (card) {
      if (card.dataset.flexRowSpan) {
        card.style.gridColumn = "";
        delete card.dataset.flexRowSpan;
      }
    });

    const columns = getGridColumnCount(grid);
    const visibleCards = allCards.filter(isVisibleResultCard);

    if (columns <= 1 || !visibleCards.length) {
      return;
    }

    const remainder = visibleCards.length % columns;

    if (!remainder) {
      return;
    }

    let columnsLeft = columns;
    visibleCards.slice(-remainder).forEach(function (card, index, lastRowCards) {
      const cardsLeft = lastRowCards.length - index;
      const span = Math.ceil(columnsLeft / cardsLeft);
      columnsLeft -= span;

      if (span > 1) {
        card.style.gridColumn = `span ${span}`;
        card.dataset.flexRowSpan = String(span);
      }
    });
  }

  function refreshFlexibleResultRows() {
    fillResultGridLastRow(".package-grid", ".package-card");
    fillResultGridLastRow("#destinationsGrid", ".destination-card");
  }

  function scheduleFlexibleResultRows() {
    if (flexibleResultRowFrame) {
      return;
    }

    flexibleResultRowFrame = window.requestAnimationFrame(function () {
      flexibleResultRowFrame = 0;
      refreshFlexibleResultRows();
    });
  }

  window.refreshTravelResultRows = scheduleFlexibleResultRows;

  function getPackageCatalog() {
    const extras = typeof extraTravelPackages !== "undefined" && Array.isArray(extraTravelPackages) ? extraTravelPackages : [];
    const mappedExtras = extras.map(function (item, index) {
      const price = Number(item.amount || parseAmount(item.price));
      const tags = [];
      const text = `${item.title} ${item.destination} ${item.image}`.toLowerCase();
      if (text.includes("beach") || text.includes("island") || text.includes("lagoon")) tags.push("Beach");
      if (text.includes("adventure") || text.includes("road") || text.includes("river")) tags.push("Adventure");
      if (item.group || price < 55000) tags.push("Family");
      if (text.includes("romantic") || text.includes("venice") || text.includes("udaipur")) tags.push("Romantic", "Honeymoon");
      if (price < 30000) tags.push("Budget");
      if (price >= 80000) tags.push("Luxury");
      if (!String(item.destination).toLowerCase().includes("india")) tags.push("International");
      if (text.includes("ooty") || text.includes("darjeeling") || text.includes("hill")) tags.push("Hill Station");
      return {
        title: item.title,
        destination: item.destination,
        price,
        duration: item.duration,
        days: parseDays(item.duration),
        tags: Array.from(new Set(tags.length ? tags : ["Family"])),
        image: typeof destinationImages !== "undefined" && destinationImages[item.image] ? destinationImages[item.image] : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=75",
        inclusions: item.features || [],
        bestFor: price < 30000 ? "Budget-friendly travel" : price >= 80000 ? "Premium holidays" : "Flexible travelers",
        popularity: 70 + (index % 25)
      };
    });
    const byTitle = new Map();
    basePackages.concat(mappedExtras).forEach(function (item) {
      byTitle.set(item.title.toLowerCase(), item);
    });
    return Array.from(byTitle.values());
  }

  function packageByTitle(title) {
    return getPackageCatalog().find(function (item) {
      return item.title.toLowerCase() === String(title || "").toLowerCase();
    });
  }

  function bookingUrl(item) {
    return `contact.html?package=${encodeURIComponent(item.title || "Custom Trip")}&destination=${encodeURIComponent(item.destination || "") }#bookingForm`;
  }

  function toast(message, type, action) {
    if (typeof showToast === "function") {
      showToast(message, type || "success", action);
      return;
    }
    const fallback = document.createElement("div");
    fallback.className = `site-toast site-toast--${type || "success"}`;
    fallback.textContent = message;
    document.body.appendChild(fallback);
    setTimeout(function () { fallback.remove(); }, 3500);
  }

  function getSavedTrips() {
    try {
      return JSON.parse(localStorage.getItem(savedTripsKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function setSavedTrips(items) {
    try {
      localStorage.setItem(savedTripsKey, JSON.stringify(items));
    } catch (error) {
      toast("Wishlist could not be saved in this browser.", "error");
    }
  }

  function tripFromCard(card) {
    const titleNode = card.querySelector("h2, h3");
    const title = titleNode ? titleNode.textContent.trim() : "Travel Trip";
    const catalog = packageByTitle(title);
    const priceNode = card.querySelector(".price, .slider-meta strong, strong");
    const destination = catalog ? catalog.destination : title;
    const price = catalog ? catalog.price : parseAmount(priceNode ? priceNode.textContent : "");
    const type = card.classList.contains("destination-card") ? "destination" : "package";
    return {
      id: `${type}-${slug(title)}`,
      type,
      name: title,
      destination,
      packageName: catalog ? catalog.title : title,
      price,
      priceText: price ? money(price) : "Custom quote"
    };
  }

  function updateWishlistUi() {
    const saved = getSavedTrips();
    document.querySelectorAll(".wishlist-count").forEach(function (node) {
      node.textContent = saved.length;
    });
    document.querySelectorAll("#savedCount").forEach(function (node) {
      node.textContent = `Saved trips: ${saved.length}`;
    });
    document.querySelectorAll(".v13-save-btn").forEach(function (button) {
      const isSaved = saved.some(function (item) { return item.id === button.dataset.tripId; });
      button.classList.toggle("is-saved", isSaved);
      button.innerHTML = isSaved ? "&#9829;" : "&#9825;";
      button.setAttribute("aria-label", isSaved ? "Remove from saved trips" : "Save trip");
    });
    renderWishlistDrawer();
  }

  function ensureWishlistNav() {
    document.querySelectorAll(".navbar").forEach(function (navbar) {
      if (navbar.querySelector(".wishlist-nav-btn")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wishlist-nav-btn";
      button.setAttribute("aria-label", "Open saved trips");
      button.innerHTML = '<i class="fas fa-heart"></i><span>Saved</span><span class="wishlist-count">0</span>';
      button.addEventListener("click", openWishlistDrawer);
      navbar.appendChild(button);
    });
  }

  function ensureWishlistDrawer() {
    if (document.getElementById("wishlistDrawer")) return;
    const drawer = document.createElement("aside");
    drawer.className = "wishlist-drawer";
    drawer.id = "wishlistDrawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = `
      <div class="wishlist-backdrop" data-close-wishlist></div>
      <div class="wishlist-panel" role="dialog" aria-modal="true" aria-labelledby="wishlistTitle">
        <div class="wishlist-head">
          <div>
            <p class="hero-kicker">Saved Trips</p>
            <h2 id="wishlistTitle">My Wishlist</h2>
          </div>
          <button type="button" class="v13-close-btn" data-close-wishlist aria-label="Close saved trips"><i class="fas fa-times"></i></button>
        </div>
        <div class="saved-trip-list" id="savedTripList"></div>
      </div>
    `;
    drawer.addEventListener("click", function (event) {
      if (event.target.closest("[data-close-wishlist]")) closeWishlistDrawer();
      const remove = event.target.closest("[data-remove-trip]");
      if (remove) {
        setSavedTrips(getSavedTrips().filter(function (item) { return item.id !== remove.dataset.removeTrip; }));
        updateWishlistUi();
      }
    });
    document.body.appendChild(drawer);
  }

  function openWishlistDrawer() {
    ensureWishlistDrawer();
    const drawer = document.getElementById("wishlistDrawer");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    renderWishlistDrawer();
  }

  function closeWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  function renderWishlistDrawer() {
    const list = document.getElementById("savedTripList");
    if (!list) return;
    const saved = getSavedTrips();
    if (!saved.length) {
      list.innerHTML = `
        <div class="v13-empty-state wishlist-empty-state">
          <strong>No saved trips yet</strong>
          <span>Tap a heart on any destination or package to build your shortlist.</span>
          <a href="packages.html" class="btn btn-small">Browse Packages</a>
        </div>
      `;
      return;
    }
    list.innerHTML = saved.map(function (item) {
      const linkItem = { title: item.packageName || item.name, destination: item.destination || item.name };
      return `
        <article class="saved-trip-item">
          <div>
            <strong>${item.name}</strong>
            <p>${item.destination || item.type} - ${item.priceText || "Custom quote"}</p>
          </div>
          <div class="saved-trip-actions">
            <a class="btn btn-small" href="${bookingUrl(linkItem)}">Book Now</a>
            <button type="button" class="btn btn-outline btn-small" data-remove-trip="${item.id}">Remove</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function decorateSaveButtons() {
    document.querySelectorAll(".save-btn").forEach(function (button) {
      button.remove();
    });
    document.querySelectorAll(".package-card, .destination-card, .v13-featured-card, .v13-trending-card").forEach(function (card) {
      if (card.querySelector(".v13-save-btn")) return;
      const item = tripFromCard(card);
      let actionBox = card.querySelector(".v13-card-top-actions");
      if (!actionBox) {
        actionBox = document.createElement("div");
        actionBox.className = "v13-card-top-actions";
        card.appendChild(actionBox);
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "v13-save-btn";
      button.dataset.tripId = item.id;
      button.innerHTML = "&#9825;";
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const saved = getSavedTrips();
        const existing = saved.some(function (savedItem) { return savedItem.id === item.id; });
        if (existing) {
          setSavedTrips(saved.filter(function (savedItem) { return savedItem.id !== item.id; }));
          toast(`${item.name} removed from your wishlist.`, "success");
        } else {
          saved.push(item);
          setSavedTrips(saved);
          toast(`${item.name} saved to your wishlist!`, "success");
        }
        updateWishlistUi();
      });
      actionBox.appendChild(button);
    });
    updateWishlistUi();
  }

  function initWishlistClearButtons() {
    document.querySelectorAll("#clearSaved").forEach(function (button) {
      if (button.dataset.v13WishlistReady) return;
      button.dataset.v13WishlistReady = "true";
      button.addEventListener("click", function () {
        setSavedTrips([]);
        updateWishlistUi();
        toast("Wishlist cleared.", "success");
      });
    });
  }

  function initCurrencyToggle() {
    document.querySelectorAll(".navbar").forEach(function (navbar) {
      if (navbar.querySelector(".currency-toggle-btn")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "currency-toggle-btn";
      button.setAttribute("aria-label", "Toggle currency");
      button.addEventListener("click", function () {
        const next = getCurrencyPreference() === "INR" ? "USD" : "INR";
        setCurrencyPreference(next);
        updateCurrencyToggleLabels();
        applyCurrencyToPage();
        toast(`Prices switched to ${next}.`, "success");
      });
      navbar.appendChild(button);
    });
    updateCurrencyToggleLabels();
    applyCurrencyToPage();
  }

  function initNewsletterSignup() {
    document.querySelectorAll(".footer-container").forEach(function (footer, index) {
      if (footer.querySelector(".newsletter-signup")) return;
      const form = document.createElement("form");
      form.className = "newsletter-signup";
      form.innerHTML = `
        <label for="newsletterEmail${index}">
          <span>Get travel deals</span>
          <div>
            <input type="email" id="newsletterEmail${index}" name="newsletterEmail" placeholder="Email address" autocomplete="email" required />
            <button type="submit" class="btn btn-small">Join</button>
          </div>
        </label>
        <p class="newsletter-status" aria-live="polite"></p>
      `;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const input = form.elements.newsletterEmail;
        const status = form.querySelector(".newsletter-status");
        const email = input.value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          status.textContent = "Enter a valid email address.";
          toast("Please enter a valid email address.", "error");
          return;
        }

        try {
          localStorage.setItem(newsletterKey, email);
        } catch (error) {}

        status.textContent = "Saved locally for demo signup.";
        input.value = "";
        toast("Thanks! Travel deals signup saved locally.", "success");
      });
      footer.appendChild(form);
    });
  }

  function updateCurrencyToggleLabels() {
    const currency = getCurrencyPreference();
    document.querySelectorAll(".currency-toggle-btn").forEach(function (button) {
      button.innerHTML = `<i class="fas fa-coins"></i><span>${currency}</span>`;
    });
  }

  function capturePriceOriginal(element) {
    if (!element.dataset.priceOriginal) {
      element.dataset.priceOriginal = element.textContent.trim();
    }

    if (!element.dataset.priceInr) {
      const amount = parseAmount(element.dataset.priceOriginal);

      if (amount) {
        element.dataset.priceInr = String(amount);
      }
    }
  }

  function updatePriceText(element, currency) {
    capturePriceOriginal(element);
    const amount = Number(element.dataset.priceInr || 0);

    if (!amount) {
      return;
    }

    const replacement = formatStaticPrice(amount, currency);
    const original = element.dataset.priceOriginal;
    const pattern = /(From\s*)?(?:Rs\.|₹)\s*[\d,]+/i;

    if (pattern.test(original)) {
      element.textContent = original.replace(pattern, function (match, fromLabel) {
        return `${fromLabel || ""}${replacement}`;
      });
    } else {
      element.textContent = replacement;
    }
  }

  function applyCurrencyToPage() {
    const currency = getCurrencyPreference();
    const priceSelectors = [
      ".price",
      ".offer-card > strong",
      ".slider-meta strong",
      ".v13-trending-content strong",
      ".v13-featured-card .card-meta span",
      ".compare-card strong",
      ".budget-output strong"
    ];

    document.querySelectorAll(priceSelectors.join(",")).forEach(function (element) {
      updatePriceText(element, currency);
    });

    ["packageMinPrice", "estimateTravelers"].forEach(function (id) {
      const control = document.getElementById(id);
      if (control) {
        control.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }

  function initBookingStepper() {
    const form = document.getElementById("bookingForm");
    if (!form || !form.classList.contains("booking-stepper-form")) return;
    const steps = Array.from(form.querySelectorAll(".booking-step"));
    const progress = Array.from(form.querySelectorAll(".stepper-item"));
    const destinationSelect = form.elements.destination;
    const packageSelect = form.elements.package;
    const budgetRange = form.elements.approxBudget;
    const budgetReadout = form.querySelector("[data-budget-readout]");
    const travelerInput = form.elements.travelers;
    const params = new URLSearchParams(window.location.search);
    let currentStep = 0;

    function fillDestinations() {
      const names = Array.from(new Set(budgetDestinations.map(function (item) { return item.name; }).concat(getPackageCatalog().map(function (item) { return item.destination; })))).filter(Boolean);
      destinationSelect.innerHTML = '<option value="">Choose destination</option>' + names.map(function (name) {
        return `<option value="${name}">${name}</option>`;
      }).join("");
    }

    function fillPackages() {
      const selectedDestination = destinationSelect.value;
      const selectedPackage = packageSelect.dataset.selected || params.get("package") || packageSelect.value;
      const matches = getPackageCatalog().filter(function (item) {
        return !selectedDestination || item.destination === selectedDestination;
      });
      packageSelect.innerHTML = '<option value="">Choose package</option>' + matches.map(function (item) {
        return `<option value="${item.title}">${item.title}</option>`;
      }).join("") + '<option value="Custom Trip">Custom Trip</option>';
      if (selectedPackage) {
        const option = Array.from(packageSelect.options).find(function (item) {
          return item.value.toLowerCase() === selectedPackage.toLowerCase();
        });
        if (option) packageSelect.value = option.value;
      }
    }

    function updateBudget() {
      if (budgetReadout) budgetReadout.textContent = money(Number(budgetRange.value));
    }

    function updateTraveler(delta) {
      const next = Math.max(1, Math.min(20, Number(travelerInput.value || 1) + delta));
      travelerInput.value = next;
    }

    function setDateMin() {
      const dateInput = form.elements.travelDate;
      if (!dateInput) return;
      const today = new Date();
      const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateInput.min = iso;
    }

    function setStep(index) {
      currentStep = Math.max(0, Math.min(steps.length - 1, index));
      steps.forEach(function (step, stepIndex) {
        step.classList.toggle("is-active", stepIndex === currentStep);
      });
      progress.forEach(function (item, itemIndex) {
        item.classList.toggle("is-active", itemIndex === currentStep);
        item.classList.toggle("is-complete", itemIndex < currentStep);
      });
      if (currentStep === 2) renderSummary();
    }

    function validateStep(index) {
      const step = steps[index];
      const error = step.querySelector(".step-error");
      const fields = Array.from(step.querySelectorAll("input, select, textarea")).filter(function (field) {
        return !field.disabled && field.type !== "button" && field.type !== "submit";
      });
      const invalid = fields.find(function (field) {
        if (field.type === "radio") {
          return field.required && !form.elements[field.name].value;
        }
        return field.required && !field.value.trim();
      });
      if (invalid) {
        if (error) error.textContent = "Please complete the required fields before continuing.";
        invalid.focus();
        return false;
      }
      if (error) error.textContent = "";
      return true;
    }

    function value(name) {
      return form.elements[name] ? form.elements[name].value : "";
    }

    function renderSummary() {
      const summary = form.querySelector("#bookingSummary");
      if (!summary) return;
      const rows = [
        ["Destination", value("destination")],
        ["Package", value("package")],
        ["Travel Type", value("travelType")],
        ["Budget", money(Number(value("approxBudget") || 0))],
        ["Name", value("bookingName")],
        ["Email", value("bookingEmail")],
        ["Phone", `+91 ${value("bookingPhone")}`],
        ["Travel Date", value("travelDate")],
        ["Travelers", value("travelers")],
        ["Traveler Type", value("travelersType")],
        ["EMI Needed", value("emiNeeded")],
        ["Preferred Contact", value("preferredContact")],
        ["Requests", value("bookingNotes") || "No special requests added"]
      ];
      summary.innerHTML = rows.map(function (row) {
        return `<div class="summary-row"><span>${row[0]}</span><strong>${row[1] || "Not selected"}</strong></div>`;
      }).join("");
    }

    fillDestinations();
    if (params.get("destination")) destinationSelect.value = params.get("destination");
    fillPackages();
    if (params.get("package")) packageSelect.value = params.get("package");
    setDateMin();
    updateBudget();
    setStep(0);

    destinationSelect.addEventListener("change", function () {
      packageSelect.dataset.selected = "";
      fillPackages();
    });
    packageSelect.addEventListener("change", function () {
      packageSelect.dataset.selected = packageSelect.value;
    });
    if (budgetRange) budgetRange.addEventListener("input", updateBudget);
    form.querySelectorAll("[data-traveler-step]").forEach(function (button) {
      button.addEventListener("click", function () { updateTraveler(Number(button.dataset.travelerStep)); });
    });
    form.querySelectorAll("[data-next-step]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (validateStep(currentStep)) setStep(currentStep + 1);
      });
    });
    form.querySelectorAll("[data-prev-step]").forEach(function (button) {
      button.addEventListener("click", function () { setStep(currentStep - 1); });
    });
    form.querySelectorAll("[data-edit-step]").forEach(function (button) {
      button.addEventListener("click", function () { setStep(Number(button.dataset.editStep)); });
    });
    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        setStep(0);
        updateBudget();
      }, 0);
    });
    form.addEventListener("submit", function (event) {
      if (currentStep !== 2 || !validateStep(2)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setStep(currentStep);
        return;
      }
      form.dataset.readyToSubmit = "true";
      renderSummary();
    }, true);
  }

  function initPackageFilters() {
    const grid = document.querySelector(".package-grid");
    const listSection = document.querySelector(".package-list-section");
    if (!grid || !listSection || document.querySelector(".v13-package-filter")) return;
    const filter = document.createElement("section");
    filter.className = "v13-package-filter";
    filter.innerHTML = `
      <div class="package-filter-grid">
        <label>Search packages
          <input type="search" id="packageSearch" placeholder="Search destinations..." autocomplete="off" />
        </label>
        <label class="price-range-group">Price range
          <div class="dual-range">
            <input type="range" id="packageMinPrice" min="10000" max="150000" step="1000" value="10000" aria-label="Minimum package price" />
            <input type="range" id="packageMaxPrice" min="10000" max="150000" step="1000" value="150000" aria-label="Maximum package price" />
          </div>
          <span class="v13-readout" id="packagePriceReadout">Rs. 10,000 - Rs. 1,50,000</span>
        </label>
        <label>Sort
          <select id="packageSort">
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration-asc">Duration: Shortest</option>
            <option value="popular">Most Popular</option>
          </select>
        </label>
      </div>
      <div class="package-results-line">
        <div class="v13-filter-chips" aria-label="Package filters">
          ${["All", "Beach", "Adventure", "Family", "Honeymoon", "Luxury", "Budget", "International"].map(function (tag) { return `<button type="button" class="v13-chip${tag === "All" ? " is-active" : ""}" data-package-filter="${tag.toLowerCase()}">${tag}</button>`; }).join("")}
        </div>
        <div class="result-line-actions">
          <span id="packageResultsCount">Showing packages</span>
          <button type="button" class="btn btn-outline btn-small" id="resetPackageFilters">Reset Filters</button>
        </div>
      </div>
    `;
    listSection.parentNode.insertBefore(filter, listSection);

    const cards = Array.from(grid.querySelectorAll(".package-card"));
    cards.forEach(function (card, index) {
      const title = card.querySelector("h2") ? card.querySelector("h2").textContent.trim() : "Package";
      const catalog = packageByTitle(title);
      const amount = catalog ? catalog.price : parseAmount(card.querySelector(".price") ? card.querySelector(".price").textContent : "");
      const durationText = catalog ? catalog.duration : (card.querySelector(".card-content > p") ? card.querySelector(".card-content > p").textContent.trim() : "3 Days");
      const tags = catalog ? catalog.tags : (amount < 30000 ? ["Budget", "Family"] : ["Family"]);
      card.dataset.packageTitle = title;
      card.dataset.packageDestination = catalog ? catalog.destination : title;
      card.dataset.packagePrice = amount;
      card.dataset.packageDays = catalog ? catalog.days : parseDays(durationText);
      card.dataset.packageTags = tags.join(" ").toLowerCase();
      card.dataset.packagePopular = catalog ? catalog.popularity : 60 + index;
      const meta = card.querySelector(".card-meta");
      if (meta && !card.querySelector(".v13-package-tags")) {
        meta.insertAdjacentHTML("afterend", `<div class="tag-row v13-package-tags">${tags.slice(0, 4).map(function (tag) { return `<span class="tag">${tag}</span>`; }).join("")}</div>`);
      }
      if (!card.querySelector(".v13-compare-check")) {
        let actionBox = card.querySelector(".v13-card-top-actions");
        if (!actionBox) {
          actionBox = document.createElement("div");
          actionBox.className = "v13-card-top-actions";
          card.appendChild(actionBox);
        }
        const compare = document.createElement("label");
        compare.className = "v13-compare-check";
        compare.innerHTML = `<input type="checkbox" data-compare-package="${slug(title)}" aria-label="Compare ${title}" />`;
        actionBox.prepend(compare);
      }
      const content = card.querySelector(".card-content");
      const book = content ? content.querySelector("a.btn") : null;
      if (content && book && !content.querySelector(".v13-card-action-row")) {
        const row = document.createElement("div");
        row.className = "v13-card-action-row";
        book.parentNode.insertBefore(row, book);
        row.appendChild(book);
        const compareButton = document.createElement("button");
        compareButton.type = "button";
        compareButton.className = "btn btn-outline";
        compareButton.textContent = "Compare";
        compareButton.dataset.compareButton = slug(title);
        row.appendChild(compareButton);
      }
    });

    const search = document.getElementById("packageSearch");
    const minRange = document.getElementById("packageMinPrice");
    const maxRange = document.getElementById("packageMaxPrice");
    const priceReadout = document.getElementById("packagePriceReadout");
    const sort = document.getElementById("packageSort");
    const count = document.getElementById("packageResultsCount");
    const reset = document.getElementById("resetPackageFilters");
    const chips = Array.from(document.querySelectorAll("[data-package-filter]"));
    let active = "all";
    const empty = document.createElement("p");
    empty.className = "v13-empty-state";
    empty.textContent = "No packages found. Try changing your filters.";
    empty.hidden = true;
    grid.after(empty);

    function apply() {
      let min = Number(minRange.value);
      let max = Number(maxRange.value);
      if (min > max) {
        const temp = min;
        min = max;
        max = temp;
      }
      priceReadout.textContent = `${money(min)} - ${money(max)}`;
      const query = String(search.value || "").toLowerCase();
      let visible = cards.filter(function (card) {
        const price = Number(card.dataset.packagePrice);
        const text = `${card.dataset.packageTitle} ${card.dataset.packageDestination} ${card.dataset.packageTags} ${card.textContent}`.toLowerCase();
        const matchesSearch = !query || text.includes(query);
        const matchesTag = active === "all" || card.dataset.packageTags.includes(active) || (active === "budget" && price < 30000);
        const matchesPrice = price >= min && price <= max;
        const show = matchesSearch && matchesTag && matchesPrice;
        card.classList.toggle("is-v13-hidden", !show);
        return show;
      });
      visible.sort(function (a, b) {
        if (sort.value === "price-asc") return Number(a.dataset.packagePrice) - Number(b.dataset.packagePrice);
        if (sort.value === "price-desc") return Number(b.dataset.packagePrice) - Number(a.dataset.packagePrice);
        if (sort.value === "duration-asc") return Number(a.dataset.packageDays) - Number(b.dataset.packageDays);
        if (sort.value === "popular") return Number(b.dataset.packagePopular) - Number(a.dataset.packagePopular);
        return cards.indexOf(a) - cards.indexOf(b);
      }).forEach(function (card) { grid.appendChild(card); });
      count.textContent = `Showing ${visible.length} package${visible.length === 1 ? "" : "s"}`;
      empty.hidden = visible.length > 0;
      scheduleFlexibleResultRows();
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        active = chip.dataset.packageFilter;
        chips.forEach(function (item) { item.classList.toggle("is-active", item === chip); });
        apply();
      });
    });
    [search, minRange, maxRange, sort].forEach(function (control) { control.addEventListener("input", apply); control.addEventListener("change", apply); });
    if (reset) {
      reset.addEventListener("click", function () {
        search.value = "";
        minRange.value = "10000";
        maxRange.value = "150000";
        sort.value = "default";
        active = "all";
        chips.forEach(function (item) { item.classList.toggle("is-active", item.dataset.packageFilter === "all"); });
        apply();
        toast("Package filters reset.", "success");
      });
    }
    apply();
    setupPackageComparison(cards);
  }

  function initDestinationResetButton() {
    const panel = document.querySelector(".search-panel");
    const tools = panel ? panel.querySelector(".saved-tools") : null;

    if (!panel || !tools || document.getElementById("resetDestinationFilters")) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline btn-small";
    button.id = "resetDestinationFilters";
    button.textContent = "Reset Filters";
    button.addEventListener("click", function () {
      if (typeof resetDestinationControls === "function") {
        resetDestinationControls();
      }

      if (typeof applyDestinationFilters === "function") {
        applyDestinationFilters();
      }

      toast("Destination filters reset.", "success");
    });
    tools.appendChild(button);
  }

  function setupPackageComparison(cards) {
    if (document.getElementById("compareStickyBar")) return;
    const bar = document.createElement("div");
    bar.className = "compare-sticky-bar";
    bar.id = "compareStickyBar";
    bar.innerHTML = '<strong id="compareStickyText">Compare 2 packages</strong><button type="button" class="btn" id="openCompareModal">Compare Packages</button>';
    document.body.appendChild(bar);

    const modal = document.createElement("div");
    modal.className = "v13-modal";
    modal.id = "compareModal";
    modal.innerHTML = `
      <div class="v13-modal-panel" role="dialog" aria-modal="true" aria-labelledby="compareTitle">
        <div class="v13-modal-head">
          <div><p class="hero-kicker">Package Comparison</p><h2 id="compareTitle">Compare Your Shortlist</h2></div>
          <button type="button" class="v13-close-btn" data-close-compare aria-label="Close comparison"><i class="fas fa-times"></i></button>
        </div>
        <div class="compare-modal-grid" id="compareModalGrid"></div>
      </div>
    `;
    modal.addEventListener("click", function (event) {
      if (event.target === modal || event.target.closest("[data-close-compare]")) modal.classList.remove("is-open");
    });
    document.body.appendChild(modal);

    function checkedCards() {
      return cards.filter(function (card) {
        const input = card.querySelector("[data-compare-package]");
        return input && input.checked;
      });
    }

    function syncBar() {
      const selected = checkedCards();
      bar.classList.toggle("is-visible", selected.length >= 2);
      const text = document.getElementById("compareStickyText");
      if (text) text.textContent = `Compare ${selected.length} packages`;
    }

    function openModal() {
      const selected = checkedCards();
      if (selected.length < 2) {
        toast("Select 2 or 3 packages to compare.", "error");
        return;
      }
      const best = selected.slice().sort(function (a, b) {
        return Number(a.dataset.packagePrice) / Number(a.dataset.packageDays) - Number(b.dataset.packagePrice) / Number(b.dataset.packageDays);
      })[0];
      const grid = document.getElementById("compareModalGrid");
      grid.innerHTML = selected.map(function (card) {
        const title = card.dataset.packageTitle;
        const catalog = packageByTitle(title);
        const features = catalog ? catalog.inclusions : Array.from(card.querySelectorAll(".feature-list li")).map(function (li) { return li.textContent.trim(); });
        const item = catalog || {
          title,
          destination: card.dataset.packageDestination,
          price: Number(card.dataset.packagePrice),
          duration: `${card.dataset.packageDays} Days`,
          bestFor: "Flexible travel",
          tags: card.dataset.packageTags.split(" ")
        };
        return `
          <article class="compare-modal-card${card === best ? " is-best" : ""}">
            ${card === best ? '<span class="trend-badge">Best Value</span>' : ""}
            <h3>${item.title}</h3>
            <p>${item.destination}</p>
            <strong>${money(item.price)}</strong>
            <span>${item.duration}</span>
            <small>Best for: ${item.bestFor}</small>
            <ul>${features.map(function (feature) { return `<li>${feature}</li>`; }).join("")}</ul>
            <a class="btn" href="${bookingUrl(item)}">Book This</a>
          </article>
        `;
      }).join("");
      modal.classList.add("is-open");
    }

    cards.forEach(function (card) {
      const checkbox = card.querySelector("[data-compare-package]");
      const compareButton = card.querySelector("[data-compare-button]");
      if (checkbox) {
        checkbox.addEventListener("change", function () {
          const selected = checkedCards();
          if (selected.length > 3) {
            checkbox.checked = false;
            toast("You can compare up to 3 packages at once.", "error");
          }
          syncBar();
        });
      }
      if (compareButton && checkbox) {
        compareButton.addEventListener("click", function () {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        });
      }
    });
    document.getElementById("openCompareModal").addEventListener("click", openModal);
  }

  function initHomeFeaturedTrips() {
    const section = document.querySelector(".home-slider-section");
    if (!section || section.dataset.v13Ready) return;
    section.dataset.v13Ready = "true";
    const trips = basePackages.slice(0, 6);
    section.innerHTML = `
      <div class="section-heading-left">
        <p class="hero-kicker">Featured Trips</p>
        <h2>Plan a trip that matches your mood</h2>
        <p>Filter by travel style and book a trip with clear pricing, duration, and inclusions.</p>
      </div>
      <div class="v13-filter-chips" aria-label="Featured trip filters">
        ${["All", "Beach", "Adventure", "Family", "Romantic", "Luxury", "Budget", "Hill Station", "International"].map(function (tag) { return `<button type="button" class="v13-chip${tag === "All" ? " is-active" : ""}" data-featured-filter="${tag.toLowerCase()}">${tag}</button>`; }).join("")}
      </div>
      <div class="v13-featured-grid">
        ${trips.map(function (trip) {
          return `
            <article class="v13-featured-card" data-featured-tags="${trip.tags.join(" ").toLowerCase()}">
              <img src="${trip.image}" alt="${trip.title}" loading="lazy" width="640" height="420" />
              <div class="v13-featured-content">
                <div class="card-meta"><h3>${trip.title}</h3><span class="price">${money(trip.price)}</span></div>
                <div class="tag-row">${trip.tags.slice(0, 4).map(function (tag) { return `<span class="tag">${tag}</span>`; }).join("")}</div>
                <p>${trip.duration} - ${trip.bestFor}</p>
                <a class="btn" href="${bookingUrl(trip)}">Book Now</a>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
    const chips = Array.from(section.querySelectorAll("[data-featured-filter]"));
    const cards = Array.from(section.querySelectorAll(".v13-featured-card"));
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        const filter = chip.dataset.featuredFilter;
        chips.forEach(function (item) { item.classList.toggle("is-active", item === chip); });
        cards.forEach(function (card) {
          card.classList.toggle("is-v13-hidden", filter !== "all" && !card.dataset.featuredTags.includes(filter));
        });
      });
    });
  }

  function initTrendingSlider() {
    const oldGrid = document.querySelector(".compact-trending-grid");
    if (!oldGrid || oldGrid.dataset.v13Ready) return;
    oldGrid.dataset.v13Ready = "true";
    const trending = [
      ["Goa Beach Escape", "Goa, India", 18000, "Beach-ready getaway", "Hot", "4.8", "services1.jpg"],
      ["Premium Bali Tour", "Bali, Indonesia", 40000, "Couples and beach favorite", "Popular", "4.9", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop&q=75"],
      ["Manali Adventure Holiday", "Manali, India", 24000, "Mountain adventure pick", "Hot", "4.7", "services2.jpg"],
      ["Dubai Desert Luxury", "Dubai, UAE", 58000, "Premium city escape", "Luxury", "4.8", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=75"],
      ["Kerala Backwater Retreat", "Kerala, India", 26000, "Slow travel favorite", "New", "4.6", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop&q=75"],
      ["Maldives Island Stay", "Maldives", 90000, "Island resort escape", "Popular", "4.9", "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&auto=format&fit=crop&q=75"],
      ["Rajasthan Royal Tour", "Rajasthan, India", 35000, "Heritage and culture route", "Culture", "4.7", "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&auto=format&fit=crop&q=75"],
      ["Singapore Family Fun", "Singapore", 50000, "Family city break", "Family", "4.8", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&auto=format&fit=crop&q=75"]
    ];
    oldGrid.className = "v13-trending-wrap";
    oldGrid.innerHTML = `
      <div class="v13-slider-arrows">
        <button type="button" class="v13-arrow" data-trending-prev aria-label="Previous trending destination"><i class="fas fa-chevron-left"></i></button>
        <button type="button" class="v13-arrow" data-trending-next aria-label="Next trending destination"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="v13-trending-track" id="v13TrendingTrack">
        ${trending.map(function (item) {
          const trip = { title: item[0], destination: item[1], price: item[2] };
          return `
            <article class="v13-trending-card">
              <span class="hot-badge">${item[4]}</span>
              <img src="${item[6]}" alt="${item[0]}" loading="lazy" width="640" height="420" />
              <div class="v13-trending-content">
                <h3>${item[0]}</h3>
                <p>${item[1]}</p>
                <strong>From ${money(item[2])}</strong>
                <span>${item[3]}</span>
                <span class="v13-stars" aria-label="${item[5]} star rating">${ratingStarsMarkup(item[5])} ${item[5]}</span>
                <a class="btn btn-small" href="${bookingUrl(trip)}">Book Now</a>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
    const track = document.getElementById("v13TrendingTrack");
    const move = function (dir) { track.scrollBy({ left: dir * Math.max(260, track.clientWidth * 0.85), behavior: "smooth" }); };
    oldGrid.querySelector("[data-trending-prev]").addEventListener("click", function () { move(-1); });
    oldGrid.querySelector("[data-trending-next]").addEventListener("click", function () { move(1); });
    let timer = setInterval(function () {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 20) track.scrollTo({ left: 0, behavior: "smooth" });
      else move(1);
    }, 4000);
    oldGrid.addEventListener("mouseenter", function () { clearInterval(timer); });
    oldGrid.addEventListener("mouseleave", function () { timer = setInterval(function () { if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 20) track.scrollTo({ left: 0, behavior: "smooth" }); else move(1); }, 4000); });
  }

  function initBudgetEstimator() {
    const aiSection = document.querySelector(".ai-planner-section");
    if (!aiSection || document.getElementById("tripBudgetEstimator")) return;
    const section = document.createElement("section");
    section.className = "section v13-budget-estimator";
    section.id = "tripBudgetEstimator";
    section.innerHTML = `
      <div class="section-heading-left">
        <p class="hero-kicker">Budget Estimator</p>
        <h2>Estimate Your Trip Budget</h2>
        <p>Choose destination, travelers, stay tier, duration, flights, and insurance to get an instant cost breakdown.</p>
      </div>
      <div class="v13-budget-grid">
        <div class="v13-budget-card">
          <label>Destination
            <select id="estimateDestination">${budgetDestinations.map(function (item) { return `<option value="${item.name}">${item.name}</option>`; }).join("")}</select>
          </label>
          <label>Travelers: <span class="v13-readout" id="estimateTravelersOut">2</span>
            <input type="range" id="estimateTravelers" min="1" max="10" value="2" />
          </label>
          <div><strong>Accommodation tier</strong><div class="v13-tier-options" id="estimateTier">${["Budget", "Standard", "Premium", "Luxury"].map(function (tier, index) { return `<button type="button" class="v13-pill${index === 1 ? " is-active" : ""}" data-tier="${tier.toLowerCase()}">${tier}</button>`; }).join("")}</div></div>
          <div><strong>Trip duration</strong><div class="v13-duration-options" id="estimateDuration">${[3, 5, 7, 10].map(function (days, index) { return `<button type="button" class="v13-pill${index === 1 ? " is-active" : ""}" data-days="${days}">${days} days</button>`; }).join("")}</div></div>
          <div class="pill-group">
            <label class="v13-pill"><input type="checkbox" id="estimateFlights" checked /> Include flights</label>
            <label class="v13-pill"><input type="checkbox" id="estimateInsurance" checked /> Include insurance</label>
          </div>
        </div>
        <div class="v13-budget-output">
          <span>Total estimate</span>
          <strong class="v13-budget-total" id="estimateTotal">Rs. 0</strong>
          <table class="v13-breakdown"><tbody id="estimateBreakdown"></tbody></table>
          <p id="estimateEmi">Or pay monthly with 0% EMI.</p>
          <a class="btn" id="estimateBookLink" href="contact.html#bookingForm">Book This Trip</a>
        </div>
      </div>
    `;
    aiSection.insertAdjacentElement("afterend", section);
    const multipliers = { budget: 0.8, standard: 1, premium: 1.35, luxury: 1.8 };
    let tier = "standard";
    let days = 5;
    function calculate() {
      const destination = budgetDestinations.find(function (item) { return item.name === document.getElementById("estimateDestination").value; }) || budgetDestinations[0];
      const travelers = Number(document.getElementById("estimateTravelers").value);
      const includeFlights = document.getElementById("estimateFlights").checked;
      const includeInsurance = document.getElementById("estimateInsurance").checked;
      const accommodation = Math.round(destination.base * multipliers[tier] * travelers * (days / 3));
      const meals = Math.round(1300 * travelers * days * multipliers[tier]);
      const sightseeing = Math.round(2200 * travelers * Math.ceil(days / 2));
      const transport = Math.round((destination.international ? 4200 : 2600) * travelers * Math.ceil(days / 3));
      const flights = includeFlights ? destination.flight * travelers : 0;
      const insurance = includeInsurance ? 500 * travelers : 0;
      const rows = { Accommodation: accommodation, Meals: meals, Sightseeing: sightseeing, Transport: transport };
      if (flights) rows.Flights = flights;
      if (insurance) rows.Insurance = insurance;
      const total = Object.values(rows).reduce(function (sum, amount) { return sum + amount; }, 0);
      document.getElementById("estimateTravelersOut").textContent = travelers;
      document.getElementById("estimateTotal").textContent = money(total);
      document.getElementById("estimateBreakdown").innerHTML = Object.keys(rows).map(function (key) { return `<tr><td>${key}</td><td>${money(rows[key])}</td></tr>`; }).join("");
      document.getElementById("estimateEmi").textContent = `Or pay ${money(Math.ceil(total / 12))}/month for 12 months (0% EMI).`;
      document.getElementById("estimateBookLink").href = `contact.html?destination=${encodeURIComponent(destination.name)}#bookingForm`;
    }
    section.querySelectorAll("[data-tier]").forEach(function (button) {
      button.addEventListener("click", function () { tier = button.dataset.tier; section.querySelectorAll("[data-tier]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); calculate(); });
    });
    section.querySelectorAll("[data-days]").forEach(function (button) {
      button.addEventListener("click", function () { days = Number(button.dataset.days); section.querySelectorAll("[data-days]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); calculate(); });
    });
    section.querySelectorAll("input, select").forEach(function (field) { field.addEventListener("input", calculate); field.addEventListener("change", calculate); });
    calculate();
  }

  function enhanceAiPlannerWhatsAppShare() {
    const form = document.getElementById("aiPlannerForm");
    const result = document.getElementById("aiPlannerResult");
    if (!form || !result || result.dataset.aiShareReady) return;
    result.dataset.aiShareReady = "true";
    result.addEventListener("click", function (event) {
      const copyButton = event.target.closest("[data-copy-ai-plan]");
      if (copyButton) {
        copyAiPlanLink(result);
      }

      const whatsappButton = event.target.closest("[data-whatsapp-ai-plan]");
      if (whatsappButton) {
        const message = result.innerText.replace(/\s+/g, " ").trim();
        const shareUrl = buildAiPlanShareUrl(result);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${message}\n\nOpen plan: ${shareUrl}`)}`, "_blank", "noopener");
      }
    });
  }

  function buildAiPlanShareUrl(result) {
    const url = new URL("index.html", window.location.href);
    const title = result.querySelector("h3") ? result.querySelector("h3").textContent.trim() : "Custom Trip";

    url.searchParams.set("tripPlan", "1");
    url.searchParams.set("destination", result.dataset.shareDestination || title);
    url.searchParams.set("budget", result.dataset.shareBudget || document.getElementById("aiBudget").value || "40000");
    url.searchParams.set("days", result.dataset.shareDays || document.getElementById("aiDays").value || "5");
    url.searchParams.set("travelers", result.dataset.shareTravelers || document.getElementById("aiTravelers").value || "2");
    url.searchParams.set("type", result.dataset.shareType || document.getElementById("aiTravelType").value || "beach");
    url.hash = "aiPlanner";

    return url.toString();
  }

  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value);
    }

    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
    return Promise.resolve();
  }

  function copyAiPlanLink(result) {
    copyText(buildAiPlanShareUrl(result))
      .then(function () {
        toast("Shareable trip plan link copied.", "success");
      })
      .catch(function () {
        toast("Could not copy the link. Please copy it from the address bar.", "error");
      });
  }

  function getAiPlanHistory() {
    try {
      return JSON.parse(localStorage.getItem(aiPlanHistoryKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function setAiPlanHistory(items) {
    try {
      localStorage.setItem(aiPlanHistoryKey, JSON.stringify(items));
    } catch (error) {
      toast("Plan history could not be saved in this browser.", "error");
    }
  }

  function planFromResult(result) {
    if (!result || !result.querySelector(".ai-itinerary")) {
      return null;
    }

    const destination = result.dataset.shareDestination || (result.querySelector("h3") ? result.querySelector("h3").textContent.trim() : "Custom Trip");
    const budget = result.dataset.shareBudget || (document.getElementById("aiBudget") ? document.getElementById("aiBudget").value : "");
    const days = result.dataset.shareDays || (document.getElementById("aiDays") ? document.getElementById("aiDays").value : "");
    const travelers = result.dataset.shareTravelers || (document.getElementById("aiTravelers") ? document.getElementById("aiTravelers").value : "");
    const type = result.dataset.shareType || (document.getElementById("aiTravelType") ? document.getElementById("aiTravelType").value : "");
    const shareUrl = buildAiPlanShareUrl(result);

    return {
      id: slug(`${destination}-${budget}-${days}-${travelers}-${type}`),
      destination,
      budget,
      days,
      travelers,
      type,
      shareUrl,
      bookUrl: `contact.html?package=${encodeURIComponent("AI Trip Plan")}&destination=${encodeURIComponent(destination)}#bookingForm`,
      createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    };
  }

  function saveAiPlanFromResult(result) {
    const plan = planFromResult(result);

    if (!plan) {
      renderAiPlanHistory();
      return;
    }

    const history = getAiPlanHistory().filter(function (item) {
      return item.id !== plan.id;
    });
    history.unshift(plan);
    setAiPlanHistory(history.slice(0, 5));
    renderAiPlanHistory();
  }

  function initAiPlanHistoryPanel() {
    const result = document.getElementById("aiPlannerResult");

    if (!result || document.getElementById("aiPlanHistoryPanel")) {
      return;
    }

    const panel = document.createElement("aside");
    panel.className = "ai-history-panel";
    panel.id = "aiPlanHistoryPanel";
    panel.innerHTML = `
      <div class="ai-history-head">
        <div>
          <p class="hero-kicker">Plan History</p>
          <h3>Saved AI Plans</h3>
        </div>
        <button type="button" class="btn btn-outline btn-small" data-clear-ai-history>Clear</button>
      </div>
      <div class="ai-history-list" id="aiPlanHistoryList"></div>
    `;
    panel.addEventListener("click", function (event) {
      const copy = event.target.closest("[data-copy-ai-history]");
      const remove = event.target.closest("[data-remove-ai-history]");
      const clear = event.target.closest("[data-clear-ai-history]");

      if (copy) {
        const item = getAiPlanHistory().find(function (plan) { return plan.id === copy.dataset.copyAiHistory; });
        if (item) {
          copyText(item.shareUrl).then(function () {
            toast("Saved plan link copied.", "success");
          });
        }
      }

      if (remove) {
        setAiPlanHistory(getAiPlanHistory().filter(function (plan) { return plan.id !== remove.dataset.removeAiHistory; }));
        renderAiPlanHistory();
      }

      if (clear) {
        setAiPlanHistory([]);
        renderAiPlanHistory();
        toast("AI plan history cleared.", "success");
      }
    });
    result.insertAdjacentElement("afterend", panel);
    renderAiPlanHistory();
  }

  function renderAiPlanHistory() {
    const list = document.getElementById("aiPlanHistoryList");

    if (!list) {
      return;
    }

    const history = getAiPlanHistory();

    if (!history.length) {
      list.innerHTML = '<p class="v13-empty-state">No saved AI plans yet. Generate a plan to save it here.</p>';
      return;
    }

    list.innerHTML = history.map(function (plan) {
      return `
        <article class="ai-history-item">
          <div>
            <strong>${escapeHtml(plan.destination)}</strong>
            <span>${escapeHtml(plan.days)} days - ${escapeHtml(plan.travelers)} traveler(s) - ${escapeHtml(plan.type)}</span>
            <small>${escapeHtml(plan.budget ? money(Number(plan.budget)) : "Custom budget")} - Saved ${escapeHtml(plan.createdAt || "today")}</small>
          </div>
          <div class="ai-history-actions">
            <a href="${plan.shareUrl}" class="btn btn-outline btn-small">Open</a>
            <button type="button" class="btn btn-outline btn-small" data-copy-ai-history="${plan.id}">Copy</button>
            <a href="${plan.bookUrl}" class="btn btn-small">Book</a>
            <button type="button" class="btn btn-outline btn-small" data-remove-ai-history="${plan.id}" aria-label="Remove ${escapeHtml(plan.destination)} plan">Remove</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function addAiPlanButtons() {
    const result = document.getElementById("aiPlannerResult");
    if (!result || result.querySelector("[data-whatsapp-ai-plan]")) return;
    if (!result.querySelector(".ai-itinerary")) return;
    const actions = document.createElement("div");
    actions.className = "v13-card-action-row";
    actions.innerHTML = '<button type="button" class="btn btn-outline" data-copy-ai-plan>Copy Link</button><button type="button" class="btn btn-outline" data-whatsapp-ai-plan>WhatsApp This Plan</button>';
    result.appendChild(actions);
    saveAiPlanFromResult(result);
  }

  function patchAiPlannerButtons() {
    const result = document.getElementById("aiPlannerResult");
    if (!result) return;
    const observer = new MutationObserver(addAiPlanButtons);
    observer.observe(result, { childList: true });
    addAiPlanButtons();
  }

  function getLocalTestimonials() {
    try {
      return JSON.parse(localStorage.getItem(localTestimonialsKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function setLocalTestimonials(items) {
    try {
      localStorage.setItem(localTestimonialsKey, JSON.stringify(items));
    } catch (error) {
      toast("Review could not be saved in this browser.", "error");
    }
  }

  function testimonialStars(rating) {
    return ratingStarsMarkup(rating);
  }

  function testimonialWhatsAppUrl(item) {
    const message = [
      "New Travel with Giridhar testimonial",
      `Name: ${item.name}`,
      `Destination: ${item.destination}`,
      `Rating: ${item.rating}/5`,
      `Review: ${item.review}`,
    ].join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function renderLocalTestimonials() {
    const list = document.getElementById("localTestimonialsList");
    const link = document.getElementById("testimonialWhatsAppLink");
    const items = getLocalTestimonials();

    if (link) {
      link.href = items.length ? testimonialWhatsAppUrl(items[0]) : `https://wa.me/${whatsappNumber}`;
    }

    if (!list) return;

    if (!items.length) {
      list.innerHTML = '<div class="v13-empty-state">No local reviews yet. Add one to preview it here.</div>';
      return;
    }

    list.innerHTML = items.slice(0, 4).map(function (item) {
      return `
        <article class="local-testimonial-card">
          <strong>${escapeHtml(item.name)} - ${escapeHtml(item.destination)}</strong>
          <span aria-label="${escapeHtml(item.rating)} star rating">${ratingStarsMarkup(item.rating)}</span>
          <p>${escapeHtml(item.review)}</p>
          <a class="btn btn-outline btn-small" href="${testimonialWhatsAppUrl(item)}" target="_blank" rel="noreferrer">Send WhatsApp</a>
        </article>
      `;
    }).join("");
  }

  function initTestimonialForm() {
    const form = document.getElementById("testimonialForm");
    if (!form) {
      renderLocalTestimonials();
      return;
    }

    if (form.dataset.testimonialReady) return;
    form.dataset.testimonialReady = "true";
    renderLocalTestimonials();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const item = {
        id: `review-${Date.now()}`,
        name: form.elements.testimonialName.value.trim(),
        destination: form.elements.testimonialDestination.value.trim(),
        rating: Number(form.elements.testimonialRating.value),
        review: form.elements.testimonialText.value.trim(),
        date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      };

      if (!item.name || !item.destination || !item.rating || !item.review) {
        toast("Please complete all testimonial fields.", "error");
        return;
      }

      const saved = getLocalTestimonials();
      saved.unshift(item);
      setLocalTestimonials(saved.slice(0, 10));
      form.reset();
      renderLocalTestimonials();
      toast("Review saved locally for the demo.", "success");
    });
  }

  function initReviews() {
    const section = document.querySelector(".review-slider-section");
    if (!section || section.dataset.v13Ready) return;
    section.dataset.v13Ready = "true";
    const localReviews = getLocalTestimonials().map(function (item) {
      return [
        item.name,
        "Local demo",
        `${item.destination} - ${item.date || "Recent trip"}`,
        String(item.rating || 5),
        item.review,
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=160&auto=format&fit=crop&q=75"
      ];
    });
    const reviews = [
      ["Ananya Rao", "Mumbai", "Bali Premium Tour - April 2026", "4", "The Bali package was well planned, comfortable, and easy to follow for our April 2026 beach holiday. Transfers and hotels were handled smoothly.", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=75"],
      ["Vikram Kumar", "Hyderabad", "Goa Beach Escape - March 2026", "5", "Our Goa trip in March 2026 felt relaxed and organized. Pricing was clear and the support before travel was very helpful.", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=75"],
      ["Priya Mehta", "Bengaluru", "Manali Adventure Holiday - February 2026", "5", "The Manali itinerary for February 2026 had the right mix of sightseeing, adventure, and rest time. It felt professionally planned.", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=75"],
      ["Rahul Sharma", "Pune", "Dubai Desert Luxury", "5", "The Dubai plan was perfect for our family. The desert safari and city tour were the highlights.", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=75"],
      ["Sneha Iyer", "Chennai", "Kerala Backwater Retreat", "4", "The houseboat stay was peaceful and the itinerary did not feel rushed. Great option for families.", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=75"],
      ["Arjun Nair", "Kochi", "Singapore Family Fun", "5", "Clean planning, quick replies, and good attraction suggestions. The kids loved Sentosa.", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=75"]
    ].concat(localReviews);
    section.innerHTML = `
      <div class="section-heading-left">
        <p class="hero-kicker">Testimonials</p>
        <h2>Verified traveler stories</h2>
        <p>Realistic reviews with trip names, city context, and balanced ratings.</p>
      </div>
      <div class="v13-review-carousel" id="v13ReviewCarousel">
        <div class="v13-review-track" id="v13ReviewTrack">
          ${reviews.map(function (review) {
            const stars = ratingStarsMarkup(review[3]);
            return `
              <article class="v13-review-card">
                <div class="v13-review-person">
                  <img class="v13-review-avatar" src="${review[5]}" alt="${review[0]}" loading="lazy" width="112" height="112" />
                  <div><h3>${review[0]}</h3><p>${review[1]} - ${review[2]}</p><span class="verified-badge">Verified Traveler</span></div>
                </div>
                <span class="v13-stars" aria-label="${review[3]} star rating">${stars}</span>
                <p>${review[4]}</p>
              </article>
            `;
          }).join("")}
        </div>
        <div class="v13-review-dots">${reviews.map(function (_, index) { return `<button type="button" class="${index === 0 ? "is-active" : ""}" data-review-dot="${index}" aria-label="Show review ${index + 1}"></button>`; }).join("")}</div>
      </div>
    `;
    const track = document.getElementById("v13ReviewTrack");
    const cards = Array.from(track.children);
    const dots = Array.from(section.querySelectorAll("[data-review-dot]"));
    let index = 0;
    let timer;
    let hasStarted = false;
    function markActive(next) {
      index = (next + cards.length) % cards.length;
      cards.forEach(function (card, cardIndex) { card.classList.toggle("is-visible-card", cardIndex === index); });
      dots.forEach(function (dot, dotIndex) { dot.classList.toggle("is-active", dotIndex === index); });
    }
    function show(next) {
      markActive(next);
      track.scrollTo({ left: cards[index].offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    function start() {
      if (timer) return;
      timer = setInterval(function () { show(index + 1); }, 5000);
    }
    function stop() {
      clearInterval(timer);
      timer = null;
    }
    dots.forEach(function (dot) { dot.addEventListener("click", function () { stop(); show(Number(dot.dataset.reviewDot)); start(); }); });
    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", function () { if (hasStarted) start(); });
    markActive(0);
    if ("IntersectionObserver" in window) {
      const reviewObserver = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          hasStarted = true;
          start();
          reviewObserver.disconnect();
        }
      }, { threshold: 0.35 });
      reviewObserver.observe(section);
    }
  }

  function initGallery() {
    const gallery = document.querySelector(".gallery-grid");
    if (!gallery || gallery.dataset.v13Ready) return;
    gallery.dataset.v13Ready = "true";
    const items = [
      ["Bali Temple Beach", "Beaches", "photo-1537996194471-e657df975ab4"],
      ["Goa Golden Shore", "Beaches", "photo-1507525428034-b723cf961d3e"],
      ["Maldives Lagoon", "Beaches", "photo-1573843981267-be1999ff37cd"],
      ["Santorini Sunset", "Beaches", "photo-1570077188670-e3a8d69ac5ff"],
      ["Manali Valley", "Mountains", "photo-1506905925346-21bda4d32df4"],
      ["Swiss Alps", "Mountains", "photo-1531366936337-7c912a4589a7"],
      ["Kashmir Lake", "Mountains", "photo-1500530855697-b586d89ba3ee"],
      ["Darjeeling Hills", "Mountains", "photo-1501785888041-af3ef285b470"],
      ["Dubai Skyline", "Cities", "photo-1512453979798-5ea266f8880c"],
      ["Paris Landmark", "Cities", "photo-1502602898657-3e91760cbb34"],
      ["Tokyo Nights", "Cities", "photo-1540959733332-eab4deabeeaf"],
      ["New York Streets", "Cities", "photo-1485871981521-5b1fd3805eee"],
      ["Rome Heritage", "Food & Culture", "photo-1525874684015-58379d421a52"],
      ["Rajasthan Palace", "Food & Culture", "photo-1477587458883-47145ed94245"],
      ["Istanbul Market", "Food & Culture", "photo-1541432901042-2d8bd64b4a9b"],
      ["Vietnam Lanterns", "Food & Culture", "photo-1528127269322-539801943592"],
      ["Ladakh Road", "Adventure", "photo-1464822759023-fed622ff2c3b"],
      ["Rishikesh Rafting", "Adventure", "photo-1500534314209-a25ddb2bd429"],
      ["Queenstown Lake", "Adventure", "photo-1500534314209-a25ddb2bd429"],
      ["Cape Town Coast", "Adventure", "photo-1580060839134-75a5edca2e99"],
      ["Kerala Backwaters", "Food & Culture", "photo-1602216056096-3b40cc0c9944"],
      ["Singapore Marina", "Cities", "photo-1525625293386-3f8f99389edd"],
      ["Phuket Islands", "Beaches", "photo-1506929562872-bb421503ef21"],
      ["Ooty Tea Gardens", "Mountains", "photo-1519681393784-d120267933ba"]
    ];
    const wrapper = gallery.parentElement;
    const filters = document.createElement("div");
    filters.className = "v13-filter-chips v13-gallery-filter";
    filters.innerHTML = ["All", "Beaches", "Mountains", "Cities", "Food & Culture", "Adventure"].map(function (tag) {
      return `<button type="button" class="v13-chip${tag === "All" ? " is-active" : ""}" data-gallery-filter="${tag.toLowerCase()}">${tag}</button>`;
    }).join("");
    wrapper.insertBefore(filters, gallery);
    gallery.className = "v13-gallery-grid";
    gallery.innerHTML = items.map(function (item, index) {
      const src = `https://images.unsplash.com/${item[2]}?w=800&auto=format&fit=crop&q=75`;
      return `
        <article class="gallery-item v13-gallery-item" data-gallery-category="${item[1].toLowerCase()}" data-gallery-index="${index}">
          <img src="${src}" alt="${item[0]}" loading="lazy" width="800" height="${index % 3 === 0 ? 980 : 640}" />
          <div class="v13-gallery-overlay"><h2>${item[0]}</h2><p>${item[1]}</p><span><i class="fas fa-search-plus"></i> View photo</span></div>
        </article>
      `;
    }).join("");
    const lightbox = document.createElement("div");
    lightbox.className = "v13-lightbox";
    lightbox.id = "galleryLightbox";
    lightbox.innerHTML = '<button type="button" class="v13-lightbox-close" data-lightbox-close aria-label="Close gallery"><i class="fas fa-times"></i></button><button type="button" class="v13-lightbox-prev" data-lightbox-prev aria-label="Previous image"><i class="fas fa-chevron-left"></i></button><img alt="Expanded gallery image" /><button type="button" class="v13-lightbox-next" data-lightbox-next aria-label="Next image"><i class="fas fa-chevron-right"></i></button><div class="v13-lightbox-caption" id="lightboxCaption"></div>';
    document.body.appendChild(lightbox);
    let current = 0;
    function visibleItems() { return Array.from(gallery.querySelectorAll(".v13-gallery-item:not(.is-v13-hidden)")); }
    function open(index) {
      const visible = visibleItems();
      const item = gallery.querySelector(`[data-gallery-index="${index}"]`) || visible[0];
      if (!item) return;
      current = Number(item.dataset.galleryIndex);
      lightbox.querySelector("img").src = item.querySelector("img").src.replace("w=800", "w=1400");
      document.getElementById("lightboxCaption").textContent = item.querySelector("h2").textContent;
      lightbox.classList.add("is-open");
    }
    function move(dir) {
      const visible = visibleItems();
      const pos = visible.findIndex(function (item) { return Number(item.dataset.galleryIndex) === current; });
      const next = visible[(pos + dir + visible.length) % visible.length];
      if (next) open(Number(next.dataset.galleryIndex));
    }
    filters.querySelectorAll("[data-gallery-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.dataset.galleryFilter;
        filters.querySelectorAll(".v13-chip").forEach(function (chip) { chip.classList.toggle("is-active", chip === button); });
        gallery.querySelectorAll(".v13-gallery-item").forEach(function (item) {
          item.classList.toggle("is-v13-hidden", filter !== "all" && item.dataset.galleryCategory !== filter);
        });
      });
    });
    gallery.addEventListener("click", function (event) {
      const item = event.target.closest(".v13-gallery-item");
      if (item) open(Number(item.dataset.galleryIndex));
    });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) lightbox.classList.remove("is-open");
      if (event.target.closest("[data-lightbox-prev]")) move(-1);
      if (event.target.closest("[data-lightbox-next]")) move(1);
    });
    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") lightbox.classList.remove("is-open");
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    });
  }

  function enhanceDestinationFilters() {
    const panel = document.querySelector(".search-panel .filter-tags");
    if (!panel || panel.dataset.v13Ready) return;
    panel.dataset.v13Ready = "true";
    document.querySelectorAll(".destination-card").forEach(function (card) {
      const name = card.querySelector("h2") ? card.querySelector("h2").textContent.toLowerCase() : "";
      const price = parseAmount(card.querySelector(".price") ? card.querySelector(".price").textContent : "");
      let category = card.dataset.category || "";
      if (price && price < 30000) category += " budget";
      if (price >= 75000) category += " luxury";
      if (!name.includes("india") && !name.includes("goa") && !name.includes("manali") && !name.includes("kerala") && !name.includes("rajasthan")) category += " international";
      if (/manali|ooty|darjeeling|kashmir|ladakh|coorg|shillong/.test(name)) category += " hill station";
      card.dataset.category = category;
      card.dataset.destination = `${card.dataset.destination || ""} ${category}`;
    });
    panel.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeDestinationFilter = chip.dataset.filter;
        panel.querySelectorAll(".filter-chip").forEach(function (item) { item.classList.toggle("is-active", item === chip); });
        if (typeof applyDestinationFilters === "function") applyDestinationFilters();
      });
    });
  }

  function initStickyCtas() {
    const page = location.pathname.split("/").pop() || "index.html";
    const ctaPages = ["index.html", "packages.html", "destinations.html"];
    if (!ctaPages.includes(page)) return;
    if (!document.getElementById("stickyBookingBar")) {
      const bar = document.createElement("div");
      bar.className = "sticky-booking-bar";
      bar.id = "stickyBookingBar";
      bar.innerHTML = `
        <strong>Ready to travel? Get a free quote in 2 hours.</strong>
        <div class="sticky-booking-actions">
          <a href="contact.html#bookingForm" class="btn btn-small">Book Now</a>
          <a href="${whatsappUrl}" target="_blank" rel="noreferrer" class="btn btn-outline btn-small">WhatsApp</a>
          <button type="button" class="sticky-dismiss" aria-label="Dismiss booking bar">&times;</button>
        </div>
      `;
      document.body.appendChild(bar);
      bar.querySelector(".sticky-dismiss").addEventListener("click", function () {
        sessionStorage.setItem("hideStickyBooking", "true");
        bar.classList.remove("is-visible");
      });
      window.addEventListener("scroll", function () {
        if (sessionStorage.getItem("hideStickyBooking") === "true") return;
        bar.classList.toggle("is-visible", window.scrollY > 400);
      });
    }
    if (!document.getElementById("mobileCtaBar")) {
      const mobile = document.createElement("div");
      mobile.className = "mobile-cta-bar";
      mobile.id = "mobileCtaBar";
      mobile.innerHTML = `<a href="tel:+91${whatsappNumber}"><i class="fas fa-phone"></i>Call</a><a href="${whatsappUrl}" target="_blank" rel="noreferrer"><i class="fab fa-whatsapp"></i>WhatsApp</a><a href="contact.html#bookingForm"><i class="fas fa-paper-plane"></i>Book Now</a>`;
      document.body.appendChild(mobile);
    }
  }

  function initMobileBottomNav() {
    if (document.getElementById("mobileBottomNav")) return;
    const page = location.pathname.split("/").pop() || "index.html";
    const nav = document.createElement("nav");
    nav.className = "mobile-bottom-nav";
    nav.id = "mobileBottomNav";
    nav.setAttribute("aria-label", "Mobile quick navigation");
    const link = function (href, icon, label) {
      const active = page === href ? " is-active" : "";
      return `<a href="${href}" class="${active}"><i class="${icon}"></i>${label}</a>`;
    };
    nav.innerHTML = [
      link("index.html", "fas fa-home", "Home"),
      link("destinations.html", "fas fa-map-marker-alt", "Places"),
      link("packages.html", "fas fa-suitcase", "Packages"),
      '<button type="button" class="mobile-saved-btn"><i class="fas fa-heart"></i>Saved <span class="wishlist-count">0</span></button>',
      link("contact.html", "fas fa-envelope", "Contact")
    ].join("");
    nav.querySelector(".mobile-saved-btn").addEventListener("click", openWishlistDrawer);
    document.body.appendChild(nav);
    if (window.visualViewport) {
      const baseHeight = window.visualViewport.height;
      window.visualViewport.addEventListener("resize", function () {
        document.body.classList.toggle("mobile-bars-hidden", baseHeight - window.visualViewport.height > 120);
      });
    }
  }

  function lazyLoadImages() {
    document.querySelectorAll("img:not([loading])").forEach(function (img) {
      img.loading = "lazy";
    });
  }

  function initTravelChecklist() {
    const boxes = Array.from(document.querySelectorAll("[data-checklist-item]"));
    const progressText = document.getElementById("checklistProgressText");
    const progressBar = document.getElementById("checklistProgressBar");
    const key = "travelChecklistV14";

    if (!boxes.length) return;

    function read() {
      try {
        return JSON.parse(localStorage.getItem(key)) || {};
      } catch (error) {
        return {};
      }
    }

    function write(state) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        toast("Checklist could not be saved in this browser.", "error");
      }
    }

    function update() {
      const state = read();
      const done = boxes.filter(function (box) { return box.checked; }).length;
      const total = boxes.length;

      if (progressText) {
        progressText.textContent = `${done} of ${total} completed`;
      }

      if (progressBar) {
        progressBar.style.width = `${Math.round((done / total) * 100)}%`;
      }

      boxes.forEach(function (box) {
        state[box.dataset.checklistItem] = box.checked;
      });
      write(state);
    }

    const saved = read();
    boxes.forEach(function (box) {
      box.checked = Boolean(saved[box.dataset.checklistItem]);
      box.addEventListener("change", update);
    });
    update();
  }

  function initDestinationComparison() {
    const first = document.getElementById("compareDestinationA");
    const second = document.getElementById("compareDestinationB");
    const result = document.getElementById("destinationCompareResult");
    const cards = Array.from(document.querySelectorAll(".destination-card"));

    if (!first || !second || !result || !cards.length) return;

    const destinations = cards.map(function (card, index) {
      const name = card.querySelector("h2") ? card.querySelector("h2").textContent.trim() : `Destination ${index + 1}`;
      const priceText = card.querySelector(".price") ? card.querySelector(".price").textContent.trim() : "Custom quote";
      const bestTime = card.querySelector(".best-time") ? card.querySelector(".best-time").textContent.replace("Best:", "").trim() : "Flexible";
      const tags = (card.dataset.category || "").split(" ").filter(Boolean).slice(0, 3);
      const details = card.querySelector("p") ? card.querySelector("p").textContent.trim() : "Curated travel experience.";

      return {
        name,
        price: parseAmount(priceText),
        priceText,
        bestTime,
        tags,
        details,
        bookUrl: `contact.html?destination=${encodeURIComponent(name)}#bookingForm`
      };
    });

    function fill(select, selectedIndex) {
      select.innerHTML = destinations.map(function (item, index) {
        return `<option value="${index}"${index === selectedIndex ? " selected" : ""}>${item.name}</option>`;
      }).join("");
    }

    function card(item, isBestValue) {
      return `
        <article class="destination-compare-card${isBestValue ? " is-best" : ""}">
          <span>${isBestValue ? "Best Value" : "Trip Option"}</span>
          <h3>${item.name}</h3>
          <p>${item.details}</p>
          <dl>
            <div><dt>Budget</dt><dd>${item.priceText}</dd></div>
            <div><dt>Best Time</dt><dd>${item.bestTime}</dd></div>
            <div><dt>Best For</dt><dd>${item.tags.join(", ") || "Flexible travel"}</dd></div>
          </dl>
          <a href="${item.bookUrl}" class="btn btn-small">Plan This Trip</a>
        </article>
      `;
    }

    function render() {
      const a = destinations[Number(first.value)] || destinations[0];
      const b = destinations[Number(second.value)] || destinations[1] || destinations[0];
      const aBest = a.price && b.price ? a.price <= b.price : true;
      result.innerHTML = card(a, aBest) + card(b, !aBest);
    }

    fill(first, 0);
    fill(second, Math.min(1, destinations.length - 1));
    first.addEventListener("change", render);
    second.addEventListener("change", render);
    render();
  }

  function updateFooterVersion() {
    document.querySelectorAll("footer p").forEach(function (paragraph) {
      if (/Travel Website v/i.test(paragraph.textContent)) {
        paragraph.remove();
      }
    });
  }

  function initFlexibleResultRows() {
    scheduleFlexibleResultRows();
    window.addEventListener("resize", scheduleFlexibleResultRows);
    window.setTimeout(scheduleFlexibleResultRows, 250);
    window.setTimeout(scheduleFlexibleResultRows, 900);
  }

  function initRouteMapPlanner() {
    const section = document.getElementById("routePreview");
    if (!section || section.dataset.routeReady) return;
    section.dataset.routeReady = "true";

    const routes = {
      bali: {
        code: "DPS",
        label: "Bali",
        destination: "Bali, Indonesia",
        packageName: "Premium Bali Tour"
      },
      manali: {
        code: "KUU",
        label: "Manali",
        destination: "Manali, India",
        packageName: "Manali Adventure Holiday"
      },
      dubai: {
        code: "DXB",
        label: "Dubai",
        destination: "Dubai, UAE",
        packageName: "Dubai Desert Luxury"
      },
      goa: {
        code: "GOI",
        label: "Goa",
        destination: "Goa, India",
        packageName: "Goa Beach Escape"
      }
    };

    const origin = "Hyderabad, India";
    const select = section.querySelector("#routeDestinationSelect");
    const mapFrame = section.querySelector("#routeGoogleMap");
    const mapLink = section.querySelector("#routeOpenMaps");
    const bookLink = section.querySelector("#routeBookTrip");

    if (!select || !mapFrame || !mapLink || !bookLink) return;

    function mapEmbedUrl(destination) {
      return `https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`;
    }

    function mapOpenUrl(destination) {
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    }

    function bookingUrl(item) {
      return `contact.html?package=${encodeURIComponent(item.packageName)}&destination=${encodeURIComponent(item.destination)}#bookingForm`;
    }

    function updateRoute() {
      const item = routes[select.value] || routes.bali;
      mapFrame.src = mapEmbedUrl(item.destination);
      mapFrame.title = `Google map showing ${item.destination}`;
      mapLink.href = mapOpenUrl(item.destination);
      bookLink.href = bookingUrl(item);
    }

    select.addEventListener("change", updateRoute);
    updateRoute();
  }

  function keepHomeAtHeroOnFreshLoad() {
    const page = location.pathname.split("/").pop() || "index.html";
    const hash = location.hash;
    const noisyHashes = ["#tripBudgetEstimator", "#reviewSlider", "#v13ReviewCarousel", "#reviews"];

    if (page !== "index.html") {
      return;
    }

    if (hash && !noisyHashes.includes(hash)) {
      return;
    }

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (hash) {
      history.replaceState(null, "", location.pathname || "index.html");
    }

    window.requestAnimationFrame(function () {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    window.setTimeout(function () {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 80);
  }
  function initV13() {
    keepHomeAtHeroOnFreshLoad();
    ensureWishlistNav();
    ensureWishlistDrawer();
    initBookingStepper();
    initPackageFilters();
    initHomeFeaturedTrips();
    initTrendingSlider();
    initBudgetEstimator();
    initCurrencyToggle();
    initAiPlanHistoryPanel();
    enhanceAiPlannerWhatsAppShare();
    patchAiPlannerButtons();
    initTestimonialForm();
    initReviews();
    initGallery();
    enhanceDestinationFilters();
    initDestinationResetButton();
    initStickyCtas();
    initMobileBottomNav();
    decorateSaveButtons();
    initWishlistClearButtons();
    lazyLoadImages();
    initTravelChecklist();
    initDestinationComparison();
    updateFooterVersion();
    initNewsletterSignup();
    initRouteMapPlanner();
    initFlexibleResultRows();
    document.addEventListener("click", function (event) {
      if (event.target.closest(".v13-trending-card, .v13-featured-card")) {
        setTimeout(decorateSaveButtons, 0);
      }
    });
    window.addEventListener("storage", updateWishlistUi);
  }

  ready(initV13);
})();
