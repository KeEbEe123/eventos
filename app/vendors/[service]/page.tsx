// /app/vendors/[service]/page.tsx
import { notFound } from "next/navigation";
import CardMine from "@/components/CardMine";
import axios from "axios";
import PhotographerCard from "@/components/PhotoCard";

interface Vendor {
  _id: string;
  location?: string;
  imageUrl?: string;
  [key: string]: any; // for other dynamic fields like name, ratings etc.
}

interface PageProps {
  params: {
    service: string;
  };
}

export default async function VendorServicePage({ params }: PageProps) {
  const { service } = params;
  const cardComponentMap: Record<string, React.FC<any>> = {
    photographers: PhotographerCard,
    decorators: PhotographerCard, // Reusing the same card
    logistics: PhotographerCard, // Reusing the same card
    entertainment: PhotographerCard, // Reusing the same card
    venues: PhotographerCard, // Reusing the same card
    catering: PhotographerCard, // Reusing the same card
    // Add more if needed: caterers: CatererCard, etc.
  };

  // Capitalize service name for title
  const serviceTitle = service.charAt(0).toUpperCase() + service.slice(1);

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/vendors/${service}/top-rated`,
    {
      next: { revalidate: 10 }, // ISR
    }
  );

  if (!res.ok) return notFound();

  const { vendors } = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Top {serviceTitle}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor: Vendor) => {
          const CardComponent = cardComponentMap[service] || CardMine;

          return (
            <CardComponent
              key={vendor._id}
              vendor={vendor}
              serviceName={serviceTitle}
              serviceHref={`/vendors/${service}/${vendor._id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
