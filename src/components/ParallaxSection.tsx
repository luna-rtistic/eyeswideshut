"use client";

import { useRef, useState, useEffect, useMemo, useSyncExternalStore } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import AnimatedRectangle from "@/components/AnimatedRectangle";
import ColorImage from "./ColorImage";
import dynamic from "next/dynamic";
import Image from "next/image";
import ScrollVideoBackground from "@/components/ScrollVideoBackground";
import { MotionValue } from "framer-motion";

const MandalaVideo = dynamic(() => import("./MandalaVideo"), { ssr: false });
const ChatLog = dynamic(() => import("./ChatLog"), { ssr: false });
const ParallaxImages = dynamic(() => import("./ParallaxImages"), { ssr: false });

const destinations = [
  // Top row
  { x: "-25vw", y: "-25vh", scale: 0.52, snackImage: "/snack_1-1.png", snackImage2: "/snack_1-2.png" },
  { x: "0vw", y: "-30vh", scale: 0.52, snackImage: "/snack_2-1.png", snackImage2: "/snack_2-2.png" },
  { x: "25vw", y: "-25vh", scale: 0.52, snackImage: "/snack_3-1.png", snackImage2: "/snack_3-2.png" },
  // Bottom row
  { x: "-25vw", y: "25vh", scale: 0.52, snackImage: "/snack_4-1.png", snackImage2: "/snack_4-2.png" },
  { x: "0vw", y: "30vh", scale: 0.52, snackImage: "/snack_5-1.png", snackImage2: "/snack_5-2.png" },
  { x: "25vw", y: "25vh", scale: 0.52, snackImage: "/snack_6-1.png", snackImage2: "/snack_6-2.png" },
];

const typingText = "Perception is being adjusted...";
const characters = Array.from(typingText);

interface MouseTrail {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

// 실제 존재하는 이미지 파일만 사용
const imageUrls = [
  "/img_1-1.gif", "/img_2-1.png", "/img_3-1.png", "/img_4-1.png", "/img_5-1.png", "/img_6-1.png", "/img_7-1.png", "/img_8-1.png", "/img_9-1.png", "/img_10-1.png", "/img_11-1.gif", "/img_12-1.png", "/img_13-1.png", "/img_14-1.gif", "/img_15-1.png", "/img_16-1.png", "/img_17-1.png", "/img_18-1.gif", "/img_19-1.png", "/img_20-1.png", "/img_21-1.png", "/img_22-1.png", "/img_23-1.png", "/img_24-1.png", "/img_25-1.png", "/img_26-1.png", "/img_27-1.png", "/img_28-1.png", "/img_29-1.png", "/img_30-1.png"
];

// ChatLogProps에 progress 추가
interface ChatLogProps {
  y: MotionValue<any>;
  opacity: MotionValue<number>;
  contentY: MotionValue<any>;
  onHeightReady: (height: number) => void;
  progress: MotionValue<number>;
}

// 커스텀 훅: motion value를 React state처럼 subscribe
function useMotionValueValue(motionValue: MotionValue<any>) {
  return useSyncExternalStore(
    (cb) => motionValue.on("change", cb),
    () => motionValue.get(),
    () => 0 // SSR에서 안전하게 0 반환
  );
}

export default function ParallaxSection() {
  const parallaxContainerRef = useRef(null);
  const [chatScrollDistance, setChatScrollDistance] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSnackImage, setSelectedSnackImage] = useState<string | null>(null);
  const [mouseTrails, setMouseTrails] = useState<MouseTrail[]>([]);
  const trailIdRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: parallaxContainerRef,
    offset: ["start start", "end end"],
  });

  const [imageConfigs, setImageConfigs] = useState<any[]>([]);
  useEffect(() => {
    setImageConfigs(
      imageUrls.map((url, i) => ({
        url,
        x: Math.random() * 80 + 5,
        yStart: 100 + Math.random() * 10,
        yEnd: -100 - Math.random() * 40,
        speed: 0.7 + Math.random() * 0.7,
        size: Math.random() * 10 + 6,
        delay: Math.random() * 0.12,
      }))
    );
  }, []);

  // Mouse trail effect
  useEffect(() => {
    let lastMouseMove = 0;
    const throttleDelay = 50; // 50ms throttle

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMove < throttleDelay) return;
      lastMouseMove = now;

      const newTrail: MouseTrail = {
        id: trailIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: now
      };

      setMouseTrails(prev => [...prev, newTrail]);

      // Remove trails older than 3 seconds
      setTimeout(() => {
        setMouseTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 하얀 네모(AnimatedRectangle) 구간: 0.005~0.23 (진행률 23에서 rectangleProgress=1)
  const rectangleStart = 0.005;
  const rectangleEnd = 0.23;
  const rectangleProgress = useTransform(
    scrollYProgress,
    [rectangleStart, rectangleEnd],
    [0, 1]
  );

  // 비디오 페이드 인/아웃 구간 (fadeOut이 네모 사라짐과 정확히 일치)
  const fadeIn = 0.08;
  // 비디오 fade out: 스크롤 진행률 23~25에 맞추기
  const fadeOut = 0.9; // rectangleProgress 0.9에서 fade out 시작
  const fadeOutEnd = 1.0; // rectangleProgress 1.0에서 완전히 사라짐

  // 이미지 등장 구간: 비디오 fade in 시작(0.08)~rectangleProgress=1(진행률 23)에서 모두 사라짐
  const imageAppearStart = 0.08;
  const imageAppearEnd = 1;
  const imageAppearProgress = Math.max(0, Math.min(1, (rectangleProgress.get() - imageAppearStart) / (imageAppearEnd - imageAppearStart)));

  // TIMELINE:
  // 0.0 - 0.25: Rectangle lifecycle
  // 0.25 - 0.5: ChatLog lifecycle
  // 0.5 - 1.0: Final sequence (Mandala, Colors, Grid)

  // --- Segment 1: Rectangle ---
  const rectangleY = useTransform(scrollYProgress, [0.005, 0.04, 0.06, 0.25, 0.27], ["100vh", "0vh", "0vh", "0vh", "-100vh"]);
  const rectangleScale = useTransform(scrollYProgress, [0.04, 0.06, 0.25], [1, 1.2, 1.2]);
  const rectangleOpacity = useTransform(scrollYProgress, [0.005, 0.01, 0.22, 0.23], [1, 1, 1, 0]);
  const rectangleContentY = useTransform(rectangleProgress, [0.4, 0.8], ["0%", "-60%"]);
  
  // 애니메이션 진행률을 0-100으로 변환
  const animationProgress = useTransform(scrollYProgress, (value) => Math.round(value * 100));
  const [scrollNumber, setScrollNumber] = useState(0);
  useEffect(() => {
    const unsubscribe = animationProgress.onChange((v) => setScrollNumber(v));
    return () => unsubscribe();
  }, [animationProgress]);

  // 내부 스크롤 구간: 0.06~0.25
  const enableInnerScroll = scrollYProgress.get() >= 0.06 && scrollYProgress.get() < 0.25;
  const innerScrollProgress = Math.max(0, Math.min(1, (scrollYProgress.get() - 0.06) / 0.19));
  const gridRows = 14;
  const rowHeight = 100; // px
  const containerHeight = 520; // px
  const innerScrollMax = (gridRows * rowHeight) - containerHeight; // 1400 - 520 = 880px
  const innerScroll = enableInnerScroll ? innerScrollProgress * innerScrollMax : 0;

  // --- Segment 2: ChatLog ---
  const chatProgress = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  // 마지막 메시지가 다 등장한 후(chatProgress=1.0) 퇴장 시작
  const chatY = useTransform(chatProgress, [0.0, 0.2, 0.92, 1.0], ["100vh", "0vh", "0vh", "-100vh"]);
  const chatOpacity = useTransform(chatProgress, [0.0, 0.02, 0.92, 1.0], [0, 1, 1, 0]);
  const chatContentY = useTransform(chatProgress, [0.2, 0.92], [0, -chatScrollDistance]);

  // --- Segment 3: Final Sequence ---
  const finalSequenceProgress = useTransform(scrollYProgress, [0.5, 1.0], [0, 1]);
  const mandalaOpacity = useTransform(finalSequenceProgress, [0.08, 0.18, 0.4, 0.45], [0, 1, 1, 0]);
  const mandalaBgScale = useTransform(finalSequenceProgress, [0, 1], [2.0, 2.5]);
  const color1Opacity = useTransform(finalSequenceProgress, [0.44, 0.46, 0.55, 0.56], [0, 1, 1, 0]);
  const color2Opacity = useTransform(finalSequenceProgress, [0.46, 0.48, 0.55, 0.56], [0, 1, 1, 0]);
  const color3Opacity = useTransform(finalSequenceProgress, [0.48, 0.50, 0.55, 0.56], [0, 1, 1, 0]);
  const color4Opacity = useTransform(finalSequenceProgress, [0.50, 0.52, 0.55, 0.56], [0, 1, 1, 0]);
  
  // Color 4 splits into 6 pieces
  const color4SplitProgress = useTransform(finalSequenceProgress, [0.52, 0.54, 0.56, 0.58], [0, 1, 1, 0]);
  const color4SplitScale = useTransform(finalSequenceProgress, [0.52, 0.54], [1, 1.5]);
  const color4SplitRotate = useTransform(finalSequenceProgress, [0.52, 0.54], [0, 360]);
  
  const gridContainerOpacity = useTransform(finalSequenceProgress, [0.54, 0.56, 0.88, 0.90], [0, 1, 1, 0]);
  const gridProgress = useTransform(finalSequenceProgress, [0.56, 0.60], [0.1, 0.9]);
  
  const saturation = useTransform(finalSequenceProgress, [0.74, 0.75, 0.77, 0.773], [1, 1, 0, 0]);
  const filter = useTransform(saturation, (s) => `saturate(${s})`);

  const snack1Opacity = useTransform(finalSequenceProgress, [0.65, 0.69, 0.73, 0.75], [0, 1, 1, 0]);
  const snack1PointerEvents = useTransform(snack1Opacity, (v) => (v > 0 ? 'auto' : 'none'));
  const snack2Opacity = useTransform(finalSequenceProgress, [0.75, 0.76, 0.78, 0.79], [0, 1, 1, 0]);
  const snack2PointerEvents = useTransform(snack2Opacity, (v) => (v === 0 ? 'none' : 'auto'));

  const textContainerOpacity = useTransform(finalSequenceProgress, [0.74, 0.773, 0.78], [0, 1, 0]);
  const textTypingProgress = useTransform(finalSequenceProgress, [0.75, 0.77], [0, 1]);

  // Error popup appears and disappears
  const errorPopupOpacity = useTransform(finalSequenceProgress, [0.82, 0.84, 0.86, 0.88], [0, 1, 1, 0]);

  // Snack images appear after popup disappears and grid starts to disappear
  const snackImagesOpacity = useTransform(finalSequenceProgress, [0.88, 0.90, 0.95, 0.96], [0, 1, 1, 0]);
  
  // Snack images transition from -1 to -2 version
  const snackImageTransition = useTransform(finalSequenceProgress, [0.92, 0.94], [0, 1]);

  // Grave images fall from sky with heavy effect
  const graveOpacity = useTransform(finalSequenceProgress, [0.95, 0.97, 0.985, 0.995], [0, 1, 1, 0]);
  const graveY = useTransform(finalSequenceProgress, [0.95, 0.97], ['-100vh', '0vh']);

  // Cyber glitch text appears while graves are disappearing
  const glitchTextOpacity = useTransform(finalSequenceProgress, [0.985, 0.995], [0, 1]);

  const baseImageOpacity = useTransform(finalSequenceProgress, [0.48, 0.50], [0, 0]);

  // 커스텀 훅: motion value를 React state처럼 subscribe
  const finalProgress = useMotionValueValue(finalSequenceProgress);

  return (
    <div ref={parallaxContainerRef} className="relative h-[5000vh]">
      {/* 비디오 배경 */}
      <ScrollVideoBackground
        progress={rectangleProgress.get()}
        fadeIn={fadeIn}
        fadeOut={fadeOut}
        fadeOutEnd={fadeOutEnd}
        duration={10}
      />

      {/* Parallax 이미지 효과 (클라이언트 전용) */}
      <ParallaxImages progress={imageAppearProgress} />

      {/* Mouse Trail Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {mouseTrails.map((trail) => (
            <motion.div
              key={trail.id}
              className="absolute w-4 h-4 rounded-full"
              style={{
                left: trail.x - 8,
                top: trail.y - 8,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                filter: 'blur(0px)'
              }}
              animate={{ 
                opacity: [0, 0.8, 0.6, 0.4, 0.2, 0],
                scale: [0.5, 1, 1.2, 1.4, 1.6, 1.8],
                filter: 'blur(2px)'
              }}
              transition={{
                duration: 5,
                ease: "easeOut"
              }}
              exit={{ opacity: 0, scale: 0 }}
            />
          ))}
        </AnimatePresence>
      </div>

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
        <ChatLog y={chatY} opacity={chatOpacity} contentY={chatContentY} onHeightReady={setChatScrollDistance} progress={chatProgress} />

        {/* AnimatedRectangle Grid Container */}
        <AnimatedRectangle 
          y={rectangleY} 
          scale={rectangleScale} 
          opacity={rectangleOpacity} 
          contentY={rectangleContentY}
          enableInnerScroll={enableInnerScroll}
          innerScroll={innerScroll}
        />

        <motion.div 
          className="absolute inset-0 z-20"
          style={{ filter }}
        >
          <MandalaVideo opacity={mandalaOpacity} bgScale={mandalaBgScale} />
          <div className="absolute inset-0 z-30 pointer-events-none">
            <ColorImage opacity={color1Opacity} src="/color_1.png" />
            <ColorImage opacity={color2Opacity} src="/color_2.png" />
            <ColorImage opacity={color3Opacity} src="/color_3.png" />
            <ColorImage opacity={color4Opacity} src="/color_4.png" />
          </div>

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
        </motion.div>

        {/* Snack Images that appear after scrolling more - Outside filter */}
        <motion.div 
          style={{ opacity: snackImagesOpacity }}
          className="absolute inset-0 z-50"
        >
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
                initial={{ opacity: 0, scale: 0.5 }}
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
                  <motion.div
                    style={{ opacity: useTransform(snackImageTransition, [0, 0.5], [1, 0]) }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={`/snack_${index + 1}-1.png`}
                      alt={`Snack ${index + 1} version 1`}
                      layout="fill"
                      objectFit="contain"
                      style={{ transform: 'scale(1.3)' }}
                      onClick={() => setSelectedSnackImage(`/snack_${index + 1}-1.png`)}
                      className="cursor-pointer"
                    />
                  </motion.div>
                  <motion.div
                    style={{ opacity: useTransform(snackImageTransition, [0.5, 1], [0, 1]) }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={`/snack_${index + 1}-2.png`}
                      alt={`Snack ${index + 1} version 2`}
                      layout="fill"
                      objectFit="contain"
                      style={{ transform: 'scale(1.3)' }}
                      onClick={() => setSelectedSnackImage(`/snack_${index + 1}-2.png`)}
                      className="cursor-pointer"
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Grave Images that fall from sky - Outside filter */}
        <motion.div 
          style={{ opacity: graveOpacity }}
          className="absolute inset-0 z-50"
        >
          {destinations.map((dest, index) => {
            const x = dest.x;
            const y = dest.y;
            const scale = dest.scale;
            const graveYPosition = useTransform(finalSequenceProgress, [0.95, 0.97], ['-100vh', y]);

            return (
              <motion.div
                key={index}
                className="absolute w-full h-full flex items-center justify-center"
                style={{ 
                  x: x,
                  y: graveYPosition,
                  scale: scale
                }}
                initial={{ opacity: 0, scale: 0.8, y: '-100vh' }}
                animate={{ 
                  opacity: 1, 
                  scale: scale,
                  y: '0vh',
                  transition: { 
                    delay: index * 0.5,
                    duration: 2.5,
                    ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for heavy feel
                    scale: {
                      duration: 2.5,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                <div className="relative w-[60vmin] aspect-[759/600]">
                  <Image
                    src={`/grave_${index + 1}.png`}
                    alt={`Grave ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    style={{ transform: 'scale(1.3)' }}
                    className="cursor-pointer"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Cyber Glitch Text */}
        <motion.div
          style={{ opacity: glitchTextOpacity }}
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center"
        >
          <div className="text-center" style={{ pointerEvents: 'auto' }}>
            <div className="font-mono text-2xl md:text-4xl font-thin text-white mb-8 leading-relaxed">
              You don't know what you've given<br />
              but they already know what to take
            </div>
          </div>
        </motion.div>
      </div>

      {/* Error Popup - moved to top level */}
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
            >
              OK
            </button>
          </div>
        </div>
      </motion.div>

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
                whileHover={{ rotate: 360, transition: { duration: 0.3 } }}
              >
                X
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snack Image Modal */}
      <AnimatePresence>
        {selectedSnackImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[70]"
            onClick={() => setSelectedSnackImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[80vmin] aspect-[759/600]"
              style={{ rotate: 0 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <motion.div className="w-full h-full">
                <Image
                  src={selectedSnackImage}
                  alt="Enlarged snack image"
                  layout="fill"
                  objectFit="contain"
                />
              </motion.div>
              <motion.button
                className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-black font-bold z-10 shadow-lg"
                onClick={() => setSelectedSnackImage(null)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ rotate: 360, transition: { duration: 0.3 } }}
              >
                X
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Start Over Button - Separate Layer */}
      {finalProgress > 0.98 && (
        <motion.button
          className="fixed z-[80] text-white font-mono text-sm hover:text-gray-300 transition-colors duration-300"
          style={{ 
            bottom: '40%', 
            left: '50%', 
            transform: 'translateX(-50%)',
            color: '#33FF00',
            animation: 'pulse 2s ease-in-out infinite',
            cursor: 'pointer'
          }}
          onClick={() => {
            console.log('Start over button clicked!');
            window.scrollTo(0, 0);
            window.location.reload();
          }}
        >
          ▴ start over
        </motion.button>
      )}
    </div>
  );
} 