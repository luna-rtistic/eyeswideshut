"use client";

import { useState } from "react";
import IntroSection from "@/components/IntroSection";
// import ContentOverloadSection from "@/components/ContentOverloadSection";
// import FilteredEmptySpaceSection from "@/components/FilteredEmptySpaceSection";
// import BiologicalMetaphorSection from "@/components/BiologicalMetaphorSection";
// import FilteringTunnelSection from "@/components/FilteringTunnelSection";
import ParallaxSection from "@/components/ParallaxSection";
import ErrorBurstBackground from "@/components/ErrorBurstBackground";

export default function Home() {
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  return (
    <>
      {isErrorOpen && <ErrorBurstBackground />}
      {isErrorOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2000,
            background: "rgba(255,255,255,0.8)",
            padding: 40,
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16 }}>System Error</div>
          <div style={{ marginBottom: 16 }}>
            Identity residue remaining: <span style={{ color: "green" }}>2.6%</span>
            <br />
            Preparing for final extraction
          </div>
          <button
            style={{
              fontSize: 20,
              padding: "8px 24px",
              borderRadius: 8,
              background: "#00ffcc",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setIsErrorOpen(false)}
          >
            OK
          </button>
        </div>
      )}
      <main>
        <IntroSection />
        {/* <ContentOverloadSection /> */}
        {/* <FilteredEmptySpaceSection /> */}
        {/* <BiologicalMetaphorSection /> */}
        {/* <FilteringTunnelSection /> */}
        <ParallaxSection />
        <button
          style={{ position: "fixed", top: 40, left: 40, zIndex: 10 }}
          onClick={() => setIsErrorOpen(true)}
        >
          Show System Error
        </button>
      </main>
    </>
  );
}
