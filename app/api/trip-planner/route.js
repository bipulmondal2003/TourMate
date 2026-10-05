import { ok, fail } from "@/lib/apiResponse";
import { generateItineraryWithGemini, isGeminiConfigured } from "@/lib/gemini";

const ACTIVITY_BANK = {
  Heritage: ["Explore the old city walls", "Guided fort/palace tour", "Visit a heritage museum", "Sunset at a historic monument"],
  Adventure: ["River rafting session", "Trekking on a nearby trail", "Zip-lining adventure park", "Rock climbing basics"],
  Food: ["Street food walking tour", "Local cooking class", "Visit a spice/produce market", "Traditional dinner experience"],
  Wildlife: ["Guided nature reserve safari", "Birdwatching at dawn", "Nature photography walk", "Visit a wildlife sanctuary"],
  Spiritual: ["Morning temple/gurdwara visit", "Meditation session", "Heritage walk to sacred sites", "Evening prayer ceremony"],
  Nightlife: ["Rooftop cafe evening", "Local live music venue", "Night market stroll", "City lights viewpoint"],
};

function generateDemoItinerary({ destination, days, budget, people, interests }) {
  const chosenInterests = interests?.length ? interests : ["Heritage", "Food"];
  const dailyBudget = Math.round((budget || 5000) / (days || 1));

  const itinerary = Array.from({ length: Number(days) || 1 }, (_, i) => {
    const dayInterests = [chosenInterests[i % chosenInterests.length], chosenInterests[(i + 1) % chosenInterests.length]];
    const activities = dayInterests.flatMap((interest) => {
      const pool = ACTIVITY_BANK[interest] || ACTIVITY_BANK.Heritage;
      return [pool[i % pool.length]];
    });

    return {
      day: i + 1,
      theme: dayInterests.join(" & "),
      activities: [
        { time: "9:00 AM", activity: activities[0] || "Explore local attractions", estimatedCost: Math.round(dailyBudget * 0.3) },
        { time: "1:00 PM", activity: "Lunch at a recommended local spot", estimatedCost: Math.round(dailyBudget * 0.2) },
        { time: "3:30 PM", activity: activities[1] || "Guided sightseeing", estimatedCost: Math.round(dailyBudget * 0.3) },
        { time: "7:30 PM", activity: "Evening leisure & dinner", estimatedCost: Math.round(dailyBudget * 0.2) },
      ],
      estimatedDayCost: dailyBudget,
    };
  });

  return {
    destination,
    days: Number(days) || 1,
    people: Number(people) || 1,
    totalEstimatedCost: dailyBudget * (Number(days) || 1),
    itinerary,
    source: "demo",
  };
}

// Calls Gemini server-side (the key never reaches the client) when
// GEMINI_API_KEY is configured. If Gemini isn't configured, or the
// live call fails for any reason (bad key, quota, malformed output),
// this falls back to the local rule-based generator so the feature
// never just breaks for the person using it.
export async function POST(req) {
  try {
    const body = await req.json();
    const { destination, days, budget, people, interests, travelStyle } = body;

    if (!destination || !days) return fail("Destination and number of days are required.");
    if (Number(days) < 1 || Number(days) > 14) return fail("Days must be between 1 and 14.");

    if (isGeminiConfigured) {
      try {
        const plan = await generateItineraryWithGemini({ destination, days, budget, people, interests, travelStyle });
        return ok({ plan, demoMode: false });
      } catch (aiError) {
        console.error("Gemini itinerary generation failed, falling back to demo:", aiError.message);
        const demo = generateDemoItinerary({ destination, days, budget, people, interests });
        return ok({
          plan: demo,
          demoMode: true,
          note: "Gemini request failed, so a local demo itinerary was shown instead.",
        });
      }
    }

    const demo = generateDemoItinerary({ destination, days, budget, people, interests });
    return ok({ plan: demo, demoMode: true });
  } catch (err) {
    return fail(err.message || "Failed to generate itinerary.", 500);
  }
}
