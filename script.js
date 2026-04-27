const destinationSearch = document.getElementById("destinationSearch");
const destinationCards = document.querySelectorAll(".destination-card");
const noDestinations = document.getElementById("noDestinations");

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

    noDestinations.hidden = visibleCount > 0;
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
