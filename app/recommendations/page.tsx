"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import VendorCard from "@/components/VendorCard"; // Rename your PhotographerCard file accordingly

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const eventDescription = searchParams ? searchParams.get("event") : null;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.post("/api/recommend", {
          eventDescription,
        });
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventDescription) fetchRecommendations();
  }, [eventDescription]);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl">
        Getting recommendations...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Recommendations</h1>

      {recommendations ? (
        <>
          {recommendations.photographers && (
            <Section
              title="Photographers"
              items={recommendations.photographers}
              serviceName="Photographer"
              serviceHrefBase="/photographers"
            />
          )}
          {recommendations.decorators && (
            <Section
              title="Decorators"
              items={recommendations.decorators}
              serviceName="Decorator"
              serviceHrefBase="/decorators"
            />
          )}
          {recommendations.venues && (
            <Section
              title="Venues"
              items={recommendations.venues}
              serviceName="Venue"
              serviceHrefBase="/venues"
              isVenue
            />
          )}
          {recommendations.caterers && (
            <Section
              title="Caterers"
              items={recommendations.caterers}
              serviceName="Caterer"
              serviceHrefBase="/caterers"
            />
          )}
          {recommendations.logistics && (
            <Section
              title="Logistics"
              items={recommendations.logistics}
              serviceName="Logistics"
              serviceHrefBase="/logistics"
            />
          )}
          {recommendations.entertainment && (
            <Section
              title="Entertainment"
              items={recommendations.entertainment}
              serviceName="Entertainment"
              serviceHrefBase="/entertainment"
            />
          )}
        </>
      ) : (
        <p>No recommendations found.</p>
      )}
    </div>
  );
}

function Section({
  title,
  items,
  serviceName,
  serviceHrefBase,
  isVenue = false,
}: {
  title: string;
  items: any[];
  serviceName: string;
  serviceHrefBase: string;
  isVenue?: boolean;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mt-6 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <VendorCard
            key={item._id}
            vendor={item}
            serviceName={serviceName}
            serviceHref={`${serviceHrefBase}/${item._id}`}
          />
        ))}
      </div>
    </div>
  );
}
