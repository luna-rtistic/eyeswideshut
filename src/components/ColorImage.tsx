import Image from "next/image";
import { motion, MotionValue } from "framer-motion";

interface ColorImageProps {
  opacity: MotionValue<number>;
  src: string;
}

export default function ColorImage({ opacity, src }: ColorImageProps) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 w-full h-full flex items-center justify-center"
    >
      <div className="relative w-[60%] h-[60%]">
        <Image
          src={src}
          alt="Abstract colorful image"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </motion.div>
  );
} 