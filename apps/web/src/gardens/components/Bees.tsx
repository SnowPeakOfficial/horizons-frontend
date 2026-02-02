import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BeeProps {
  startPosition: [number, number, number];
  phaseOffset: number;
  speedMult: number;
}

/**
 * Individual bee with zigzag flight pattern
 */
function Bee({ startPosition, phaseOffset, speedMult }: BeeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create bee texture
  const texture = useMemo(() => createBeeTexture(), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const t = state.clock.elapsedTime * speedMult + phaseOffset;
    
    // Zigzag pattern - fast, erratic movement
    const scale = 6;
    const x = startPosition[0] + Math.sin(t * 1.5) * scale;
    const z = startPosition[2] + Math.cos(t * 1.8) * scale;
    const y = startPosition[1] + Math.sin(t * 3.0) * 0.8 + 1.5; // Quick bobbing
    
    meshRef.current.position.set(x, y, z);
    
    // Fast rotation for busy bee look
    meshRef.current.rotation.y = t * 2;
  });
  
  return (
    <sprite ref={meshRef} scale={[0.5, 0.5, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </sprite>
  );
}

/**
 * Create bee sprite texture
 */
function createBeeTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  ctx.clearRect(0, 0, 64, 64);
  
  const centerX = 32;
  const centerY = 32;
  
  // Body (yellow with black stripes)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 8, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Black stripes
  ctx.fillStyle = '#000000';
  ctx.fillRect(centerX - 8, centerY - 4, 16, 2);
  ctx.fillRect(centerX - 8, centerY + 2, 16, 2);
  ctx.fillRect(centerX - 8, centerY + 8, 16, 2);
  
  // Wings (translucent white)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  
  // Left wing
  ctx.beginPath();
  ctx.ellipse(centerX - 8, centerY - 6, 8, 10, -0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Right wing
  ctx.beginPath();
  ctx.ellipse(centerX + 8, centerY - 6, 8, 10, 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(centerX, centerY - 12, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Antennae
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 2, centerY - 14);
  ctx.lineTo(centerX - 4, centerY - 18);
  ctx.moveTo(centerX + 2, centerY - 14);
  ctx.lineTo(centerX + 4, centerY - 18);
  ctx.stroke();
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Bees - Manages multiple bees in the garden
 */
export function Bees() {
  const bees = useMemo(() => [
    { pos: [-5, 1.5, 8] as [number, number, number], phase: 0, speed: 1.2 },
    { pos: [10, 1.5, -10] as [number, number, number], phase: 1.5, speed: 1.0 },
    { pos: [-12, 1.5, -5] as [number, number, number], phase: 3.0, speed: 1.3 },
    { pos: [8, 1.5, 12] as [number, number, number], phase: 4.2, speed: 0.9 },
    { pos: [0, 1.5, -8] as [number, number, number], phase: 2.5, speed: 1.1 },
  ], []);
  
  return (
    <group>
      {bees.map((bee, i) => (
        <Bee
          key={i}
          startPosition={bee.pos}
          phaseOffset={bee.phase}
          speedMult={bee.speed}
        />
      ))}
    </group>
  );
}
