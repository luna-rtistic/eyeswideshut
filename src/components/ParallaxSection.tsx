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
  const color1Opacity = useTransform(finalSequenceProgress, [0.50, 0.55], [0, 1]);
  const color2Opacity = useTransform(finalSequenceProgress, [0.55, 0.60], [0, 1]);
  const color3Opacity = useTransform(finalSequenceProgress, [0.60, 0.65], [0, 1]);
  const color4Opacity = useTransform(finalSequenceProgress, [0.65, 0.70], [0, 1]);
  
  const gridContainerOpacity = useTransform(finalSequenceProgress, [0.48, 0.50], [0, 1]);
  const gridProgress = useTransform(finalSequenceProgress, [0.70, 0.74], [0.1, 0.9]);
  
  const saturation = useTransform(finalSequenceProgress, [0.73, 0.745, 0.77, 0.773], [1, 0, 0, 0]);
  const filter = useTransform(saturation, (s) => `saturate(${s})`);

  const snack1Opacity = useTransform(finalSequenceProgress, [0.65, 0.69, 0.73, 0.75], [0, 1, 1, 0]);
  const snack1PointerEvents = useTransform(snack1Opacity, (v) => (v > 0 ? 'auto' : 'none'));
  const snack2Opacity = useTransform(finalSequenceProgress, [0.75, 0.76, 0.78, 0.79], [0, 1, 1, 0]);
  const snack2PointerEvents = useTransform(snack2Opacity, (v) => (v === 0 ? 'none' : 'auto'));

  const textContainerOpacity = useTransform(finalSequenceProgress, [0.74, 0.773, 0.78], [0, 1, 0]);
  const textTypingProgress = useTransform(finalSequenceProgress, [0.75, 0.77], [0, 1]);

  const graveOpacity = useTransform(finalSequenceProgress, [0.79, 1.0], [0, 1]);
  const graveY = useTransform(finalSequenceProgress, [0.79, 1.0], ['-50vh', '0vh']);

  const baseImageOpacity = useTransform(finalSequenceProgress, [0.48, 0.50], [0, 0]);

  // 애니메이션 진행률을 0-100으로 변환
  const animationProgress = useTransform(scrollYProgress, (value) => Math.round(value * 100));

  // 디버깅: 74%에서 opacity 값 확인
  if (typeof window !== 'undefined') {
    import('framer-motion').then(({ useMotionValueEvent }) => {
      useMotionValueEvent(animationProgress, 'change', (v) => {
        if (v === 74) {
          // eslint-disable-next-line no-console
          console.log('[DEBUG] 74% - color4Opacity:', color4Opacity.get(), 'baseImageOpacity:', baseImageOpacity.get(), 'gridContainerOpacity:', gridContainerOpacity.get());
        }
      });
    });
  }

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

          <motion.div style={{ opacity: gridContainerOpacity }} className="absolute inset-0">
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
              const snack1Y = useTransform(finalSequenceProgress, [0.98, 0.982], i < 3 ? ["-100%", "0%"] : ["100%", "0%"]);
              
              return (
                <motion.div
                  key={i}
                  style={{ x, y, scale }}
                  className="absolute w-full h-full flex items-center justify-center z-20"
                >
                  <motion.div
                    className="relative w-[60vmin] aspect-[759/600]"
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{ opacity: baseImageOpacity, filter }}
                    >
                      <Image
                        src="/color_4.png"
                        alt="Abstract colorful image"
                        layout="fill"
                        objectFit="contain"
                      />
                    </motion.div>
                    
                    <motion.div
                      className="absolute inset-0 cursor-pointer"
                      style={{
                        opacity: snack1Opacity,
                        pointerEvents: snack1PointerEvents,
                        y: snack1Y,
                        rotate: rotation,
                        scale: 1.5,
                        transformOrigin: 'center',
                      }}
                      onClick={() => setSelectedImage(dest.snackImage)}
                      layoutId={`snack-image-${dest.snackImage}`}
                      whileHover={{
                        scale: 1.6,
                        rotate: [rotation, rotation - 2, rotation + 2, rotation - 2, rotation],
                        transition: { duration: 0.3 },
                      }}
                    >
                      <Image
                        src={dest.snackImage}
                        alt={`Snack image 1 for ${i + 1}`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </motion.div>
                    
                    <motion.div
                      className="absolute inset-0"
                      style={{ 
                        opacity: snack2Opacity, 
                        pointerEvents: snack2PointerEvents,
                        scale: 1.5,
                        transformOrigin: 'center',
                      }}
                    >
                      <Image
                        src={dest.snackImage2}
                        alt={`Snack image 2 for ${i + 1}`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0"
                      style={{
                        opacity: graveOpacity,
                        y: graveY,
                        pointerEvents: 'auto',
                        scale: 1.5,
                        transformOrigin: 'center',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 120,
                        damping: 12,
                        mass: 1.2,
                      }}
                    >
                      <Image
                        src={`/grave_${i + 1}.png`}
                        alt={`Grave image ${i + 1}`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </motion.div>

                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
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