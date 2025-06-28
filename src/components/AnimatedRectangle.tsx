"use client";

import { motion, MotionValue } from 'framer-motion';
import Image from 'next/image';

// Generate some abstract avatar URLs from DiceBear for the grid
const imageIds = Array.from({ length: 42 }, (_, i) => i + 1);
const imageUrls = imageIds.map(
  (id) => `https://api.dicebear.com/8.x/shapes/svg?seed=${id}`
);

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
          {imageUrls.map((url, index) => (
            <div key={index} className="aspect-square relative">
              <Image
                src={url}
                alt={`Abstract shape ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedRectangle; 