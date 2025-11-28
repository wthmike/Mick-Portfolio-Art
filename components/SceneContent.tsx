import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Image, SpotLight, MeshReflectorMaterial, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// CAMERA CONFIGURATION
// Vertical elevator movement only (no zoom).
const START_POS = new THREE.Vector3(0, 8, 14);
const END_POS = new THREE.Vector3(0, 1.4, 14);

// LookAt Targets
const START_TARGET = new THREE.Vector3(0, 0, 0);
const END_TARGET = new THREE.Vector3(0, 1.4, 0);

interface SceneContentProps {
  setCursorText: (text: string) => void;
}

const Bench: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <RoundedBox args={[1.8, 0.4, 0.7]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </RoundedBox>
      {/* Legs */}
      <mesh position={[-0.7, -0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.5]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, -0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.5]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const Plinth = ({ position, artType, rotationY = 0 }: { position: [number, number, number], artType: 'gold' | 'glass' | 'stone', rotationY?: number }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base Pedestal */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 2.5, 0.7]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.2} />
      </mesh>
      
      {/* Artwork */}
      <group position={[0, 2.5, 0]}>
         {artType === 'gold' && (
            <mesh position={[0, 0.4, 0]} castShadow rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                <torusKnotGeometry args={[0.2, 0.06, 64, 8]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
            </mesh>
         )}
         {artType === 'glass' && (
            <mesh position={[0, 0.35, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
                <octahedronGeometry args={[0.35]} />
                <meshPhysicalMaterial 
                    color="white" 
                    transmission={1} 
                    thickness={1.5} 
                    roughness={0} 
                    ior={1.5}
                />
            </mesh>
         )}
         {artType === 'stone' && (
             <mesh position={[0, 0.35, 0]} castShadow>
                 <dodecahedronGeometry args={[0.35, 0]} />
                 <meshStandardMaterial color="#333" roughness={0.8} />
             </mesh>
         )}
      </group>

      {/* Dedicated spotlight for the art */}
      <SpotLight
        position={[0, 5, 0]}
        target-position={[0, 2.5, 0]}
        angle={0.25}
        penumbra={1}
        intensity={40}
        distance={8}
        castShadow
        color="white"
      />
    </group>
  );
}

const FramedArt = ({ position, rotation, url }: { position: [number, number, number], rotation: [number, number, number], url: string }) => {
    // Load texture for standard material so it reacts to light/shadow properly
    const texture = useTexture(url);

    return (
        <group position={position} rotation={rotation}>
            {/* Frame */}
            <mesh position={[0, 0, -0.06]}>
                <boxGeometry args={[2.2, 3.2, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Mat board (white border) - using Standard Material to allow shadows */}
             <mesh position={[0, 0, -0.02]}>
                <planeGeometry args={[2.05, 3.05]} />
                <meshStandardMaterial color="#ddd" roughness={0.8} />
            </mesh>
            {/* Canvas - Standard Material to ensure it's not emissive/unlit */}
            <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
                <planeGeometry args={[1.9, 2.9]} />
                <meshStandardMaterial map={texture} roughness={0.5} />
            </mesh>
        </group>
    )
}

const DetailedProjector = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
             {/* Stand - Sleek industrial tripod/pole */}
             <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.06, 0.06, 1.2]} />
                <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.02, 0]} receiveShadow>
               <cylinderGeometry args={[0.3, 0.3, 0.04]} />
               <meshStandardMaterial color="#222" />
            </mesh>

            {/* Projector Body Group */}
            <group position={[0, 1.35, 0]}>
                {/* Main Chassis - Clean and symmetrical */}
                <RoundedBox args={[0.7, 0.22, 0.7]} radius={0.02} smoothness={4} castShadow>
                   <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
                </RoundedBox>

                {/* Control Panel (Top) */}
                <group position={[0.15, 0.115, 0.15]}>
                    <mesh rotation={[-Math.PI/2, 0, 0]}>
                        <planeGeometry args={[0.2, 0.2]} />
                        <meshStandardMaterial color="#ddd" roughness={0.8} />
                    </mesh>
                    {/* Buttons */}
                    <mesh position={[-0.05, 0.005, -0.05]} rotation={[-Math.PI/2, 0, 0]}>
                         <circleGeometry args={[0.02]} />
                         <meshStandardMaterial color="#333" />
                    </mesh>
                     <mesh position={[0.05, 0.005, -0.05]} rotation={[-Math.PI/2, 0, 0]}>
                         <circleGeometry args={[0.02]} />
                         <meshStandardMaterial color="#333" />
                    </mesh>
                </group>

                {/* Rear Ports - Minimalist */}
                <group position={[0, 0, 0.355]}>
                    <mesh position={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.1, 0.05, 0.02]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                     <mesh position={[0.15, 0, 0]}>
                        <boxGeometry args={[0.08, 0.08, 0.02]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                </group>

                {/* Lens Housing Ring */}
                <mesh position={[0, 0, -0.36]} rotation={[Math.PI/2, 0, 0]}>
                   <cylinderGeometry args={[0.12, 0.12, 0.05]} />
                   <meshStandardMaterial color="#222" metalness={0.6} />
                </mesh>

                {/* Lens Glass */}
                <mesh position={[0, 0, -0.38]} rotation={[Math.PI/2, 0, 0]}>
                   <cylinderGeometry args={[0.09, 0.09, 0.05]} />
                   <meshPhysicalMaterial 
                     color="#aaccff" 
                     transmission={1} 
                     opacity={1} 
                     metalness={0.2} 
                     roughness={0} 
                     ior={1.7} 
                     thickness={0.5} 
                   />
                </mesh>

                {/* Light Source - Softened */}
                <SpotLight
                    position={[0, 0, -0.4]}
                    target-position={[0, 0.5, -10]}
                    angle={0.5}
                    penumbra={1} // Maximum softness
                    intensity={150}
                    distance={25}
                    castShadow
                    color="#f5f5ff"
                />

                {/* Volumetric Beam - Softer opacity */}
                <mesh position={[0, 0, -3.5]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[1.9, 0.09, 7]} />
                    <meshBasicMaterial 
                        color="#ffffff" 
                        transparent 
                        opacity={0.015} // Very subtle
                        side={THREE.DoubleSide} 
                        depthWrite={false} 
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>
        </group>
    );
};

const GalleryRoom = () => {
  const [floorTexture, wallTexture] = useTexture([
    'https://cdn.prod.website-files.com/67938aa1b31a177d7bdc1016/69296578959d73a72ae0d303_Patterned_Floor_Tiles_rl0knmp0_1K_BaseColor.jpg',
    'https://cdn.prod.website-files.com/67938aa1b31a177d7bdc1016/69296685f498216aa8c436a2_White_Cracked_Wall_tibkcjsew_1K_BaseColor.jpg'
  ]);
  
  // Configure Floor tiling
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(20, 240); // Smaller tiles (20 repeats across 10m, 240 repeats across 120m)

  // Configure Wall tiling
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(24, 4); // Longer length (120), same height (20)

  return (
    <group>
      {/* Reflective Tiled Floor - Extended Length, Narrower Width */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[10, 120]} /> {/* 10m wide, 120m long */}
        <MeshReflectorMaterial
          map={floorTexture}
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15} 
          roughness={0.7}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#999" 
          metalness={0.4}
          mirror={0.3} 
        />
      </mesh>

      {/* Side Walls - Tighter, Extended */}
      {/* Left Wall */}
      <mesh position={[-5, 10, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[120, 20]} />
        <meshStandardMaterial map={wallTexture} color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[5, 10, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[120, 20]} />
        <meshStandardMaterial map={wallTexture} color="#ffffff" roughness={0.8} />
      </mesh>
      
       {/* Ceiling - Extended */}
       <mesh position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 120]} />
        <meshStandardMaterial color="#111" roughness={0.9} /> 
      </mesh>

      {/* Ceiling Beams/Track Lights hint */}
      {[-10, -5, 0, 5, 10, 15, 20].map((z, i) => (
        <mesh key={i} position={[0, 11.5, z]} rotation={[0, 0, 0]}>
          <boxGeometry args={[9, 0.2, 0.5]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
    </group>
  );
}

interface ProjectorScreenProps {
  setCursorText: (text: string) => void;
}

const ProjectorScreen: React.FC<ProjectorScreenProps> = ({ setCursorText }) => {
    return (
        <group position={[0, 2, 0]}>
            {/* Main Screen Frame (Aluminum Housing) */}
            <mesh position={[0, 0, -0.05]} castShadow>
                <boxGeometry args={[4.4, 2.6, 0.15]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* The Digital Display */}
            <group position={[0, 0, 0.03]}>
                <Image 
                    url="https://cdn.prod.website-files.com/67938aa1b31a177d7bdc1016/69296af628113910b966423a_Screenshot%202025-11-28%20at%2009.27.00.png"
                    scale={[4.2, 2.4]}
                    toneMapped={false} // Keep colors bright/emissive
                    onPointerOver={() => {
                      document.body.style.cursor = 'none';
                      setCursorText('VIEW PROJECT');
                    }}
                    onPointerOut={() => {
                      document.body.style.cursor = 'auto';
                      setCursorText('');
                    }}
                    onClick={() => {
                        console.log("View Project clicked");
                    }}
                />
            </group>

            {/* Screen Glow (Simulated Area Light) */}
            <pointLight position={[0, 0, 1]} distance={8} intensity={20} color="#aaddff" decay={2} />

            {/* Suspension Cables */}
            <mesh position={[-1.8, 5, -0.05]}>
                <cylinderGeometry args={[0.003, 0.003, 10]} />
                <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[1.8, 5, -0.05]}>
                <cylinderGeometry args={[0.003, 0.003, 10]} />
                <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
            </mesh>
        </group>
    )
}

const SceneContent: React.FC<SceneContentProps> = ({ setCursorText }) => {
  const scroll = useScroll();
  const vecPos = useMemo(() => new THREE.Vector3(), []);
  const vecTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const r = scroll.offset;
    
    // Smooth camera transition
    vecPos.lerpVectors(START_POS, END_POS, r);
    state.camera.position.copy(vecPos);

    vecTarget.lerpVectors(START_TARGET, END_TARGET, r);
    state.camera.lookAt(vecTarget);
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* 
        ATMOSPHERE:
        Fog starts white/grey near the camera and fades to black towards the screen.
      */}
      <fog attach="fog" args={['#050505', 5, 30]} />

      {/* Ambient Fill - Keep it dim for shadow effect */}
      <ambientLight intensity={0.2} color="#ffffff" />

      {/* REMOVED: Main Ceiling Spotlights to create the requested "in shadow" look */}

      <GalleryRoom />
      <ProjectorScreen setCursorText={setCursorText} />

      {/* Detailed Projector Plinth emitting light */}
      <DetailedProjector position={[0, 0, 6]} />

      {/* Symmetrical Benches - Moved in slightly */}
      <group position={[0, 0.5, 8]}>
        <Bench position={[-1.8, 0, 0]} rotation={[0, 0.2, 0]} />
        <Bench position={[1.8, 0, 0]} rotation={[0, -0.2, 0]} />
        
        <Bench position={[-1.8, 0, 3]} rotation={[0, 0.1, 0]} />
        <Bench position={[1.8, 0, 3]} rotation={[0, -0.1, 0]} />
      </group>

      {/* Background Plinths with Art - Moved in for tighter walls */}
      <Plinth position={[-3.5, 0, 3]} artType="gold" rotationY={0.5} />
      <Plinth position={[3.5, 0, 3]} artType="glass" rotationY={-0.5} />
      
      <Plinth position={[-3.5, 0, 9]} artType="stone" rotationY={0.2} />
      <Plinth position={[3.5, 0, 9]} artType="gold" rotationY={-0.2} />

      {/* WALL ART - Moved closer to screen (z=3 and z=7) and removed emission */}
      <FramedArt 
        position={[-4.92, 3.5, 3]} 
        rotation={[0, Math.PI/2, 0]} 
        url="https://cdn.prod.website-files.com/67938aa1b31a177d7bdc1016/68b02310a56066911a7505a5_Gocart.png" 
      />
      <FramedArt 
        position={[-4.92, 3.5, 7]} 
        rotation={[0, Math.PI/2, 0]} 
        url="https://cdn.prod.website-files.com/67938aa1b31a177d7bdc1016/68b022f335580cd3128e6a5a_Insta%20post.png" 
      />

      <FramedArt 
        position={[4.92, 3.5, 3]} 
        rotation={[0, -Math.PI/2, 0]} 
        url="https://cdn.prod.website-files.com/67938aa1b31a177d7bdc1016/68b022f335580cd3128e6a5a_Insta%20post.png" 
      />
       <FramedArt 
        position={[4.92, 3.5, 7]} 
        rotation={[0, -Math.PI/2, 0]} 
        url="https://cdn.prod.website-files.com/67938aa1b31a177d7bdc1016/68b02310a56066911a7505a5_Gocart.png" 
      />
    </>
  );
};

export default SceneContent;