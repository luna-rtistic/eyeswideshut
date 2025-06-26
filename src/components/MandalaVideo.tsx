"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface MandalaVideoProps {
  opacity: MotionValue<number>;
}

export default function MandalaVideo({ opacity }: MandalaVideoProps) {
  return (
    <motion.div
      style={{ opacity, scale: 1.0 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center"
    >
      <video
        src="/mandala.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-[80%] h-[80%] object-contain"
      />
    </motion.div>
  );
} 