"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import AnimatedRectangle from "@/components/AnimatedRectangle";
import ColorImage from "./ColorImage";
import dynamic from "next/dynamic";
import Image from "next/image";

const MandalaVideo = dynamic(() => import("./MandalaVideo"), { ssr: false });
const ChatLog = dynamic(() => import("./ChatLog"), { ssr: false });

const destinations = [
  // Top row
  { x: "-25vw", y: "-25vh", scale: 0.4, snackImage: "/snack_1-1.png", snackImage2: "/snack_1-2.png" },
  { x: "0vw", y: "-30vh", scale: 0.4, snackImage: "/snack_2-1.png", snackImage2: "/snack_2-2.png" },
  { x: "25vw", y: "-25vh", scale: 0.4, snackImage: "/snack_3-1.png", snackImage2: "/snack_3-2.png" },
  // Bottom row
  { x: "-25vw", y: "25vh", scale: 0.4, snackImage: "/snack_4-1.png", snackImage2: "/snack_4-2.png" },
  { x: "0vw", y: "30vh", scale: 0.4, snackImage: "/snack_5-1.png", snackImage2: "/snack_5-2.png" },
  { x: "25vw", y: "25vh", scale: 0.4, snackImage: "/snack_6-1.png", snackImage2: "/snack_6-2.png" },
];

const typingText = "Perception is being adjusted...";
const characters = Array.from(typingText);

export default function ParallaxSection() {
  const parallaxContainerRef = useRef(null);
  const [chatScrollDistance, setChatScrollDistance] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [okClicked, setOkClicked] = useState(false);

  const { scrollYProgress } = useScroll({
    target: parallaxContainerRef,
    offset: ["start start", "end end"],
  });

  // TIMELINE:
  // 0.0 - 0.25: Rectangle lifecycle
  // 0.25 - 0.5: ChatLog lifecycle
  // 0.5 - 1.0: Final sequence (Mandala, Colors, Grid)

  // --- Segment 1: Rectangle ---
  const rectangleProgress = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const rectangleY = useTransform(rectangleProgress, [0.0, 0.4, 0.8, 1.0], ["100vh", "0vh", "0vh", "-100vh"]);
  const rectangleScale = useTransform(rectangleProgress, [0.4, 0.8], [1, 1.2]);
  const rectangleOpacity = useTransform(rectangleProgress, [0.0, 0.02, 0.98, 1.0], [0, 1, 1, 0]);
  const rectangleContentY = useTransform(rectangleProgress, [0.4, 0.8], ["0%", "-60%"]);
  
  // --- Segment 2: ChatLog ---
  const chatProgress = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  const chatY = useTransform(chatProgress, [0.0, 0.2, 0.8, 1.0], ["100vh", "0vh", "0vh", "-100vh"]);
  const chatOpacity = useTransform(chatProgress, [0.0, 0.02, 0.98, 1.0], [0, 1, 1, 0]);
  const chatContentY = useTransform(chatProgress, [0.2, 0.8], [0, -chatScrollDistance]);

  // --- Segment 3: Final Sequence ---
  const finalSequenceProgress = useTransform(scrollYProgress, [0.5, 1.0], [0, 1]);
  const mandalaOpacity = useTransform(finalSequenceProgress, [0.0, 0.1, 0.4, 0.45], [0, 1, 1, 0]);
  const color1Opacity = useTransform(finalSequenceProgress, [0.44, 0.46, 0.55, 0.56], [0, 1, 1, 0]);
  const color2Opacity = useTransform(finalSequenceProgress, [0.46, 0.48, 0.55, 0.56], [0, 1, 1, 0]);
  const color3Opacity = useTransform(finalSequenceProgress, [0.48, 0.50, 0.55, 0.56], [0, 1, 1, 0]);
  const color4Opacity = useTransform(finalSequenceProgress, [0.50, 0.52, 0.55, 0.56], [0, 1, 1, 0]);
  
  const gridContainerOpacity = useTransform(finalSequenceProgress, [0.54, 0.56], [0, 1]);
  const gridProgress = useTransform(finalSequenceProgress, [0.56, 0.60], [0.1, 0.9]);
  
  const saturation = useTransform(finalSequenceProgress, [0.74, 0.75, 0.77, 0.773], [1, 1, 0, 0]);
  const filter = useTransform(saturation, (s) => `saturate(${s})`);

  const snack1Opacity = useTransform(finalSequenceProgress, [0.65, 0.69, 0.73, 0.75], [0, 1, 1, 0]);
  const snack1PointerEvents = useTransform(snack1Opacity, (v) => (v > 0 ? 'auto' : 'none'));
  const snack2Opacity = useTransform(finalSequenceProgress, [0.75, 0.76, 0.78, 0.79], [0, 1, 1, 0]);
  const snack2PointerEvents = useTransform(snack2Opacity, (v) => (v === 0 ? 'none' : 'auto'));

  const textContainerOpacity = useTransform(finalSequenceProgress, [0.74, 0.773, 0.78], [0, 1, 0]);
  const textTypingProgress = useTransform(finalSequenceProgress, [0.75, 0.77], [0, 1]);

  const errorPopupOpacity = useTransform(finalSequenceProgress, [0.78, 0.80], [0, 1]);

  const graveOpacity = useTransform(finalSequenceProgress, [0.79, 1.0], [0, 1]);
  const graveY = useTransform(finalSequenceProgress, [0.79, 1.0], ['-50vh', '0vh']);

  const baseImageOpacity = useTransform(finalSequenceProgress, [0.48, 0.50], [0, 0]);

  // 애니메이션 진행률을 0-100으로 변환
  const animationProgress = useTransform(scrollYProgress, (value) => Math.round(value * 100));

  return (
    <div ref={parallaxContainerRef} className="relative h-[5000vh]">
      {/* 애니메이션 진행률 표시 */}
      <motion.div 
        className="fixed top-4 right-4 z-50 bg-black bg-opacity-50 px-3 py-2 rounded-lg"
        style={{ color: 'red' }}
      >
        <motion.div className="font-mono text-xl font-bold">
          {animationProgress}
        </motion.div>
      </motion.div>

      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <AnimatedRectangle y={rectangleY} scale={rectangleScale} opacity={rectangleOpacity} contentY={rectangleContentY} />
        <ChatLog y={chatY} opacity={chatOpacity} contentY={chatContentY} onHeightReady={setChatScrollDistance} />

        <div className="absolute inset-0 z-20">
          <MandalaVideo opacity={mandalaOpacity} />
          <div className="absolute inset-0 z-30 pointer-events-none">
            <ColorImage opacity={color1Opacity} src="/color_1.png" />
            <ColorImage opacity={color2Opacity} src="/color_2.png" />
            <ColorImage opacity={color3Opacity} src="/color_3.png" />
            <ColorImage opacity={color4Opacity} src="/color_4.png" />
          </div>

          <motion.div 
            style={{ opacity: gridContainerOpacity }} 
            className="absolute inset-0 z-40"
            animate={{ opacity: okClicked ? 0 : undefined }}
            transition={{ duration: okClicked ? 0.5 : 0 }}
          >
            <motion.div
              style={{ opacity: textContainerOpacity }}
              className="z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <p className="font-mono text-green-500 text-center text-2xl">
                {characters.map((char, i) => {
                  const start = i / characters.length;
                  const end = start + 1 / characters.length;
                  const opacity = useTransform(textTypingProgress, [start, end], [0.2, 1]);
                  return (
                    <motion.span key={`${char}-${i}`} style={{ opacity }}>
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  );
                })}
              </p>
            </motion.div>
            
            {destinations.map((dest, i) => {
              const x = useTransform(gridProgress, [0.1, 0.9], ["0vw", dest.x]);
              const yValue = parseFloat(dest.y);
              const yUnit = dest.y.replace(yValue.toString(), '');
              const arcY = `${yValue * 1.2}${yUnit}`;
              const y = useTransform(gridProgress, [0.1, 0.5, 0.9], ["0vh", arcY, dest.y]);
              const scale = useTransform(gridProgress, [0.1, 0.9], [1, dest.scale]);
              const rotation = i % 2 === 0 ? 90 : -90;

              // color_4.png가 6방향으로 움직이도록
              return (
                <motion.div
                  key={i}
                  style={{ x, y, scale }}
                  className="absolute w-full h-full flex items-center justify-center z-20"
                >
                  <motion.div className="relative w-[60vmin] aspect-[759/600]">
                    <motion.div className="absolute inset-0" style={{ filter }}>
                      <Image
                        src="/color_4.png"
                        alt={`Color 4 grid image ${i + 1}`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Snack Images that appear after OK button click */}
          {okClicked && (
            <div className="absolute inset-0 z-50">
              {destinations.map((dest, index) => {
                const x = dest.x;
                const y = dest.y;
                const scale = dest.scale;

                return (
                  <motion.div
                    key={index}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{ 
                      x: x,
                      y: y,
                      scale: scale
                    }}
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: scale, 
                      rotate: 90,
                      transition: { 
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }}
                  >
                    <div className="relative w-[60vmin] aspect-[759/600]">
                      <Image
                        src={`/snack_${index + 1}-1.png`}
                        alt={`Snack ${index + 1}`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Error Popup - moved to top level */}
      {!okClicked && (
        <motion.div
          style={{ opacity: errorPopupOpacity }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]"
        >
          <div 
            className="p-6 max-w-md mx-auto text-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              fontSize: '80%'
            }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg drop-shadow-lg">System Error</h2>
                <p className="text-gray-200 text-sm drop-shadow">The application encountered an error</p>
              </div>
            </div>
            <div className="text-white font-mono text-sm space-y-2 mb-6">
              <p 
                className="p-2 rounded border-l-4 border-red-400 drop-shadow"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-red-300 font-semibold">ERR_001:</span> Perception adjustment failed
              </p>
              <p 
                className="p-2 rounded border-l-4 border-red-400 drop-shadow"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-red-300 font-semibold">ERR_002:</span> Reality matrix corrupted
              </p>
              <p 
                className="p-2 rounded border-l-4 border-red-400 drop-shadow"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-red-300 font-semibold">ERR_003:</span> Consciousness overflow detected
              </p>
            </div>
            <div className="flex justify-center">
              <button 
                className="px-8 py-3 rounded-lg font-medium transition-all duration-300 text-white font-semibold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
                  boxShadow: '0 4px 15px rgba(0, 255, 136, 0.4)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.6)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(0, 255, 136, 0.4)';
                }}
                onClick={() => setOkClicked(true)}
              >
                OK
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`snack-image-${selectedImage}`}
              className="relative w-[60vmin] aspect-[759/600]"
              style={{ rotate: 0 }}
            >
              <motion.div className="w-full h-full" style={{ scale: 1.5 }}>
                <Image
                  src={selectedImage}
                  alt="Enlarged snack image"
                  layout="fill"
                  objectFit="contain"
                />
              </motion.div>
              <motion.button
                className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center text-black font-bold z-10"
                onClick={() => setSelectedImage(null)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                X
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 