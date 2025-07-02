"use client";

import styles from "./ErrorBurstBackground.module.css";
import { useMemo, useEffect, useState } from "react";

const NUM_IMAGES = 100;
const IMG_WIDTH = 260;
const IMG_HEIGHT = 180;
const APPEAR_INTERVAL = 100; // ms, 0.1초 간격

function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function ErrorBurstBackground() {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  // useMemo로 한 번만 생성 (랜덤 위치 고정, rotate 없음)
  const imagesData = useMemo(() => Array.from({ length: NUM_IMAGES }).map((_, i) => {
    const left = getRandomInRange(0, screenWidth - IMG_WIDTH);
    const top = getRandomInRange(0, screenHeight - IMG_HEIGHT);
    const opacity = 0.7 + Math.random() * 0.25;
    const zIndex = 10 + i;
    return { left, top, opacity, zIndex };
  }), [screenWidth, screenHeight]);

  // 등장 이미지 개수 state
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    setVisibleCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount((prev) => {
        if (prev < NUM_IMAGES) return prev + 1;
        return prev;
      });
      if (i >= NUM_IMAGES) clearInterval(interval);
    }, APPEAR_INTERVAL);
    return () => clearInterval(interval);
  }, [screenWidth, screenHeight]);

  return (
    <div
      className={styles.burstContainer}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {imagesData.slice(0, visibleCount).map((img, i) => (
        <img
          key={i}
          src="/computer.jpg"
          alt="computer"
          width={IMG_WIDTH}
          height={IMG_HEIGHT}
          style={{
            position: "fixed",
            left: `${img.left}px`,
            top: `${img.top}px`,
            opacity: img.opacity,
            zIndex: img.zIndex,
            pointerEvents: "none",
            userSelect: "none",
            objectFit: "cover",
            display: "block",
          }}
          draggable={false}
        />
      ))}
    </div>
  );
} 