import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
  size: number;
}

/**
 * Create a round particle texture for softer appearance
 */
function createRoundParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  
  // Create radial gradient for soft round particle
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * FloatingParticles - Magical dust motes and sparkles drifting through the garden
 */
export function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Generate particle data
  const particleData = useMemo(() => {
    const particles: ParticleData[] = [];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          Math.random() * 8 + 1,
          (Math.random() - 0.5) * 40
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          Math.random() * 0.2 + 0.1,
          (Math.random() - 0.5) * 0.3
        ),
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 0.3 + 0.15,
      });
    }
    
    return particles;
  }, []);
  
  // Create geometry and material
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleData.length * 3);
    const sizes = new Float32Array(particleData.length);
    
    particleData.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      sizes[i] = particle.size;
    });
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const mat = new THREE.PointsMaterial({
      size: 0.1,
      color: '#F4D03F', // Warm golden pollen color
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      map: createRoundParticleTexture(),
    });
    
    return { geometry: geo, material: mat };
  }, [particleData]);
  
  // Animate particles
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    particleData.forEach((particle, i) => {
      // Drift upward
      particle.position.y += particle.velocity.y * 0.016;
      
      // Gentle sway
      const swayX = Math.sin(time + particle.phase) * 0.02;
      const swayZ = Math.cos(time + particle.phase * 1.3) * 0.02;
      
      particle.position.x += swayX + particle.velocity.x * 0.016;
      particle.position.z += swayZ + particle.velocity.z * 0.016;
      
      // Reset if too high or out of bounds
      if (particle.position.y > 10 || 
          Math.abs(particle.position.x) > 25 || 
          Math.abs(particle.position.z) > 25) {
        particle.position.set(
          (Math.random() - 0.5) * 40,
          1,
          (Math.random() - 0.5) * 40
        );
      }
      
      // Update buffer
      positions.setXYZ(i, particle.position.x, particle.position.y, particle.position.z);
    });
    
    positions.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} geometry={geometry} material={material} />
  );
}

/**
 * Fountain Sparkles - Special sparkles near fountain
 */
export function FountainSparkles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Generate sparkle data near fountain
  const sparkleData = useMemo(() => {
    const sparkles: ParticleData[] = [];
    const count = 15;
    
    for (let i = 0; i < count; i++) {
      sparkles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          Math.random() * 3 + 0.5,
          (Math.random() - 0.5) * 4
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          Math.random() * 0.15 + 0.05,
          (Math.random() - 0.5) * 0.2
        ),
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 0.25 + 0.1,
      });
    }
    
    return sparkles;
  }, []);
  
  // Create geometry and material
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkleData.length * 3);
    const sizes = new Float32Array(sparkleData.length);
    
    sparkleData.forEach((sparkle, i) => {
      positions[i * 3] = sparkle.position.x;
      positions[i * 3 + 1] = sparkle.position.y;
      positions[i * 3 + 2] = sparkle.position.z;
      sizes[i] = sparkle.size;
    });
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const mat = new THREE.PointsMaterial({
      size: 0.25,
      color: '#87CEEB', // Sky blue sparkles
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    
    return { geometry: geo, material: mat };
  }, [sparkleData]);
  
  // Animate sparkles
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    sparkleData.forEach((sparkle, i) => {
      // Drift upward from fountain
      sparkle.position.y += sparkle.velocity.y * 0.016;
      
      // Spiral motion
      const spiral = time + sparkle.phase;
      sparkle.position.x += Math.cos(spiral * 2) * 0.01;
      sparkle.position.z += Math.sin(spiral * 2) * 0.01;
      
      // Reset if too high
      if (sparkle.position.y > 4) {
        sparkle.position.set(
          (Math.random() - 0.5) * 4,
          0.5,
          (Math.random() - 0.5) * 4
        );
      }
      
      // Update buffer
      positions.setXYZ(i, sparkle.position.x, sparkle.position.y, sparkle.position.z);
    });
    
    positions.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} geometry={geometry} material={material} />
  );
}
