"use client";

import { useRef, useLayoutEffect } from "react";
import { motion, MotionValue } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot" | "system";
  time?: string;
}

const messages: Message[] = [
  { id: 1, text: "what kind of stuff's on your feed lately?", time: "13:02", sender: "user" },
  { id: 2, text: "idk, everything looks the same. kinda aggressive, clicky stuff.", time: "13:03", sender: "bot" },
  { id: 3, text: "really? mine's totally different. you used to hate that kind of content", time: "13:03", sender: "user" },
  { id: 4, text: "i did. but i keep seeing it. then i just watch it.", time: "13:04", sender: "bot" },
  { id: 5, text: "feels like you're turning into someone else lately lol", time: "13:04", sender: "user" },
  { id: 6, text: "maybe. or i'm just seeing what they want me to see.", time: "13:05", sender: "bot" },
  { id: 7, text: "yeah. that algorithm thing again huh", time: "13:05", sender: "user" },
  { id: 8, text: "it's weird though. i don't even click and it still shows up.", time: "13:06", sender: "bot" },
  { id: 9, text: "so it's not really a choice. just a loop.", time: "13:06", sender: "user" },
  { id: 10, text: "yesterday i mentioned a brand out loud and boom—ad for it", time: "13:07", sender: "bot" },
  { id: 11, text: "lol same happened to me. and we're not even surprised anymore", time: "13:07", sender: "user" },
  { id: 12, text: "we got too used to being watched", time: "13:08", sender: "bot" },
  { id: 13, text: "yeah. and we call it convenience now.", time: "13:08", sender: "user" },
  { id: 14, text: "thing is, sometimes it feels comforting. like it knows me.", time: "13:09", sender: "bot" },
  { id: 15, text: "or pretends to know you. that's even creepier", time: "13:09", sender: "user" },
  { id: 16, text: "it's like i don't have to think anymore", time: "13:10", sender: "bot" },
  { id: 17, text: "same. i just scroll, react, forget", time: "13:10", sender: "user" },
  { id: 18, text: "the data version of me feels more consistent than me", time: "13:11", sender: "bot" },
  { id: 19, text: "but that's not you. it's just a pattern", time: "13:11", sender: "user" },
  { id: 20, text: "(silence)", sender: "system" },
  { id: 21, text: "you think this convo's being logged too?", time: "13:14", sender: "user" },
  { id: 22, text: "probably. maybe it already knows what we'll say next.", time: "13:15", sender: "bot" },
];

interface ChatLogProps {
  y: MotionValue<any>;
  opacity: MotionValue<number>;
  contentY: MotionValue<any>;
  onHeightReady: (height: number) => void;
}

const ChatLog = ({ y, opacity, contentY, onHeightReady }: ChatLogProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messagesContainerRef.current && viewportRef.current) {
      const contentHeight = messagesContainerRef.current.scrollHeight;
      const viewportHeight = viewportRef.current.clientHeight;
      const scrollDistance = Math.max(0, contentHeight - viewportHeight);
      onHeightReady(scrollDistance);
    }
  }, [onHeightReady]);

  return (
    <motion.div style={{ y, opacity }} className="absolute">
      <div className="w-[1000px] h-[90vh] bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 font-mono text-xl text-green-400 flex flex-col overflow-hidden border border-green-500/20">
        <div className="flex-shrink-0 p-2 bg-gray-800/50 flex items-center rounded-t-lg">
          <div className="flex space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
          </div>
          <span className="flex-grow text-center text-gray-400 text-sm font-light">Message</span>
        </div>
        <div
          ref={viewportRef}
          className="mt-4 flex-grow overflow-y-auto pr-2"
          style={{
            maskImage: "linear-gradient(to bottom, black 95%, transparent 100%)",
          }}
        >
          <motion.div ref={messagesContainerRef} style={{ y: contentY }} className="flex flex-col space-y-10">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              const isSystem = msg.sender === "system";

              const bubble = (
                <div
                  className={
                    isSystem
                      ? "font-mono text-gray-400 text-base italic tracking-tight"
                      : `max-w-full rounded-2xl px-6 py-3 font-mono text-lg tracking-tight ${
                          isUser
                            ? "text-black rounded-br-none"
                            : "bg-gradient-to-br from-white via-gray-50 to-gray-100 text-black rounded-bl-none"
                        }`
                  }
                  style={{
                    boxShadow: isSystem 
                      ? 'none'
                      : isUser 
                        ? '0 0 8px rgba(51, 255, 0, 0.3)' 
                        : '0 0 8px rgba(255, 255, 255, 0.2)',
                    background: isUser 
                      ? 'linear-gradient(to bottom right, #33FF00, #2ECC71, #33FF00)' 
                      : undefined
                  }}
                >
                  {msg.text}
                </div>
              );

              const timestamp = msg.time && (
                <span className="text-xs text-gray-500 self-end mx-3">
                  {msg.time}
                </span>
              );

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex w-full justify-center">
                    {bubble}
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end max-w-[65%] ${
                    isUser ? "self-end justify-end" : "self-start justify-start"
                  }`}
                >
                  {isUser ? (
                    <>
                      {timestamp}
                      {bubble}
                    </>
                  ) : (
                    <>
                      {bubble}
                      {timestamp}
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Chat Input Footer */}
        <div className="flex-shrink-0 p-3 border-t border-gray-700/50 flex items-center space-x-3 bg-black/50">
          <input
            type="text"
            placeholder="Enter message..."
            className="flex-grow bg-gray-900/70 rounded-md px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-transparent focus:border-green-500/50 transition-all text-sm font-light"
            disabled
          />
          <button className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50" disabled>
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatLog;