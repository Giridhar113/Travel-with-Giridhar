(function () {
  const siteConfig = window.TRAVEL_SITE_CONFIG || {};
  const whatsappNumber = siteConfig.whatsappNumber || "918179721034";
  const savedTripsKey = "savedTrips";
  const localTestimonialsKey = "travelLocalTestimonials";
  const newsletterKey = "travelNewsletterEmail";
  const aiPlanHistoryKey = "travelAiPlanHistory";
  const quoteText =
    siteConfig.whatsappMessage || "Hi, I want to plan a trip with Travel with Giridhar.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(quoteText)}`;

  const travelData = window.TRAVEL_DATA || {};
  const basePackages = Array.isArray(travelData.basePackages) ? travelData.basePackages : [];
  const budgetDestinations = Array.isArray(travelData.budgetDestinations) ? travelData.budgetDestinations : [];
  const destinationCatalog = Array.isArray(travelData.destinations)
    ? travelData.destinations
    : [];

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function money(value) {
    if (typeof formatRupees === "function") {
      return formatRupees(value);
    }
    return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function debounce(callback, delay) {
    let timer;

    return function () {
      const context = this;
      const args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, delay);
    };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

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
    const widths = [400, 800, 1200];
    const variants = widths
      .map(function (width) {
        const url = unsplashVariant(src, width);
        return url ? `${escapeHtml(url)} ${width}w` : "";
      })
      .filter(Boolean);

    if (!variants.length) {
      return "";
    }

    return `srcset="${variants.join(", ")}" sizes="${escapeHtml(sizes || "(max-width: 768px) 92vw, 33vw")}"`;
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
    const sharedPackages = Array.isArray(travelData.packages)
      ? travelData.packages
      : basePackages;
    const byTitle = new Map();
    sharedPackages.forEach(function (item) {
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
    return `contact.html?package=${encodeURIComponent(item.title || "Custom Trip")}&destination=${encodeURIComponent(item.destination || "")}#bookingForm`;
  }

  function tripDetailsUrl(item, type) {
    const params = new URLSearchParams();
    const mode = type || (item && item.title ? "package" : "destination");
    params.set("type", mode);
    if (item && item.id) params.set("id", item.id);
    if (item && item.title) params.set("package", item.title);
    if (item && (item.destination || item.name)) params.set("destination", item.destination || item.name);
    return `trip-details.html?${params.toString()}`;
  }

  function destinationByName(name) {
    const needle = String(name || "").toLowerCase();
    return destinationCatalog.find(function (item) {
      return String(item.destination || item.name || "").toLowerCase() === needle ||
        String(item.id || "").toLowerCase() === needle;
    });
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
    const savedDestinations = saved.filter(function (item) {
      return item.type === "destination";
    });
    document.querySelectorAll(".wishlist-count").forEach(function (node) {
      node.textContent = saved.length;
    });
    document.querySelectorAll("#savedCount").forEach(function (node) {
      node.textContent = document.body.classList.contains("destinations-page")
        ? `Saved destinations: ${savedDestinations.length}`
        : `Saved trips: ${saved.length}`;
    });
    document.querySelectorAll("#savedFilterCount").forEach(function (node) {
      node.textContent = `(${savedDestinations.length})`;
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
        if (document.body.classList.contains("destinations-page") && typeof window.applyDestinationFilters === "function") {
          window.applyDestinationFilters();
        }
      }
      const clear = event.target.closest("[data-clear-wishlist]");
      if (clear) {
        setSavedTrips([]);
        updateWishlistUi();
        toast("Wishlist cleared.", "success");
      }
      const compare = event.target.closest("[data-wishlist-compare]");
      if (compare) {
        renderWishlistComparison();
      }
      const bookSelected = event.target.closest("[data-wishlist-book]");
      if (bookSelected) {
        const selected = getSelectedWishlistItems();
        if (!selected.length) {
          toast("Select at least one saved trip first.", "error");
          return;
        }
        const first = selected[0];
        window.location.href = bookingUrl({ title: first.packageName || first.name, destination: first.destination || first.name });
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
    const total = saved.reduce(function (sum, item) {
      return sum + Number(item.price || parseAmount(item.priceText) || 0);
    }, 0);
    list.innerHTML = saved.map(function (item) {
      const linkItem = { title: item.packageName || item.name, destination: item.destination || item.name };
      return `
        <article class="saved-trip-item">
          <label class="saved-trip-select">
            <input type="checkbox" data-select-saved="${escapeHtml(item.id)}" aria-label="Select ${escapeHtml(item.name)}" />
          </label>
          <div>
            <strong>${item.name}</strong>
            <p>${item.destination || item.type} - ${item.priceText || "Custom quote"}</p>
          </div>
          <div class="saved-trip-actions">
            <a class="btn btn-small" href="${bookingUrl(linkItem)}">Book Now</a>
            <a class="btn btn-outline btn-small" href="${tripDetailsUrl(linkItem, item.type)}">Details</a>
            <button type="button" class="btn btn-outline btn-small" data-remove-trip="${item.id}">Remove</button>
          </div>
        </article>
      `;
    }).join("") + `
      <div class="wishlist-summary-card">
        <div>
          <span>Total saved value</span>
          <strong>${total ? money(total) : "Custom quotes"}</strong>
        </div>
        <div class="wishlist-summary-actions">
          <button type="button" class="btn btn-small" data-wishlist-book>Book Selected</button>
          <button type="button" class="btn btn-outline btn-small" data-wishlist-compare>Compare Selected</button>
          <button type="button" class="btn btn-outline btn-small" data-clear-wishlist>Remove All</button>
        </div>
      </div>
      <div class="wishlist-compare-result" id="wishlistCompareResult" aria-live="polite"></div>
    `;
  }

  function getSelectedWishlistItems() {
    const selectedIds = Array.from(document.querySelectorAll("[data-select-saved]:checked")).map(function (input) {
      return input.dataset.selectSaved;
    });
    return getSavedTrips().filter(function (item) {
      return selectedIds.includes(item.id);
    });
  }

  function renderWishlistComparison() {
    const target = document.getElementById("wishlistCompareResult");
    const selected = getSelectedWishlistItems();
    if (!target) return;
    if (selected.length < 2) {
      target.innerHTML = '<p class="v13-empty-state">Select 2 or more saved trips to compare them.</p>';
      return;
    }
    target.innerHTML = `
      <h3>Saved Trip Comparison</h3>
      <div class="wishlist-compare-grid">
        ${selected.slice(0, 4).map(function (item) {
          return `
            <article>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.destination || "Flexible destination")}</span>
              <small>${escapeHtml(item.priceText || "Custom quote")}</small>
              <a href="${tripDetailsUrl({ title: item.packageName || item.name, destination: item.destination || item.name }, item.type)}">Open details</a>
            </article>
          `;
        }).join("")}
      </div>
    `;
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
        if (document.body.classList.contains("destinations-page") && typeof window.applyDestinationFilters === "function") {
          window.applyDestinationFilters();
        }
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
        if (document.body.classList.contains("destinations-page")) {
          setSavedTrips(getSavedTrips().filter(function (item) { return item.type !== "destination"; }));
        } else {
          setSavedTrips([]);
        }
        updateWishlistUi();
        if (document.body.classList.contains("destinations-page") && typeof window.applyDestinationFilters === "function") {
          window.applyDestinationFilters();
        }
        toast("Wishlist cleared.", "success");
      });
    });
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
    const queryDestination = (params.get("destination") || "").trim().slice(0, 140);
    const queryPackage = (params.get("package") || "").trim().slice(0, 140);
    let currentStep = 0;

    function fillDestinations() {
      const names = Array.from(new Set(
        budgetDestinations
          .map(function (item) { return item.name; })
          .concat(getPackageCatalog().map(function (item) { return item.destination; }))
          .concat(queryDestination ? [queryDestination] : [])
      )).filter(Boolean);
      destinationSelect.innerHTML = '<option value="">Choose destination</option>' + names.map(function (name) {
        return `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`;
      }).join("");
    }

    function fillPackages() {
      const selectedDestination = destinationSelect.value;
      const selectedPackage = packageSelect.dataset.selected || queryPackage || packageSelect.value;
      const matches = getPackageCatalog().filter(function (item) {
        return !selectedDestination || item.destination === selectedDestination;
      });
      packageSelect.innerHTML = '<option value="">Choose package</option>' + matches.map(function (item) {
        return `<option value="${escapeHtml(item.title)}">${escapeHtml(item.title)}</option>`;
      }).join("") + '<option value="Custom Trip">Custom Trip</option>';
      if (selectedPackage) {
        const option = Array.from(packageSelect.options).find(function (item) {
          return item.value.toLowerCase() === selectedPackage.toLowerCase();
        });
        if (option) {
          packageSelect.value = option.value;
        } else {
          packageSelect.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(selectedPackage)}">${escapeHtml(selectedPackage)}</option>`);
          packageSelect.value = selectedPackage;
        }
      }
    }

    function updateBudget() {
      if (budgetReadout) budgetReadout.textContent = money(Number(budgetRange.value));
    }

    function updateTraveler(delta) {
      const next = Math.max(1, Math.min(20, Number(travelerInput.value || 1) + delta));
      travelerInput.value = next;
      travelerInput.dispatchEvent(new Event("input", { bubbles: true }));
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

      if (window.validateTravelFormFields) {
        const isStepValid = window.validateTravelFormFields(form, step);
        if (error) {
          error.textContent = isStepValid ? "" : "Please fix the highlighted fields before continuing.";
        }
        return isStepValid;
      }

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
        ["Phone", window.formatTravelPhone ? window.formatTravelPhone(value("bookingPhone")) : `+91 ${value("bookingPhone")}`],
        ["Travel Date", value("travelDate")],
        ["Travelers", value("travelers")],
        ["Traveler Type", value("travelersType")],
        ["EMI Needed", value("emiNeeded")],
        ["Preferred Contact", value("preferredContact")],
        ["Requests", value("bookingNotes") || "No special requests added"]
      ];
      summary.innerHTML = rows.map(function (row) {
        return `<div class="summary-row"><span>${row[0]}</span><strong>${row[1] || "Not selected"}</strong></div>`;
      }).join("") + `
        <div class="booking-timeline-card">
          <h3>Booking Timeline</h3>
          <ol>
            <li class="is-active"><span>1</span><strong>Request Sent</strong><small>Your details are saved in the booking desk.</small></li>
            <li><span>2</span><strong>Reviewed</strong><small>The trip is checked for date, budget, and package fit.</small></li>
            <li><span>3</span><strong>Contacted</strong><small>You receive WhatsApp or email follow-up.</small></li>
            <li><span>4</span><strong>Confirmed</strong><small>The final plan is confirmed after your approval.</small></li>
          </ol>
        </div>
      `;
    }

    fillDestinations();
    if (queryDestination) destinationSelect.value = queryDestination;
    fillPackages();
    if (queryPackage) packageSelect.value = queryPackage;
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
      const firstInvalidStep = steps.findIndex(function (_, stepIndex) {
        return !validateStep(stepIndex);
      });

      if (firstInvalidStep !== -1 || currentStep !== 2) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setStep(firstInvalidStep === -1 ? currentStep : firstInvalidStep);
        return;
      }
      form.dataset.readyToSubmit = "true";
      renderSummary();
    }, true);
  }

  function initSmartPackageBuilder() {
    if (!document.body.classList.contains("packages-page") || document.getElementById("smartPackageBuilder")) {
      return;
    }

    const packageTools = document.querySelector(".package-tools");
    const packages = getPackageCatalog();

    if (!packageTools || !packages.length) {
      return;
    }

    const destinations = Array.from(new Set(packages.map(function (item) {
      return item.destination;
    }).filter(Boolean)));
    const section = document.createElement("section");
    section.className = "section smart-package-builder";
    section.id = "smartPackageBuilder";
    section.innerHTML = `
      <div class="section-heading-left">
        <p class="hero-kicker">Smart Package Builder</p>
        <h2>Build a custom trip estimate</h2>
        <p>Choose destination, travelers, hotel comfort, transport, and activities to get a quick INR estimate before sending an inquiry.</p>
      </div>
      <div class="builder-grid">
        <form class="builder-panel" id="packageBuilderForm">
          <label>Destination
            <select id="builderDestination">
              ${destinations.map(function (name) { return `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`; }).join("")}
            </select>
          </label>
          <div class="builder-two">
            <label>Travelers
              <input type="number" id="builderTravelers" min="1" max="12" value="2" />
            </label>
            <label>Days
              <input type="number" id="builderDays" min="2" max="12" value="5" />
            </label>
          </div>
          <div>
            <strong>Hotel type</strong>
            <div class="v13-tier-options" id="builderHotel">
              ${["Budget", "Standard", "Premium", "Luxury"].map(function (tier, index) {
                return `<button type="button" class="v13-pill${index === 1 ? " is-active" : ""}" data-builder-tier="${tier.toLowerCase()}">${tier}</button>`;
              }).join("")}
            </div>
          </div>
          <div class="builder-options">
            <label><input type="checkbox" id="builderTransport" checked /> Local transport</label>
            <label><input type="checkbox" id="builderActivities" checked /> Guided activities</label>
          </div>
        </form>
        <aside class="builder-result" id="builderResult" aria-live="polite"></aside>
      </div>
    `;
    packageTools.after(section);

    const destination = section.querySelector("#builderDestination");
    const travelers = section.querySelector("#builderTravelers");
    const days = section.querySelector("#builderDays");
    const transport = section.querySelector("#builderTransport");
    const activities = section.querySelector("#builderActivities");
    const result = section.querySelector("#builderResult");
    let tier = "standard";
    const multipliers = {
      budget: 0.82,
      standard: 1,
      premium: 1.28,
      luxury: 1.65,
    };

    function bestPackage() {
      const byDestination = packages.filter(function (item) {
        return item.destination === destination.value;
      });
      return byDestination.sort(function (a, b) {
        return Math.abs(Number(a.days || 5) - Number(days.value || 5)) - Math.abs(Number(b.days || 5) - Number(days.value || 5));
      })[0] || packages[0];
    }

    function render() {
      const match = bestPackage();
      const travelerCount = Number(travelers.value || 1);
      const dayCount = Number(days.value || match.days || 5);
      const basePerPerson = Number(match.amount || match.price || 30000);
      const dayFactor = Math.max(0.75, dayCount / Math.max(Number(match.days || 5), 1));
      const extras = (transport.checked ? 2500 : 0) + (activities.checked ? 1800 : 0);
      const total = Math.round((basePerPerson * dayFactor * multipliers[tier] + extras) * travelerCount);
      const linkItem = { title: `${match.title} Custom Plan`, destination: destination.value };

      result.innerHTML = `
        <span class="ai-pill">Estimate Ready</span>
        <h3>${escapeHtml(destination.value)} custom plan</h3>
        <strong>${money(total)}</strong>
        <dl class="builder-breakdown">
          <div><dt>Base match</dt><dd>${escapeHtml(match.title)}</dd></div>
          <div><dt>Duration</dt><dd>${dayCount} days</dd></div>
          <div><dt>Travelers</dt><dd>${travelerCount}</dd></div>
          <div><dt>Hotel</dt><dd>${tier.charAt(0).toUpperCase() + tier.slice(1)}</dd></div>
        </dl>
        <p>Estimate includes selected comfort level and optional add-ons. Final quote is confirmed after date and availability check.</p>
        <div class="v13-card-action-row">
          <a class="btn" href="${bookingUrl(linkItem)}">Send Inquiry</a>
          <a class="btn btn-outline" href="${tripDetailsUrl(match, "package")}">View Similar Trip</a>
        </div>
      `;
    }

    section.querySelectorAll("[data-builder-tier]").forEach(function (button) {
      button.addEventListener("click", function () {
        tier = button.dataset.builderTier;
        section.querySelectorAll("[data-builder-tier]").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        render();
      });
    });
    [destination, travelers, days, transport, activities].forEach(function (control) {
      control.addEventListener("input", render);
      control.addEventListener("change", render);
    });
    render();
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
          <div class="range-endpoints" aria-hidden="true">
            <span>Rs. 10,000</span>
            <span>Rs. 1,50,000</span>
          </div>
          <span class="v13-readout" id="packagePriceReadout" aria-live="polite">Rs. 10,000 - Rs. 1,50,000</span>
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
          ${["All", "Beach", "Adventure", "Family", "Honeymoon", "Luxury", "Budget", "International"].map(function (tag) { return `<button type="button" class="v13-chip${tag === "All" ? " is-active" : ""}" data-package-filter="${tag.toLowerCase()}" aria-pressed="${tag === "All" ? "true" : "false"}">${tag}</button>`; }).join("")}
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
        const detailsLink = document.createElement("a");
        detailsLink.className = "btn btn-outline";
        detailsLink.href = tripDetailsUrl(catalog || { title, destination: card.dataset.packageDestination }, "package");
        detailsLink.textContent = "Details";
        row.appendChild(detailsLink);
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
      minRange.setAttribute("aria-valuetext", `Minimum ${money(min)}`);
      maxRange.setAttribute("aria-valuetext", `Maximum ${money(max)}`);
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

    function handleRangeKeydown(event) {
      const control = event.currentTarget;
      const step = Number(control.step || 1000);
      const min = Number(control.min || 10000);
      const max = Number(control.max || 150000);
      const current = Number(control.value || min);
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
      control.value = String(Math.min(max, Math.max(min, next)));
      apply();
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        active = chip.dataset.packageFilter;
        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
          item.setAttribute("aria-pressed", String(item === chip));
        });
        apply();
      });
    });
    const debouncedApply = debounce(apply, 120);
    [search, minRange, maxRange].forEach(function (control) {
      control.addEventListener("input", debouncedApply);
      control.addEventListener("change", apply);
    });
    [minRange, maxRange].forEach(function (control) {
      control.addEventListener("keydown", handleRangeKeydown);
    });
    sort.addEventListener("input", apply);
    sort.addEventListener("change", apply);
    if (reset) {
      reset.addEventListener("click", function () {
        search.value = "";
        minRange.value = "10000";
        maxRange.value = "150000";
        sort.value = "default";
        active = "all";
        chips.forEach(function (item) {
          const isActive = item.dataset.packageFilter === "all";
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });
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
            <a class="btn btn-outline" href="${tripDetailsUrl(item, "package")}">View Details</a>
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
    const featuredTitles = Array.isArray(travelData.featuredPackageTitles)
      ? travelData.featuredPackageTitles
      : [];
    const trips = featuredTitles.map(packageByTitle).filter(Boolean);

    function routePlannerMarkup() {
      return `
        <div class="featured-route-panel" id="routePreview" aria-label="Google Maps route planner from Hyderabad">
          <div class="route-live-tools">
            <label for="routeDestinationSelect">
              Choose destination
              <select id="routeDestinationSelect">
                <option value="bali">Loading all destinations...</option>
              </select>
            </label>
            <div class="route-live-actions">
              <a
                id="routeOpenMaps"
                class="btn btn-small"
                href="https://www.google.com/maps/dir/?api=1&origin=Hyderabad%2C%20India&destination=Bali%2C%20Indonesia"
                target="_blank"
                rel="noreferrer"
              >
                Open Google Maps
              </a>
              <a
                id="routeBookTrip"
                class="btn btn-outline btn-small"
                href="contact.html?package=Premium%20Bali%20Tour&destination=Bali%2C%20Indonesia#bookingForm"
              >
                Book This Route
              </a>
            </div>
          </div>
          <div class="route-google-map">
            <iframe
              id="routeGoogleMap"
              title="Google map showing Bali, Indonesia"
              src="https://www.google.com/maps?q=Bali%2C%20Indonesia&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      `;
    }

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
        ${trips.map(function (trip, index) {
          return `
            <article class="v13-featured-card" data-featured-tags="${trip.tags.join(" ").toLowerCase()}">
              <img src="${trip.image}" alt="${escapeHtml(trip.title)} destination view" loading="lazy" width="640" height="420" ${responsiveImageAttrs(trip.image, "(max-width: 768px) 92vw, 31vw")} />
              <div class="v13-featured-content">
                <div class="card-meta"><h3>${trip.title}</h3><span class="price">${money(trip.price)}</span></div>
                <div class="tag-row">${trip.tags.slice(0, 4).map(function (tag) { return `<span class="tag">${tag}</span>`; }).join("")}</div>
                <p>${trip.duration} - ${trip.bestFor}</p>
                <div class="v13-card-action-row">
                  <a class="btn" href="${bookingUrl(trip)}">Book Now</a>
                  <a class="btn btn-outline" href="${tripDetailsUrl(trip, "package")}">Details</a>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
      ${routePlannerMarkup()}
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
    const featuredTitles = Array.isArray(travelData.featuredPackageTitles)
      ? travelData.featuredPackageTitles
      : [];
    const featuredDestinations = new Set(featuredTitles
      .map(packageByTitle)
      .filter(Boolean)
      .map(function (item) {
        return item.destination.toLowerCase();
      }));
    const trendingTitles = Array.isArray(travelData.trendingPackageTitles)
      ? travelData.trendingPackageTitles
      : [];
    const trendingCandidates = trendingTitles
      .map(packageByTitle)
      .filter(Boolean)
      .map(function (item, index) {
        const badge = item.tags.includes("Luxury") ? "Luxury" : item.tags.includes("Family") ? "Family" : index === 0 ? "Hot" : "Popular";
        const rating = (4.6 + ((item.popularity || 80) % 4) / 10).toFixed(1);
        return [item.title, item.destination, item.price, item.bestFor, badge, rating, item.image];
      });
    const trending = trendingCandidates.filter(function (item) {
      return !featuredDestinations.has(String(item[1]).toLowerCase());
    });
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
              <img src="${item[6]}" alt="${escapeHtml(item[0])} destination view" loading="lazy" width="640" height="420" ${responsiveImageAttrs(item[6], "(max-width: 768px) 80vw, 28vw")} />
              <div class="v13-trending-content">
                <h3>${item[0]}</h3>
                <p>${item[1]}</p>
                <strong>From ${money(item[2])}</strong>
                <span>${item[3]}</span>
                <span class="v13-stars" aria-label="${item[5]} star rating">${ratingStarsMarkup(item[5])} ${item[5]}</span>
                <div class="v13-card-action-row">
                  <a class="btn btn-small" href="${bookingUrl(trip)}">Book Now</a>
                  <a class="btn btn-outline btn-small" href="${tripDetailsUrl(packageByTitle(item[0]) || trip, "package")}">Details</a>
                </div>
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
          <h3>Saved Trip Matches</h3>
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
        toast("Trip match history cleared.", "success");
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
      list.innerHTML = '<p class="v13-empty-state">No saved trip matches yet. Generate a plan to save it here.</p>';
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
                  <img class="v13-review-avatar" src="${review[5]}" alt="${escapeHtml(review[0])} traveler portrait" loading="lazy" width="112" height="112" ${responsiveImageAttrs(review[5], "56px")} />
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
      { title: "Bali Temple Beach", category: "Beaches", photo: "photo-1537996194471-e657df975ab4", destination: "Bali, Indonesia", caption: "Temple coastlines, rice terraces, and warm beach evenings." },
      { title: "Goa Golden Shore", category: "Beaches", photo: "photo-1507525428034-b723cf961d3e", destination: "Goa, India", caption: "Easy beach cafes, sunsets, and weekend-friendly coastal energy." },
      { title: "Maldives Lagoon", category: "Beaches", photo: "photo-1573843981267-be1999ff37cd", destination: "Maldives", caption: "Clear lagoon water, resort stays, and slow island days." },
      { title: "Santorini Sunset", category: "Beaches", photo: "photo-1570077188670-e3a8d69ac5ff", destination: "Santorini, Greece", caption: "White villages, blue domes, and premium sunset views." },
      { title: "Manali Valley", category: "Mountains", photo: "photo-1506905925346-21bda4d32df4", destination: "Manali, India", caption: "Cool mountain weather, valley drives, and adventure stops." },
      { title: "Swiss Alps", category: "Mountains", photo: "photo-1531366936337-7c912a4589a7", destination: "Swiss Alps, Switzerland", caption: "Snow peaks, scenic trains, and lake-side mountain towns." },
      { title: "Kashmir Lake", category: "Mountains", photo: "photo-1500530855697-b586d89ba3ee", destination: "Kashmir, India", caption: "Houseboats, gardens, valleys, and calm mountain views." },
      { title: "Darjeeling Hills", category: "Mountains", photo: "photo-1501785888041-af3ef285b470", destination: "Darjeeling, India", caption: "Tea gardens, misty viewpoints, and heritage hill charm." },
      { title: "Dubai Skyline", category: "Cities", photo: "photo-1512453979798-5ea266f8880c", destination: "Dubai, UAE", caption: "Modern skyline, desert experiences, shopping, and luxury stays." },
      { title: "Paris Landmark", category: "Cities", photo: "photo-1502602898657-3e91760cbb34", destination: "Paris, France", caption: "Landmarks, cafes, museums, and romantic city walks." },
      { title: "Tokyo Nights", category: "Cities", photo: "photo-1540959733332-eab4deabeeaf", destination: "Tokyo, Japan", caption: "Neon streets, temples, food lanes, and modern culture." },
      { title: "New York Streets", category: "Cities", photo: "photo-1485871981521-5b1fd3805eee", destination: "New York, USA", caption: "Skyline views, museums, shopping streets, and city lights." },
      { title: "Rome Heritage", category: "Food & Culture", photo: "photo-1525874684015-58379d421a52", destination: "Rome, Italy", caption: "Historic streets, monuments, Italian food, and evening walks." },
      { title: "Rajasthan Palace", category: "Food & Culture", photo: "photo-1477587458883-47145ed94245", destination: "Rajasthan, India", caption: "Palaces, forts, markets, and rich royal culture." },
      { title: "Istanbul Market", category: "Food & Culture", photo: "photo-1541432901042-2d8bd64b4a9b", destination: "Istanbul, Turkey", caption: "Old city routes, bazaars, Bosphorus views, and local food." },
      { title: "Vietnam Lanterns", category: "Food & Culture", photo: "photo-1528127269322-539801943592", destination: "Vietnam", caption: "Lantern streets, bay cruises, food walks, and layered history." },
      { title: "Ladakh Road", category: "Adventure", photo: "photo-1464822759023-fed622ff2c3b", destination: "Ladakh, India", caption: "High-altitude roads, monasteries, lakes, and rugged landscapes." },
      { title: "Rishikesh Rafting", category: "Adventure", photo: "photo-1500534314209-a25ddb2bd429", destination: "Rishikesh, India", caption: "River rafting, yoga cafes, temples, and mountain air." },
      { title: "Queenstown Lake", category: "Adventure", photo: "photo-1500534314209-a25ddb2bd429", destination: "Queenstown, New Zealand", caption: "Lake views, adventure sports, and scenic drives." },
      { title: "Cape Town Coast", category: "Adventure", photo: "photo-1580060839134-75a5edca2e99", destination: "Cape Town, South Africa", caption: "Table Mountain, beaches, coastal roads, and wildlife routes." },
      { title: "Kerala Backwaters", category: "Food & Culture", photo: "photo-1602216056096-3b40cc0c9944", destination: "Kerala, India", caption: "Houseboats, greenery, calm resorts, and local meals." },
      { title: "Singapore Marina", category: "Cities", photo: "photo-1525625293386-3f8f99389edd", destination: "Singapore", caption: "Family attractions, gardens, skyline views, and clean city breaks." },
      { title: "Phuket Islands", category: "Beaches", photo: "photo-1506929562872-bb421503ef21", destination: "Phuket, Thailand", caption: "Island tours, beach viewpoints, nightlife, and water activities." },
      { title: "Ooty Tea Gardens", category: "Mountains", photo: "photo-1519681393784-d120267933ba", destination: "Ooty, India", caption: "Tea estates, lakes, viewpoints, and cool-weather stays." }
    ];
    const wrapper = gallery.parentElement;
    const filters = document.createElement("div");
    filters.className = "v13-filter-chips v13-gallery-filter";
    filters.innerHTML = ["All", "Beaches", "Mountains", "Cities", "Food & Culture", "Adventure"].map(function (tag) {
      return `<button type="button" class="v13-chip${tag === "All" ? " is-active" : ""}" data-gallery-filter="${tag.toLowerCase()}" aria-pressed="${tag === "All"}">${tag}</button>`;
    }).join("");
    wrapper.insertBefore(filters, gallery);
    gallery.className = "v13-gallery-grid";
    gallery.innerHTML = items.map(function (item, index) {
      const src = `https://images.unsplash.com/${item.photo}?w=800&auto=format&fit=crop&q=75`;
      const link = `destinations.html?search=${encodeURIComponent(item.destination)}`;
      return `
        <article class="gallery-item v13-gallery-item" tabindex="0" role="button" aria-label="Open ${escapeHtml(item.title)} photo" data-gallery-category="${item.category.toLowerCase()}" data-gallery-category-label="${escapeHtml(item.category)}" data-gallery-index="${index}" data-gallery-title="${escapeHtml(item.title)}" data-gallery-destination="${escapeHtml(item.destination)}" data-gallery-link="${escapeHtml(link)}">
          <img src="${src}" alt="${escapeHtml(item.title)} in ${escapeHtml(item.destination)}" loading="lazy" decoding="async" width="800" height="${index % 3 === 0 ? 980 : 640}" ${responsiveImageAttrs(src, "(max-width: 768px) 92vw, (max-width: 1100px) 45vw, 30vw")} />
          <div class="v13-gallery-overlay">
            <span class="v13-gallery-category">${escapeHtml(item.category)}</span>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.caption)}</p>
            <a class="v13-gallery-destination-link" href="${escapeHtml(link)}" aria-label="View ${escapeHtml(item.destination)} on the destinations page">View destination</a>
            <span class="v13-gallery-zoom"><i class="fas fa-search-plus"></i> Enlarge photo</span>
          </div>
        </article>
      `;
    }).join("");
    const lightbox = document.createElement("div");
    lightbox.className = "v13-lightbox";
    lightbox.id = "galleryLightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-labelledby", "lightboxTitle");
    lightbox.setAttribute("aria-describedby", "lightboxMeta");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <button type="button" class="v13-lightbox-close" data-lightbox-close aria-label="Close gallery"><i class="fas fa-times"></i></button>
      <button type="button" class="v13-lightbox-prev" data-lightbox-prev aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <img alt="Expanded gallery image" />
      <button type="button" class="v13-lightbox-next" data-lightbox-next aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      <div class="v13-lightbox-caption" id="lightboxCaption">
        <strong id="lightboxTitle"></strong>
        <span id="lightboxMeta"></span>
        <a href="destinations.html" data-lightbox-destination-link>View destination details</a>
      </div>
    `;
    document.body.appendChild(lightbox);
    let current = 0;
    let lastGalleryTrigger = null;
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const lightboxImage = lightbox.querySelector("img");
    const lightboxTitle = lightbox.querySelector("#lightboxTitle");
    const lightboxMeta = lightbox.querySelector("#lightboxMeta");
    const lightboxLink = lightbox.querySelector("[data-lightbox-destination-link]");
    function visibleItems() { return Array.from(gallery.querySelectorAll(".v13-gallery-item:not(.is-v13-hidden)")); }
    function focusableLightboxItems() {
      return Array.from(lightbox.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(function (item) {
        return !item.hasAttribute("hidden") && item.getAttribute("aria-hidden") !== "true";
      });
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("gallery-lightbox-open");
      if (lastGalleryTrigger && document.contains(lastGalleryTrigger)) {
        lastGalleryTrigger.focus();
      }
    }
    function open(index, trigger) {
      const visible = visibleItems();
      const item = gallery.querySelector(`[data-gallery-index="${index}"]`) || visible[0];
      if (!item) return;
      current = Number(item.dataset.galleryIndex);
      lastGalleryTrigger = trigger || item;
      const thumb = item.querySelector("img");
      lightboxImage.src = unsplashVariant(thumb.src, 1400) || thumb.src;
      lightboxImage.alt = thumb.alt;
      lightboxTitle.textContent = item.dataset.galleryTitle || "";
      lightboxMeta.textContent = `${item.dataset.galleryDestination || ""} - ${item.dataset.galleryCategoryLabel || ""}`;
      lightboxLink.href = item.dataset.galleryLink || "destinations.html";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("gallery-lightbox-open");
      closeButton.focus({ preventScroll: true });
      window.setTimeout(function () {
        closeButton.focus({ preventScroll: true });
      }, 40);
    }
    function move(dir) {
      const visible = visibleItems();
      const pos = visible.findIndex(function (item) { return Number(item.dataset.galleryIndex) === current; });
      const next = visible[((pos < 0 ? 0 : pos) + dir + visible.length) % visible.length];
      if (next) open(Number(next.dataset.galleryIndex), lastGalleryTrigger);
    }
    filters.querySelectorAll("[data-gallery-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.dataset.galleryFilter;
        filters.querySelectorAll(".v13-chip").forEach(function (chip) {
          chip.classList.toggle("is-active", chip === button);
          chip.setAttribute("aria-pressed", String(chip === button));
        });
        gallery.querySelectorAll(".v13-gallery-item").forEach(function (item) {
          item.classList.toggle("is-v13-hidden", filter !== "all" && item.dataset.galleryCategory !== filter);
        });
        if (lightbox.classList.contains("is-open")) {
          closeLightbox();
        }
      });
    });
    gallery.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;
      const item = event.target.closest(".v13-gallery-item");
      if (item) open(Number(item.dataset.galleryIndex), item);
    });
    gallery.addEventListener("keydown", function (event) {
      if (event.target.closest("a, button, input, select, textarea")) return;
      const item = event.target.closest(".v13-gallery-item");
      if (!item || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      open(Number(item.dataset.galleryIndex), item);
    });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) closeLightbox();
      if (event.target.closest("[data-lightbox-prev]")) move(-1);
      if (event.target.closest("[data-lightbox-next]")) move(1);
    });
    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "Tab") {
        const focusable = focusableLightboxItems();
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  function enhanceDestinationFilters() {
    const panel = document.querySelector(".search-panel .filter-tags");
    if (!panel || panel.dataset.v13Ready) return;
    panel.dataset.v13Ready = "true";
    document.querySelectorAll(".destination-card").forEach(function (card) {
      const titleText = card.querySelector("h2") ? card.querySelector("h2").textContent.trim() : "";
      const name = titleText.toLowerCase();
      const price = parseAmount(card.querySelector(".price") ? card.querySelector(".price").textContent : "");
      let category = card.dataset.category || "";
      if (price && price < 30000) category += " budget";
      if (price >= 75000) category += " luxury";
      if (!name.includes("india") && !name.includes("goa") && !name.includes("manali") && !name.includes("kerala") && !name.includes("rajasthan")) category += " international";
      if (/manali|ooty|darjeeling|kashmir|ladakh|coorg|shillong/.test(name)) category += " hill station";
      card.dataset.category = category;
      card.dataset.destination = `${card.dataset.destination || ""} ${category}`;
      const actions = card.querySelector(".destination-actions");
      if (actions && !actions.querySelector("[data-destination-details]")) {
        const item = destinationByName(titleText) || { name: titleText, destination: titleText };
        const link = document.createElement("a");
        link.className = "btn btn-outline";
        link.href = tripDetailsUrl(item, "destination");
        link.textContent = "Details";
        link.dataset.destinationDetails = "true";
        actions.appendChild(link);
      }
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

  function resolveTripDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = String(params.get("id") || "").toLowerCase();
    const packageName = String(params.get("package") || "").toLowerCase();
    const destinationName = String(params.get("destination") || "").toLowerCase();
    const packages = getPackageCatalog();
    const packageMatch =
      packages.find(function (item) { return String(item.id || "").toLowerCase() === id; }) ||
      packages.find(function (item) { return String(item.title || "").toLowerCase() === packageName; }) ||
      packages.find(function (item) { return String(item.destination || "").toLowerCase() === destinationName; });
    const destinationMatch =
      destinationCatalog.find(function (item) { return String(item.id || "").toLowerCase() === id; }) ||
      destinationCatalog.find(function (item) { return String(item.name || item.destination || "").toLowerCase() === destinationName; }) ||
      destinationByName(packageMatch ? packageMatch.destination : "");

    if (packageMatch) {
      return {
        type: "package",
        package: packageMatch,
        destination: destinationMatch || destinationByName(packageMatch.destination),
      };
    }

    if (destinationMatch) {
      return {
        type: "destination",
        package: packages.find(function (item) {
          return String(item.destination || "").toLowerCase() === String(destinationMatch.destination || destinationMatch.name || "").toLowerCase();
        }),
        destination: destinationMatch,
      };
    }

    return null;
  }

  function tripDayPlan(item, destination) {
    const days = Math.max(3, Math.min(10, Number(item.days || parseDays(item.duration) || 5)));
    const place = destination.destination || destination.name || item.destination;
    const ideas = [
      `Arrival in ${place}, hotel check-in, local orientation, and relaxed evening walk.`,
      "Guided sightseeing covering the most popular landmarks and photo spots.",
      "Local food, culture, markets, and flexible free-time slots.",
      "Experience-focused day for beaches, mountains, adventure, or city attractions.",
      "Slow morning, shopping or cafe time, transfer support, and departure planning.",
      "Optional add-on day for nearby places, premium activities, or family-friendly rest time.",
    ];

    return Array.from({ length: days }).map(function (_, index) {
      return {
        day: index + 1,
        text: ideas[index] || ideas[ideas.length - 1],
      };
    });
  }

  function documentChecklist(item, destination) {
    const text = `${item.destination || ""} ${destination.name || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
    const international = !/india|goa|manali|kerala|rajasthan|ladakh|coorg|ooty|darjeeling|kashmir|mysore|rishikesh/.test(text);
    const adventure = /adventure|mountain|trek|snow|ladakh|rishikesh|queenstown|manali/.test(text);
    const beach = /beach|bali|goa|maldives|phuket|andaman|mauritius|island/.test(text);
    return [
      "Government ID proof for all travelers",
      international ? "Passport with valid expiry" : "Train/flight tickets and hotel confirmation",
      international ? "Visa or entry document check" : "Emergency contact list",
      "Travel insurance copy",
      beach ? "Beachwear, sunscreen, and waterproof pouch" : "Weather-appropriate clothing",
      adventure ? "Comfortable shoes and activity consent documents" : "Local transport confirmation",
    ];
  }

  function renderTripDetailsPage() {
    const root = document.getElementById("tripDetailRoot");
    if (!root) return;
    const resolved = resolveTripDetail();
    if (!resolved) {
      root.innerHTML = `
        <section class="page-hero">
          <h1>Trip Not Found</h1>
          <p>Choose a package or destination from the main pages to open a detailed trip plan.</p>
          <a href="packages.html" class="btn">Browse Packages</a>
        </section>
      `;
      return;
    }

    const fallbackDestination = resolved.destination || {};
    const item = resolved.package || {
      title: fallbackDestination.name || "Custom Trip",
      destination: fallbackDestination.destination || fallbackDestination.name || "Flexible destination",
      amount: fallbackDestination.amount || parseAmount(fallbackDestination.price) || 30000,
      price: fallbackDestination.amount || parseAmount(fallbackDestination.price) || 30000,
      duration: "Custom duration",
      days: 5,
      tags: fallbackDestination.tags || ["Custom"],
      features: [
        fallbackDestination.desc || fallbackDestination.description || "Curated destination planning",
        "Hotel and local transport quote support",
        "WhatsApp follow-up with flexible options",
      ],
      bestFor: (fallbackDestination.tags || ["Flexible travelers"]).join(", "),
      image: fallbackDestination.image || "",
    };
    const destination = fallbackDestination.destination ? fallbackDestination : {
      name: item.destination,
      destination: item.destination,
      bestTimeToVisit: item.bestTimeToVisit || "Flexible season",
      desc: item.description || item.bestFor,
      detail: item.description || item.bestFor,
      image: item.image,
      tags: item.tags || [],
    };
    const image = item.image || destination.image || "services1.jpg";
    const inclusions = item.inclusions || item.features || [];
    const exclusions = ["Flights unless requested", "Personal shopping", "Entry tickets not listed", "Meals not listed in final quote"];
    const dayPlan = tripDayPlan(item, destination);
    const docs = documentChecklist(item, destination);
    const bookingLink = bookingUrl({ title: item.title, destination: item.destination || destination.name });
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(item.destination || destination.name)}&output=embed`;
    const openMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.destination || destination.name)}`;

    document.title = `${item.title || destination.name} - Travel with Giridhar`;
    root.innerHTML = `
      <section class="trip-detail-hero" style="--trip-bg:url('${escapeHtml(image)}')">
        <div class="trip-detail-hero-card">
          <p class="hero-kicker">Trip Detail Page</p>
          <h1>${escapeHtml(item.title || destination.name)}</h1>
          <p>${escapeHtml(destination.desc || item.description || "A curated travel plan with clear pricing, itinerary, and support.")}</p>
          <div class="tag-row">${(item.tags || destination.tags || []).slice(0, 5).map(function (tag) { return `<span class="tag">${escapeHtml(tag)}</span>`; }).join("")}</div>
          <div class="trip-detail-actions">
            <a href="${bookingLink}" class="btn">Book via Form</a>
            <a href="${whatsappUrl}" class="btn btn-outline" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </section>

      <section class="section trip-detail-grid">
        <article class="panel trip-overview-card">
          <p class="hero-kicker">Overview</p>
          <h2>${escapeHtml(item.destination || destination.name)}</h2>
          <dl>
            <div><dt>Price from</dt><dd>${money(item.amount || item.price || destination.amount)}</dd></div>
            <div><dt>Duration</dt><dd>${escapeHtml(item.duration || `${item.days || 5} Days`)}</dd></div>
            <div><dt>Best time</dt><dd>${escapeHtml(destination.bestTimeToVisit || destination.best || item.bestTimeToVisit || "Flexible")}</dd></div>
            <div><dt>Best for</dt><dd>${escapeHtml(item.bestFor || (item.tags || []).join(", ") || "Flexible travelers")}</dd></div>
          </dl>
        </article>
        <article class="panel trip-map-card">
          <p class="hero-kicker">Map Preview</p>
          <h2>Explore the route area</h2>
          <iframe title="Google Map for ${escapeHtml(item.destination || destination.name)}" src="${mapUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <a class="btn btn-outline btn-small" href="${openMapUrl}" target="_blank" rel="noreferrer">Open in Google Maps</a>
        </article>
      </section>

      <section class="section trip-detail-grid">
        <article class="panel">
          <p class="hero-kicker">Day-wise Itinerary</p>
          <h2>Simple route plan</h2>
          <ol class="trip-itinerary-list">
            ${dayPlan.map(function (day) { return `<li><strong>Day ${day.day}</strong><span>${escapeHtml(day.text)}</span></li>`; }).join("")}
          </ol>
        </article>
        <article class="panel">
          <p class="hero-kicker">Travel Documents</p>
          <h2>Checklist for this trip</h2>
          <ul class="trip-document-list">
            ${docs.map(function (doc, index) { return `<li><label><input type="checkbox" data-trip-doc="${index}" /> <span>${escapeHtml(doc)}</span></label></li>`; }).join("")}
          </ul>
        </article>
      </section>

      <section class="section trip-detail-grid">
        <article class="panel">
          <p class="hero-kicker">Inclusions</p>
          <h2>What is covered</h2>
          <ul class="trip-document-list">${inclusions.map(function (feature) { return `<li><i class="fas fa-check"></i>${escapeHtml(feature)}</li>`; }).join("")}</ul>
        </article>
        <article class="panel">
          <p class="hero-kicker">Exclusions</p>
          <h2>Plan separately</h2>
          <ul class="trip-document-list">${exclusions.map(function (feature) { return `<li><i class="fas fa-minus"></i>${escapeHtml(feature)}</li>`; }).join("")}</ul>
        </article>
      </section>

      <section class="section trip-seo-section">
        <p class="hero-kicker">Trip Guide</p>
        <h2>Best time, budget, and things to do in ${escapeHtml(item.destination || destination.name)}</h2>
        <div class="trip-seo-grid">
          <article><h3>Best Time To Visit</h3><p>${escapeHtml(destination.bestTimeToVisit || destination.best || "Choose pleasant weather months and avoid heavy rush dates when possible.")}</p></article>
          <article><h3>Things To Do</h3><p>${escapeHtml(destination.detail || item.description || "Sightseeing, local food, relaxed exploration, and optional activities can be added to the final plan.")}</p></article>
          <article><h3>Budget Guide</h3><p>Start from ${money(item.amount || item.price || destination.amount)} and customize hotel, transport, travelers, and activities before confirming.</p></article>
        </div>
      </section>

      <section class="section faq-section">
        <div class="faq-grid">
          <details open><summary>Can this trip be customized?</summary><p>Yes. Dates, hotel comfort, traveler count, transport, and activities can be changed in the booking request.</p></details>
          <details><summary>How do I confirm availability?</summary><p>Use the booking form or WhatsApp. The admin dashboard stores your request for follow-up.</p></details>
          <details><summary>Is this a final price?</summary><p>No. This is a starting price. Final quote depends on date, season, hotel type, and inclusions.</p></details>
        </div>
      </section>
    `;

    const docKey = `travelDocChecklist-${slug(item.title || destination.name)}`;
    const docInputs = Array.from(root.querySelectorAll("[data-trip-doc]"));
    let savedDocs = {};

    try {
      savedDocs = JSON.parse(localStorage.getItem(docKey)) || {};
    } catch (error) {
      savedDocs = {};
    }

    docInputs.forEach(function (input) {
      input.checked = Boolean(savedDocs[input.dataset.tripDoc]);
      input.addEventListener("change", function () {
        savedDocs[input.dataset.tripDoc] = input.checked;
        try {
          localStorage.setItem(docKey, JSON.stringify(savedDocs));
        } catch (error) {
          toast("Document checklist could not be saved in this browser.", "error");
        }
      });
    });
  }

  function initOffersPage() {
    const grid = document.getElementById("offersGrid");
    if (!grid || grid.dataset.ready) return;
    grid.dataset.ready = "true";
    const source = getPackageCatalog();
    const preferred = [
      "Goa Beach Escape",
      "Singapore Family Fun",
      "Premium Bali Tour",
      "Manali Adventure Holiday",
      "Maldives Island Stay",
      "Kerala Backwater Retreat",
      "Dubai Desert Luxury",
      "Santorini Honeymoon Tour",
    ].map(packageByTitle).filter(Boolean);
    const offers = (preferred.length ? preferred : source.slice(0, 8)).map(function (item, index) {
      const tags = item.tags || [];
      const category = tags.includes("Family") ? "family" :
        tags.includes("Honeymoon") || tags.includes("Romantic") ? "honeymoon" :
        tags.includes("International") ? "international" :
        Number(item.days || 5) <= 4 ? "weekend" : "family";
      return {
        ...item,
        offerCategory: category,
        badge: ["Seasonal Pick", "Family Deal", "Couple Special", "Weekend Ready"][index % 4],
      };
    });

    function render(filter) {
      const visible = offers.filter(function (item) {
        return filter === "all" || item.offerCategory === filter || (filter === "international" && (item.tags || []).includes("International"));
      });
      grid.innerHTML = visible.map(function (item) {
        return `
          <article class="offer-card offers-page-card" data-offer-category="${item.offerCategory}">
            <span class="trend-badge">${escapeHtml(item.badge)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.destination)} - ${escapeHtml(item.bestFor || item.description || "Flexible travel plan")}</p>
            <strong>From ${money(item.amount || item.price)}</strong>
            <div class="tag-row">${(item.tags || []).slice(0, 4).map(function (tag) { return `<span class="tag">${escapeHtml(tag)}</span>`; }).join("")}</div>
            <div class="v13-card-action-row">
              <a class="btn btn-small" href="${bookingUrl(item)}">Request Quote</a>
              <a class="btn btn-outline btn-small" href="${tripDetailsUrl(item, "package")}">Details</a>
            </div>
          </article>
        `;
      }).join("");
    }

    document.querySelectorAll("[data-offer-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.dataset.offerFilter;
        document.querySelectorAll("[data-offer-filter]").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        render(filter);
      });
    });
    render("all");
  }

  function updateFooterVersion() {
    document.querySelectorAll("footer p").forEach(function (paragraph) {
      if (/Travel Website v/i.test(paragraph.textContent)) {
        paragraph.remove();
      }
    });
  }

  function ensureOffersFooterLink() {
    document.querySelectorAll(".footer-links").forEach(function (links) {
      if (links.querySelector('a[href="offers.html"]')) return;
      const offers = document.createElement("a");
      offers.href = "offers.html";
      offers.textContent = "Offers";
      const contact = links.querySelector('a[href="contact.html"]');

      if (contact) {
        links.insertBefore(offers, contact);
      } else {
        links.appendChild(offers);
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

    const origin = "Hyderabad, India";
    const select = section.querySelector("#routeDestinationSelect");
    const mapFrame = section.querySelector("#routeGoogleMap");
    const mapLink = section.querySelector("#routeOpenMaps");
    const bookLink = section.querySelector("#routeBookTrip");

    if (!select || !mapFrame || !mapLink || !bookLink) return;

    function createRouteItems() {
      const byDestination = new Map();

      function addRoute(destination, packageName) {
        const name = String(destination || "").trim();

        if (!name) {
          return;
        }

        const key = name.toLowerCase();

        if (!byDestination.has(key)) {
          byDestination.set(key, {
            id: `route-${byDestination.size}`,
            destination: name,
            packageName: packageName || `${name} Custom Trip`
          });
        } else if (packageName && /Custom Trip$/i.test(byDestination.get(key).packageName)) {
          byDestination.get(key).packageName = packageName;
        }
      }

      getPackageCatalog().forEach(function (item) {
        addRoute(item.destination, item.title);
      });

      budgetDestinations.forEach(function (item) {
        addRoute(item.name);
      });

      if (typeof extraDestinations !== "undefined" && Array.isArray(extraDestinations)) {
        extraDestinations.forEach(function (item) {
          addRoute(item.name);
        });
      }

      document.querySelectorAll(".destination-card h2").forEach(function (heading) {
        addRoute(heading.textContent);
      });

      return Array.from(byDestination.values());
    }

    const routes = createRouteItems();

    select.innerHTML = "";
    routes.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.destination;
      select.appendChild(option);
    });

    const bali = routes.find(function (item) {
      return item.destination.toLowerCase() === "bali, indonesia";
    });

    if (bali) {
      select.value = bali.id;
    }

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
      const item = routes.find(function (route) {
        return route.id === select.value;
      }) || routes[0];

      if (!item) {
        return;
      }

      mapFrame.src = mapEmbedUrl(item.destination);
      mapFrame.title = `Google map showing ${item.destination}`;
      mapLink.href = mapOpenUrl(item.destination);
      bookLink.href = bookingUrl(item);
    }

    select.addEventListener("change", updateRoute);
    updateRoute();
  }

  function removeFloatingWidgetClutter() {
    const allowedSelectors = [
      ".whatsapp-float",
      ".sticky-booking-bar",
      ".mobile-cta-bar",
      ".mobile-bottom-nav",
      ".compare-sticky-bar",
      ".toast-container",
      ".wishlist-drawer",
      ".v13-modal",
      ".v13-lightbox",
      ".two-factor-backdrop",
      ".drawer",
      ".drawer-backdrop",
      ".sidebar-backdrop"
    ];

    function isAllowed(element) {
      return allowedSelectors.some(function (selector) {
        return element.matches(selector) || element.closest(selector);
      });
    }

    function clean() {
      Array.from(document.body.children).forEach(function (element) {
        if (isAllowed(element)) {
          return;
        }

        const style = window.getComputedStyle(element);

        if (style.position !== "fixed") {
          return;
        }

        const rect = element.getBoundingClientRect();
        const isSmallRightWidget =
          rect.width >= 20 &&
          rect.width <= 96 &&
          rect.height >= 20 &&
          rect.height <= 120 &&
          rect.right >= window.innerWidth - 120;

        if (isSmallRightWidget) {
          element.dataset.floatingCleanupHidden = "true";
          element.setAttribute("aria-hidden", "true");
        }
      });
    }

    clean();

    const observer = new MutationObserver(function () {
      window.requestAnimationFrame(clean);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: false
    });

    window.addEventListener("resize", clean);
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
    renderTripDetailsPage();
    initOffersPage();
    ensureWishlistNav();
    ensureWishlistDrawer();
    initBookingStepper();
    initSmartPackageBuilder();
    initPackageFilters();
    initHomeFeaturedTrips();
    initTrendingSlider();
    initBudgetEstimator();
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
    ensureOffersFooterLink();
    initNewsletterSignup();
    initRouteMapPlanner();
    initFlexibleResultRows();
    removeFloatingWidgetClutter();
    document.addEventListener("click", function (event) {
      if (event.target.closest(".v13-trending-card, .v13-featured-card")) {
        setTimeout(decorateSaveButtons, 0);
      }
    });
    window.addEventListener("storage", updateWishlistUi);
  }

  ready(initV13);
})();
