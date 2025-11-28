import React from 'react';
import SceneContent from './SceneContent';

interface ExperienceProps {
  setCursorText: (text: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Experience: React.FC<ExperienceProps> = ({ setCursorText, containerRef }) => {
  return (
    <>
      <color attach="background" args={['#050505']} />
      {/* 
        We no longer use ScrollControls. 
        The scroll logic is now handled by measuring the container's DOM position in SceneContent.
      */}
      <SceneContent setCursorText={setCursorText} containerRef={containerRef} />
    </>
  );
};

export default Experience;