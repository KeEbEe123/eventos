import React from "react";
import CyclingText from "./CyclingTest";
import CardMine from "./CardMine";
import LocationSelector from "./LocationSelector";

function HomeTwo() {
  return (
    <div className="flex flex-col items-start justify-center text-[100px] mx-auto font-dm mt-[140px] px-4 ml-20">
      {/* Top Line: "Plan your" + cycling text */}
      <div className="flex items-end">
        <CyclingText words={["birthday", "marriage", "anniversary"]} />
      </div>

      {/* Bottom Line: Aligned with text above */}
      <div>With us!</div>
      <div className="w-full">
        <LocationSelector />
      </div>
      {/* Grid for cards */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 w-full mt-8">
        <CardMine serviceName="Photographers" serviceHref="/photographers" />
        <CardMine serviceName="Decorators" serviceHref="/decorators" />
        <CardMine serviceName="Caterers" serviceHref="/caterers" />
        <CardMine serviceName="Others" serviceHref="/service-link" />
      </div>
    </div>
  );
}

export default HomeTwo;
