"use client";
import React from "react";
import CyclingText from "./CyclingTest";
import CardMine from "./CardMine";
import LocationSelector from "./LocationSelector";
import phot from "../public/phot.png";
import decor from "../public/decors.png";
import logistics from "../public/logistics.png";
import catering from "../public/catering.png";
import entertainment from "../public/entertainment.png";
import venues from "../public/venues.png";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/react";

function HomeTwo() {
  const [eventDescription, setEventDescription] = useState("");
  const router = useRouter();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && eventDescription.trim()) {
      router.push(
        `/recommendations?event=${encodeURIComponent(eventDescription)}`
      );
    }
  };
  return (
    <div className="flex flex-col items-start justify-center text-[100px] mx-auto font-dm mt-[140px] px-4 ml-20">
      {/* Top Line: "Plan your" + cycling text */}
      <div className="flex items-end">
        <CyclingText words={["birthday", "marriage", "anniversary"]} />
      </div>

      {/* Bottom Line: Aligned with text above */}
      <div>With us!</div>
      <div className="w-full flex items-center gap-4">
        <LocationSelector />
        <Input
          label="Describe your event"
          placeholder="e.g. Wedding in Mumbai for 200 guests with ₹5L budget"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      {/* Grid for cards */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 w-full mt-8">
        <CardMine
          serviceName="Photographers"
          serviceHref="/vendors/photographers"
          image={phot.src}
        />
        <CardMine
          serviceName="Decorators"
          serviceHref="/vendors/decorators"
          image={decor.src}
        />
        <CardMine
          serviceName="Caterers"
          serviceHref="/vendors/caterers"
          image={catering.src}
        />
        <CardMine
          serviceName="Venues"
          serviceHref="/vendors/venues"
          image={venues.src}
        />
        <CardMine
          serviceName="Entertainment"
          serviceHref="/vendors/entertainment"
          image={entertainment.src}
        />
        <CardMine
          serviceName="Logisitcs"
          serviceHref="/vendors/logistics"
          image={logistics.src}
        />
      </div>
    </div>
  );
}

export default HomeTwo;
