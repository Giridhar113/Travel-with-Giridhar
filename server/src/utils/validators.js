const allowedStatuses = ["new", "contacted", "confirmed", "closed"];

function clean(value) {
  return String(value || "").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));
}

function isValidPhone(value) {
  const digits = clean(value).replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isFutureOrToday(dateValue) {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date >= today;
}

function validateBookingInput(input) {
  const payload = input || {};
  const packageName = clean(payload.package || payload.package_name || payload.packageName);
  const travelDate = clean(payload.travelDate || payload.travel_date);
  const travelers = Number(payload.travelers);
  const errors = {};

  const value = {
    name: clean(payload.name || payload.from_name),
    email: clean(payload.email || payload.from_email).toLowerCase(),
    phone: clean(payload.phone),
    package: packageName,
    destination: clean(payload.destination),
    travelDate,
    travelers,
    message: clean(payload.message || payload.travel_notes),
    travelType: clean(payload.travelType || payload.travel_type),
    approxBudget: clean(payload.approxBudget || payload.approx_budget),
    emiNeeded: clean(payload.emiNeeded || payload.emi_needed),
    travelersType: clean(payload.travelersType || payload.travelers_type),
    preferredContact: clean(payload.preferredContact || payload.preferred_contact),
  };

  if (!value.name) {
    errors.name = "Name is required.";
  }

  if (!isValidEmail(value.email)) {
    errors.email = "Valid email is required.";
  }

  if (!isValidPhone(value.phone)) {
    errors.phone = "Valid phone number is required.";
  }

  if (!value.package) {
    errors.package = "Package is required.";
  }

  if (!value.destination) {
    errors.destination = "Destination is required.";
  }

  if (!isFutureOrToday(value.travelDate)) {
    errors.travelDate = "Travel date must be today or later.";
  }

  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) {
    errors.travelers = "Traveler count must be between 1 and 50.";
  }

  if (value.message.length > 2000) {
    errors.message = "Message must be under 2000 characters.";
  }

  if (value.emiNeeded && !["Yes", "No"].includes(value.emiNeeded)) {
    errors.emiNeeded = "EMI preference must be Yes or No.";
  }

  return {
    errors,
    value,
  };
}

function validateStatus(value) {
  const status = clean(value).toLowerCase();
  return allowedStatuses.includes(status) ? status : "";
}

module.exports = {
  allowedStatuses,
  validateBookingInput,
  validateStatus,
};
