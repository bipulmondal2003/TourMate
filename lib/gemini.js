import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export const isGeminiConfigured = Boolean(GEMINI_API_KEY);

const client = isGeminiConfigured ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Asks Gemini for a structured day-by-day itinerary in the exact JSON
 * shape the trip-planner UI already renders. Throws on any failure
 * (bad key, quota, malformed response) so the caller can fall back to
 * the local demo generator rather than showing a broken page.
 */
export async function generateItineraryWithGemini({ destination, days, budget, people, interests, travelStyle }) {
  if (!client) throw new Error("Gemini is not configured.");

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `You are a travel planning assistant for TourMate, a tour-guide booking platform.
Create a realistic ${days}-day travel itinerary for a trip to "${destination}" in India for ${people || 1} people,
with a total budget of approximately ₹${budget || 5000}, travel style "${travelStyle || "Balanced"}",
and interests: ${(interests && interests.length ? interests : ["Heritage", "Food"]).join(", ")}.

Respond with ONLY valid JSON (no markdown, no commentary) in exactly this shape:
{
  "destination": string,
  "days": number,
  "people": number,
  "totalEstimatedCost": number,
  "itinerary": [
    {
      "day": number,
      "theme": string,
      "estimatedDayCost": number,
      "activities": [
        { "time": string, "activity": string, "estimatedCost": number }
      ]
    }
  ]
}
Each day should have 3-5 activities with realistic INR costs that sum close to estimatedDayCost,
and estimatedDayCost values should sum close to totalEstimatedCost.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Some models wrap JSON in ```json fences even when asked not to — strip and retry once.
    const cleaned = text.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

  if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
    throw new Error("Gemini returned an unexpected response shape.");
  }

  return { ...parsed, source: "gemini" };
}
