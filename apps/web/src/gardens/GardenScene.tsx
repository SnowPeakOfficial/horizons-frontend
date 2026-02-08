import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GardenConfig } from './gardenConfigs';
import type { Flower } from '../types/api.types';
import type { PlacedFlower, FlowerDefinition } from '../flowers/types';
import { FLOWER_DEFINITIONS } from '../flowers/types';
import { GrassField } from './components/GrassField';
import { SeasonalTrees } from './components/SeasonalTrees';
import { EnvironmentProps } from './components/EnvironmentProps';
import { TerrainGround, BaseGroundLayer } from './components/TerrainGround';
import { Sky } from './components/Sky';
import { SkyPresets } from './components/SkyPresets';
import { Butterflies } from './components/Butterflies';
import { Bees } from './components/Bees';
import { FloatingParticles } from './components/FloatingParticles';
import { FlowerModel } from '../flowers/FlowerModel';

interface GardenSceneProps {
  config: GardenConfig;
  flowers?: Flower[];
  children?: React.ReactNode;
  isPlacementMode?: boolean;
  onTerrainClick?: (position: { x: number; y: number; z: number }) => void;
  onFlowerDragEnd?: (flowerId: string, position: { x: number; y: number; z: number }, rotation: number) => void;
  onFlowerDragStateChange?: (isDragging: boolean) => void;
  onFlowerClick?: (flower: Flower) => void;
}

/**
 * Convert API Flower to local PlacedFlower and FlowerDefinition types
 */
function convertApiFlowerToLocal(apiFlower: Flower): { flower: PlacedFlower; definition: FlowerDefinition } | null {
  // Map API flower key to local definition
  const defKey = apiFlower.flowerDefinition?.key?.toLowerCase() || 'daisy';
  const definition = FLOWER_DEFINITIONS[defKey];
  
  if (!definition) {
    console.warn(`Unknown flower definition: ${defKey}`);
    return null;
  }
  
  // Convert API state to local state
  let state: 'BUD' | 'BLOOMED' | 'OPEN' = 'OPEN';
  if (apiFlower.state === 'BUD') state = 'BUD';
  else if (apiFlower.state === 'BLOOMED') state = 'BLOOMED';
  else state = 'OPEN';
  
  const flower: PlacedFlower = {
    id: apiFlower.id,
    flowerDefinitionId: definition.id,
    gardenId: apiFlower.gardenId,
    position: {
      x: apiFlower.positionX ?? 0,
      y: apiFlower.positionY ?? 0,
      z: apiFlower.positionZ ?? 0
    },
    rotation: apiFlower.rotation || 0,
    scale: apiFlower.customScale || definition.defaultScale,
    placedAt: new Date(apiFlower.createdAt),
    state,
    bloomAt: apiFlower.bloomAt ? new Date(apiFlower.bloomAt) : undefined,
    bloomedAt: apiFlower.bloomedAt ? new Date(apiFlower.bloomedAt) : undefined,
    recipientName: apiFlower.recipientName || undefined,
    plantedBy: apiFlower.plantedBy || undefined,
  };
  
  return { flower, definition };
}

/**
 * Main garden scene component
 * Renders the 3D environment based on garden configuration
 */
export function GardenScene({ config, flowers = [], children, isPlacementMode = false, onTerrainClick, onFlowerDragEnd, onFlowerDragStateChange, onFlowerClick }: GardenSceneProps) {
  // Check if this garden uses the new terrain system
  const usesTerrain = config.key === 'test_garden';
  
  // Convert API flowers to local format
  const convertedFlowers = useMemo(() => {
    return flowers.map(convertApiFlowerToLocal).filter((f): f is { flower: PlacedFlower; definition: FlowerDefinition } => f !== null);
  }, [flowers]);
  
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
  
  // SINGLE SOURCE OF TRUTH - Change this one number to resize the entire garden!
  const GARDEN_SIZE = 60;
  
  // Terrain size offset - expands terrain to fill gap caused by edge falloff
  // Adjust this to close the gap between terrain and fence (try 2-5)
  const TERRAIN_SIZE_OFFSET = 5; // Increase to expand terrain, decrease to shrink
  const TERRAIN_SIZE = GARDEN_SIZE + TERRAIN_SIZE_OFFSET;
  
  // Select sky configuration based on garden
  const skyConfig = useMemo(() => {
    if (config.key === 'test_garden') return SkyPresets.clearDay;
    if (config.key === 'quiet_garden') return SkyPresets.peacefulMorning;
    if (config.key === 'spring_meadow') return SkyPresets.brightNoon;
    if (config.key === 'autumn_grove') return SkyPresets.softEvening;
    if (config.key === 'winter_wonderland') return SkyPresets.winterDay;
    return SkyPresets.clearDay;
  }, [config.key]);
  
  return (
    <group>
      {/* Sky with clouds - replaces flat background color */}
      <Sky {...skyConfig} />
      
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
          {/* New terrain system with rolling hills - uses TERRAIN_SIZE to fill gap */}
          <BaseGroundLayer size={TERRAIN_SIZE} color={config.colors.ground} />
          <TerrainGround
            size={TERRAIN_SIZE}
            resolution={150}
            seed={42}
            amplitude={0.9}
            grassColor={config.colors.primary}
            isPlacementMode={isPlacementMode}
            onTerrainClick={onTerrainClick}
          />
        </>
      ) : (
        <>
          {/* Traditional flat ground */}
          <Ground color={config.colors.ground} size={TERRAIN_SIZE} />
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
          {/* Fence around the test garden */}
          <EnvironmentProps type="fence" gardenSize={GARDEN_SIZE} />
          
          {/* Decorated wall with trees, lettuce, grass, and flowers */}
          <EnvironmentProps type="decoratedWall" gardenSize={GARDEN_SIZE} />
          
          {/* Central fountain */}
          <NewFountain />
          
          {/* Farmhouse in corner */}
          <Farmhouse />
          
          {/* Rock path from house to fountain */}
          <RockPathArc />
          
          {/* Animated environment elements */}
          <Butterflies />
          <Bees />
          <FloatingParticles />
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
      
      {/* Render flowers from database */}
      {convertedFlowers.map(({ flower, definition }, index) => {
        // Find the original API flower for click handler
        const apiFlower = flowers[index];
        
        return (
          <FlowerModel
            key={flower.id}
            flower={flower}
            definition={definition}
            draggable={true}
            onClick={() => {
              if (apiFlower) {
                onFlowerClick?.(apiFlower);
              }
            }}
            onDragStart={() => {
              // Notify parent that dragging started - disable OrbitControls
              onFlowerDragStateChange?.(true);
            }}
            onDragEnd={(placedFlower, position) => {
              // Notify parent that dragging ended - re-enable OrbitControls
              onFlowerDragStateChange?.(false);
              // Call the parent handler to save position to backend
              onFlowerDragEnd?.(placedFlower.id, position, placedFlower.rotation);
            }}
          />
        );
      })}
      
      {/* Children (additional elements) */}
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
 * New Fountain - Central feature for test garden (80% of previous 0.75 scale)
 */
function NewFountain() {
  const { scene } = useGLTF('/models/environment/Fountain-new.glb');
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Lightening value for new fountain - adjust independently!
    const LIGHTENING_VALUE = 1.5;
    
    if (LIGHTENING_VALUE) {
      clone.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) 
            ? child.material 
            : [child.material];
          
          materials.forEach((mat: any) => {
            const material = mat.clone();
            material.color.multiplyScalar(LIGHTENING_VALUE);
            child.material = material;
          });
        }
      });
    }
    
    return clone;
  }, [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      position={[0, 0.5, 0]} 
      rotation={[0, 0, 0]}
      scale={1.7}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Farmhouse - Building in back-left corner of test garden
 */
function Farmhouse() {
  const { scene } = useGLTF('/models/environment/House.glb');
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Lightening value for farmhouse - make it much brighter
    const LIGHTENING_VALUE = 3.5;
    
    clone.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) 
          ? child.material 
          : [child.material];
        
        materials.forEach((mat: any) => {
          const material = mat.clone();
          material.color.multiplyScalar(LIGHTENING_VALUE);
          child.material = material;
        });
      }
    });
    
    return clone;
  }, [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      position={[-22, 0.5, -22]} 
      rotation={[0, 0, 0]}
      scale={13.5}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Rock Path Arc - Curved walking path from house to fountain area
 */
function RockPathArc() {
  const { scene } = useGLTF('/models/environment/Rock Path Round Small.glb');
  
  // Generate arc path positions
  const pathSegments = useMemo(() => {
    const segments = [];
    const numSegments = 12; // Fewer segments for more spacing between pieces
    
    // Arc parameters - creates a curve from one side of house to the other
    // House is at [-22, 0.5, -22]
    // Fountain is at [0, 0.5, 0]
    // Path arcs away from fountain, closer to it, and reaches perimeter
    
    const centerX = -28.5; // Centered on house
    const centerZ = -27.7; // Centered on house
    const radius = 26; // Arc extends to garden walls (from -22 to +30 = ~26 units)
    const startAngle = Math.PI * 0.0; // Start angle (right side of house, toward garden)
    const endAngle = Math.PI * 0.5; // End angle (front side of house, stays in garden)
    
    for (let i = 0; i < numSegments; i++) {
      const t = i / (numSegments - 1);
      const angle = startAngle + (endAngle - startAngle) * t;
      
      const x = centerX + Math.cos(angle) * radius;
      const z = centerZ + Math.sin(angle) * radius;
      
      // Calculate rotation to follow the curve
      const tangentX = -Math.sin(angle);
      const tangentZ = Math.cos(angle);
      const baseRotation = Math.atan2(tangentX, tangentZ);
      
      // Add deterministic pseudo-random rotation on Y-axis only for variety
      // Using index-based seed for consistent results across renders
      const seedY = i * 12.9898 + 78.233;
      
      const randomY = Math.abs((Math.sin(seedY) * 43758.5453) % 1);
      
      const rotationY = baseRotation + (randomY - 0.5) * Math.PI; // ±90 degrees
      
      segments.push({
        position: [x, 0.6, z] as [number, number, number],
        rotation: [0, rotationY, 0] as [number, number, number],
      });
    }
    
    return segments;
  }, []);
  
  return (
    <group>
      {pathSegments.map((segment, index) => {
        const clonedScene = scene.clone();
        
        // Lighten the path materials
        const LIGHTENING_VALUE = 3;
        clonedScene.traverse((child: any) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) 
              ? child.material 
              : [child.material];
            
            materials.forEach((mat: any) => {
              const material = mat.clone();
              material.color.multiplyScalar(LIGHTENING_VALUE);
              child.material = material;
            });
          }
        });
        
        return (
          <primitive
            key={index}
            object={clonedScene}
            position={segment.position}
            rotation={segment.rotation}
            scale={2.5}
            receiveShadow
          />
        );
      })}
    </group>
  );
}

// Preload models
useGLTF.preload('/models/environment/Fountain.glb');
useGLTF.preload('/models/environment/Fountain-new.glb');
useGLTF.preload('/models/environment/House.glb');
useGLTF.preload('/models/environment/Rock Path Round Small.glb');
