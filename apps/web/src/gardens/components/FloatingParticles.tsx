import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  size?: number;
  color?: string;
  speed?: number;
  spread?: number;
  height?: number;
}

/**
 * FloatingParticles - Creates a magical atmosphere with small glowing particles
 * Particles float upward and drift gently, creating an ethereal effect
 */
export function FloatingParticles({
  count = 300,
  size = 0.08,
  color = '#FFD700',
  speed = 0.3,
  spread = 30,
  height = 15
}: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create circular texture for particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create radial gradient for soft circular glow
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  // Generate random particle positions and velocities
  const particles = useMemo(() => {
     
    const generateParticles = () => {
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Random position within spread area
        positions[i3] = (Math.random() - 0.5) * spread; // x
        positions[i3 + 1] = Math.random() * height; // y (height)
        positions[i3 + 2] = (Math.random() - 0.5) * spread; // z
        
        // Random velocity for drift
        velocities[i3] = (Math.random() - 0.5) * 0.02; // x drift
        velocities[i3 + 1] = Math.random() * 0.01 + 0.005; // y upward
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02; // z drift
      }
      
      return { positions, velocities };
    };
    
    return generateParticles();
  }, [count, spread, height]);
  
  // Animate particles
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += particles.velocities[i3] * speed * delta * 60;
      positions[i3 + 1] += particles.velocities[i3 + 1] * speed * delta * 60;
      positions[i3 + 2] += particles.velocities[i3 + 2] * speed * delta * 60;
      
      // Add subtle wobble
      positions[i3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001;
      positions[i3 + 2] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.001;
      
      // Reset particle if it goes too high
      if (positions[i3 + 1] > height) {
        positions[i3 + 1] = 0;
      }
      
      // Keep particles within bounds (wrap around)
      const halfSpread = spread / 2;
      if (positions[i3] > halfSpread) positions[i3] = -halfSpread;
      if (positions[i3] < -halfSpread) positions[i3] = halfSpread;
      if (positions[i3 + 2] > halfSpread) positions[i3 + 2] = -halfSpread;
      if (positions[i3 + 2] < -halfSpread) positions[i3 + 2] = halfSpread;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        map={particleTexture}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
