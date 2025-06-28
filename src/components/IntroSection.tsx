"use client";

import Image from "next/image";
import SurveillanceTerminal from "./SurveillanceTerminal";

const IntroSection = () => {
  return (
    <section 
      className="h-screen w-full relative bg-black p-8"
      style={{ backgroundColor: "black" }}
    >
      {/* Left Column: Terminal (z-20) - Positioned at top */}
      <div className="pr-4 relative z-20" style={{ width: "calc(50% + 50px)", paddingLeft: "30px" }}>
        <div style={{ padding: "1.5rem" }}>
          <SurveillanceTerminal />
        </div>
      </div>

      {/* Right Column: Text Image (z-30) */}
      <div 
        className="absolute w-1/2 z-30"
        style={{
          top: "20px",
          left: "50%"
        }}
      >
        <div className="w-full max-w-[1040px]">
          <Image
            src="/text_1.png"
            alt="WE ALREADY KNOW ENOUGH"
            width={1040}
            height={1040}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
      
      {/* Cookie Image Container (z-10) */}
      <div 
        className="absolute w-1/2 z-10"
        style={{
          top: "1080px",
          left: "50%"
        }}
      >
        <div className="w-full max-w-[1040px]">
           <div className="flex justify-start">
            <Image
              src="/cookie.gif"
              alt="Cookie"
              width={300}
              height={300}
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
