// Anthropic config - add ANTHROPIC_API_KEY in Vercel Environment Variables.
const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_VERSION = "2023-06-01";

function parseBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }

  return req.body;
}

function extractLine(label, text) {
  const match = String(text || "").match(new RegExp(`^${label}:\\s*(.+)$`, "im"));
  return match ? match[1].trim() : "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing ANTHROPIC_API_KEY. Add it in Vercel Environment Variables.",
    });
  }

  const body = parseBody(req);
  const budget = Number(body.budget);
  const days = Number(body.days);
  const travelers = Number(body.travelers);
  const travelType = String(body.travelType || "").trim();

  if (!budget || !days || !travelers || !travelType) {
    return res.status(400).json({
      error: "Budget, days, travelers, and travel type are required.",
    });
  }

  const prompt = `
You are the travel planning assistant for Travel with Giridhar.
Create a realistic short day-wise itinerary for an Indian traveler.

Inputs:
- Budget: INR ${budget}
- Days: ${days}
- Travelers: ${travelers}
- Travel type: ${travelType}

Return plain text only in this exact structure:
Destination: <best destination>
Estimated cost: <INR amount for total trip>
Day 1: <short plan>
Day 2: <short plan>
Continue until Day ${days}.
Why it fits: <one short reason>
`.trim();

  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 700,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      const message =
        data && data.error && data.error.message
          ? data.error.message
          : "Claude planner request failed.";
      return res.status(anthropicResponse.status).json({ error: message });
    }

    const plan = Array.isArray(data.content)
      ? data.content
          .filter(function (part) {
            return part && part.type === "text";
          })
          .map(function (part) {
            return part.text;
          })
          .join("\n")
          .trim()
      : "";

    return res.status(200).json({
      plan,
      destination: extractLine("Destination", plan) || "Custom Trip",
      estimatedCost: extractLine("Estimated cost", plan),
    });
  } catch (error) {
    return res.status(500).json({
      error: error && error.message ? error.message : "Claude planner request failed.",
    });
  }
};
