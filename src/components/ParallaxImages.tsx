"use client";
import { useEffect, useState } from "react";

export default function ParallaxImages({ progress }: { progress: number }) {
  const imageUrls = [
    "/img_1-1.gif", "/img_2-1.png", "/img_3-1.png", "/img_4-1.png", "/img_5-1.png", "/img_6-1.png", "/img_7-1.png", "/img_8-1.png", "/img_9-1.png", "/img_10-1.png", "/img_11-1.gif", "/img_12-1.png", "/img_13-1.png", "/img_14-1.gif", "/img_15-1.png", "/img_16-1.png", "/img_17-1.png", "/img_18-1.gif", "/img_19-1.png", "/img_20-1.png", "/img_21-1.png", "/img_22-1.png", "/img_23-1.png", "/img_24-1.png", "/img_25-1.png", "/img_26-1.png", "/img_27-1.png", "/img_28-1.png", "/img_29-1.png", "/img_30-1.png"
  ];
  const [imageConfigs, setImageConfigs] = useState<any[]>([]);

  useEffect(() => {
    setImageConfigs(
      imageUrls.slice(0, 24).map((url, i) => {
        const N = 24;
        const maxDelay = 0.7857; // scrollYProgress 0.19에서 마지막 이미지 등장
        const delay = i * (maxDelay / (N - 1)) + Math.random() * 0.01;
        // 더 빠르게 화면에서 사라지게
        const speed = 0.08 + Math.random() * 0.4 + delay * 0.5;
        // 이미지 크기 줄이기 (6~10vw)
        const size = Math.random() * 4 + 6;
        // x 좌표 완전 랜덤
        const x = 2 + Math.random() * (96 - size);
        // y 좌표 더 흩뿌리기 (더 위로)
        const yStart = 90 + Math.random() * 40;
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