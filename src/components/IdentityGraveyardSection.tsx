"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

const tombstoneImage = "https://images.unsplash.com/photo-1558501121-a08496434493?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const avatars = [
  "John", "Jane", "Alex", "Sam", "Chris", 
  "Pat", "Taylor", "Morgan", "Jordan", "Casey"
];

interface IdentityGraveyardSectionProps {
  scrollYProgress: MotionValue<number>;
}

const IdentityGraveyardSection = ({ scrollYProgress }: IdentityGraveyardSectionProps) => {
  const textOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-30%', '100%']);

  return (
    <motion.section
      className="absolute inset-0 h-screen w-full"
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Falling Avatars */}
        {avatars.map((seed, i) => {
          const start = i / avatars.length;
          const end = start + (1 / avatars.length) * 5;
          const y = useTransform(scrollYProgress, [start, end], ["0%", "100%"]);
          const opacity = useTransform(scrollYProgress, [end - 0.05, end], [1, 0]);
          const x = `${(i % 5) * 20 + 5}%`; // Distribute avatars horizontally

          return (
            <motion.div
              key={seed}
              style={{ y, opacity, x }}
              className="absolute top-[-10%] w-16 h-16"
            >
              <Image
                src={`https://api.dicebear.com/9.x/pixel-art-neutral/svg?seed=${seed}`}
                alt={`Avatar of ${seed}`}
                width={64}
                height={64}
                className="rounded-full"
              />
            </motion.div>
          );
        })}

        {/* Tombstones */}
        <div className="absolute bottom-0 left-0 w-full h-1/4">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${tombstoneImage})`,
              backgroundSize: '150px 150px',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'bottom center',
              maskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Final Text */}
        <motion.div
          style={{ y: parallaxY, opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <h2 className="text-6xl md:text-8xl text-gray-800 font-bold font-mono">
            what&apos;s missing?
          </h2>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default IdentityGraveyardSection; 