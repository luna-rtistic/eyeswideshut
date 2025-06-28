"use client";

import { motion, MotionValue } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

// Generate local image URLs for the grid
const imageUrls = Array.from({ length: 42 }, (_, i) => `/img_${i + 1}-1.png`);

interface AnimatedRectangleProps {
  y: MotionValue<any>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  contentY: MotionValue<any>;
  enableInnerScroll?: boolean;
  innerScroll?: number;
}

const AnimatedRectangle = ({ y, scale, opacity, contentY, enableInnerScroll = false, innerScroll = 0 }: AnimatedRectangleProps) => {
  return (
    <motion.div style={{ y, opacity }} className="absolute z-10">
      <motion.div style={{ scale }} className="h-[600px] w-[300px] bg-white origin-center overflow-hidden rounded-lg">
        <motion.div
          className="p-4 grid grid-cols-3 gap-4"
          style={enableInnerScroll ? { y: -innerScroll } : { y: contentY }}
        >
          {imageUrls.map((url, index) => {
            const baseUrl = `/img_${index + 1}-1.png`;
            const hoverUrl = `/img_${index + 1}-2.png`;
            return (
              <motion.div
                key={index}
                className="aspect-square relative"
                style={{ pointerEvents: 'auto', zIndex: 50 }}
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={{
                  rest: { rotate: 0, scale: 1 },
                  hover: { rotate: [0, -8, 8, -8, 8, 0], scale: [1, 1.08, 0.96, 1.04, 0.98, 1], transition: { duration: 0.5 } }
                }}
              >
                <motion.img
                  src={baseUrl}
                  alt={`Grid image ${index + 1}`}
                  className="object-cover w-full h-full absolute inset-0"
                  variants={{
                    rest: { opacity: 1 },
                    hover: { opacity: 0 }
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.img
                  src={hoverUrl}
                  alt={`Grid image hover ${index + 1}`}
                  className="object-cover w-full h-full absolute inset-0"
                  variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1 }
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedRectangle; 