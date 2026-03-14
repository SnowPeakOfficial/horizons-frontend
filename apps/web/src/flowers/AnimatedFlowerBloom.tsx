import { useState, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { FlowerBud } from './FlowerBud';
import type { FlowerDefinition } from './types';

interface AnimatedFlowerBloomProps {
  definition: FlowerDefinition;
  isBloom: boolean;
  scale?: number;
  onBloomComplete?: () => void;
}

/**
 * Animated flower that transitions from bud to bloomed state
 * Features:
 * - Cross-fade opacity animation
 * - Scale-up bloom animation
 * - Particle burst effect on bloom
 * - Spring physics for smooth transitions
 */
export function AnimatedFlowerBloom({
  definition,
  isBloom,
  scale = 1,
  onBloomComplete
}: AnimatedFlowerBloomProps) {
  const [hasBloomedOnce, setHasBloomedOnce] = useState(false);
  const { scene } = useGLTF(definition.modelPath);

  // Clone the bloomed flower model
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Brightening value for planted flower GLBs
    const LIGHTENING_VALUE = 2.0;
    
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            const material = mat.clone();
            material.color.multiplyScalar(LIGHTENING_VALUE);
            child.material = material;
          });
        }
      }
    });
    
    return clone;
  }, [scene]);

  // Spring animation for bloom transition
  const { budOpacity, bloomOpacity, bloomScale } = useSpring({
    budOpacity: isBloom ? 0 : 1,
    bloomOpacity: isBloom ? 1 : 0,
    bloomScale: isBloom ? 1 : 0.1,
    config: { tension: 120, friction: 14 },
    onRest: () => {
      if (isBloom && !hasBloomedOnce) {
        setHasBloomedOnce(true);
        onBloomComplete?.();
      }
    },
  });

  return (
    <group>
      {/* Bud state - fades out when blooming - Universal size matching Daisy */}
      <animated.group
        // @ts-ignore - R3F animated types
        scale={budOpacity.to(o => o * (1.5 / definition.defaultScale))}  // Counter-scale to always match Daisy's bud size (1.5)
        visible={budOpacity.to(o => o > 0.01)}
      >
        <FlowerBud scale={1} color={definition.color} />
      </animated.group>

      {/* Bloomed state - scales up and fades in - uses actual flower scale */}
      <animated.group
        // @ts-ignore - R3F animated types
        scale={bloomScale.to(s => s * scale)}
        visible={bloomOpacity.to(o => o > 0.01)}
      >
        {/* Raise model above ground - use per-flower gardenOffset or default to 1 */}
        <primitive object={clonedScene} position={[0, definition.gardenOffset ?? 1, 0]} />
      </animated.group>

      {/* Particle burst effect when blooming */}
      {isBloom && bloomOpacity.get() < 0.95 && (
        <group>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 0.5;
            
            return (
              <animated.mesh
                key={`particle-${i}`}
                position={[
                  Math.cos(angle) * distance * bloomOpacity.get(),
                  1.2 + bloomOpacity.get() * 0.3,
                  Math.sin(angle) * distance * bloomOpacity.get()
                ]}
                scale={0.05 * (1 - bloomOpacity.get())}
              >
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial 
                  color={definition.color}
                  emissive={definition.color}
                  emissiveIntensity={0.5}
                  transparent
                  opacity={Math.max(0, 1 - bloomOpacity.get())}
                />
              </animated.mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
