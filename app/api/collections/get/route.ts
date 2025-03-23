import { NextResponse } from "next/server";
import User from "@/models/user";
import Photographer from "@/models/Photographer";
import Decorator from "@/models/Decorator";
// import other service models as needed
import { getServerSession } from "next-auth";

const serviceModels: Record<string, any> = {
  photographer: Photographer,
  decorator: Decorator,
  // Add other services here
};

export async function GET(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const populatedCollections = await Promise.all(
    user.collections.map(async (collection: any) => {
      const populatedVendors = await Promise.all(
        collection.vendors.map(async (vendor: any) => {
          const model = serviceModels[vendor.serviceType.toLowerCase()];
          if (!model) return null;

          const vendorData = await model
            .findById(vendor.refId)
            .select("name service");
          return vendorData
            ? { ...vendorData._doc, serviceType: vendor.serviceType }
            : null;
        })
      );

      return {
        _id: collection._id,
        name: collection.name,
        vendors: populatedVendors.filter(Boolean),
      };
    })
  );

  return NextResponse.json({ collections: populatedCollections });
}
