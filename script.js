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
const savedTripsKey = "savedTrips";
const savedFilterCount = document.getElementById("savedFilterCount");
const destinationLoading = document.getElementById("destinationLoading");
const themePreferenceKey = "travelGuideTheme";
let activeDestinationFilter = "all";

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function debounce(callback, delay) {
  let timer;

  return function () {
    const args = arguments;
    const context = this;

    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, delay);
  };
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

function slugForSavedTrip(value) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getSharedSavedTrips() {
  try {
    const parsed = JSON.parse(getStorageItem(savedTripsKey)) || [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setSharedSavedTrips(items) {
  return setStorageItem(savedTripsKey, JSON.stringify(items));
}

function getLegacySavedDestinationNames() {
  try {
    const parsed = JSON.parse(getStorageItem(savedDestinationsKey)) || [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (error) {
    return [];
  }
}

function getDestinationNameFromSavedTrip(item) {
  if (!item) {
    return "";
  }

  if (item.type === "destination") {
    return item.destination || item.name || "";
  }

  return "";
}

function getSavedDestinationNames() {
  const sharedNames = getSharedSavedTrips()
    .map(getDestinationNameFromSavedTrip)
    .filter(Boolean);

  return Array.from(new Set(sharedNames.concat(getLegacySavedDestinationNames())));
}

function isDestinationNameSaved(destinationName, savedNames) {
  const normalizedName = normalizeSearchText(destinationName);

  return (savedNames || getSavedDestinationNames()).some(function (savedName) {
    return normalizeSearchText(savedName) === normalizedName;
  });
}

function createSavedDestinationItem(card, destinationName) {
  const priceNode = card.querySelector(".price");
  const price = parseRupeeAmount(priceNode ? priceNode.textContent : "");

  return {
    id: `destination-${slugForSavedTrip(destinationName)}`,
    type: "destination",
    name: destinationName,
    destination: destinationName,
    packageName: destinationName,
    price,
    priceText: price ? `Rs. ${price.toLocaleString("en-IN")}` : "Custom quote",
  };
}

const travelData = window.TRAVEL_DATA || {};
const destinationImages = travelData.destinationImages || {};
const baseDestinations = Array.isArray(travelData.baseDestinations) ? travelData.baseDestinations : [];
const extraDestinations = Array.isArray(travelData.extraDestinations) ? travelData.extraDestinations : [];
const allDestinations = Array.isArray(travelData.destinations)
  ? travelData.destinations
  : baseDestinations.concat(extraDestinations);
const baseTravelPackages = Array.isArray(travelData.basePackages) ? travelData.basePackages : [];
const extraTravelPackages = Array.isArray(travelData.extraPackages) ? travelData.extraPackages : [];
const allTravelPackages = Array.isArray(travelData.packages)
  ? travelData.packages
  : baseTravelPackages.concat(extraTravelPackages);

function unsplashVariant(src, width) {
  if (!/images\.unsplash\.com/.test(String(src || ""))) {
    return "";
  }

  if (/[?&]w=\d+/.test(src)) {
    return src.replace(/([?&]w=)\d+/, `$1${width}`);
  }

  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}

function responsiveImageAttrs(src, sizes) {
  const variants = [400, 800, 1200]
    .map(function (width) {
      const url = unsplashVariant(src, width);
      return url ? `${url} ${width}w` : "";
    })
    .filter(Boolean);

  if (!variants.length) {
    return "";
  }

  return `srcset="${variants.join(", ")}" sizes="${sizes || "(max-width: 768px) 92vw, 33vw"}"`;
}

function createTagMarkup(tags) {
  return (tags || [])
    .map(function (tag) {
      return `<span class="tag">${tag}</span>`;
    })
    .join("");
}

function createFeatureMarkup(features) {
  return (features || [])
    .map(function (feature) {
      return `<li>${feature}</li>`;
    })
    .join("");
}

function getResolvedImageSource(item) {
  const image = item ? item.image : "";
  return destinationImages[image] || image || destinationImages.city || "";
}

function getPackagePriceText(travelPackage) {
  if (travelPackage.priceText) {
    return travelPackage.priceText;
  }

  if (typeof travelPackage.price === "string") {
    return travelPackage.price;
  }

  const amount = travelPackage.amount || travelPackage.price || 0;
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function renderExtraDestinations() {
  const destinationsGrid = document.getElementById("destinationsGrid");

  if (!destinationsGrid) {
    return;
  }

  destinationsGrid.innerHTML = "";

  allDestinations.forEach(function (destination) {
    const article = document.createElement("article");
    const keywords = normalizeSearchText(
      `${destination.name} ${destination.category} ${destination.desc} ${(destination.tags || []).join(" ")}`
    );

    article.className = "card destination-card";
    article.dataset.category = destination.category;
    article.dataset.destination = keywords;
    article.tabIndex = 0;
    const imageSource = getResolvedImageSource(destination);
    article.innerHTML = `
      <img src="${imageSource}" alt="${destination.imageAlt || `${destination.name} travel view`}" loading="lazy" decoding="async" ${responsiveImageAttrs(imageSource)} />
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

  if (destinationLoading) {
    destinationLoading.hidden = true;
  }
}

function renderExtraPackages() {
  const packageGrid = document.querySelector(".package-grid");

  if (!packageGrid) {
    return;
  }

  packageGrid.innerHTML = "";

  allTravelPackages.forEach(function (travelPackage) {
    const article = document.createElement("article");
    const bookingUrl = `contact.html?package=${encodeURIComponent(
      travelPackage.title
    )}&destination=${encodeURIComponent(travelPackage.destination)}#bookingForm`;
    const features = travelPackage.features || travelPackage.inclusions || [];
    const priceText = getPackagePriceText(travelPackage);

    article.className = "card package-card";
    const imageSource = getResolvedImageSource(travelPackage);
    article.innerHTML = `
      <img src="${imageSource}" alt="${travelPackage.imageAlt || `${travelPackage.title} package view`}" loading="lazy" decoding="async" ${responsiveImageAttrs(imageSource)} />
      <div class="card-content">
        <div class="card-meta">
          <h2>${travelPackage.title}</h2>
          <span class="price">${priceText}</span>
        </div>
        ${
          travelPackage.group
            ? '<span class="group-badge">Group of 6+ gets 10% off</span>'
            : ""
        }
        <p>${travelPackage.duration}</p>
        <ul class="feature-list">
          ${createFeatureMarkup(features)}
        </ul>
        <a href="${bookingUrl}" class="btn">Book Now</a>
      </div>
    `;

    packageGrid.appendChild(article);
  });
}

renderExtraDestinations();
renderExtraPackages();

function updateSavedCount(savedDestinations) {
  const count = savedDestinations ? savedDestinations.length : getSavedDestinationNames().length;

  if (savedCount) {
    savedCount.textContent = `Saved destinations: ${count}`;
  }

  if (savedFilterCount) {
    savedFilterCount.textContent = `(${count})`;
  }
}

function setupSavedDestinations() {
  if (!destinationCards.length) {
    return;
  }

  let savedDestinations = getSavedDestinationNames();
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
      savedDestinations = getSavedDestinationNames();
      const isSaved = isDestinationNameSaved(destinationName, savedDestinations);

      card.classList.toggle("is-saved", isSaved);
      saveButton.classList.toggle("is-saved", isSaved);
      saveButton.textContent = isSaved ? "Saved" : "Save Destination";
      saveButton.setAttribute("aria-pressed", String(isSaved));
      saveButton.setAttribute(
        "aria-label",
        isSaved ? `Remove ${destinationName} from saved destinations` : `Save ${destinationName}`
      );
    }

    saveButton.addEventListener("click", function () {
      const isSaved = isDestinationNameSaved(destinationName);
      let savedTrips = getSharedSavedTrips();

      if (isSaved) {
        savedTrips = savedTrips.filter(function (item) {
          return normalizeSearchText(getDestinationNameFromSavedTrip(item)) !== normalizeSearchText(destinationName);
        });
      } else {
        savedTrips.push(createSavedDestinationItem(card, destinationName));
      }

      setSharedSavedTrips(savedTrips);
      savedDestinations = getSavedDestinationNames();
      updateSavedCount(savedDestinations);
      updateButton();

      if (typeof applyDestinationFilters === "function") {
        applyDestinationFilters();
      }
    });

    updateButton();
  });

  if (clearSavedButton) {
    clearSavedButton.addEventListener("click", function () {
      const savedTrips = getSharedSavedTrips().filter(function (item) {
        return item.type !== "destination";
      });

      setSharedSavedTrips(savedTrips);
      setStorageItem(savedDestinationsKey, JSON.stringify([]));
      savedDestinations = getSavedDestinationNames();
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

      if (typeof applyDestinationFilters === "function") {
        applyDestinationFilters();
      }
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
  const savedDestinationNames = getSavedDestinationNames();
  let visibleCount = 0;

  cards.forEach(function (card) {
    const destinationName = card.querySelector("h2")
      ? card.querySelector("h2").textContent.trim()
      : "";
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
      activeDestinationFilter === "all" ||
      (activeDestinationFilter === "saved" &&
        isDestinationNameSaved(destinationName, savedDestinationNames)) ||
      categories.includes(activeDestinationFilter);
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
    noDestinations.textContent =
      activeDestinationFilter === "saved"
        ? "No saved destinations yet. Tap a heart on a destination to save it."
        : "No destinations found. Try another search.";
  }

  if (filterStatus) {
    const filterLabel =
      activeDestinationFilter === "all"
        ? "all"
        : activeDestinationFilter === "saved"
          ? "saved"
        : activeDestinationFilter.charAt(0).toUpperCase() +
          activeDestinationFilter.slice(1);
    const searchLabel = searchText ? ` matching "${searchText}"` : "";
    filterStatus.textContent = `Showing ${visibleCount} ${filterLabel} destination${
      visibleCount === 1 ? "" : "s"
    }${searchLabel}.`;
  }

  if (typeof window.refreshTravelResultRows === "function") {
    window.refreshTravelResultRows();
  }

  updateSavedCount(savedDestinationNames);
}

function showVisibleDestinationCards() {
  refreshDestinationCards().forEach(function (card) {
    if (!card.classList.contains("is-filtered-out")) {
      card.removeAttribute("hidden");
      card.style.display = "";
      card.classList.add("is-visible");
    }
  });

  if (typeof window.refreshTravelResultRows === "function") {
    window.refreshTravelResultRows();
  }
}

function resetDestinationControls() {
  if (!document.body.classList.contains("destinations-page")) {
    return;
  }

  activeDestinationFilter = "all";

  if (destinationSearch) {
    destinationSearch.value = "";
  }

  if (destinationBudgetFilter) {
    destinationBudgetFilter.value = "all";
  }

  if (destinationSeasonFilter) {
    destinationSeasonFilter.value = "all";
  }

  filterChips.forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.filter === "all");
    button.setAttribute("aria-pressed", String(button.dataset.filter === "all"));
  });

  updateSavedCount();
}

function applyDestinationQuerySearch() {
  if (!document.body.classList.contains("destinations-page") || !destinationSearch) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const queryValue =
    params.get("search") ||
    params.get("destination") ||
    params.get("place") ||
    "";

  if (!queryValue.trim()) {
    return;
  }

  destinationSearch.value = queryValue.trim();
}

if (destinationSearch) {
  destinationSearch.addEventListener("input", debounce(applyDestinationFilters, 180));
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
        button.setAttribute("aria-pressed", String(button === chip));
      });

      applyDestinationFilters();
    });
  });

}

if (destinationSearch || filterChips.length) {
  resetDestinationControls();
  applyDestinationQuerySearch();
  applyDestinationFilters();
  showVisibleDestinationCards();
}

window.applyDestinationFilters = applyDestinationFilters;
window.resetDestinationControls = resetDestinationControls;
window.updateSavedDestinationControls = function () {
  updateSavedCount();
  applyDestinationFilters();
};

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

  allDestinations.forEach(function (destination) {
    addUniqueSelectOption(destinationSelect, destination.name);
  });

  allTravelPackages.forEach(function (travelPackage) {
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

function getCleanQueryParam(params, name) {
  const value = params.get(name);
  return value ? value.trim().slice(0, 140) : "";
}

function buildBookingContextText(destination, packageName) {
  if (packageName && destination) {
    return `Planning your ${packageName} trip to ${destination}.`;
  }

  if (packageName) {
    return `Planning your ${packageName} trip.`;
  }

  if (destination) {
    return `Planning your trip to ${destination}.`;
  }

  return "";
}

function updateContactWhatsAppLink(destination, packageName) {
  if (!bookingForm) {
    return;
  }

  const whatsappLink = document.querySelector(".whatsapp-float");

  if (!whatsappLink) {
    return;
  }

  const config = window.TRAVEL_SITE_CONFIG || {};
  const whatsappNumber = config.whatsappNumber || "918179721034";
  const messageParts = ["Hi, I want to plan a trip with Travel with Giridhar."];

  if (packageName) {
    messageParts.push(`Package: ${packageName}`);
  }

  if (destination) {
    messageParts.push(`Destination: ${destination}`);
  }

  whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageParts.join("\n"))}`;
  whatsappLink.setAttribute(
    "aria-label",
    packageName || destination
      ? "Book this selected trip via WhatsApp"
      : "Book via WhatsApp"
  );
}

function setupBookingPrefill() {
  if (!bookingForm) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const selectedDestination = getCleanQueryParam(params, "destination");
  const selectedPackage = getCleanQueryParam(params, "package");
  const bookingHint = document.getElementById("bookingHint");
  const bookingPrefillNotice = document.getElementById("bookingPrefillNotice");
  const destinationSelect = bookingForm.elements.destination;
  const packageSelect = bookingForm.elements.package;
  const notesField = bookingForm.elements.bookingNotes;
  const bookingContextText = buildBookingContextText(selectedDestination, selectedPackage);

  populateBookingOptions();
  setSelectByText(destinationSelect, selectedDestination);
  setSelectByText(packageSelect, selectedPackage);

  function syncWhatsAppContext() {
    updateContactWhatsAppLink(
      getFormValue(bookingForm, "destination"),
      getFormValue(bookingForm, "package")
    );
  }

  if (selectedPackage && notesField && !notesField.value) {
    notesField.value = `I am interested in the ${selectedPackage} package.`;
  }

  if (bookingHint && (selectedDestination || selectedPackage)) {
    bookingHint.textContent = "Your earlier selection is ready. Review the details, then send the request.";
  } else if (bookingHint) {
    bookingHint.textContent = "Choose a destination and package to request a quick quote.";
  }

  if (bookingPrefillNotice) {
    bookingPrefillNotice.textContent = bookingContextText
      ? `${bookingContextText} You can edit anything before sending.`
      : "";
    bookingPrefillNotice.hidden = !bookingContextText;
  }

  if (!bookingForm.dataset.whatsappContextReady) {
    bookingForm.dataset.whatsappContextReady = "true";
    if (destinationSelect) {
      destinationSelect.addEventListener("change", syncWhatsAppContext);
    }
    if (packageSelect) {
      packageSelect.addEventListener("change", syncWhatsAppContext);
    }
  }

  syncWhatsAppContext();
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
const budgetCurrent = document.getElementById("budgetCurrent");
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

const packageBudgetOptions = allTravelPackages
  .map(function (travelPackage) {
    return {
      name: travelPackage.title || travelPackage.name,
      destination: travelPackage.destination,
      duration: travelPackage.duration,
      price: travelPackage.amount || travelPackage.price,
      bestFor: travelPackage.bestFor || (travelPackage.features || travelPackage.inclusions || [])[0] || "Flexible travel",
    };
  })
  .sort(function (first, second) {
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
    return price === budget ? "Exact Match" : "Closest Match";
  }

  return price <= budget ? "Under Budget" : "Near Budget";
}

function renderBudgetComparison(matches, budget) {
  if (!budgetComparisonCards) {
    return;
  }

  const closestDifference = matches.length ? matches[0].difference : 0;
  const hasExactOrNearMatch = closestDifference <= 5000;

  if (budgetComparisonIntro) {
    budgetComparisonIntro.textContent = hasExactOrNearMatch
      ? `Showing packages closest to ${formatRupees(budget)}.`
      : `No exact matches for ${formatRupees(budget)} - here are the closest options.`;
  }

  if (!matches.length) {
    budgetComparisonCards.innerHTML = `
      <article class="compare-card">
        <span>No matches</span>
        <h3>Try another budget</h3>
        <p>Move the slider to compare nearby package options.</p>
      </article>
    `;
    return;
  }

  budgetComparisonCards.innerHTML = matches
    .map(function (travelPackage, index) {
      const bookingUrl = `contact.html?package=${encodeURIComponent(
        travelPackage.name
      )}&destination=${encodeURIComponent(travelPackage.destination)}#bookingForm`;
      const monthlyEmi = Math.ceil(travelPackage.price / 12);

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
          <small class="compare-emi">Approx. ${formatRupees(monthlyEmi)}/month for 12 months</small>
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
  if (budgetCurrent) {
    budgetCurrent.textContent = formatRupees(budget);
  }

  budgetRange.setAttribute("aria-valuetext", formatRupees(budget));

  if (!match) {
    budgetAdvice.textContent = "Move the slider to compare nearby package options.";
    renderBudgetComparison([], budget);
    return;
  }

  const closestMessage =
    match.difference <= 5000
      ? `${match.name} is the closest match.`
      : `No exact match - ${match.name} is the nearest option.`;

  budgetAdvice.textContent = `${closestMessage} ${getBudgetRelationText(match.price, budget)}.`;
  renderBudgetComparison(matches, budget);
}

function handleBudgetRangeKeydown(event) {
  if (!budgetRange) {
    return;
  }

  const step = Number(budgetRange.step || 1000);
  const min = Number(budgetRange.min || 0);
  const max = Number(budgetRange.max || 150000);
  const current = Number(budgetRange.value || min);
  let next = current;

  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    next = current + step;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    next = current - step;
  } else if (event.key === "PageUp") {
    next = current + step * 10;
  } else if (event.key === "PageDown") {
    next = current - step * 10;
  } else if (event.key === "Home") {
    next = min;
  } else if (event.key === "End") {
    next = max;
  } else {
    return;
  }

  event.preventDefault();
  budgetRange.value = String(Math.min(max, Math.max(min, next)));
  updateBudgetEstimator();
}

if (budgetRange) {
  const debouncedBudgetEstimator = debounce(updateBudgetEstimator, 120);
  budgetRange.addEventListener("input", debouncedBudgetEstimator);
  budgetRange.addEventListener("change", updateBudgetEstimator);
  budgetRange.addEventListener("keydown", handleBudgetRangeKeydown);
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

  const budget = Number(document.getElementById("aiBudget") ? document.getElementById("aiBudget").value : trip.estimatedCost);
  const travelers = Number(document.getElementById("aiTravelers") ? document.getElementById("aiTravelers").value : 2);
  const itinerary = trip.itinerary
    .slice(0, Math.min(days, trip.itinerary.length))
    .map(function (item) {
      return `<li>${item}</li>`;
    })
    .join("");
  const bookingUrl = `contact.html?package=${encodeURIComponent(
    trip.packageName
  )}&destination=${encodeURIComponent(trip.destination)}#bookingForm`;
  setAiPlannerShareData({
    destination: trip.destination,
    budget,
    days,
    travelers,
    travelType,
  });

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

function setAiPlannerShareData(data) {
  if (!aiPlannerResult) {
    return;
  }

  aiPlannerResult.dataset.shareDestination = data.destination || "";
  aiPlannerResult.dataset.shareBudget = String(data.budget || "");
  aiPlannerResult.dataset.shareDays = String(data.days || "");
  aiPlannerResult.dataset.shareTravelers = String(data.travelers || "");
  aiPlannerResult.dataset.shareType = data.travelType || "";
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

  if (aiPlannerResult) {
    aiPlannerResult.classList.toggle("is-loading", isLoading);

    if (isLoading) {
      aiPlannerResult.innerHTML = `
        <span class="ai-pill">Generating</span>
        <h3>Building your trip plan</h3>
        <div class="ai-skeleton-stack" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Checking destination fit, budget, days, and travel style...</p>
      `;
    }
  }
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
    "Smart Trip Plan"
  )}&destination=${encodeURIComponent(planData.destination || "Custom Trip")}#bookingForm`;
  setAiPlannerShareData({
    destination: planData.destination || "Custom Trip",
    budget: inputs.budget,
    days: inputs.days,
    travelers: inputs.travelers,
    travelType: inputs.travelType,
  });

  aiPlannerResult.innerHTML = `
    <span class="ai-pill">Smart match</span>
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

function renderSharedPlannerFromUrl() {
  if (!aiPlannerForm || !aiPlannerResult) {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  if (params.get("tripPlan") !== "1") {
    return;
  }

  const budget = Number(params.get("budget")) || 40000;
  const days = Number(params.get("days")) || 5;
  const travelers = Number(params.get("travelers")) || 2;
  const travelType = params.get("type") || "beach";
  const destination = params.get("destination") || "";

  document.getElementById("aiBudget").value = budget;
  document.getElementById("aiDays").value = days;
  document.getElementById("aiTravelers").value = travelers;
  document.getElementById("aiTravelType").value = travelType;

  const trip = {
    ...findSmartTrip({ budget, days, travelers, travelType }),
  };

  if (destination) {
    trip.destination = destination;
  }

  renderSmartTrip(trip, days, travelType);

  const pill = aiPlannerResult.querySelector(".ai-pill");
  if (pill) {
    pill.textContent = "Shared plan";
  }
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
    throw new Error(data.error || "Smart planner request failed.");
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
      console.error("Smart planner request failed:", error);
      const trip = findSmartTrip(plannerInputs);
      renderSmartTrip(trip, days, travelType);
      showToast(
        "Showing a local smart match for now.",
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

renderSharedPlannerFromUrl();

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

function formatTravelPhone(value) {
  const phone = String(value || "").trim();

  if (!phone) {
    return "";
  }

  return phone.startsWith("+") ? phone : `+91 ${phone}`;
}

window.formatTravelPhone = formatTravelPhone;

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

const formFieldLabels = {
  bookingName: "Full name",
  bookingEmail: "Email",
  bookingPhone: "Phone number",
  travelDate: "Travel date",
  travelers: "Number of travelers",
  travelersType: "Traveler type",
  destination: "Destination",
  package: "Package",
  travelType: "Travel type",
  emiNeeded: "EMI preference",
  preferredContact: "Preferred contact",
  name: "Name",
  email: "Email",
  feedbackType: "Feedback type",
  message: "Message",
};

function getTodayIsoDate() {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function getFieldLabel(field) {
  return formFieldLabels[field.name] || "This field";
}

function getRadioGroup(form, fieldName) {
  return Array.from(form.querySelectorAll('input[type="radio"]')).filter(function (radio) {
    return radio.name === fieldName;
  });
}

function getErrorTarget(field) {
  if (field.type === "radio") {
    return field.closest(".pill-group") || field.parentElement || field;
  }

  return field.closest(".traveler-stepper") || field;
}

function addDescribedBy(field, errorId) {
  const ids = (field.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .filter(Boolean);

  if (!ids.includes(errorId)) {
    ids.push(errorId);
    field.setAttribute("aria-describedby", ids.join(" "));
  }
}

function ensureFieldError(field) {
  const form = field.form || field.closest("form");
  const fieldName = field.name || field.id || "field";
  const errorId = `${form && form.id ? form.id : "travelForm"}-${fieldName}-error`;
  let error = document.getElementById(errorId);

  if (!error) {
    error = document.createElement("p");
    error.id = errorId;
    error.className = "field-error";
    error.setAttribute("aria-live", "polite");
    getErrorTarget(field).insertAdjacentElement("afterend", error);
  }

  if (field.type === "radio" && form) {
    getRadioGroup(form, field.name).forEach(function (radio) {
      addDescribedBy(radio, errorId);
    });
  } else {
    addDescribedBy(field, errorId);
  }

  return error;
}

function setFieldError(field, message) {
  const error = ensureFieldError(field);
  const form = field.form || field.closest("form");
  error.textContent = message || "";

  if (field.type === "radio" && form) {
    getRadioGroup(form, field.name).forEach(function (radio) {
      radio.setAttribute("aria-invalid", message ? "true" : "false");
    });
  } else {
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  getErrorTarget(field).classList.toggle("has-field-error", Boolean(message));
}

function clearFieldError(field) {
  setFieldError(field, "");
}

function getFieldValidationMessage(field, form) {
  const value = String(field.value || "").trim();
  const label = getFieldLabel(field);

  if (field.type === "radio") {
    return field.required && !getFormValue(form, field.name)
      ? `${label} is required.`
      : "";
  }

  if (field.required && !value) {
    return `${label} is required.`;
  }

  if (!value) {
    return "";
  }

  if (field.type === "email" || field.name === "bookingEmail" || field.name === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ""
      : "Enter a valid email address.";
  }

  if (field.name === "bookingPhone") {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15
      ? ""
      : "Enter a valid phone number with 7 to 15 digits.";
  }

  if (field.name === "travelDate") {
    return value >= getTodayIsoDate()
      ? ""
      : "Travel date cannot be in the past.";
  }

  if (field.name === "travelers") {
    const travelers = Number(value);
    return Number.isInteger(travelers) && travelers > 0
      ? ""
      : "Traveler count must be a positive number.";
  }

  return "";
}

function validateTravelField(field, form) {
  const message = getFieldValidationMessage(field, form);
  setFieldError(field, message);
  return !message;
}

function validateTravelFormFields(form, scope) {
  if (!form) {
    return true;
  }

  const validationRoot = scope || form;
  const fields = Array.from(validationRoot.querySelectorAll("input, select, textarea")).filter(function (field) {
    return (
      !field.disabled &&
      field.type !== "hidden" &&
      field.type !== "button" &&
      field.type !== "submit" &&
      field.type !== "reset"
    );
  });
  const radioGroupsChecked = new Set();
  let firstInvalid = null;

  fields.forEach(function (field) {
    if (field.type === "radio") {
      if (radioGroupsChecked.has(field.name)) {
        return;
      }

      radioGroupsChecked.add(field.name);
    }

    if (!validateTravelField(field, form) && !firstInvalid) {
      firstInvalid = field;
    }
  });

  if (firstInvalid) {
    window.setTimeout(function () {
      firstInvalid.focus({ preventScroll: false });
    }, 0);
  }

  return !firstInvalid;
}

function initInlineFormValidation(form) {
  if (!form || form.dataset.inlineValidationReady === "true") {
    return;
  }

  form.dataset.inlineValidationReady = "true";

  Array.from(form.querySelectorAll("input, select, textarea")).forEach(function (field) {
    if (
      field.type === "hidden" ||
      field.type === "button" ||
      field.type === "submit" ||
      field.type === "reset"
    ) {
      return;
    }

    ensureFieldError(field);

    const eventName =
      field.tagName === "SELECT" || field.type === "radio" || field.type === "date"
        ? "change"
        : "input";

    field.addEventListener(eventName, function () {
      validateTravelField(field, form);
    });
  });
}

function clearTravelFormErrors(form) {
  if (!form) {
    return;
  }

  form.querySelectorAll(".field-error").forEach(function (error) {
    error.textContent = "";
  });

  form.querySelectorAll("[aria-invalid]").forEach(function (field) {
    field.setAttribute("aria-invalid", "false");
  });

  form.querySelectorAll(".has-field-error").forEach(function (target) {
    target.classList.remove("has-field-error");
  });
}

function applyServerValidationErrors(form, details) {
  if (!form || !details) {
    return;
  }

  const serverToClientField = {
    name: "bookingName",
    email: "bookingEmail",
    phone: "bookingPhone",
    package: "package",
    destination: "destination",
    travelDate: "travelDate",
    travelers: "travelers",
    message: "bookingNotes",
    emiNeeded: "emiNeeded",
  };
  let firstField = null;

  Object.entries(details).forEach(function ([serverField, message]) {
    const clientFieldName = serverToClientField[serverField] || serverField;
    const field = form.elements[clientFieldName];
    const targetField = field && field.length ? field[0] : field;

    if (!targetField) {
      return;
    }

    setFieldError(targetField, message);

    if (!firstField) {
      firstField = targetField;
    }
  });

  if (firstField) {
    firstField.focus({ preventScroll: false });
  }
}

function isPlaceholderFormspreeForm(form) {
  return isFormspreeForm(form) && form.action.includes("YOUR_");
}

function shouldUseClientOnlySubmission(form, templateId) {
  if (isBookingApiForm(form)) {
    return false;
  }

  if (form && form.dataset.submitEndpoint === "feedback-demo") {
    return true;
  }

  if (isPlaceholderFormspreeForm(form)) {
    return true;
  }

  return !isFormspreeForm(form) && !hasEmailJsCredentials(templateId);
}

function isBookingApiForm(form) {
  return Boolean(form && form.dataset.submitEndpoint === "booking-api");
}

function getTravelApiBaseUrl() {
  const config = window.TRAVEL_SITE_CONFIG || {};
  const fallbackBase =
    window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:5000"
      : "";

  return String(config.apiBaseUrl || fallbackBase).replace(/\/$/, "");
}

function isTravelApiConfigured() {
  const baseUrl = getTravelApiBaseUrl();

  return Boolean(baseUrl) && !/your-travel-api\.example\.com/i.test(baseUrl);
}

function createTravelApiConfigError() {
  const isLocalPage =
    window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const error = new Error(
    isLocalPage
      ? "Booking backend is not running. Start the server folder with npm.cmd start, then try again."
      : "Booking backend is not connected on the live site yet. Please use WhatsApp for this booking."
  );

  error.code = "TRAVEL_API_NOT_CONFIGURED";
  return error;
}

function buildTravelApiUrl(path) {
  const baseUrl = getTravelApiBaseUrl();
  return `${baseUrl}${path}`;
}

function getTravelWhatsappNumber() {
  const config = window.TRAVEL_SITE_CONFIG || {};
  return config.whatsappNumber || "918179721034";
}

function buildTravelWhatsappUrl(message) {
  return `https://wa.me/${getTravelWhatsappNumber()}?text=${encodeURIComponent(message)}`;
}

function buildBookingWhatsAppMessage(templateParams) {
  const lines = [
    "Hi Travel with Giridhar, I want to send this booking request.",
    "",
    `Name: ${templateParams.from_name || "Not provided"}`,
    `Email: ${templateParams.from_email || "Not provided"}`,
    `Phone: ${templateParams.phone || "Not provided"}`,
    `Destination: ${templateParams.destination || "Not selected"}`,
    `Package: ${templateParams.package_name || "Not selected"}`,
    `Travel Type: ${templateParams.travel_type || "Not selected"}`,
    `Budget: ${templateParams.approx_budget || "Not provided"}`,
    `Travel Date: ${templateParams.travel_date || "Not selected"}`,
    `Travelers: ${templateParams.travelers || "Not provided"}`,
    `Traveler Type: ${templateParams.travelers_type || "Not selected"}`,
    `EMI Needed: ${templateParams.emi_needed || "No"}`,
    `Preferred Contact: ${templateParams.preferred_contact || "WhatsApp"}`,
    `Requests: ${templateParams.travel_notes || "No special requests added."}`,
  ];

  return lines.join("\n");
}

function sendBookingViaWhatsAppFallback(templateParams) {
  const whatsappUrl = buildTravelWhatsappUrl(buildBookingWhatsAppMessage(templateParams));
  const openedWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  return Promise.resolve({
    whatsappFallback: true,
    whatsappUrl,
    popupBlocked: !openedWindow,
  });
}

function sendBookingApi(templateParams) {
  if (!isTravelApiConfigured()) {
    return Promise.reject(createTravelApiConfigError());
  }

  const payload = {
    name: templateParams.from_name,
    email: templateParams.from_email,
    phone: templateParams.phone,
    package: templateParams.package_name,
    destination: templateParams.destination,
    travelDate: templateParams.travel_date,
    travelers: Number(templateParams.travelers),
    message: templateParams.travel_notes,
    travelType: templateParams.travel_type,
    approxBudget: templateParams.approx_budget,
    emiNeeded: templateParams.emi_needed,
    travelersType: templateParams.travelers_type,
    preferredContact: templateParams.preferred_contact,
  };

  return fetch(buildTravelApiUrl("/api/bookings"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  }).then(function (response) {
    return response.json().catch(function () {
      return {};
    }).then(function (data) {
      if (!response.ok) {
        const error = new Error(
          data.error || "Booking request failed. Please WhatsApp us directly."
        );
        error.details = data.errors || {};
        error.bookingId = data.bookingId || "";
        error.paymentRetryAvailable = Boolean(data.paymentRetryAvailable);
        error.setupRequired = Boolean(data.setupRequired);
        error.status = response.status;
        throw error;
      }

      return data;
    });
  });
}

function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise(function (resolve, reject) {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = function () {
      reject(new Error("Razorpay Checkout could not load. Please check your connection."));
    };
    document.body.appendChild(script);
  });
}

function verifyRazorpayPayment(bookingId, response) {
  return fetch(buildTravelApiUrl("/api/payments/verify"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      bookingId,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  }).then(function (verifyResponse) {
    return verifyResponse.json().catch(function () {
      return {};
    }).then(function (data) {
      if (!verifyResponse.ok) {
        throw new Error(data.error || "Payment verification failed.");
      }

      return data;
    });
  });
}

function requestPaymentRetry(bookingId) {
  return fetch(buildTravelApiUrl("/api/payments/retry"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ bookingId }),
  }).then(function (response) {
    return response.json().catch(function () {
      return {};
    }).then(function (data) {
      if (!response.ok) {
        throw new Error(data.error || "Payment retry could not start.");
      }

      return data;
    });
  });
}

function getPaymentRetryUrl(bookingId) {
  return `contact.html?bookingId=${encodeURIComponent(bookingId)}#bookingForm`;
}

function showPaymentRetryNotice(bookingId, message) {
  showToast(
    message || "Payment not completed. Your booking is saved, and you can retry payment.",
    "error",
    {
      href: getPaymentRetryUrl(bookingId),
      label: "Retry payment",
    }
  );
}

function openRazorpayCheckout(submissionData, templateParams) {
  const payment = submissionData.payment || {};
  const bookingId = submissionData.bookingId || payment.bookingId;

  if (!bookingId || !payment.orderId || !payment.key) {
    return Promise.resolve({
      paymentPending: true,
      bookingId,
    });
  }

  return new Promise(function (resolve) {
    let settled = false;

    function finish(result) {
      if (settled) {
        return;
      }

      settled = true;
      resolve(result);
    }

    const checkout = new window.Razorpay({
      key: payment.key,
      amount: payment.amount,
      currency: payment.currency || "INR",
      name: "Travel with Giridhar",
      description: `${payment.package || templateParams.package_name} - ${
        payment.destination || templateParams.destination
      }`,
      order_id: payment.orderId,
      prefill: {
        name: templateParams.from_name || payment.customerName || "",
        email: templateParams.from_email || payment.customerEmail || "",
        contact: (templateParams.phone || payment.customerPhone || "").replace(/\D/g, ""),
      },
      notes: {
        bookingId,
        package: payment.package || templateParams.package_name,
        destination: payment.destination || templateParams.destination,
      },
      theme: {
        color: "#ff6b57",
      },
      handler: function (response) {
        verifyRazorpayPayment(bookingId, response)
          .then(function () {
            finish({ paid: true, bookingId });
          })
          .catch(function (error) {
            console.error("Payment verification failed:", error);
            finish({ paymentPending: true, bookingId, error });
          });
      },
      modal: {
        ondismiss: function () {
          finish({ paymentPending: true, bookingId });
        },
      },
    });

    checkout.on("payment.failed", function () {
      finish({ paymentPending: true, bookingId });
    });

    checkout.open();
  });
}

function handleBookingPayment(submissionData, templateParams) {
  if (!submissionData || !submissionData.paymentRequired) {
    return Promise.resolve({ paid: false });
  }

  return loadRazorpayCheckout()
    .then(function () {
      return openRazorpayCheckout(submissionData, templateParams);
    })
    .catch(function (error) {
      console.error("Razorpay Checkout failed:", error);
      return {
        paymentPending: true,
        bookingId: submissionData.bookingId,
        error,
      };
    })
    .then(function (result) {
      if (result && result.paymentPending) {
        showPaymentRetryNotice(result.bookingId);
      }

      return result;
    });
}

function setupPaymentRetryFromUrl() {
  if (!bookingForm) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get("bookingId");

  if (!bookingId || document.querySelector(".payment-retry-panel")) {
    return;
  }

  const retryPanel = document.createElement("div");
  retryPanel.className = "panel payment-retry-panel";
  retryPanel.innerHTML = `
    <div>
      <p class="eyebrow">Payment Pending</p>
      <h2>Complete Your Booking Payment</h2>
      <p>Your booking is saved. Click Pay Now to reopen Razorpay Checkout and complete payment.</p>
    </div>
    <button type="button" class="btn" data-retry-booking-payment>
      <span class="btn-text">Pay Now</span>
      <span class="btn-spinner" aria-hidden="true"></span>
    </button>
  `;

  bookingForm.insertAdjacentElement("beforebegin", retryPanel);

  const retryButton = retryPanel.querySelector("[data-retry-booking-payment]");
  retryButton.addEventListener("click", function () {
    retryButton.disabled = true;
    retryButton.classList.add("is-loading");

    requestPaymentRetry(bookingId)
      .then(function (data) {
        return handleBookingPayment(data, {
          from_name: data.payment && data.payment.customerName,
          from_email: data.payment && data.payment.customerEmail,
          phone: data.payment && data.payment.customerPhone,
          package_name: data.payment && data.payment.package,
          destination: data.payment && data.payment.destination,
        });
      })
      .then(function (result) {
        if (result && result.paid) {
          showToast("Payment verified! Your booking is confirmed.", "success");
          retryPanel.remove();
        }
      })
      .catch(function (error) {
        showToast(error.message || "Payment retry failed. Please WhatsApp us directly.", "error", {
          href: emailJsWhatsAppUrl,
          label: "WhatsApp us",
        });
      })
      .finally(function () {
        retryButton.disabled = false;
        retryButton.classList.remove("is-loading");
      });
  });
}

function sendClientOnlyForm(form) {
  // TODO: wire to backend endpoint / email service - currently client-side only.
  return new Promise(function (resolve) {
    window.setTimeout(function () {
      resolve(form);
    }, 550);
  });
}

window.validateTravelFormFields = validateTravelFormFields;
window.initInlineFormValidation = initInlineFormValidation;

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
  if (error && error.code === "TRAVEL_API_NOT_CONFIGURED") {
    return error.message;
  }

  if (error && error.text) {
    return error.text;
  }

  if (error && error.message) {
    if (/failed to fetch|networkerror|load failed/i.test(error.message)) {
      return "Booking backend is not reachable right now. Please use WhatsApp, or try again after the backend is online.";
    }

    return error.message;
  }

  return "Something went wrong. Please WhatsApp us directly.";
}

function shouldFallbackBookingToWhatsApp(error) {
  if (error && error.code === "TRAVEL_API_NOT_CONFIGURED") {
    return true;
  }

  if (error && error.setupRequired) {
    return true;
  }

  if (error && error.message && /failed to fetch|networkerror|load failed/i.test(error.message)) {
    return true;
  }

  return false;
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

let activeTwoFactorModal = null;

function createTwoFactorCode() {
  const values = new Uint32Array(1);

  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(values);
    return String(100000 + (values[0] % 900000));
  }

  return String(Math.floor(100000 + Math.random() * 900000));
}

function getTwoFactorTarget(templateParams) {
  return (
    templateParams.from_email ||
    templateParams.customer_email ||
    templateParams.phone ||
    "this request"
  );
}

function closeTwoFactorModal() {
  if (activeTwoFactorModal) {
    activeTwoFactorModal.remove();
    activeTwoFactorModal = null;
  }
}

function requestTwoFactorVerification(formLabel, templateParams) {
  return new Promise(function (resolve, reject) {
    closeTwoFactorModal();

    let verificationCode = createTwoFactorCode();
    const target = getTwoFactorTarget(templateParams);
    const modal = document.createElement("div");
    const titleId = `twoFactorTitle-${Date.now()}`;

    modal.className = "two-factor-backdrop";
    modal.innerHTML = `
      <section class="two-factor-modal" role="dialog" aria-modal="true" aria-labelledby="${titleId}">
        <button type="button" class="two-factor-close" aria-label="Cancel verification">&times;</button>
        <span class="two-factor-badge"><i class="fas fa-shield-alt"></i> 2-Step Check</span>
        <h2 id="${titleId}">${formLabel || "Request"} verification</h2>
        <p>Enter the 6-digit code below to confirm sending this request for <strong>${escapeHtml(target)}</strong>.</p>
        <div class="two-factor-code" data-two-factor-code>${verificationCode}</div>
        <label>
          Verification code
          <input type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" data-two-factor-input placeholder="Enter 6-digit code" />
        </label>
        <p class="two-factor-error" data-two-factor-error aria-live="polite"></p>
        <div class="two-factor-actions">
          <button type="button" class="btn btn-outline" data-two-factor-refresh>Generate New Code</button>
          <button type="button" class="btn" data-two-factor-submit>Verify & Send</button>
        </div>
      </section>
    `;

    activeTwoFactorModal = modal;
    document.body.appendChild(modal);
    document.body.classList.add("two-factor-open");

    const input = modal.querySelector("[data-two-factor-input]");
    const error = modal.querySelector("[data-two-factor-error]");
    const codeDisplay = modal.querySelector("[data-two-factor-code]");
    const verifyButton = modal.querySelector("[data-two-factor-submit]");
    const refreshButton = modal.querySelector("[data-two-factor-refresh]");
    const closeButton = modal.querySelector(".two-factor-close");

    function cleanup() {
      document.body.classList.remove("two-factor-open");
      document.removeEventListener("keydown", handleKeyDown);
      closeTwoFactorModal();
    }

    function cancelVerification() {
      const errorObject = new Error("Two-step verification was cancelled.");
      errorObject.name = "TwoFactorCancelled";
      cleanup();
      reject(errorObject);
    }

    function verifyCode() {
      if (input.value.trim() === verificationCode) {
        templateParams.two_step_verified = "Yes";
        cleanup();
        resolve();
        return;
      }

      error.textContent = "Code does not match. Please try again.";
      input.select();
    }

    function refreshCode() {
      verificationCode = createTwoFactorCode();
      codeDisplay.textContent = verificationCode;
      input.value = "";
      error.textContent = "New verification code generated.";
      input.focus();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        cancelVerification();
      }
    }

    input.addEventListener("input", function () {
      input.value = input.value.replace(/\D/g, "").slice(0, 6);
      error.textContent = "";
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        verifyCode();
      }
    });
    verifyButton.addEventListener("click", verifyCode);
    refreshButton.addEventListener("click", refreshCode);
    closeButton.addEventListener("click", cancelVerification);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        cancelVerification();
      }
    });
    document.addEventListener("keydown", handleKeyDown);

    window.setTimeout(function () {
      input.focus();
    }, 80);
  });
}

function attachEmailJsSubmit(form, buildParams, templateId, successMessage, formLabel) {
  if (!form) {
    return;
  }

  initInlineFormValidation(form);

  if (isBookingApiForm(form) && !isTravelApiConfigured()) {
    const submitText = form.querySelector('button[type="submit"] .btn-text');

    if (submitText) {
      submitText.textContent = "Send via WhatsApp";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (form.dataset.sending === "true") {
      return;
    }

    if (!validateTravelFormFields(form)) {
      showToast("Please fix the highlighted fields before sending.", "error");
      return;
    }

    form.dataset.sending = "true";
    setFormLoading(form, true);

    const templateParams = buildParams(form);
    let paymentResult = null;
    let handledByWhatsAppFallback = false;

    Promise.resolve()
      .then(function () {
        if (isBookingApiForm(form) && !isTravelApiConfigured()) {
          handledByWhatsAppFallback = true;
          return sendBookingViaWhatsAppFallback(templateParams).then(function (result) {
            paymentResult = result;
            return result;
          });
        }

        if (shouldUseClientOnlySubmission(form, templateId)) {
          return sendClientOnlyForm(form);
        }

        return requestTwoFactorVerification(formLabel, templateParams);
      })
      .then(function () {
        if (handledByWhatsAppFallback) {
          return Promise.resolve();
        }

        if (shouldUseClientOnlySubmission(form, templateId)) {
          return Promise.resolve();
        }

        if (isFormspreeForm(form)) {
          return sendFormspree(form, templateParams);
        }

        if (isBookingApiForm(form)) {
          return sendBookingApi(templateParams).then(function (data) {
            return handleBookingPayment(data, templateParams).then(function (result) {
              paymentResult = result;
              return data;
            });
          });
        }

        return sendEmailJs(templateId, templateParams, formLabel);
      })
      .then(function () {
        return isFormspreeForm(form) || isBookingApiForm(form) || shouldUseClientOnlySubmission(form, templateId)
          ? Promise.resolve()
          : sendAutoReply(templateParams);
      })
      .then(function () {
        if (paymentResult && paymentResult.paymentPending) {
          return;
        }

        if (paymentResult && paymentResult.whatsappFallback) {
          showToast(
            paymentResult.popupBlocked
              ? "Booking details are ready. Open WhatsApp to send the request."
              : "WhatsApp opened with your booking details. Please press Send to complete the request.",
            paymentResult.popupBlocked ? "info" : "success",
            {
              href: paymentResult.whatsappUrl,
              label: "Open WhatsApp",
            }
          );
          form.reset();
          clearTravelFormErrors(form);
          setupBookingPrefill();
          initInlineFormValidation(form);
          return;
        }

        showToast(successMessage, "success");
        form.reset();
        clearTravelFormErrors(form);
        setupBookingPrefill();
        initInlineFormValidation(form);
      })
      .catch(function (error) {
        if (error && error.name === "TwoFactorCancelled") {
          showToast("Verification cancelled. Your request was not sent.", "info");
          return;
        }

        console.error("Form send failed:", error);
        applyServerValidationErrors(form, error.details);

        if (isBookingApiForm(form) && shouldFallbackBookingToWhatsApp(error)) {
          sendBookingViaWhatsAppFallback(templateParams).then(function (fallbackResult) {
            showToast(
              fallbackResult.popupBlocked
                ? "Backend setup is not complete yet. Open WhatsApp to send this booking."
                : "Backend setup is not complete yet, so WhatsApp opened with your booking details.",
              fallbackResult.popupBlocked ? "info" : "success",
              {
                href: fallbackResult.whatsappUrl,
                label: "Open WhatsApp",
              }
            );
          });
          return;
        }

        if (error.paymentRetryAvailable && error.bookingId) {
          showPaymentRetryNotice(error.bookingId);
          return;
        }

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
      phone: formatTravelPhone(getFormValue(form, "bookingPhone")),
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
  "Payment verified! Your booking request was sent successfully.",
  "Booking"
);

setupPaymentRetryFromUrl();

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
