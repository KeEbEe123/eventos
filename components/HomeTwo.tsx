import React from "react";
import CyclingText from "./CyclingTest";

function HomeTwo() {
  return (
    <div className="flex flex-col items-start justify-center text-[100px] mx-auto font-dm mt-[140px] px-4 ml-20">
      {/* Top Line: "Plan your" + cycling text */}
      <div className="flex items-end">
        <CyclingText words={["birthday", "marriage", "anniversary", "pooja"]} />
      </div>

      {/* Bottom Line: Aligned with text above */}
      <div>With us!</div>
    </div>
  );
}

export default HomeTwo;
