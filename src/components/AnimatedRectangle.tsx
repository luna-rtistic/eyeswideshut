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
  // 모든 hover 상태를 하나의 배열로 관리
  const [hoveredIndexes, setHoveredIndexes] = useState(Array(42).fill(false));

  const handleMouseEnter = (index: number) => {
    setHoveredIndexes(prev => prev.map((v, i) => i === index ? true : v));
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndexes(prev => prev.map((v, i) => i === index ? false : v));
  };

  return (
    <motion.div style={{ y, opacity }} className="absolute z-[200]">
      <motion.div style={{ scale }} className="h-[600px] w-[300px] origin-center overflow-hidden rounded-lg backdrop-blur-md bg-white/20 border border-white/30 shadow-lg">
        <motion.div
          className="p-4"
          style={enableInnerScroll ? { y: -innerScroll } : { y: contentY }}
        >
          {/* 1~7번째(0~6) 3열 그리드 */}
          <div className="grid grid-cols-3 gap-4">
            {imageUrls.slice(0, 7).map((url, index) => {
              // img_1-1: hover 효과 없이 gif만 단독 렌더링
              if (index === 0) {
                return (
                  <div
                    key={index}
                    className="aspect-square relative"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                  >
                    <img
                      src="/img_1-1.gif"
                      alt="Grid image 1"
                      className="object-cover w-full h-full absolute inset-0"
                    />
                  </div>
                );
              }
              if (index === 5) {
                // img_6: row-span-2으로 세로 직사각형 (1px 더 짧게)
                const baseUrl = `/img_${index + 1}-1.png`;
                const hoverUrl = `/img_${index + 1}-2.png`;
                const isHovered = hoveredIndexes[index];
                return (
                  <div
                    key={index}
                    className="relative row-span-2 aspect-[1/2.34]"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 6) {
                // img_7: col-span-2로 가로 직사각형
                const baseUrl = `/img_${index + 1}-1.png`;
                const hoverUrl = `/img_${index + 1}-2.png`;
                const isHovered = hoveredIndexes[index];
                return (
                  <div
                    key={index}
                    className="relative col-span-2 aspect-[2/1]"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              // 나머지는 기존대로
              const baseUrl = `/img_${index + 1}-1.png`;
              const hoverUrl = `/img_${index + 1}-2.png`;
              const isHovered = hoveredIndexes[index];
              return (
                <div
                  key={index}
                  className="aspect-square relative"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <img
                    src={baseUrl}
                    alt={`Grid image ${index + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                  />
                  <img
                    src={hoverUrl}
                    alt={`Grid image hover ${index + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                  />
                </div>
              );
            })}
          </div>
          {/* 8,9번째(7,8)만 2열 그리드 */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {imageUrls.slice(7, 9).map((url, idx) => {
              const index = idx + 7;
              const baseUrl = `/img_${index + 1}-1.png`;
              const hoverUrl = `/img_${index + 1}-2.png`;
              const isHovered = hoveredIndexes[index];
              return (
                <div
                  key={index}
                  className="relative aspect-[3/2]"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <img
                    src={baseUrl}
                    alt={`Grid image ${index + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                  />
                  <img
                    src={hoverUrl}
                    alt={`Grid image hover ${index + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                  />
                </div>
              );
            })}
          </div>
          {/* 10번째(9)부터 28번째(27)까지 3열 그리드 */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {imageUrls.slice(9, 28).map((url, idx) => {
              const index = idx + 9;
              const baseUrl = `/img_${index + 1}-1.png`;
              const hoverUrl = `/img_${index + 1}-2.png`;
              const isHovered = hoveredIndexes[index];
              if (index === 9) {
                // img_10-1: 왼쪽 위 크게 (2x2)
                return (
                  <div
                    key={index}
                    className="relative col-span-2 row-span-2 aspect-square col-start-1 row-start-1"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 10) {
                // img_11-1: 오른쪽 위
                return (
                  <div
                    key={index}
                    className="aspect-square relative col-start-3 row-start-1"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                  >
                    <img
                      src="/img_11-1.gif"
                      alt="Grid image 11"
                      className="object-cover w-full h-full absolute inset-0"
                    />
                  </div>
                );
              }
              if (index === 11) {
                // img_12-1: 오른쪽 두번째 줄
                return (
                  <div
                    key={index}
                    className="aspect-square relative col-start-3 row-start-2"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 12) {
                // img_13-1: 아래 왼쪽
                return (
                  <div
                    key={index}
                    className="aspect-square relative col-start-1 row-start-3"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 13) {
                // img_14-1: 아래 왼쪽 두번째 줄
                return (
                  <div
                    key={index}
                    className="aspect-square relative col-start-1 row-start-4"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                  >
                    <img
                      src="/img_14-1.gif"
                      alt="Grid image 14"
                      className="object-cover w-full h-full absolute inset-0"
                    />
                  </div>
                );
              }
              if (index === 14) {
                // img_15-1: 아래 오른쪽 크게 (2x2)
                return (
                  <div
                    key={index}
                    className="relative col-span-2 row-span-2 aspect-square col-start-2 row-start-3"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 17) {
                // img_18-1: hover 효과 없이 gif만 단독 렌더링, 좌측 정렬
                return (
                  <div
                    key={index}
                    className="aspect-square relative"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                  >
                    <img
                      src="/img_18-1.gif"
                      alt="Grid image 18"
                      className="object-cover object-left w-full h-full absolute inset-0"
                    />
                  </div>
                );
              }
              if (index === 18) {
                // img_19-1: 가로 2칸 차지
                return (
                  <div
                    key={index}
                    className="relative col-span-2 aspect-[2/1]"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 21) {
                // img_22-1: 가로 2칸 차지
                return (
                  <div
                    key={index}
                    className="relative col-span-2 aspect-[2/1]"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 25) {
                // img_26-1: 아래쪽 크게 (2x2)
                return (
                  <div
                    key={index}
                    className="relative col-span-2 row-span-2 aspect-square col-start-1 row-start-5"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 26) {
                // img_27-1: 오른쪽 다섯 번째 줄
                return (
                  <div
                    key={index}
                    className="aspect-square relative col-start-3 row-start-5"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              if (index === 27) {
                // img_28-1: 오른쪽 여섯 번째 줄
                return (
                  <div
                    key={index}
                    className="aspect-square relative col-start-3 row-start-6"
                    style={{ pointerEvents: 'auto', zIndex: 50 }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <img
                      src={baseUrl}
                      alt={`Grid image ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                    />
                    <img
                      src={hoverUrl}
                      alt={`Grid image hover ${index + 1}`}
                      className="object-cover w-full h-full absolute inset-0"
                      style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="aspect-square relative"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <img
                    src={baseUrl}
                    alt={`Grid image ${index + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                  />
                  <img
                    src={hoverUrl}
                    alt={`Grid image hover ${index + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                  />
                </div>
              );
            })}
          </div>
          {/* 29, 30번째(28, 29)만 2열 그리드로 가로 직사각형 */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {imageUrls.slice(28, 30).map((url, idx) => {
              const index = idx + 28;
              const baseUrl = `/img_${index + 1}-1.png`;
              const hoverUrl = `/img_${index + 1}-2.png`;
              const isHovered = hoveredIndexes[index];
              return (
                <div
                  key={index}
                  className="relative aspect-[3/2]"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <img
                    src={baseUrl}
                    alt={`Grid image ${index + 1}`}
                    className="object-contain w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}
                  />
                  <img
                    src={hoverUrl}
                    alt={`Grid image hover ${index + 1}`}
                    className="object-contain w-full h-full absolute inset-0"
                    style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedRectangle; 