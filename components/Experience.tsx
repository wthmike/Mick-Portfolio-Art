import React from 'react';
import { ScrollControls, Scroll } from '@react-three/drei';
import SceneContent from './SceneContent';

interface ExperienceProps {
  setCursorText: (text: string) => void;
}

const Experience: React.FC<ExperienceProps> = ({ setCursorText }) => {
  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* 
        pages=5 gives us a 500vh long scroll container.
        damping=0.2 makes the scroll smooth.
      */}
      <ScrollControls pages={5} damping={0.2}>
        {/* The 3D Scene (Camera logic is handled inside here) */}
        <SceneContent setCursorText={setCursorText} />

        {/* 
          HTML Content that scrolls alongside the 3D world.
          We keep the sections to maintain scroll length/areas, but remove the text.
          CRITICAL: pointer-events-none ensures we can hover the 3D objects through the HTML layers.
        */}
        <Scroll html style={{ width: '100%', pointerEvents: 'none' }}>
          {/* BLOCK 1: Top Section - Empty */}
          <section className="h-[100vh] w-full pointer-events-none">
          </section>

          {/* BLOCK 2: Spacer */}
          <section className="h-[300vh] w-full pointer-events-none"></section>

          {/* BLOCK 3: Bottom Section - Empty */}
          <section className="h-[100vh] w-full pointer-events-none">
          </section>
        </Scroll>
      </ScrollControls>
    </>
  );
};

export default Experience;