(function () {
  const siteConfig = {
    brandName: "Travel with Giridhar",
    whatsappNumber: "918179721034",
    githubUrl: "https://github.com/Giridhar113/Travel-with-Giridhar",
    portfolioUrl: "https://giridhar-portfolio-ten.vercel.app/",
    whatsappMessage: "Hi, I want to plan a trip with Travel with Giridhar.",
    apiBaseUrl:
      window.location.protocol === "file:" ||
      ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://your-travel-api.example.com",
  };

  window.TRAVEL_SITE_CONFIG = siteConfig;

  function buildWhatsappUrl(message) {
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
      message || siteConfig.whatsappMessage
    )}`;
  }

  function applySiteConfig() {
    const footer = document.querySelector(".footer");

    if (footer) {
      const footerBrand = footer.querySelector("h3");
      const copyright = Array.from(footer.querySelectorAll("p")).find(function (paragraph) {
        return /2026/.test(paragraph.textContent);
      });

      if (footerBrand) {
        footerBrand.textContent = siteConfig.brandName;
      }

      if (copyright) {
        copyright.textContent = `\u00a9 2026 ${siteConfig.brandName}. All rights reserved.`;
      }
    }

    document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
      const messageMatch = link.href.match(/[?&]text=([^&]+)/);
      const message = messageMatch ? decodeURIComponent(messageMatch[1]) : siteConfig.whatsappMessage;
      link.href = buildWhatsappUrl(message);
    });

    document.querySelectorAll('a[href*="github.com/Giridhar113"]').forEach(function (link) {
      link.href = siteConfig.githubUrl;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySiteConfig);
  } else {
    applySiteConfig();
  }
})();
