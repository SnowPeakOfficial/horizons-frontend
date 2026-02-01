import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

interface TreeLineProps {
  side?: 'north' | 'south' | 'east' | 'west';
  size?: number;
  spacing?: number;
  scale?: number;
  yOffset?: number;
}

/**
 * TreeLine - Places Trees.glb models along one side of the garden perimeter
 */
export function TreeLine({
  side = 'north',
  size = 60,
  spacing = 10,
  scale = 1.0,
  yOffset = 0
}: TreeLineProps) {
  const { scene } = useGLTF('/models/environment/Trees.glb');
  
  // Calculate tree positions based on side
  const treePositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const halfSize = size / 2;
    const inset = 18; // Move trees well inside the perimeter
    
    switch (side) {
      case 'north': // Back side (negative Z)
        for (let x = -halfSize + spacing; x < halfSize; x += spacing) {
          positions.push([x, yOffset, -halfSize + inset]);
        }
        break;
      case 'south': // Front side (positive Z)
        for (let x = -halfSize + spacing; x < halfSize; x += spacing) {
          positions.push([x, yOffset, halfSize - inset]);
        }
        break;
      case 'east': // Right side (positive X)
        for (let z = -halfSize + spacing; z < halfSize; z += spacing) {
          positions.push([halfSize - inset, yOffset, z]);
        }
        break;
      case 'west': // Left side (negative X)
        for (let z = -halfSize + spacing; z < halfSize; z += spacing) {
          positions.push([-halfSize + inset, yOffset, z]);
        }
        break;
    }
    
    return positions;
  }, [side, size, spacing, yOffset]);
  
  return (
    <group>
      {treePositions.map((position, index) => {
        const clonedScene = scene.clone();
        
        return (
          <primitive
            key={`tree-${side}-${index}`}
            object={clonedScene}
            position={position}
            scale={scale}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}
