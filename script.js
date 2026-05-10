const destinationSearch = document.getElementById("destinationSearch");
const destinationCards = document.querySelectorAll(".destination-card");
const noDestinations = document.getElementById("noDestinations");
const savedCount = document.getElementById("savedCount");
const clearSavedButton = document.getElementById("clearSaved");
const savedDestinationsKey = "travelGuideSavedDestinations";

function getSavedDestinations() {
  try {
    return JSON.parse(localStorage.getItem(savedDestinationsKey)) || [];
  } catch (error) {
    return [];
  }
}

function setSavedDestinations(destinations) {
  localStorage.setItem(savedDestinationsKey, JSON.stringify(destinations));
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
    planLink.href = "contact.html";
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

if (destinationSearch) {
  destinationSearch.addEventListener("input", function () {
    const searchText = destinationSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    destinationCards.forEach(function (card) {
      const content = card.textContent.toLowerCase();
      const keywords = card.dataset.destination || "";
      const isMatch = content.includes(searchText) || keywords.includes(searchText);

      card.hidden = !isMatch;
      if (isMatch) {
        visibleCount += 1;
      }
    });

    if (noDestinations) {
      noDestinations.hidden = visibleCount > 0;
    }
  });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Message sent successfully");
    contactForm.reset();
  });
}

const animatedItems = document.querySelectorAll(
  ".page-hero, .section, .stats-band, .card, .panel, .search-panel, .stat-box"
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
} else {
  animatedItems.forEach(function (item) {
    item.classList.add("is-visible");
  });
}
