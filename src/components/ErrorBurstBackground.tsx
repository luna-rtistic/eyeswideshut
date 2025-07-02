"use client";

import styles from "./ErrorBurstBackground.module.css";

const NUM_IMAGES = 18;
const BASE_LEFT = 120; // px, 시작 x 위치 (오른쪽으로 이동)
const BASE_TOP = -40;  // px, 시작 y 위치 (더 위로 올림)
const DELTA_X = 48;   // px, x축 이동량
const DELTA_Y = 90;   // px, y축 이동량
const IMG_WIDTH = 260;
const IMG_HEIGHT = 180;
const OVERLAP = 0.7; // 오버랩 비율 (1: 완전 분리, 0: 완전 겹침)

function getRandomOffset(range: number) {
  return (Math.random() - 0.5) * range; // -range/2 ~ +range/2
}

export default function ErrorBurstBackground() {
  const images = Array.from({ length: NUM_IMAGES }).map((_, i) => {
    const left = BASE_LEFT + i * DELTA_X * OVERLAP + getRandomOffset(28);
    const top = BASE_TOP + i * DELTA_Y * OVERLAP + getRandomOffset(36);
    const opacity = 0.85 - i * 0.015; // 아래로 갈수록 살짝 투명
    const zIndex = 10 + i; // 위로 갈수록 위에 쌓임
    return (
      <img
        key={i}
        src="/computer.jpg"
        alt="computer"
        width={IMG_WIDTH}
        height={IMG_HEIGHT}
        style={{
          position: "fixed",
          left: `${left}px`,
          top: `${top}px`,
          opacity,
          zIndex,
          pointerEvents: "none",
          userSelect: "none",
          objectFit: "cover",
          display: "block",
          boxShadow: i === 0 ? "0 8px 32px rgba(0,0,0,0.2)" : undefined,
        }}
        draggable={false}
      />
    );
  });

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
      {images}
    </div>
  );
} 