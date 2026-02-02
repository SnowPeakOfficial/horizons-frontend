import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface EnvironmentPropsProps {
  type: 'rocks' | 'stones' | 'fountain' | 'path' | 'springPathways' | 'fence' | 'decoratedWall';
  count?: number;
  spread?: number;
  gardenSize?: number;
}

/**
 * EnvironmentProps - Decorative elements for the garden
 * Adds rocks, stones, fountains, paths, and decorated walls
 */
export function EnvironmentProps({ 
  type, 
  count = 5,
  spread = 12,
  gardenSize = 60 
}: EnvironmentPropsProps) {
  const modelPath = useMemo(() => {
    if (type === 'decoratedWall') return '';
    switch (type) {
      case 'rocks':
        return '/models/environment/Rocks.glb';
      case 'stones':
        return '/models/environment/Stones.glb';
      case 'fountain':
        return '/models/environment/Fountain.glb';
      case 'fence':
        return '/models/environment/Stone Wall.glb';
      case 'path':
      case 'springPathways':
        return '/models/environment/Path Straight.glb';
      default:
        return '/models/environment/Rocks.glb';
    }
  }, [type]);
  
  const { scene } = useGLTF(modelPath || '/models/environment/Rocks.glb');
  
  // For decoratedWall, we'll handle multiple model types
  if (type === 'decoratedWall') {
    return <DecoratedWall gardenSize={gardenSize} />;
  }
  
  const positions = useMemo(() => {
    const pos: Array<[number, number, number]> = [];
    
    if (type === 'fountain') {
      // Single fountain in a specific location
      pos.push([8, 0, -8]);
    } else if (type === 'springPathways') {
      // Long pathways leading to the fountain at [0, 0, -5]
      // Create 4 pathways from cardinal directions
      const fountainZ = -5;
      const pathSpacing = 9; // Distance between path segments (8-10x original 2)
      
      // North pathway (from behind, positive Z)
      for (let i = 0; i < 3; i++) {
        pos.push([0, 0, fountainZ + (i + 1) * pathSpacing]);
      }
      
      // South pathway (from front, negative Z)
      for (let i = 0; i < 3; i++) {
        pos.push([0, 0, fountainZ - (i + 1) * pathSpacing]);
      }
      
      // East pathway (from right, positive X)
      for (let i = 0; i < 3; i++) {
        pos.push([(i + 1) * pathSpacing, 0, fountainZ]);
      }
      
      // West pathway (from left, negative X)
      for (let i = 0; i < 3; i++) {
        pos.push([-(i + 1) * pathSpacing, 0, fountainZ]);
      }
    } else if (type === 'fence') {
      // Programmatic wall sizing - scales with garden size
      // Use spacing-based calculation for connected walls
      const desiredSpacing = 3.5; // Tight spacing for connected look
      
      // Calculate walls per side based on desired spacing
      const wallsPerSide = Math.floor(gardenSize / desiredSpacing);
      
      // Fine-tune spacing to distribute evenly
      const actualSpacing = gardenSize / wallsPerSide;
      
      // Fixed inset based on wall geometry - works across all garden sizes
      // Wall width is 5.0 units, so inset should be half that to sit flush at edge
      // Negative value pushes walls outward
      const wallWidth = 4; // Must match the scale value below
      const inset = -(wallWidth / 2.5); // -2.5 for flush fit
      const gardenRadius = (gardenSize / 2) - inset;
      
      // North side (positive Z)
      for (let i = 0; i < wallsPerSide; i++) {
        const x = -(gardenSize / 2) + (i + 0.5) * actualSpacing;
        pos.push([x, 0, gardenRadius]);
      }
      
      // South side (negative Z)
      for (let i = 0; i < wallsPerSide; i++) {
        const x = -(gardenSize / 2) + (i + 0.5) * actualSpacing;
        pos.push([x, 0, -gardenRadius]);
      }
      
      // East side (positive X)
      for (let i = 0; i < wallsPerSide; i++) {
        const z = -(gardenSize / 2) + (i + 0.5) * actualSpacing;
        pos.push([gardenRadius, 0, z]);
      }
      
      // West side (negative X)
      for (let i = 0; i < wallsPerSide; i++) {
        const z = -(gardenSize / 2) + (i + 0.5) * actualSpacing;
        pos.push([-gardenRadius, 0, z]);
      }
    } else if (type === 'path') {
      // Path pieces in a line
      for (let i = 0; i < count; i++) {
        pos.push([i * 2 - 4, 0, -5]);
      }
    } else {
      // Random scatter for rocks and stones
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spread;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        pos.push([x, 0, z]);
      }
    }
    
    return pos;
  }, [type, count, spread, gardenSize]);
  
  const rotations = useMemo(() => {
    if (type === 'fence') {
      // Programmatic rotations matching dynamic wall count
      const desiredSpacing = 3.5;
      const wallsPerSide = Math.floor(gardenSize / desiredSpacing);
      
      const rots: number[] = [];
      
      // North side - facing south (inward)
      for (let i = 0; i < wallsPerSide; i++) {
        rots.push(Math.PI); // 180 degrees
      }
      
      // South side - facing north (inward)
      for (let i = 0; i < wallsPerSide; i++) {
        rots.push(0); // 0 degrees
      }
      
      // East side - facing west (inward)
      for (let i = 0; i < wallsPerSide; i++) {
        rots.push(-Math.PI / 2); // -90 degrees
      }
      
      // West side - facing east (inward)
      for (let i = 0; i < wallsPerSide; i++) {
        rots.push(Math.PI / 2); // 90 degrees
      }
      
      return rots;
    } else if (type === 'springPathways') {
      // Specific rotations for pathways to align them correctly
      const rots: number[] = [];
      
      // North pathway (Z-aligned, no rotation needed)
      for (let i = 0; i < 3; i++) {
        rots.push(0);
      }
      
      // South pathway (Z-aligned, no rotation needed)
      for (let i = 0; i < 3; i++) {
        rots.push(0);
      }
      
      // East pathway (X-aligned, rotated 90 degrees)
      for (let i = 0; i < 3; i++) {
        rots.push(Math.PI / 2);
      }
      
      // West pathway (X-aligned, rotated 90 degrees)
      for (let i = 0; i < 3; i++) {
        rots.push(Math.PI / 2);
      }
      
      return rots;
    }
    return positions.map(() => Math.random() * Math.PI * 2);
  }, [positions, type]);
  
  const scales = useMemo(() => {
    if (type === 'fence') {
      // Non-uniform scaling: [width, height, depth]
      // Height is 2x the base scale for taller walls
      return positions.map(() => [5.0, 10.0, 5.0] as [number, number, number]);
    } else if (type === 'springPathways') {
      // Large scale for spring pathways (8-10x larger)
      return positions.map(() => 9);
    }
    // Random scale variation for natural look
    return positions.map(() => 0.8 + Math.random() * 0.4);
  }, [positions, type]);
  
  return (
    <group>
      {positions.map((position, i) => (
        <Prop
          key={i}
          scene={scene}
          position={position}
          rotation={rotations[i]}
          scale={scales[i]}
          type={type}
        />
      ))}
    </group>
  );
}

/**
 * Individual prop instance
 */
function Prop({ 
  scene, 
  position, 
  rotation, 
  scale,
  type
}: { 
  scene: THREE.Group;
  position: [number, number, number]; 
  rotation: number;
  scale: number | [number, number, number];
  type: string;
}) {
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Individual lightening values for each model type
    const LIGHTENING_VALUES: Record<string, number> = {
      fence: 5.0,
      fountain: 0,
    };
    
    // Lighten materials for specific types
    const lighteningValue = LIGHTENING_VALUES[type];
    if (lighteningValue) {
      clone.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // Handle both single materials and material arrays
          const materials = Array.isArray(child.material) 
            ? child.material 
            : [child.material];
          
          materials.forEach((mat: any) => {
            const material = mat.clone();
            // Brighten by the specified value
            material.color.multiplyScalar(lighteningValue);
            child.material = material;
          });
        }
      });
    }
    
    return clone;
  }, [scene, type]);
  
  return (
    <primitive 
      object={clonedScene} 
      position={position} 
      rotation={[0, rotation, 0]}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
}

/**
 * DecoratedWall - A wall decoration with trees, lettuce, grass, and flowers
 */
function DecoratedWall({ gardenSize }: { gardenSize: number }) {
  const bigTreeModel = useGLTF('/models/environment/Big Tree.glb');
  const regularTreeModel = useGLTF('/models/environment/Tree.glb');
  const crateLettuceModel = useGLTF('/models/environment/Crate Lettuce.glb');
  const grassPatchModel = useGLTF('/models/environment/Grass patch.glb');
  const bushFlowerModel = useGLTF('/models/environment/Bush with Flowers.glb');
  const bushTallModel = useGLTF('/models/environment/Bush Tall.glb');
  const swingSetModel = useGLTF('/models/environment/Swing set.glb');
  
  const elements = useMemo(() => {
    const result: Array<{
      type: 'tree' | 'regularTree' | 'lettuce' | 'grass' | 'flowerBush' | 'tallBush' | 'swing';
      position: [number, number, number];
      rotation: number;
      scale: number;
    }> = [];
    
    // North wall configuration (positive Z)
    const wallZ = gardenSize / 2 - 3; // Just inside the fence
    const wallLength = gardenSize;
    
    // LEFT EDGE: Two big trees - more spread out for natural look
    const leftEdgeX = -wallLength / 2 + 5;
    result.push({
      type: 'tree',
      position: [leftEdgeX, 10.5, wallZ],
      rotation: 5,
      scale: 8
    });
    result.push({
      type: 'tree',
      position: [leftEdgeX + 6, 10.5, wallZ - 4],
      rotation: 5,
      scale: 8
    });
    
    // RIGHT EDGE: Two big trees - more spread out for natural look
    const rightEdgeX = wallLength / 2 - 5;
    result.push({
      type: 'tree',
      position: [rightEdgeX, 10.5, wallZ],
      rotation: 5,
      scale: 8
    });
    result.push({
      type: 'tree',
      position: [rightEdgeX - 6, 10.5, wallZ - 4],
      rotation: 5,
      scale: 8
    });
    
    // REGULAR TREES: Add variety with Tree.glb (left and right only, moved to front)
     result.push({
      type: 'tree',
      position: [leftEdgeX + 13, 7, wallZ -9],
      rotation: 5,
      scale: 5
    });
    result.push({
      type: 'tree',
      position: [rightEdgeX - 13, 7, wallZ - 9],
      rotation: 5,
      scale: 5
    });
    
    // SWING SET: Center focal point (scaled down by 50x)
    result.push({
      type: 'swing',
      position: [0, 0, wallZ - 8],
      rotation: 1.6,
      scale: 0.08 // 1/50 = 0.02
    });
    
    // CRATE LETTUCE: 10 crates, tighter spacing, less area
    const centerX = 0;
    const lettuceSpan = 20; // Reduced from ~40+ to 20 units
    const lettuceStartX = centerX - lettuceSpan / 2;
    const lettuceCount = 10;
    const lettuceSpacing = lettuceSpan / (lettuceCount - 1);
    
    for (let i = 0; i < lettuceCount; i++) {
      result.push({
        type: 'lettuce',
        position: [lettuceStartX + i * lettuceSpacing, 0, wallZ],
        rotation: 0,
        scale: 1.0
      });
    }
    
    // GRASS PATCHES: VERY ABUNDANT for lush look with extra coverage along walls (120+ patches)
    const grassPositions = [
      // VERY DENSE around left big trees
      [leftEdgeX - 2, wallZ + 2], [leftEdgeX + 5, wallZ + 1],
      [leftEdgeX + 1, wallZ - 4], [leftEdgeX + 4, wallZ - 3],
      [leftEdgeX - 1, wallZ + 4], [leftEdgeX + 6, wallZ - 2],
      [leftEdgeX + 2, wallZ - 5], [leftEdgeX - 3, wallZ],
      [leftEdgeX + 3, wallZ + 3], [leftEdgeX - 2, wallZ - 2],
      [leftEdgeX + 7, wallZ], [leftEdgeX + 1, wallZ + 2],
      [leftEdgeX - 4, wallZ + 1], [leftEdgeX + 8, wallZ - 1],
      [leftEdgeX, wallZ + 5], [leftEdgeX + 4, wallZ + 4],
      [leftEdgeX - 1, wallZ - 5], [leftEdgeX + 5, wallZ - 4],
      
      // VERY DENSE around right big trees
      [rightEdgeX + 2, wallZ + 2], [rightEdgeX - 5, wallZ + 1],
      [rightEdgeX - 1, wallZ - 4], [rightEdgeX - 4, wallZ - 3],
      [rightEdgeX + 1, wallZ + 4], [rightEdgeX - 6, wallZ - 2],
      [rightEdgeX - 2, wallZ - 5], [rightEdgeX + 3, wallZ],
      [rightEdgeX - 3, wallZ + 3], [rightEdgeX + 2, wallZ - 2],
      [rightEdgeX - 7, wallZ], [rightEdgeX - 1, wallZ + 2],
      [rightEdgeX + 4, wallZ + 1], [rightEdgeX - 8, wallZ - 1],
      [rightEdgeX, wallZ + 5], [rightEdgeX - 4, wallZ + 4],
      [rightEdgeX + 1, wallZ - 5], [rightEdgeX - 5, wallZ - 4],
      
      // DENSE around regular trees (left and right)
      [leftEdgeX + 10, wallZ - 7], [leftEdgeX + 11, wallZ - 5],
      [leftEdgeX + 9, wallZ - 8], [leftEdgeX + 12, wallZ - 6],
      [leftEdgeX + 14, wallZ - 7.5], [leftEdgeX + 8, wallZ - 9.5],
      [rightEdgeX - 10, wallZ - 7], [rightEdgeX - 11, wallZ - 5],
      [rightEdgeX - 9, wallZ - 8], [rightEdgeX - 12, wallZ - 6],
      [rightEdgeX - 14, wallZ - 7.5], [rightEdgeX - 8, wallZ - 9.5],
      
      // Around swing area (but not too close)
      [-2, wallZ - 9], [2, wallZ - 9], [-3, wallZ - 7], [3, wallZ - 7],
      [-1.5, wallZ - 10], [1.5, wallZ - 10],
      
      // CONTINUOUS coverage along wall edges - left side (more dense, no gaps)
      [-28, wallZ + 3], [-27, wallZ + 1], [-26, wallZ + 2], [-25, wallZ + 0.5],
      [-24, wallZ + 4], [-23, wallZ + 1.5], [-22, wallZ], [-21, wallZ + 3],
      [-20, wallZ + 1], [-19, wallZ + 2], [-18, wallZ - 1], [-17, wallZ + 1],
      [-16, wallZ + 2.5], [-15, wallZ + 0.5], [-14, wallZ - 0.5], [-13, wallZ + 3],
      [-12, wallZ - 2], [-11, wallZ + 1], [-10, wallZ + 3], [-9, wallZ + 0.5],
      [-8, wallZ + 1], [-7, wallZ + 2], [-6, wallZ - 1.5], [-5, wallZ - 1],
      [-4, wallZ + 1.5], [-3, wallZ + 4],
      
      // CONTINUOUS coverage along wall edges - right side (more dense, no gaps)
      [28, wallZ + 3], [27, wallZ + 1], [26, wallZ + 2], [25, wallZ + 0.5],
      [24, wallZ + 4], [23, wallZ + 1.5], [22, wallZ], [21, wallZ + 3],
      [20, wallZ + 1], [19, wallZ + 2], [18, wallZ - 1], [17, wallZ + 1],
      [16, wallZ + 2.5], [15, wallZ + 0.5], [14, wallZ - 0.5], [13, wallZ + 3],
      [12, wallZ - 2], [11, wallZ + 1], [10, wallZ + 3], [9, wallZ + 0.5],
      [8, wallZ + 1], [7, wallZ + 2], [6, wallZ - 1.5], [5, wallZ - 1],
      [4, wallZ + 1.5], [3, wallZ + 4],
      
      // DENSE coverage in center area (away from lettuce)
      [0, wallZ + 2], [0, wallZ - 3], [0, wallZ + 4], [0, wallZ - 5],
      [-2, wallZ + 3], [2, wallZ + 3], [-4, wallZ - 2], [4, wallZ - 2],
      
      // More scattered for organic integration
      [-25, wallZ - 4], [25, wallZ - 4], [-23, wallZ - 2], [23, wallZ - 2],
      [-19, wallZ - 3], [19, wallZ - 3], [-10, wallZ - 4], [10, wallZ - 4],
      [-22, wallZ + 5], [22, wallZ + 5], [-24, wallZ - 2], [24, wallZ - 2],
      [-18, wallZ + 3], [18, wallZ + 3], [-16, wallZ - 3], [16, wallZ - 3],
      [-14, wallZ + 4], [14, wallZ + 4], [-20, wallZ - 4], [20, wallZ - 4],
    ];
    
    grassPositions.forEach(([x, z]) => {
      result.push({
        type: 'grass',
        position: [x, 0, z],
        rotation: 0.8, // Uniform rotation for consistent look
        scale: 1.0
      });
    });
    
    // BUSH FLOWERS & TALL BUSHES: More random placement, moved outward from swing
    const bushPositions = [
      // Single tall bush behind lettuce crates - pushed back toward wall
      { pos: [0, wallZ + 4], type: 'tallBush' as const },
      
      // Left outer edge - random organic placement
      { pos: [leftEdgeX - 4, wallZ + 5], type: 'flowerBush' as const },
      { pos: [leftEdgeX + 1, wallZ + 6], type: 'tallBush' as const },
      { pos: [leftEdgeX - 5, wallZ - 6], type: 'flowerBush' as const },
      { pos: [leftEdgeX + 9, wallZ + 3.5], type: 'tallBush' as const },
      { pos: [leftEdgeX + 12, wallZ - 0.5], type: 'flowerBush' as const },
      { pos: [leftEdgeX - 3, wallZ + 2], type: 'tallBush' as const },
      { pos: [leftEdgeX + 2, wallZ - 3], type: 'flowerBush' as const },
      
      // Right outer edge - random organic placement
      { pos: [rightEdgeX + 4, wallZ + 1.5], type: 'flowerBush' as const },
      { pos: [rightEdgeX - 1, wallZ + 6], type: 'tallBush' as const },
      { pos: [rightEdgeX + 5, wallZ - 6], type: 'flowerBush' as const },
      { pos: [rightEdgeX - 9, wallZ + 3.5], type: 'tallBush' as const },
      { pos: [rightEdgeX - 12, wallZ - 1.5], type: 'flowerBush' as const },
      { pos: [rightEdgeX + 3, wallZ + 2.5], type: 'tallBush' as const },
      { pos: [rightEdgeX - 2, wallZ - 2.5], type: 'flowerBush' as const },
      
      // Far left and right - more spread out
      { pos: [-22, wallZ + 4], type: 'tallBush' as const },
      { pos: [-24, wallZ - 1], type: 'flowerBush' as const },
      { pos: [-19, wallZ + 1.5], type: 'tallBush' as const },
      { pos: [22, wallZ + 4], type: 'tallBush' as const },
      { pos: [24, wallZ - 1], type: 'flowerBush' as const },
      { pos: [19, wallZ + 1.5], type: 'tallBush' as const },
      { pos: [25, wallZ - 5], type: 'flowerBush' as const },
      { pos: [-25, wallZ - 5], type: 'flowerBush' as const },
      
      // Random scattered - avoiding swing area (wallZ - 8)
      { pos: [-16, wallZ + 3.5], type: 'tallBush' as const },
      { pos: [-13, wallZ - 4.5], type: 'flowerBush' as const },
      { pos: [16, wallZ + 3.5], type: 'tallBush' as const },
      { pos: [13, wallZ - 4.5], type: 'flowerBush' as const },
      { pos: [-17, wallZ - 2], type: 'flowerBush' as const },
      { pos: [17, wallZ - 2], type: 'flowerBush' as const },
      
      // Around LEFT regular tree (outer side)
      { pos: [leftEdgeX + 5, wallZ - 8], type: 'tallBush' as const },
      { pos: [leftEdgeX + 6, wallZ - 9.5], type: 'tallBush' as const },
      { pos: [leftEdgeX + 7, wallZ - 10.5], type: 'tallBush' as const },
      { pos: [leftEdgeX + 5, wallZ - 10], type: 'tallBush' as const },
      { pos: [leftEdgeX + 6, wallZ - 6.5], type: 'tallBush' as const },
      
      // Around RIGHT regular tree (outer side)
      { pos: [rightEdgeX - 5, wallZ - 8], type: 'tallBush' as const },
      { pos: [rightEdgeX - 6, wallZ - 9.5], type: 'tallBush' as const },
      { pos: [rightEdgeX - 7, wallZ - 10.5], type: 'tallBush' as const },
      { pos: [rightEdgeX - 5, wallZ - 10], type: 'tallBush' as const },
      { pos: [rightEdgeX - 6, wallZ - 6.5], type: 'tallBush' as const },
    ];
    
    bushPositions.forEach(({ pos: [x, z], type }) => {
      result.push({
        type,
        position: [x, 0, z],
        rotation: 0,
        scale: 2.0
      });
    });
    
    return result;
  }, [gardenSize]);
  
  // Pre-process models with lightening effect
  const processedModels = useMemo(() => {
    const models: Record<string, THREE.Group> = {};
    
    // Individual lightening values for each model type - adjust these independently!
    const LIGHTENING_VALUES: Record<string, number> = {
      tree: 3.5,           // Big trees
      flowerBush: 5,     // Bush with flowers
      lettuce: 5,        // Crate lettuce
      tallBush: 2,       // Tall bushes
      grass: 2.2,       // Grass patches - just slightly darker than terrain (#5A8F67)
    };
    
    const processModel = (name: string, scene: THREE.Group) => {
      const clone = scene.clone();
      
      const lighteningValue = LIGHTENING_VALUES[name];
      if (lighteningValue) {
        clone.traverse((child: any) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) 
              ? child.material 
              : [child.material];
            
            materials.forEach((mat: any) => {
              const material = mat.clone();
              // Brighten by the specified value for this model type
              material.color.multiplyScalar(lighteningValue);
              child.material = material;
            });
          }
        });
      }
      
      return clone;
    };
    
    models.tree = processModel('tree', bigTreeModel.scene);
    models.regularTree = processModel('regularTree', regularTreeModel.scene);
    models.lettuce = processModel('lettuce', crateLettuceModel.scene);
    models.grass = processModel('grass', grassPatchModel.scene);
    models.flowerBush = processModel('flowerBush', bushFlowerModel.scene);
    models.tallBush = processModel('tallBush', bushTallModel.scene);
    models.swing = processModel('swing', swingSetModel.scene);
    
    return models;
  }, [bigTreeModel.scene, regularTreeModel.scene, crateLettuceModel.scene, grassPatchModel.scene, bushFlowerModel.scene, bushTallModel.scene, swingSetModel.scene]);
  
  return (
    <group>
      {elements.map((element, i) => {
        const model = processedModels[element.type] || processedModels.grass;
        
        return (
          <primitive
            key={`${element.type}-${i}`}
            object={model.clone()}
            position={element.position}
            rotation={[0, element.rotation, 0]}
            scale={element.scale}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}

// Preload all environment props
useGLTF.preload('/models/environment/Rocks.glb');
useGLTF.preload('/models/environment/Stones.glb');
useGLTF.preload('/models/environment/Fountain.glb');
useGLTF.preload('/models/environment/Stone Wall.glb');
useGLTF.preload('/models/environment/Path Straight.glb');
useGLTF.preload('/models/environment/Big Tree.glb');
useGLTF.preload('/models/environment/Tree.glb');
useGLTF.preload('/models/environment/Crate Lettuce.glb');
useGLTF.preload('/models/environment/Grass patch.glb');
useGLTF.preload('/models/environment/Bush with Flowers.glb');
useGLTF.preload('/models/environment/Bush Tall.glb');
useGLTF.preload('/models/environment/Swing set.glb');
