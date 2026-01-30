import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface FencePerimeterProps {
  size?: number;
  spacing?: number;
  inset?: number;
  scale?: number;
  yOffset?: number;
}

/**
 * FencePerimeter - Creates a fence around the garden perimeter
 * Places fence segments in a rectangular pattern around the edges
 */
export function FencePerimeter({
  size = 60,
  spacing = 8,
  inset = 2,
  scale = 1.5,
  yOffset = 0
}: FencePerimeterProps) {
  const { scene } = useGLTF('/models/environment/Fence.glb');
  
  const fencePositions = useMemo(() => {
    const positions: Array<{
      position: [number, number, number];
      rotation: number;
    }> = [];
    
    const halfSize = size / 2;
    const fenceEdge = halfSize - inset;
    
    // Calculate how many fence segments fit on each side
    const segmentsPerSide = Math.floor(size / spacing);
    
    // Calculate the actual fence width to use for positioning
    const fenceWidth = spacing;
    
    // Calculate starting offset to center the fences on each side
    const totalFenceWidth = segmentsPerSide * fenceWidth;
    const startOffset = (size - totalFenceWidth) / 2;
    
    // North side (positive Z) - along X axis
    for (let i = 0; i < segmentsPerSide; i++) {
      const x = -halfSize + startOffset + (i * fenceWidth) + (fenceWidth / 2);
      positions.push({
        position: [x, yOffset, fenceEdge],
        rotation: Math.PI / 2 // Rotated to run along X axis
      });
    }
    
    // South side (negative Z) - along X axis
    for (let i = 0; i < segmentsPerSide; i++) {
      const x = -halfSize + startOffset + (i * fenceWidth) + (fenceWidth / 2);
      positions.push({
        position: [x, yOffset, -fenceEdge],
        rotation: Math.PI / 2 // Rotated to run along X axis
      });
    }
    
    // East side (positive X) - along Z axis
    for (let i = 0; i < segmentsPerSide; i++) {
      const z = -halfSize + startOffset + (i * fenceWidth) + (fenceWidth / 2);
      positions.push({
        position: [fenceEdge, yOffset, z],
        rotation: 0 // Rotated to run along Z axis
      });
    }
    
    // West side (negative X) - along Z axis
    for (let i = 0; i < segmentsPerSide; i++) {
      const z = -halfSize + startOffset + (i * fenceWidth) + (fenceWidth / 2);
      positions.push({
        position: [-fenceEdge, yOffset, z],
        rotation: 0 // Rotated to run along Z axis
      });
    }
    
    return positions;
  }, [size, spacing, inset, yOffset]);
  
  return (
    <group>
      {fencePositions.map((fence, i) => (
        <FenceSegment
          key={i}
          scene={scene}
          position={fence.position}
          rotation={fence.rotation}
          scale={scale}
        />
      ))}
    </group>
  );
}

/**
 * Individual fence segment instance
 */
function FenceSegment({
  scene,
  position,
  rotation,
  scale
}: {
  scene: THREE.Group;
  position: [number, number, number];
  rotation: number;
  scale: number;
}) {
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
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

// Preload fence model
useGLTF.preload('/models/environment/Fence.glb');
