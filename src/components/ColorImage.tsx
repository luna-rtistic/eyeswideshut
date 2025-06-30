import Image from "next/image";
import { motion, MotionValue } from "framer-motion";

interface ColorImageProps {
  opacity: MotionValue<number>;
  src: string;
  filter?: MotionValue<string>;
}

export default function ColorImage({ opacity, src, filter }: ColorImageProps) {
  return (
    <motion.div
      style={filter ? { opacity, filter } : { opacity }}
      className="absolute inset-0 w-full h-full flex items-center justify-center"
    >
      <div className="relative w-[60vmin] aspect-[759/600]">
        <Image
          src={src}
          alt="Abstract colorful image"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
    </motion.div>
  );
} 