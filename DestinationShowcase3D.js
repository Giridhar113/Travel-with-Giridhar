const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const DESKTOP_QUERY = "(min-width: 769px)";

const destinations = [
  {
    name: "Paris, France",
    shortName: "Paris",
    tagline: "Romance, cafes, and the Eiffel Tower",
    ribbon: "Romantic City",
    model: "eiffel",
    color: "#ff6b57",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=75",
    link: "destinations.html",
    booking:
      "contact.html?destination=Paris%2C%20France&package=Paris%20City%20Escape#bookingForm",
  },
  {
    name: "Agra, India",
    shortName: "Taj Mahal",
    tagline: "Heritage, marble domes, and sunrise views",
    ribbon: "Heritage Icon",
    model: "taj",
    color: "#22d3c5",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=75",
    link: "destinations.html",
    booking:
      "contact.html?destination=Agra%2C%20India&package=Taj%20Mahal%20Heritage%20Trip#bookingForm",
  },
  {
    name: "Santorini, Greece",
    shortName: "Santorini",
    tagline: "White cliffs, blue domes, and sunset stays",
    ribbon: "Island Escape",
    model: "santorini",
    color: "#38bdf8",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=75",
    link: "destinations.html",
    booking:
      "contact.html?destination=Santorini%2C%20Greece&package=Santorini%20Honeymoon%20Tour#bookingForm",
  },
  {
    name: "Machu Picchu, Peru",
    shortName: "Machu Picchu",
    tagline: "Ancient terraces and mountain adventure",
    ribbon: "Adventure Pick",
    model: "machu",
    color: "#84cc16",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=75",
    link: "destinations.html",
    booking:
      "contact.html?destination=Machu%20Picchu%2C%20Peru&package=Machu%20Picchu%20Adventure#bookingForm",
  },
  {
    name: "Dubai, UAE",
    shortName: "Dubai",
    tagline: "Skyline, desert safari, and luxury escapes",
    ribbon: "Luxury Skyline",
    model: "dubai",
    color: "#f6c453",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=75",
    link: "destinations.html",
    booking:
      "contact.html?destination=Dubai%2C%20UAE&package=Dubai%20Desert%20Luxury#bookingForm",
  },
  {
    name: "Bali, Indonesia",
    shortName: "Bali",
    tagline: "Temples, tropical stays, and beach sunsets",
    ribbon: "Beach Culture",
    model: "bali",
    color: "#a78bfa",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=75",
    link: "destinations.html",
    booking:
      "contact.html?destination=Bali%2C%20Indonesia&package=Premium%20Bali%20Tour#bookingForm",
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch (error) {
    return false;
  }
}

function renderLabels(section) {
  const labels = section.querySelector("[data-showcase-labels]");
  if (!labels) return;

  labels.innerHTML = destinations
    .map(
      (item, index) => `
        <button type="button" class="destination-showcase-label${
          index === 0 ? " is-active" : ""
        }" data-showcase-index="${index}">
          <img class="destination-showcase-thumb" src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" />
          <span class="destination-showcase-ribbon">${item.ribbon}</span>
          <span class="destination-showcase-title">${item.shortName}</span>
          <small>${item.tagline}</small>
        </button>
      `,
    )
    .join("");
}

function renderMobileFallback(section) {
  const mobile = section.querySelector("[data-showcase-mobile]");
  if (!mobile) return;

  mobile.innerHTML = destinations
    .map(
      (item, index) => `
        <article class="destination-showcase-mobile-card" data-showcase-mobile-card="${index}">
          <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" />
          <div>
            <span>${item.ribbon}</span>
            <h3>${item.name}</h3>
            <p>${item.tagline}</p>
          </div>
        </article>
      `,
    )
    .join("");

  mobile.querySelectorAll("[data-showcase-mobile-card]").forEach((card) => {
    card.addEventListener("click", () => {
      openDestinationModal(section, Number(card.dataset.showcaseMobileCard));
    });
  });
}

function setActiveDestination(section, index) {
  section.querySelectorAll("[data-showcase-index]").forEach((label) => {
    label.classList.toggle("is-active", Number(label.dataset.showcaseIndex) === index);
  });
}

function openDestinationModal(section, index) {
  const item = destinations[index];
  const modal = section.querySelector("[data-showcase-modal]");
  if (!item || !modal) return;

  modal.querySelector("[data-showcase-modal-kicker]").textContent = "Destination preview";
  modal.querySelector("[data-showcase-modal-title]").textContent = item.name;
  modal.querySelector("[data-showcase-modal-text]").textContent = item.tagline;
  modal.querySelector("[data-showcase-modal-link]").href = item.link;
  modal.querySelector("[data-showcase-modal-book]").href = item.booking;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("destination-showcase-modal-open");
}

function closeDestinationModal(section) {
  const modal = section.querySelector("[data-showcase-modal]");
  if (!modal) return;

  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("destination-showcase-modal-open");
}

function attachSharedInteractions(section) {
  section.querySelectorAll("[data-showcase-index]").forEach((label) => {
    label.addEventListener("click", () => {
      const index = Number(label.dataset.showcaseIndex);
      setActiveDestination(section, index);
      openDestinationModal(section, index);
    });
  });

  section.querySelector("[data-showcase-close]")?.addEventListener("click", () => {
    closeDestinationModal(section);
  });

  section.querySelector("[data-showcase-modal]")?.addEventListener("click", (event) => {
    if (event.target.matches("[data-showcase-modal]")) {
      closeDestinationModal(section);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDestinationModal(section);
  });
}

function setSectionVisibility(section) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        section.classList.toggle("is-showcase-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(section);
}

async function initThreeShowcase(section) {
  if (section.dataset.threeReady) return;
  section.dataset.threeReady = "true";

  const loader = section.querySelector("[data-showcase-loader]");
  const canvas = section.querySelector("[data-showcase-canvas]");
  if (!canvas) return;

  let THREE;
  try {
    THREE = await import(THREE_CDN);
  } catch (error) {
    section.classList.add("destination-showcase-fallback");
    if (loader) {
      loader.innerHTML =
        "<strong>3D preview could not load.</strong><p>Use the swipeable destination cards below.</p>";
    }
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050607, 0.055);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 2.4, 9.6);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const ambient = new THREE.AmbientLight(0xffffff, 1.5);
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 7, 5);
  const rim = new THREE.PointLight(0x22d3c5, 2.4, 16);
  rim.position.set(-5, 3, 4);
  scene.add(ambient, key, rim);

  const carousel = new THREE.Group();
  scene.add(carousel);

  const models = destinations.map((item, index) => {
    const model = createDestinationModel(THREE, item);
    model.position.x = (index - (destinations.length - 1) / 2) * 2.95;
    model.userData.destinationIndex = index;
    model.traverse((child) => {
      child.userData.destinationIndex = index;
    });
    carousel.add(model);
    return model;
  });

  let width = 0;
  let height = 0;
  let selectedIndex = 0;
  let hoveredIndex = null;
  let scrollProgress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let raf = 0;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(320, rect.width);
    height = Math.max(360, rect.height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function updateScrollProgress() {
    const rect = section.getBoundingClientRect();
    const total = rect.height + window.innerHeight;
    scrollProgress = clamp((window.innerHeight - rect.top) / total, 0, 1);
  }

  function pickDestination(event, shouldOpen) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointerX = pointer.x;
    pointerY = pointer.y;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(models, true)[0];
    hoveredIndex = hit ? hit.object.userData.destinationIndex : null;
    canvas.style.cursor = hit ? "pointer" : "grab";

    if (hit && shouldOpen) {
      selectedIndex = hit.object.userData.destinationIndex;
      setActiveDestination(section, selectedIndex);
      openDestinationModal(section, selectedIndex);
    }
  }

  function animate(time) {
    const seconds = time * 0.001;
    updateScrollProgress();

    const maxShift = (destinations.length - 1) * 1.42;
    carousel.position.x += ((0.5 - scrollProgress) * maxShift - carousel.position.x) * 0.055;
    carousel.rotation.y += ((scrollProgress - 0.5) * 0.34 - carousel.rotation.y) * 0.035;
    carousel.rotation.x += (pointerY * -0.08 - carousel.rotation.x) * 0.045;

    models.forEach((model, index) => {
      const isHot = hoveredIndex === index || selectedIndex === index;
      const targetScale = isHot ? 1.16 : 1;
      model.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      model.rotation.y = Math.sin(seconds * 0.7 + index) * 0.08 + seconds * 0.08;
      model.rotation.z += ((isHot ? pointerX * -0.08 : 0) - model.rotation.z) * 0.08;
    });

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement);
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  canvas.addEventListener("pointermove", (event) => pickDestination(event, false));
  canvas.addEventListener("pointerleave", () => {
    hoveredIndex = null;
    canvas.style.cursor = "grab";
  });
  canvas.addEventListener("click", (event) => pickDestination(event, true));

  section.querySelectorAll("[data-showcase-index]").forEach((label) => {
    label.addEventListener("mouseenter", () => {
      selectedIndex = Number(label.dataset.showcaseIndex);
      setActiveDestination(section, selectedIndex);
    });
  });

  resize();
  updateScrollProgress();
  if (loader) loader.classList.add("is-loaded");
  section.classList.add("destination-showcase-ready");
  raf = requestAnimationFrame(animate);

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    renderer.dispose();
  });
}

function createDestinationModel(THREE, item) {
  const root = new THREE.Group();
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1.05, 0.22, 8),
    material(THREE, "#151d22", 0.72),
  );
  pedestal.position.y = -0.12;
  root.add(pedestal);

  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(1.02, 1.02, 0.018, 32),
    material(THREE, item.color, 0.36, true),
  );
  glow.position.y = 0.02;
  root.add(glow);

  const model = new THREE.Group();
  model.position.y = 0.15;
  root.add(model);

  if (item.model === "eiffel") buildEiffel(THREE, model, item.color);
  if (item.model === "taj") buildTajMahal(THREE, model, item.color);
  if (item.model === "santorini") buildSantorini(THREE, model, item.color);
  if (item.model === "machu") buildMachuPicchu(THREE, model, item.color);
  if (item.model === "dubai") buildDubai(THREE, model, item.color);
  if (item.model === "bali") buildBaliTemple(THREE, model, item.color);

  return root;
}

function material(THREE, color, roughness = 0.85, transparent = false) {
  return new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    metalness: 0.05,
    roughness,
    transparent,
    opacity: transparent ? 0.34 : 1,
  });
}

function mesh(THREE, group, geometry, color, position, scale, rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material(THREE, color));
  object.position.set(...position);
  object.scale.set(...scale);
  object.rotation.set(...rotation);
  group.add(object);
  return object;
}

function buildEiffel(THREE, group, accent) {
  const iron = "#b66a55";
  mesh(THREE, group, new THREE.BoxGeometry(1.25, 0.1, 0.32), iron, [0, 0.25, 0], [1, 1, 1]);
  mesh(THREE, group, new THREE.BoxGeometry(0.8, 0.08, 0.26), iron, [0, 0.92, 0], [1, 1, 1]);
  mesh(THREE, group, new THREE.BoxGeometry(0.42, 0.07, 0.2), iron, [0, 1.42, 0], [1, 1, 1]);
  mesh(THREE, group, new THREE.ConeGeometry(0.18, 1.9, 4), iron, [0, 0.94, 0], [1, 1, 1]);
  mesh(THREE, group, new THREE.CylinderGeometry(0.03, 0.03, 0.72, 6), accent, [0, 2.08, 0], [1, 1, 1]);
  [-0.42, 0.42].forEach((x) => {
    mesh(THREE, group, new THREE.CylinderGeometry(0.035, 0.055, 1.15, 6), iron, [x, 0.68, 0.16], [1, 1, 1], [0, 0, x > 0 ? -0.24 : 0.24]);
    mesh(THREE, group, new THREE.CylinderGeometry(0.035, 0.055, 1.15, 6), iron, [x, 0.68, -0.16], [1, 1, 1], [0, 0, x > 0 ? -0.24 : 0.24]);
  });
}

function buildTajMahal(THREE, group, accent) {
  const marble = "#f3efe8";
  mesh(THREE, group, new THREE.BoxGeometry(1.5, 0.36, 0.92), marble, [0, 0.36, 0], [1, 1, 1]);
  mesh(THREE, group, new THREE.SphereGeometry(0.46, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), marble, [0, 0.74, 0], [1, 0.84, 1]);
  mesh(THREE, group, new THREE.CylinderGeometry(0.07, 0.07, 0.32, 8), accent, [0, 1.18, 0], [1, 1, 1]);
  mesh(THREE, group, new THREE.ConeGeometry(0.12, 0.22, 8), accent, [0, 1.44, 0], [1, 1, 1]);
  [-0.72, 0.72].forEach((x) => {
    [-0.42, 0.42].forEach((z) => {
      mesh(THREE, group, new THREE.CylinderGeometry(0.07, 0.09, 0.9, 8), marble, [x, 0.56, z], [1, 1, 1]);
      mesh(THREE, group, new THREE.ConeGeometry(0.11, 0.2, 8), accent, [x, 1.12, z], [1, 1, 1]);
    });
  });
}

function buildSantorini(THREE, group, accent) {
  mesh(THREE, group, new THREE.ConeGeometry(0.95, 0.76, 7), "#8d6747", [0, 0.3, 0], [1, 1, 1], [0, 0, Math.PI]);
  const houses = [
    [-0.42, 0.68, 0.06],
    [0.02, 0.82, 0.02],
    [0.42, 0.66, -0.08],
    [-0.08, 1.06, 0.08],
  ];
  houses.forEach((pos, index) => {
    mesh(THREE, group, new THREE.BoxGeometry(0.42, 0.34, 0.38), "#f8f7f0", pos, [1, 1, 1]);
    mesh(THREE, group, new THREE.SphereGeometry(0.18, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), index === 1 ? accent : "#3b82f6", [pos[0], pos[1] + 0.22, pos[2]], [1, 0.72, 1]);
  });
}

function buildMachuPicchu(THREE, group, accent) {
  mesh(THREE, group, new THREE.ConeGeometry(0.7, 1.35, 7), "#2f5f3d", [-0.42, 0.62, -0.18], [1, 1, 1]);
  mesh(THREE, group, new THREE.ConeGeometry(0.86, 1.65, 7), "#3f7b4c", [0.38, 0.74, -0.22], [1, 1, 1]);
  for (let i = 0; i < 5; i += 1) {
    mesh(THREE, group, new THREE.BoxGeometry(1.35 - i * 0.16, 0.09, 0.34), i % 2 ? "#9a7a52" : accent, [0, 0.2 + i * 0.16, 0.22 + i * 0.02], [1, 1, 1]);
  }
  mesh(THREE, group, new THREE.BoxGeometry(0.36, 0.25, 0.26), "#a68b63", [-0.28, 1.08, 0.22], [1, 1, 1]);
  mesh(THREE, group, new THREE.BoxGeometry(0.42, 0.22, 0.26), "#a68b63", [0.28, 1.0, 0.24], [1, 1, 1]);
}

function buildDubai(THREE, group, accent) {
  mesh(THREE, group, new THREE.ConeGeometry(0.28, 2.15, 7), "#9ca3af", [0, 1.05, 0], [1, 1, 1]);
  mesh(THREE, group, new THREE.CylinderGeometry(0.025, 0.025, 0.56, 6), accent, [0, 2.28, 0], [1, 1, 1]);
  [-0.55, 0.5].forEach((x, index) => {
    mesh(THREE, group, new THREE.BoxGeometry(0.32, 0.9 + index * 0.22, 0.32), index ? "#64748b" : "#475569", [x, 0.56 + index * 0.12, 0.08], [1, 1, 1]);
  });
  mesh(THREE, group, new THREE.TorusGeometry(0.62, 0.025, 6, 18), accent, [0, 0.18, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
}

function buildBaliTemple(THREE, group, accent) {
  mesh(THREE, group, new THREE.BoxGeometry(0.9, 0.2, 0.52), "#8b5a2b", [0, 0.24, 0], [1, 1, 1]);
  [0.48, 0.78, 1.08, 1.36].forEach((y, index) => {
    mesh(THREE, group, new THREE.ConeGeometry(0.7 - index * 0.12, 0.24, 4), index % 2 ? accent : "#2f2118", [0, y, 0], [1, 0.42, 1], [0, Math.PI / 4, 0]);
    mesh(THREE, group, new THREE.BoxGeometry(0.36 - index * 0.04, 0.16, 0.3), "#6b4226", [0, y - 0.18, 0], [1, 1, 1]);
  });
  [-0.42, 0.42].forEach((x) => {
    mesh(THREE, group, new THREE.CylinderGeometry(0.055, 0.055, 0.72, 6), "#8b5a2b", [x, 0.62, 0], [1, 1, 1]);
  });
}

function initDestinationShowcase() {
  const section = document.getElementById("destinationShowcase3D");
  if (!section) return;

  renderLabels(section);
  renderMobileFallback(section);
  attachSharedInteractions(section);
  setSectionVisibility(section);

  const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
  const canUseWebGL = isDesktop && hasWebGL() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canUseWebGL) {
    section.classList.add("destination-showcase-fallback");
    return;
  }

  const loader = section.querySelector("[data-showcase-loader]");
  if (loader) loader.hidden = false;

  const lazyObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      initThreeShowcase(section);
    },
    { rootMargin: "260px 0px", threshold: 0.1 },
  );

  lazyObserver.observe(section);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDestinationShowcase);
} else {
  initDestinationShowcase();
}
