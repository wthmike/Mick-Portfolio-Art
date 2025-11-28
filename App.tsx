import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';

const CustomCursor = ({ text }: { text: string }) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Use translate3d for better performance
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 pointer-events-none z-[100] will-change-transform"
      style={{ transform: 'translate3d(0,0,0) translate(-50%, -50%)' }} // Initial state
    >
      <div 
        className={`flex items-center justify-center rounded-full bg-white text-black transition-all duration-300 ease-out overflow-hidden ${
          text ? 'w-32 h-32 opacity-100' : 'w-0 h-0 opacity-0'
        }`}
      >
        <span 
          className="whitespace-nowrap italic text-lg tracking-wide"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [cursorText, setCursorText] = useState('');

  return (
    <div style={{ width: '100%', height: '100dvh', position: 'relative', backgroundColor: '#050505' }}>
      <CustomCursor text={cursorText} />
      
      <Canvas 
        shadows 
        dpr={[1, 2]}
        // Updated initial position to match SceneContent START_POS
        camera={{ position: [0, 10, 11], fov: 35 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Experience setCursorText={setCursorText} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-8 left-0 w-full text-center text-gray-500 text-xs tracking-widest pointer-events-none opacity-50 mix-blend-difference">
        SCROLL TO EXPLORE
      </div>
    </div>
  );
};

export default App;