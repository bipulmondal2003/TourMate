/**
 * Server-side price calculation. The client NEVER sends a trusted
 * total — this function is the single source of truth for pricing.
 */
export function calculateBookingPrice({ pricePerHour, pricePerDay, durationHours, numberOfPeople }) {
  const hours = Number(durationHours);
  const people = Number(numberOfPeople);

  if (!hours || hours <= 0 || !people || people <= 0) {
    throw new Error("Invalid duration or number of people.");
  }

  let base;
  if (hours >= 8) {
    // Full-day rate once the booking spans 8+ hours
    const days = Math.ceil(hours / 8);
    base = days * pricePerDay;
  } else {
    base = hours * pricePerHour;
  }

  // Extra people beyond the first add a 10% surcharge per person
  const peopleSurcharge = base * 0.1 * Math.max(0, people - 1);
  const total = base + peopleSurcharge;

  return Math.round(total);
}
