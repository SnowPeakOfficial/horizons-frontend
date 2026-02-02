import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ButterflyProps {
  index: number;
  color: string;
  startPosition: [number, number, number];
}

/**
 * Individual butterfly with figure-8 flight pattern
 */
function Butterfly({ index, color, startPosition }: ButterflyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Random offset for unique movement
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const speedMultiplier = useMemo(() => 0.8 + Math.random() * 0.4, []); // 0.8-1.2
  
  // Create butterfly texture
  const texture = useMemo(() => createButterflyTexture(color), [color]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const t = state.clock.elapsedTime * speedMultiplier + phaseOffset;
    
    // Figure-8 pattern (lemniscate)
    const scale = 8;
    const x = startPosition[0] + Math.sin(t * 0.5) * scale;
    const z = startPosition[2] + Math.sin(t * 1.0) * scale * 0.5;
    const y = startPosition[1] + Math.sin(t * 2.0) * 1.5 + 2; // Bobbing motion
    
    meshRef.current.position.set(x, y, z);
    
    // Gentle rotation to face movement direction
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
  });
  
  return (
    <sprite ref={meshRef} scale={[0.8, 0.8, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </sprite>
  );
}

/**
 * Create butterfly sprite texture
 */
function createButterflyTexture(color: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  ctx.clearRect(0, 0, 64, 64);
  
  // Draw butterfly shape (simple wings)
  const centerX = 32;
  const centerY = 32;
  
  // Left wing
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(centerX - 10, centerY, 12, 16, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Right wing
  ctx.beginPath();
  ctx.ellipse(centerX + 10, centerY, 12, 16, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Wing patterns (dots)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(centerX - 10, centerY - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX + 10, centerY - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Body
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Antennae
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 1, centerY - 8);
  ctx.lineTo(centerX - 3, centerY - 12);
  ctx.moveTo(centerX + 1, centerY - 8);
  ctx.lineTo(centerX + 3, centerY - 12);
  ctx.stroke();
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Butterflies - Manages multiple butterflies in the garden
 */
export function Butterflies() {
  const butterflies = useMemo(() => [
    { color: '#FF69B4', pos: [-10, 2, 10] as [number, number, number] },  // Pink
    { color: '#FFD700', pos: [12, 2, -8] as [number, number, number] },   // Gold
    { color: '#87CEEB', pos: [-8, 2, -12] as [number, number, number] },  // Sky blue
    { color: '#FFA500', pos: [15, 2, 5] as [number, number, number] },    // Orange
    { color: '#DA70D6', pos: [5, 2, -15] as [number, number, number] },   // Orchid
  ], []);
  
  return (
    <group>
      {butterflies.map((butterfly, i) => (
        <Butterfly
          key={i}
          index={i}
          color={butterfly.color}
          startPosition={butterfly.pos}
        />
      ))}
    </group>
  );
}
