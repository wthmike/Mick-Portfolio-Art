import React, { Suspense, useState, useEffect, useRef, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Html } from '@react-three/drei';
import Experience from './components/Experience';

// --- COMPONENTS ---

// 1. Error Boundary
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // Use Html to render the error UI inside the 3D Canvas context
      return (
        <Html center>
          <div className="w-[90vw] max-w-md p-6 bg-[#050505] border border-red-900/50 rounded-lg text-red-500 text-center font-mono shadow-2xl z-[99999]">
            <h2 className="text-lg font-bold mb-3 tracking-wide">GALLERY ERROR</h2>
            <p className="text-xs opacity-70 break-words mb-6 leading-relaxed">
              {this.state.error?.message || "Failed to load gallery assets."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-full text-xs font-bold uppercase tracking-widest transition-colors duration-200"
            >
              Reload
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
      
      {/* 
        The Canvas itself renders immediately. 
        Suspense is placed INSIDE to handle the async SceneContent.
        Loader is placed OUTSIDE to show progress.
      */}
      <Canvas 
        shadows 
        dpr={[1, 2]}
        camera={{ position: [0, 10, 11], fov: 35 }}
        style={{ width: '100%', height: '100%', background: '#050505' }}
        gl={{ antialias: true, alpha: false }} // alpha: false helps with performance and black backgrounds
      >
        <ErrorBoundary>
           <Suspense fallback={null}>
              <Experience setCursorText={setCursorText} />
           </Suspense>
        </ErrorBoundary>
      </Canvas>
      
      {/* 
        Drei Loader: Automatically hooks into the loading manager.
        Shows up whenever textures/models are loading.
      */}
      <Loader 
        containerStyles={{ background: '#050505' }}
        innerStyles={{ width: '200px', height: '2px', background: '#333' }}
        barStyles={{ height: '2px', background: '#fff' }}
        dataStyles={{ fontSize: '10px', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.2em' }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
      />
      
      <div className="absolute bottom-8 left-0 w-full text-center text-gray-500 text-xs tracking-widest pointer-events-none opacity-50 mix-blend-difference z-10">
        SCROLL TO EXPLORE
      </div>
    </div>
  );
};

export default App;