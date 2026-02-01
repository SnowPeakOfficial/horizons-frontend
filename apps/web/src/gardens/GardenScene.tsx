import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GardenConfig } from './gardenConfigs';
import { GrassField } from './components/GrassField';
import { SeasonalTrees } from './components/SeasonalTrees';
import { EnvironmentProps } from './components/EnvironmentProps';
import { TerrainGround, BaseGroundLayer } from './components/TerrainGround';
import { FencePerimeter } from './components/FencePerimeter';
import { FloatingParticles } from './components/FloatingParticles';

interface GardenSceneProps {
  config: GardenConfig;
  children?: React.ReactNode;
}

/**
 * Main garden scene component
 * Renders the 3D environment based on garden configuration
 */
export function GardenScene({ config, children }: GardenSceneProps) {
  // Parse sky gradient colors
  const [_skyTop, skyBottom] = config.colors.sky;
  
  // Check if this garden uses the new terrain system
  const usesTerrain = config.key === 'test_garden';
  
  // Determine season for tree selection
  const season = useMemo(() => {
    if (config.key === 'quiet_garden') return 'quiet';
    if (config.key === 'spring_meadow') return 'spring';
    if (config.key === 'autumn_grove') return 'autumn';
    if (config.key === 'winter_wonderland') return 'winter';
    return 'quiet';
  }, [config.key]);
  
  // Grass density based on garden type
  const grassDensity = useMemo(() => {
    if (config.key === 'spring_meadow') return 'dense';
    if (config.key === 'winter_wonderland') return 'sparse';
    return 'medium';
  }, [config.key]);
  
  return (
    <group>
      {/* Sky - gradient background */}
      <color attach="background" args={[skyBottom]} />
      
      {/* PLA-style lighting - natural, soft atmosphere */}
      {usesTerrain ? (
        <>
          {/* Soft ambient - natural atmosphere */}
          <ambientLight
            color="#E8E4DC"
            intensity={0.55}
          />
          
          {/* Hemisphere for sky/ground color */}
          <hemisphereLight
            args={["#D4E4F0", "#C8B89A", 0.3]}
          />
          
          {/* Natural daylight - soft, warm */}
          <directionalLight
            color="#FFF8F0"
            intensity={1.0}
            position={[30, 40, 25]}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={70}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
          />
          
        </>
      ) : (
        <>
          {/* Standard lighting */}
          <ambientLight 
            color={config.lighting.ambient.color}
            intensity={config.lighting.ambient.intensity}
          />
          
          <directionalLight
            color={config.lighting.directional.color}
            intensity={config.lighting.directional.intensity}
            position={config.lighting.directional.position}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
        </>
      )}
      
      {/* Render terrain or traditional ground based on garden */}
      {usesTerrain ? (
        <>
          {/* New terrain system with rolling hills */}
          <BaseGroundLayer size={60} color={config.colors.ground} />
          <TerrainGround
            size={60}
            resolution={150}
            seed={42}
            amplitude={0.9}
            grassColor={config.colors.primary}
          />
        </>
      ) : (
        <>
          {/* Traditional flat ground */}
          <Ground color={config.colors.ground} size={60} />
          <GrassField 
            color={config.colors.primary} 
            density={grassDensity}
            areaSize={40}
          />
        </>
      )}
      
      {/* Seasonal trees - vary spread based on garden */}
      {!usesTerrain && (
        <SeasonalTrees 
          season={season}
          count={config.environment.trees.count}
          spread={config.key === 'quiet_garden' ? 12 : 16} // Closer for quiet garden
        />
      )}
      
      {/* Garden-specific decorations */}
      {config.key === 'test_garden' && (
        <>
          {/* Fence perimeter around the garden */}
          <FencePerimeter size={60} spacing={10} inset={0} scale={0.6} yOffset={0} />
          
          {/* Big Trees as focal points */}
          <BigTreeAccents />
          
          {/* Curved rock path */}
          <RockPath />
          
          {/* Garden decorations - bench, rocks, bushes */}
          <GardenDecorations />
          
          {/* Floating magical particles */}
          <FloatingParticles 
            count={250} 
            size={0.1} 
            color="#FFE4B5" 
            speed={0.4} 
            spread={40} 
            height={12} 
          />
        </>
      )}
      
      {config.key === 'quiet_garden' && (
        <>
          <EnvironmentProps type="stones" count={8} spread={10} />
          {/* Fountain removed from quiet garden */}
        </>
      )}
      
      {config.key === 'spring_meadow' && (
        <>
          <EnvironmentProps type="springPathways" />
          <EnvironmentProps type="rocks" count={4} spread={12} />
          {/* Large fountain added to spring garden */}
          <LargeFountain />
        </>
      )}
      
      {config.key === 'autumn_grove' && (
        <>
          <EnvironmentProps type="rocks" count={10} spread={14} />
          <EnvironmentProps type="stones" count={6} spread={8} />
        </>
      )}
      
      {config.key === 'winter_wonderland' && (
        <>
          <EnvironmentProps type="stones" count={12} spread={15} />
        </>
      )}
      
      {/* Optional fog */}
      {config.fog && (
        <fog 
          attach="fog" 
          args={[config.fog.color, config.fog.near, config.fog.far]} 
        />
      )}
      
      {/* Children (flowers, etc.) */}
      {children}
    </group>
  );
}

/**
 * Simple ground plane - base layer under grass
 */
function Ground({ color, size }: { color: string; size: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/**
 * Large fountain for Spring Garden - scaled up significantly
 */
function LargeFountain() {
  const { scene } = useGLTF('/models/environment/Fountain.glb');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      position={[0, 0, -5]} 
      rotation={[0, 0, 0]}
      scale={4} // Much larger fountain
      castShadow
      receiveShadow
    />
  );
}

/**
 * Big Tree accent for test garden - single massive focal point tree
 */
function BigTreeAccents() {
  const { scene } = useGLTF('/models/environment/Big Tree.glb');
  
  const tree = useMemo(() => scene.clone(), [scene]);
  
  return (
    <primitive 
      object={tree} 
      position={[-20, 10, -20]} 
      rotation={[0, Math.PI / 2, 0]}
      scale={10}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Curved rock path - stepping stones across the garden
 */
function RockPath() {
  const rockPath = useGLTF('/models/environment/Rock Path Round Small.glb');
  
  // Create curved path coordinates - arc from left to right, bending toward tree
  const pathStones = useMemo(() => {
    const stones = [];
    const numStones = 25; // Increased to 25 to fill gaps
    
    for (let i = 0; i < numStones; i++) {
      const t = i / (numStones - 1); // 0 to 1
      
      // Arc path from left [-25, 0] to right [25, 0], bending toward tree at [-20, -20]
      const x = -25 + (50 * t); // Move from -25 to 25 (left to right)
      
      // Parabolic arc: peaks at middle (t=0.5), bends toward negative Z (tree direction)
      // Arc amplitude of -15 means it curves backward toward the tree
      const z = -15 * (1 - Math.pow(2 * t - 1, 2)); // Parabola: 0 at ends, -15 at middle
      
      // Vary rotation for natural look - deterministic based on index
      const rotation = (i * 0.7) % (Math.PI * 2);
      
      stones.push({ x, z, rotation });
    }
    
    return stones;
  }, []);
  
  return (
    <group>
      {pathStones.map((stone, index) => (
        <primitive
          key={index}
          object={rockPath.scene.clone()}
          position={[stone.x, 0.6, stone.z]}
          rotation={[0, stone.rotation, 0]}
          scale={2.5}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

/**
 * Garden decorations for test garden - bench, rocks, and bushes
 */
function GardenDecorations() {
  const bench = useGLTF('/models/environment/Bench.glb');
  const multipleRocks = useGLTF('/models/environment/MultipleRocks.glb');
  const rocks = useGLTF('/models/environment/Rocks.glb');
  const bush = useGLTF('/models/environment/Bush with Flowers.glb');
  
  // Clone and lighten bush materials - subtle brightness increase
  const createLighterBush = () => {
    const clonedBush = bush.scene.clone();
    clonedBush.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        // Subtle brightness increase
        if (child.material.color) {
          child.material.color.multiplyScalar(1.15); // 15% brighter (reduced from 40%)
        }
        // Subtle emissive for lightness
        if (child.material.emissive) {
          child.material.emissive.setRGB(0.05, 0.05, 0.03); // Reduced emissive
        }
      }
    });
    return clonedBush;
  };
  
  return (
    <group>
      {/* Bench closer to tree - on terrain */}
      <primitive 
        object={bench.scene.clone()} 
        position={[-10, 1.0, -18]} 
        rotation={[0, 0, 0]}
        scale={4.0}
        castShadow
        receiveShadow
      />
      
      {/* Massive MultipleRocks - positioned along the path */}
      {/* Rock 1: Near left end of path */}
      <primitive 
        object={multipleRocks.scene.clone()} 
        position={[-18, 0.3, -2]} 
        rotation={[0, 0.5, 0]}
        scale={7.0}
        castShadow
        receiveShadow
      />
      
      {/* Massive Rocks - positioned along the path */}
      {/* Rock 2: Middle-left of path */}
      <primitive 
        object={rocks.scene.clone()} 
        position={[-5, 0.3, -12]} 
        rotation={[0, 0.8, 0]}
        scale={6.0}
        castShadow
        receiveShadow
      />
      
      {/* Bushes - filling out the garden - lighter and smaller */}
      {/* Bush 1: Left side of path (closer to camera) */}
      <primitive 
        object={createLighterBush()} 
        position={[-22, 0.5, 5]} 
        rotation={[0, 0.3, 0]}
        scale={2.5}
        castShadow
        receiveShadow
      />
      
      {/* Bush 4: Right side, midway between fence and path */}
      <primitive 
        object={createLighterBush()} 
        position={[23, 0.5, -8]} 
        rotation={[0, 2.1, 0]}
        scale={2.5}
        castShadow
        receiveShadow
      />
      
      {/* Bush 5: Near the bench/tree area (behind tree, not against fence) */}
      <primitive 
        object={createLighterBush()} 
        position={[-12, 0.5, -22]} 
        rotation={[0, 1.5, 0]}
        scale={2.5}
        castShadow
        receiveShadow
      />
      
    </group>
  );
}
