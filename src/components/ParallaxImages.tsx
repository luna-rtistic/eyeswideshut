"use client";
import { useEffect, useState } from "react";

export default function ParallaxImages({ progress }: { progress: number }) {
  const imageUrls = [
    "/img_1-1.gif", "/img_2-1.png", "/img_3-1.png", "/img_4-1.png", "/img_5-1.png", "/img_6-1.png", "/img_7-1.png", "/img_8-1.png", "/img_9-1.png", "/img_10-1.png", "/img_11-1.gif", "/img_12-1.png", "/img_13-1.png", "/img_14-1.gif", "/img_15-1.png", "/img_16-1.png", "/img_17-1.png", "/img_18-1.gif", "/img_19-1.png", "/img_20-1.png", "/img_21-1.png", "/img_22-1.png", "/img_23-1.png", "/img_24-1.png", "/img_25-1.png", "/img_26-1.png", "/img_27-1.png", "/img_28-1.png", "/img_29-1.png", "/img_30-1.png"
  ];
  const [imageConfigs, setImageConfigs] = useState<any[]>([]);

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
        // 크기 1.3배 (기존 6~10vw → 7.8~13vw)
        const size = (Math.random() * 4 + 6) * 1.3;
        // 격자 분포
        const col = i % cols;
        const row = Math.floor(i / cols);
        // x/y를 격자에 랜덤 오프셋 추가
        const x = 2 + col * (96 - size) / (cols - 1) + Math.random() * 2;
        const yStart = 90 + row * 8 + Math.random() * 4;
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
        else if (localProgress < 0.1) opacity = localProgress / 0.1;
        else if (localProgress > 0.9) opacity = 1 - Math.min(1, (localProgress - 0.9) / 0.1);
        else opacity = 1;
        if (opacity <= 0) return null;
        return (
          <img
            key={img.url + i}
            src={img.url}
            style={{
              position: "fixed",
              left: `${img.x}vw`,
              top: 0,
              transform: `translateY(${y}vh)`,
              width: `${img.size}vw`,
              opacity,
              zIndex: 10,
              pointerEvents: "none"
            }}
            alt=""
          />
        );
      })}
    </>
  );
} 