import React, { Suspense, useState, useEffect, useRef, ReactNode, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress, Html } from '@react-three/drei';
import Experience from './components/Experience';

// --- COMPONENTS ---

// 1. Loading Screen
function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] text-white z-50">
      <div className="w-48 h-[2px] bg-gray-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="font-mono text-xs tracking-widest opacity-50">
        LOADING GALLERY {progress.toFixed(0)}%
      </span>
    </div>
  );
}

// 2. Error Boundary
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // CRITICAL FIX: Wrap HTML content in <Html> when rendering inside Canvas
      return (
        <Html center>
          <div className="w-[80vw] max-w-md p-6 bg-[#111] border border-red-900/50 rounded-lg text-red-500 text-center font-mono shadow-2xl">
            <h2 className="text-lg font-bold mb-3 tracking-wide">ASSET LOAD ERROR</h2>
            <p className="text-xs opacity-70 break-words mb-6 leading-relaxed">
              {this.state.error?.message || "Unknown error occurred while loading 3D assets."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-800/50 rounded text-xs uppercase tracking-widest transition-colors duration-200"
            >
              Reload Experience
            </button>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

// 3. Custom Cursor
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

// --- MAIN APP ---

const App: React.FC = () => {
  const [cursorText, setCursorText] = useState('');

  return (
    <div style={{ width: '100%', height: '100dvh', position: 'relative', backgroundColor: '#050505' }}>
      <CustomCursor text={cursorText} />
      
      {/* 
        We use a simple HTML Loader here that sits on top of the Canvas.
        The Canvas itself will suspend until assets are ready.
      */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas 
          shadows 
          dpr={[1, 2]}
          // Updated initial position to match SceneContent START_POS
          camera={{ position: [0, 10, 11], fov: 35 }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* ErrorBoundary MUST use <Html> to render inside Canvas */}
          <ErrorBoundary>
            <Experience setCursorText={setCursorText} />
          </ErrorBoundary>
        </Canvas>
      </Suspense>
      
      <div className="absolute bottom-8 left-0 w-full text-center text-gray-500 text-xs tracking-widest pointer-events-none opacity-50 mix-blend-difference">
        SCROLL TO EXPLORE
      </div>
    </div>
  );
};

export default App;