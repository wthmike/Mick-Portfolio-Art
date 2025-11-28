import React, { Component, Suspense, useState, useEffect, useRef, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Html } from '@react-three/drei';
import Experience from './components/Experience';

// --- COMPONENTS ---

// 1. Error Boundary
interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <Html center>
          <div className="w-[300px] p-4 bg-red-900/90 text-white rounded text-center border border-red-500 font-mono text-xs z-[99999]">
            <p className="mb-2 font-bold">Rendering Error</p>
            <p className="opacity-70 mb-4">{this.state.error?.message || "Unknown error occurred"}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

// 2. Custom Cursor
const CustomCursor = ({ text }: { text: string }) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 pointer-events-none z-[100] will-change-transform mix-blend-difference"
      style={{ transform: 'translate3d(0,0,0) translate(-50%, -50%)' }}
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

// --- MAIN APP ---

const App: React.FC = () => {
  const [cursorText, setCursorText] = useState('');
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // Manual Pinning Logic
  // This replaces CSS position: sticky which can be flaky in nested Webflow structures or with overflow: hidden
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current || !canvasWrapperRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate when the track is active
      const isPastTop = rect.top <= 0;
      const isBeforeBottom = rect.bottom >= viewportHeight;

      if (isPastTop && isBeforeBottom) {
        // PINNED: The element is fully occupying the view
        canvasWrapperRef.current.style.position = 'fixed';
        canvasWrapperRef.current.style.top = '0';
        canvasWrapperRef.current.style.left = '0';
        canvasWrapperRef.current.style.width = '100%';
        canvasWrapperRef.current.style.height = '100%';
        canvasWrapperRef.current.style.bottom = 'auto';
        canvasWrapperRef.current.style.zIndex = '10'; // Ensure it sits on top if needed
      } else if (!isPastTop) {
        // BEFORE: The element is coming up
        canvasWrapperRef.current.style.position = 'absolute';
        canvasWrapperRef.current.style.top = '0';
        canvasWrapperRef.current.style.left = '0';
        canvasWrapperRef.current.style.width = '100%';
        canvasWrapperRef.current.style.height = '100vh'; // Explicit height
        canvasWrapperRef.current.style.bottom = 'auto';
        canvasWrapperRef.current.style.zIndex = 'auto';
      } else {
        // AFTER: The element has passed
        canvasWrapperRef.current.style.position = 'absolute';
        canvasWrapperRef.current.style.top = 'auto';
        canvasWrapperRef.current.style.left = '0';
        canvasWrapperRef.current.style.width = '100%';
        canvasWrapperRef.current.style.height = '100vh'; // Explicit height
        canvasWrapperRef.current.style.bottom = '0';
        canvasWrapperRef.current.style.zIndex = 'auto';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also listen to resize to handle viewport changes
    window.addEventListener('resize', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="w-full relative bg-[#050505]">
      <CustomCursor text={cursorText} />
      
      {/* 
        SCROLL TRACK (The Spacer)
        400vh gives enough room for a smooth animation.
        This element stays in the document flow and gives the page height.
      */}
      <div 
        ref={trackRef} 
        className="relative w-full"
        style={{ height: '400vh' }}
      >
        {/* 
          CANVAS WRAPPER
          This element gets manipulated by JS to switch between absolute and fixed positioning.
        */}
        <div ref={canvasWrapperRef} className="absolute top-0 left-0 w-full h-[100vh] overflow-hidden">
          <Canvas 
            dpr={[1, 1.5]}
            camera={{ position: [0, 10, 14], fov: 40 }}
            style={{ width: '100%', height: '100%', background: '#020202' }}
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: false 
            }}
            shadows={false} 
          >
            <ErrorBoundary fallback={null}>
               <Suspense fallback={<Html center><div className="text-white font-mono text-sm tracking-widest animate-pulse opacity-50">INITIALIZING</div></Html>}>
                  {/* Pass trackRef so the scene knows the global progress */}
                  <Experience setCursorText={setCursorText} trackRef={trackRef} />
               </Suspense>
            </ErrorBoundary>
          </Canvas>
          
          <div className="absolute bottom-8 left-0 w-full text-center text-gray-500 text-xs tracking-widest pointer-events-none opacity-30 mix-blend-difference z-10">
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>

      <Loader 
        containerStyles={{ background: '#020202', zIndex: 99999 }}
        innerStyles={{ width: '200px', height: '2px', background: '#333' }}
        barStyles={{ height: '2px', background: '#fff' }}
        dataStyles={{ fontSize: '10px', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#666' }}
        dataInterpolation={(p) => `Loading Gallery ${p.toFixed(0)}%`}
      />
    </div>
  );
};

export default App;