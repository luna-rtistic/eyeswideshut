"use client";
import { useEffect, useState } from "react";

export default function ParallaxImages({ progress }: { progress: number }) {
  const imageUrls = [
    "/img_1-1.gif", "/img_2-1.png", "/img_3-1.png", "/img_4-1.png", "/img_5-1.png", "/img_6-1.png", "/img_7-1.png", "/img_8-1.png", "/img_9-1.png", "/img_10-1.png", "/img_11-1.gif", "/img_12-1.png", "/img_13-1.png", "/img_14-1.gif", "/img_15-1.png", "/img_16-1.png", "/img_17-1.png", "/img_18-1.gif", "/img_19-1.png", "/img_20-1.png", "/img_21-1.png", "/img_22-1.png", "/img_23-1.png", "/img_24-1.png", "/img_25-1.png", "/img_26-1.png", "/img_27-1.png", "/img_28-1.png", "/img_29-1.png", "/img_30-1.png", "/img_31-1.png", "/img_32-1.gif", "/img_33-1.png", "/img_34-1.png"
  ];
  const [imageConfigs, setImageConfigs] = useState<any[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [failedHoverSrcs, setFailedHoverSrcs] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 54개 (9x6)
    const N = 54;
    const cols = 9;
    const rows = 6;
    const repeatedUrls = Array.from({ length: N }, (_, i) => imageUrls[i % imageUrls.length]);
    setImageConfigs(
      repeatedUrls.map((url, i) => {
        const maxDelay = 0.7857;
        const delay = i * (maxDelay / (N - 1)) + Math.random() * 0.01;
        const speed = 0.08 + Math.random() * 0.4 + delay * 0.5;
        // 크기 1.6배 (기존 6~10vw → 9.6~16vw)
        const size = (Math.random() * 4 + 6) * 1.6;
        // 격자 분포
        const col = i % cols;
        const row = Math.floor(i / cols);
        // 격자 기반 + 각 칸 내 랜덤 오프셋 (최대한 겹치지 않게)
        const gridWidth = 96; // vw
        const gridHeight = 48; // vh (6행, 각 8vh)
        const cellWidth = gridWidth / cols;
        const cellHeight = gridHeight / rows;
        // 완전 랜덤 분포 (화면 전체에 자연스럽게 흩어지게)
        const x = Math.random() * 96; // 0~96vw
        const yStart = 90 + Math.random() * 48; // 90~138vh
        const yEnd = -400 - Math.random() * 200;
        return {
          url,
          x,
          yStart,
          yEnd,
          speed,
          size,
          delay,
        };
      })
    );
  }, []);

  if (imageConfigs.length === 0 || progress >= 1) return null;

  return (
    <>
      {imageConfigs.map((img, i) => {
        const localProgress = Math.max(0, (progress - img.delay) / img.speed);
        const y = progress < img.delay ? img.yStart : img.yStart + (img.yEnd - img.yStart) * localProgress;
        let opacity = 1;
        if (progress < img.delay) opacity = 0;
        else if (localProgress > 0.9) opacity = 1 - Math.min(1, (localProgress - 0.9) / 0.1);
        else opacity = 1;
        if (opacity <= 0) return null;
        // 이미지 파일명에서 -1을 -2로 바꿔서 hover 시 사용
        const hoverSrc =
          img.url.includes("img_5-1.png")
            ? img.url.replace("img_5-1.png", "img_5-2.jpeg")
            : img.url.includes("img_16-1.png")
            ? img.url.replace("img_16-1.png", "img_16-2.jpg")
            : img.url.includes("img_32-1.gif")
            ? img.url.replace("img_32-1.gif", "img_32-2.gif")
            : img.url.replace(/-1(\.[a-zA-Z0-9]+)$/, "-2$1");
        // hoverSrc가 실패한 경우 fallback
        const useHoverSrc = hovered === i && !failedHoverSrcs.has(hoverSrc);
        return (
          <img
            key={img.url + i}
            src={useHoverSrc ? hoverSrc : img.url}
            style={{
              position: "fixed",
              left: `${img.x}vw`,
              top: 0,
              transform: `translateY(${y}vh)`,
              width: `${img.size}vw`,
              opacity,
              zIndex: 10,
              pointerEvents: "auto",
              display: "block"
            }}
            alt=""
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onError={e => {
              // hoverSrc가 실패하면 기록
              if (useHoverSrc) {
                setFailedHoverSrcs(prev => new Set(prev).add(hoverSrc));
              }
            }}
          />
        );
      })}
    </>
  );
} 