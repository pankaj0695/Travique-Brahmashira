import { backend_url } from "./helper";

export async function generateTrip({
  city,
  checkin,
  checkout,
  preference,
  budget,
}) {
  const response = await fetch(`${backend_url}/api/trips/generate-trip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city,
      checkin,
      checkout,
      preference,
      budget,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trip suggestions");
  }

  const data = await response.json();

  return data;
}
