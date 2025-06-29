"use client";
import { useEffect, useRef } from "react";

interface Props {
  progress: number; // 0~1 (하얀 네모 등장~사라짐 구간의 scrollYProgress)
  fadeIn: number;   // fadeIn 끝나는 progress (ex: 0.1)
  fadeOut: number;  // fadeOut 시작하는 progress (ex: 0.9)
  fadeOutEnd: number; // fadeOut 끝나는 progress (ex: 1.0)
  duration?: number; // 비디오 길이(초)
}

function getOpacity(progress: number, fadeIn: number, fadeOut: number, fadeOutEnd: number) {
  if (progress < fadeIn) return progress / fadeIn;
  if (progress >= fadeOut && progress < fadeOutEnd) return 1 - (progress - fadeOut) / (fadeOutEnd - fadeOut);
  if (progress >= fadeOutEnd) return 0;
  return 1;
}

export default function ScrollVideoBackground({ progress, fadeIn, fadeOut, fadeOutEnd, duration = 10 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 비디오 프레임을 스크롤에 맞춰 동기화
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, progress * duration));
    }
  }, [progress, duration]);

  const opacity = getOpacity(progress, fadeIn, fadeOut, fadeOutEnd);
  console.log('video opacity', opacity, progress, fadeIn, fadeOut, fadeOutEnd);

  // fadeOutEnd 이후에는 완전히 사라지도록 더 엄격한 조건 추가
  if (opacity < 0.01 || progress >= fadeOutEnd) return null;

  return (
    <video
      ref={videoRef}
      src="/video.mp4"
      className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      style={{ opacity }}
      muted
      playsInline
      preload="auto"
    />
  );
} 