import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectMongoDB } from "@/lib/mongodb";
import Photographer from "@/models/Photographer";
import Decorator from "@/models/Decorator";
import Venue from "@/models/Venue";
import Caterer from "@/models/Caterer";
import Logistics from "@/models/Logistics";
import Entertainment from "@/models/Entertainment";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
function extractJSON(responseText: string): string {
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : "{}"; // Return JSON or empty object if no match
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { eventDescription } = await req.json();

    // 🔹 Step 1: Use Gemini AI to extract keywords
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Extract key details from this event description: "${eventDescription}".
      Identify:
      - Number of guests
      - Type of event
      - Budget (numeric only, remove currency symbols)
      - Location
      - Any special requirements
      - Preferred style

      Return ONLY a valid JSON object with this structure:
      {
        "numberOfGuests": 200,
        "eventType": "Wedding",
        "budget": 200000,
        "location": "Mumbai",
        "specialRequirements": null,
        "preferredStyle": null
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // 🔹 Extract JSON from AI response
    let extractedData;
    try {
      extractedData = JSON.parse(extractJSON(responseText));
    } catch (parseError) {
      console.error("AI JSON Parsing Error:", responseText);
      return NextResponse.json(
        { message: "AI response format error, try again" },
        { status: 500 }
      );
    }

    console.log("Extracted Data:", extractedData);

    // 🔹 Normalize Data
    const numberOfGuests = parseInt(extractedData.numberOfGuests) || 50;
    const eventType = extractedData.eventType || "";
    const budget =
      parseInt(String(extractedData.budget).replace(/\D/g, "")) || 100000;
    const location = extractedData.location || "";

    // 🔹 Step 2: Query MongoDB for best matches
    const photographers = await Photographer.find({
      $or: [
        {
          specialties: { $regex: eventType, $options: "i" },
          location: { $regex: location, $options: "i" },
        }, // Exact match
        { specialties: { $regex: eventType, $options: "i" } }, // Matches event type
        { location: { $regex: location, $options: "i" } }, // Matches location
      ],
    }).sort({ ratings: -1 });

    const decorators = await Decorator.find({
      $or: [
        {
          specialties: { $regex: eventType, $options: "i" },
          location: { $regex: location, $options: "i" },
        }, // Exact match
        { specialties: { $regex: eventType, $options: "i" } }, // Matches event type
        { location: { $regex: location, $options: "i" } }, // Matches location
      ],
    }).sort({ ratings: -1 });

    const venues = await Venue.find({
      $or: [
        {
          location: { $regex: location, $options: "i" },
          capacity: { $gte: numberOfGuests },
          pricePerHour: { $lte: budget },
        }, // Exact match
        { location: { $regex: location, $options: "i" } }, // Matches location
        { capacity: { $gte: numberOfGuests } }, // Matches guest count
      ],
    }).sort({ ratings: -1 });
    const caterers = await Caterer.find({
      $or: [
        {
          specialties: { $regex: eventType, $options: "i" },
          location: { $regex: location, $options: "i" },
        },
        { specialties: { $regex: eventType, $options: "i" } },
        { location: { $regex: location, $options: "i" } },
      ],
    }).sort({ ratings: -1 });

    const logistics = await Logistics.find({
      $or: [
        {
          services: { $regex: eventType, $options: "i" },
          location: { $regex: location, $options: "i" },
        },
        { services: { $regex: eventType, $options: "i" } },
        { location: { $regex: location, $options: "i" } },
      ],
    }).sort({ ratings: -1 });

    const entertainment = await Entertainment.find({
      $or: [
        {
          type: { $regex: eventType, $options: "i" },
          location: { $regex: location, $options: "i" },
        },
        { type: { $regex: eventType, $options: "i" } },
        { location: { $regex: location, $options: "i" } },
      ],
    }).sort({ ratings: -1 });

    // 🔹 Step 3: Handle cases where no exact matches are found
    const recommendedPhotographers = photographers.length
      ? photographers
      : await Photographer.find().sort({ ratings: -1 }).limit(3);
    const recommendedDecorators = decorators.length
      ? decorators
      : await Decorator.find().sort({ ratings: -1 }).limit(3);
    const recommendedVenues = venues.length
      ? venues
      : await Venue.find().sort({ ratings: -1 }).limit(3);
    const recommendedCaterers = caterers.length
      ? caterers
      : await Caterer.find().sort({ ratings: -1 }).limit(3);

    const recommendedLogistics = logistics.length
      ? logistics
      : await Logistics.find().sort({ ratings: -1 }).limit(3);

    const recommendedEntertainment = entertainment.length
      ? entertainment
      : await Entertainment.find().sort({ ratings: -1 }).limit(3);

    return NextResponse.json({
      message: "AI Recommendations Generated",
      recommendations: {
        photographers: recommendedPhotographers,
        decorators: recommendedDecorators,
        venues: recommendedVenues,
        caterers: recommendedCaterers,
        logistics: recommendedLogistics,
        entertainment: recommendedEntertainment,
      },
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json(
      { message: "Error generating recommendations" },
      { status: 500 }
    );
  }
}
