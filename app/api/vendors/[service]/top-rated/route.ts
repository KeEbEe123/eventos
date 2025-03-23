// /app/api/vendors/[service]/top-rated/route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Photographer from "@/models/Photographer";
import Decorator from "@/models/Decorator";
import Venue from "@/models/Venue";
import Entertainment from "@/models/Entertainment";
import Caterer from "@/models/Caterer";
import Logistics from "@/models/Logistics";
// Import other models as you add them

const serviceModelMap: Record<string, any> = {
  photographers: Photographer,
  decorators: Decorator,
  venues: Venue,
  entertainment: Entertainment,
  caterers: Caterer,
  logistics: Logistics,
  // add more here
};

export async function GET(
  req: Request,
  { params }: { params: { service: string } }
) {
  await connectMongoDB();

  const { service } = params;
  const Model = serviceModelMap[service];

  if (!Model) {
    return NextResponse.json(
      { error: "Invalid service type" },
      { status: 400 }
    );
  }

  try {
    const topVendors = await Model.find({})
      .sort({ ratings: -1 })
      .limit(10)
      .lean();
    return NextResponse.json({ vendors: topVendors });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
