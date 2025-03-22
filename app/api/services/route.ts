import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Photographer from "@/models/Photographer";
import Decorator from "@/models/Decorator";
// import Caterer from "@/models/Caterer";

export async function GET(req: Request) {
  try {
    await connectMongoDB();

    // Fetch all vendors from each collection
    const photographers = await Photographer.find({}).limit(1); // Limit to 1 for the card display
    const decorators = await Decorator.find({}).limit(1);
    const caterers = await Caterer.find({}).limit(1);

    // Structure the response as an array of services
    const services = [
      {
        serviceName: "Photographers",
        serviceHref: "/services/photographers",
        vendor:
          photographers.length > 0
            ? {
                _id: photographers[0]._id.toString(),
                location: photographers[0].location,
                imageUrl:
                  photographers[0].portfolio?.[0] ||
                  "https://heroui.com/images/card-example-6.jpeg",
              }
            : null,
      },
      {
        serviceName: "Decorators",
        serviceHref: "/services/decorators",
        vendor:
          decorators.length > 0
            ? {
                _id: decorators[0]._id.toString(),
                location: decorators[0].location,
                imageUrl: "https://heroui.com/images/card-example-6.jpeg", // Decorators don't have portfolio, use default
              }
            : null,
      },
      {
        serviceName: "Caterers",
        serviceHref: "/services/caterers",
        vendor:
          caterers.length > 0
            ? {
                _id: caterers[0]._id.toString(),
                location: caterers[0].location,
                imageUrl: "https://heroui.com/images/card-example-6.jpeg", // Caterers don't have portfolio, use default
              }
            : null,
      },
    ];

    // Filter out services with no vendors
    const availableServices = services.filter(
      (service) => service.vendor !== null
    );

    return NextResponse.json({ services: availableServices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
