const fs = require("fs");
const path = require("path");
const vm = require("vm");

let cachedTravelData = null;

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function loadSharedTravelData() {
  if (cachedTravelData) {
    return cachedTravelData;
  }

  const dataPath = path.resolve(__dirname, "../../../data.js");
  const code = fs.readFileSync(dataPath, "utf8");
  const sandbox = {
    window: {},
    console,
  };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "data.js" });
  cachedTravelData = sandbox.window.TRAVEL_DATA || {};

  return cachedTravelData;
}

function getPackageNames(item) {
  return [item.name, item.title, item.packageName].filter(Boolean).map(normalizeText);
}

function findPackage(packageName, destination) {
  const data = loadSharedTravelData();
  const packages = Array.isArray(data.packages) ? data.packages : [];
  const normalizedPackage = normalizeText(packageName);
  const normalizedDestination = normalizeText(destination);

  return (
    packages.find((item) => {
      const packageMatches = getPackageNames(item).includes(normalizedPackage);
      const destinationMatches = normalizeText(item.destination) === normalizedDestination;
      return packageMatches && destinationMatches;
    }) ||
    packages.find((item) => getPackageNames(item).includes(normalizedPackage)) ||
    packages
      .filter((item) => normalizeText(item.destination) === normalizedDestination)
      .sort((a, b) => Number(a.amount || a.price || 0) - Number(b.amount || b.price || 0))[0]
  );
}

function findDestination(destination) {
  const data = loadSharedTravelData();
  const destinations = Array.isArray(data.destinations) ? data.destinations : [];
  const normalizedDestination = normalizeText(destination);

  return destinations.find((item) => normalizeText(item.destination || item.name) === normalizedDestination);
}

function resolveBookingAmount(packageName, destination) {
  const packageMatch = findPackage(packageName, destination);

  if (packageMatch) {
    const amount = Number(packageMatch.amount || packageMatch.price || 0);

    if (amount > 0) {
      return {
        amount,
        source: packageMatch.title || packageMatch.name || packageName,
      };
    }
  }

  const destinationMatch = findDestination(destination);

  if (destinationMatch) {
    const amount = Number(destinationMatch.amount || 0);

    if (amount > 0) {
      return {
        amount,
        source: `${destinationMatch.destination || destinationMatch.name} destination base price`,
      };
    }
  }

  return null;
}

module.exports = {
  resolveBookingAmount,
};
