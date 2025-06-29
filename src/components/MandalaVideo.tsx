"use client";

import { motion, MotionValue } from "framer-motion";

interface MandalaVideoProps {
  opacity: MotionValue<number>;
  bgScale: MotionValue<number>;
}

export default function MandalaVideo({ opacity, bgScale }: MandalaVideoProps) {
  return (
    <motion.div
      style={{ opacity, scale: 1.0 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center"
    >
      {/* Blurred background mandala video with infinite slow rotation */}
      <motion.video
        src="/mandala.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'blur(15px) brightness(0.4)',
          scale: bgScale,
          zIndex: 0
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
      />
      
      {/* Main mandala video as overlay with screen blend and soft edge mask, rotating counter-clockwise */}
      <motion.video
        src="/mandala.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-[80%] h-[80%] object-contain relative z-10"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.8,
          WebkitMaskImage: 'radial-gradient(circle, white 70%, transparent 100%)',
          maskImage: 'radial-gradient(circle, white 70%, transparent 100%)'
        }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
      />
    </motion.div>
  );
} 