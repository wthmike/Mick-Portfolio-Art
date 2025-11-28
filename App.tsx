import React, { Suspense, useState, useEffect, useRef, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Html } from '@react-three/drei';
import Experience from './components/Experience';

// --- COMPONENTS ---

// 1. Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // If a fallback UI is provided, render it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Visible Error UI
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

  return (
    <div style={{ width: '100%', height: '100dvh', position: 'relative', backgroundColor: '#050505' }}>
      <CustomCursor text={cursorText} />
      
      <Canvas 
        shadows="soft"
        dpr={[1, 1.5]}
        camera={{ position: [0, 10, 14], fov: 35 }}
        style={{ width: '100%', height: '100%', background: '#050505' }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false 
        }}
      >
        <ErrorBoundary fallback={null}>
           {/* Wrap everything in Suspense with an HTML fallback so we see *something* while textures load */}
           <Suspense fallback={<Html center><div className="text-white font-mono text-sm tracking-widest animate-pulse">LOADING 3D ASSETS...</div></Html>}>
              <Experience setCursorText={setCursorText} />
           </Suspense>
        </ErrorBoundary>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#050505', zIndex: 99999 }}
        innerStyles={{ width: '200px', height: '2px', background: '#333' }}
        barStyles={{ height: '2px', background: '#fff' }}
        dataStyles={{ fontSize: '10px', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#666' }}
        dataInterpolation={(p) => `Loading Gallery ${p.toFixed(0)}%`}
      />
      
      <div className="absolute bottom-8 left-0 w-full text-center text-gray-500 text-xs tracking-widest pointer-events-none opacity-50 mix-blend-difference z-10">
        SCROLL TO EXPLORE
      </div>
    </div>
  );
};

export default App;