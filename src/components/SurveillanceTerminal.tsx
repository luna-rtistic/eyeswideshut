"use client";

import { useState, useEffect, useRef } from 'react';

// Helper function to parse the User Agent string
const parseUserAgent = (ua: string) => {
  let os = 'UNKNOWN';
  let browser = 'UNKNOWN';

  // OS Detection
  if (ua.includes('Win')) os = 'Windows';
  if (ua.includes('Mac')) os = 'macOS';
  if (ua.includes('Linux')) os = 'Linux';
  if (ua.includes('Android')) os = 'Android';
  if (ua.includes('like Mac')) os = 'iOS';

  // Browser Detection
  const chromeMatch = ua.match(/Chrome\/([0-9.]+)/);
  const firefoxMatch = ua.match(/Firefox\/([0-9.]+)/);
  const safariMatch = ua.match(/Version\/([0-9.]+).*Safari/);

  if (chromeMatch) browser = `Chrome ${chromeMatch[1]}`;
  else if (firefoxMatch) browser = `Firefox ${firefoxMatch[1]}`;
  else if (safariMatch) browser = `Safari ${safariMatch[1]}`;

  return { os, browser };
};

const SurveillanceTerminal = () => {
  // State for the full data lines (fetched once)
  const [allLines, setAllLines] = useState<Array<{ label: string; value: string }>>([]);
  // State for the lines currently being displayed with the typing effect
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  // State to track the current line and character being typed
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  // State to track animation completion
  const [isComplete, setIsComplete] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Effect for data fetching (runs once)
  useEffect(() => {
    // This effect is largely the same, but it now populates `allLines`
    // to trigger the animation effect.
    const collectedData: { [key: string]: string } = {};
    const dataPoints = [
      'language', 'resolution', 'os', 'browser', 'location', 
      'time', 'cameras', 'mic', 'dpi', 'ip'
    ];
    let fetchedCount = 0;

    const finalize = () => {
      // Check if all async data has been fetched
      if (fetchedCount < 4) return; // 4 async sources: location, time, devices, ip

      const successfulDetections = Object.values(collectedData).filter(
        (val) => val && !val.includes('DETECTING') && !val.includes('UNKNOWN')
      ).length;

      const finalLines = [
        { label: "YOU SPEAK:", value: collectedData.language || 'UNKNOWN' },
        { label: "YOU SEE THROUGH:", value: collectedData.resolution || 'UNKNOWN' },
        { label: "YOU THINK IN:", value: collectedData.os || 'UNKNOWN' },
        { label: "YOU MOVE WITH:", value: collectedData.browser || 'UNKNOWN' },
        { label: "YOU ARRIVE FROM:", value: collectedData.location || 'UNKNOWN' },
        { label: "YOUR TIME:", value: collectedData.time || 'UNKNOWN' },
        { label: "CAMERA:", value: collectedData.cameras || 'UNKNOWN' },
        { label: "MIC:", value: collectedData.mic || 'UNKNOWN' },
        { label: "DPI:", value: collectedData.dpi || 'UNKNOWN' },
        { label: "TRACKABLE:", value: successfulDetections >= 6 ? 'YES' : 'NO' },
        { label: "WELCOME, SUBJECT", value: collectedData.ip || 'UNKNOWN' },
      ];
      setAllLines(finalLines);
    };
    
    // Synchronous data
    collectedData.language = navigator.languages ? navigator.languages.join(', ') : navigator.language;
    const updateResolution = () => (collectedData.resolution = `${window.innerWidth}x${window.innerHeight} pixels`);
    updateResolution();
    window.addEventListener('resize', updateResolution);
    const { os, browser } = parseUserAgent(navigator.userAgent);
    collectedData.os = os;
    collectedData.browser = browser;
    collectedData.dpi = window.devicePixelRatio > 1 ? 'HIGH ENOUGH TO BE WATCHED' : 'LOW';

    // Asynchronous data
    fetch('https://ipapi.co/json/').then(res => res.json())
      .then(ipData => (collectedData.location = `${ipData.city || 'Unknown'}, ${ipData.country_name || 'Unknown'}`))
      .catch(() => (collectedData.location = 'UNKNOWN'))
      .finally(() => { fetchedCount++; finalize(); });

    fetch('https://api.ipify.org?format=json').then(res => res.json())
      .then(ipData => (collectedData.ip = ipData.ip))
      .catch(() => (collectedData.ip = 'UNKNOWN'))
      .finally(() => { fetchedCount++; finalize(); });

    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        collectedData.cameras = `${devices.filter(d => d.kind === 'videoinput').length} EYE(S)`;
        collectedData.mic = devices.filter(d => d.kind === 'audioinput').length > 0 ? 'LISTENING' : 'NOT DETECTED';
      }).catch(() => {
        collectedData.cameras = 'PERMISSION DENIED';
        collectedData.mic = 'PERMISSION DENIED';
      }).finally(() => { fetchedCount++; finalize(); });
    
    const timeInterval = setInterval(() => {
        const now = new Date();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        collectedData.time = `${now.toLocaleString('en-US')} (${timeZone})`;
    }, 1000);
    
    // Set initial time and mark as fetched
    collectedData.time = `${new Date().toLocaleString('en-US')} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
    fetchedCount++;
    finalize(); // Initial call to finalize

    return () => {
      window.removeEventListener('resize', updateResolution);
      clearInterval(timeInterval);
    };
  }, []);

  // Effect for the typing animation
  useEffect(() => {
    if (isComplete || allLines.length === 0) return;

    // Add a guard to prevent out-of-bounds access
    if (currentLineIndex >= allLines.length) {
      setIsComplete(true);
      return;
    }

    const lineToType = allLines[currentLineIndex];
    const fullText = `${lineToType.label.padEnd(20, ' ')}${lineToType.value}`;

    const typingTimer = setTimeout(() => {
      if (currentCharIndex < fullText.length) {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = fullText.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      } else {
        // Line finished, move to the next line
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }, 13); // Typing speed in ms

    return () => clearTimeout(typingTimer);
  }, [allLines, displayedLines, currentLineIndex, currentCharIndex, isComplete]);

  // Effect to measure width after animation completes
  useEffect(() => {
    if (isComplete && textContainerRef.current) {
      const width = textContainerRef.current.offsetWidth;
      setContainerWidth(width);
    }
  }, [isComplete]);

  return (
    <div className="font-mono py-4 px-6 flex flex-col items-center" style={{ fontSize: '2.025rem', lineHeight: '1.6', color: '#00FF2F' }}>
      <div ref={textContainerRef} className="inline-block">
        <p className="mb-4">&gt; EXECUTING SURVEILLANCE PROTOCOL...</p>
        {displayedLines.map((text, index) => (
          <p key={index}>
            {text}
            {index === currentLineIndex && !isComplete && <span className="animate-pulse">_</span>}
          </p>
        ))}
        {isComplete && (
          <>
            <p className="mt-4 animate-pulse">&gt; CONNECTION ESTABLISHED. MONITORING...</p>
            <p>&nbsp;</p>
            <p className="mt-4">
              COOKIES? [ <span className="inline-block hover:opacity-0 transition-opacity duration-300"><span className="glitch animate-flicker-glitch" data-text="N">N</span></span> / Y ]
            </p>
          </>
        )}
      </div>

    </div>
  );
};

export default SurveillanceTerminal; 