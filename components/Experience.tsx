import React from 'react';
import SceneContent from './SceneContent';

interface ExperienceProps {
  setCursorText: (text: string) => void;
  trackRef: React.RefObject<HTMLDivElement>;
}

const Experience: React.FC<ExperienceProps> = ({ setCursorText, trackRef }) => {
  return (
    <>
      <color attach="background" args={['#050505']} />
      {/* 
        We pass the trackRef down to SceneContent so it can calculate 
        animation progress based on the main track's position in the DOM.
      */}
      <SceneContent setCursorText={setCursorText} trackRef={trackRef} />
    </>
  );
};

export default Experience;