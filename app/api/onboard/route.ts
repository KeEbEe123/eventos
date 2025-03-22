import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Photographer from "@/models/Photographer";
import Decorator from "@/models/Decorator";
import Venue from "@/models/Venue";

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const {
      role,
      email,
      name,
      phone,
      location,
      specialties,
      portfolio,
      capacity,
      priceRangeMin,
      priceRangeMax,
      amenities,
    } = body;

    // Update User to set onboarded = true
    await User.findOneAndUpdate({ email }, { onboard: true });

    // Create entry in respective model
    let newEntry;
    if (role === "photographer") {
      newEntry = new Photographer({
        name,
        email,
        phone,
        location,
        specialties: specialties.split(","),
        portfolio: portfolio.split(","),
        priceRange: { min: priceRangeMin, max: priceRangeMax },
        availability: true,
        ratings: 0,
      });
    } else if (role === "decorator") {
      newEntry = new Decorator({
        name,
        email,
        phone,
        location,
        specialties: specialties.split(","),
        availability: true,
        ratings: 0,
      });
    } else if (role === "venue_distributor") {
      newEntry = new Venue({
        name,
        location,
        capacity,
        pricePerHour: priceRangeMin,
        amenities: amenities.split(","),
        images: [],
        availability: true,
        ratings: 0,
      });
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await newEntry.save();
    return NextResponse.json(
      { message: "Onboarding successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
