import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PondProps {
  position: [number, number, number];
  radius: number;
}

/**
 * Pond component - PLA-style integrated water feature
 * Quarter-circle pond with depth, terrain integration, and realistic water
 */
export function Pond({ position, radius }: PondProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const basinRef = useRef<THREE.Mesh>(null);
  
  // Create quarter-circle pond shape (soccer corner arc style)
  const pondShape = useMemo(() => {
    const shape = new THREE.Shape();
    const segments = 64; // Higher resolution for smoother curves
    
    // Start at corner origin
    shape.moveTo(0, 0);
    
    // Draw quarter circle arc
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * (Math.PI / 2); // 0 to 90 degrees
      const x = -Math.cos(angle) * radius; // Negative X (toward center from east wall)
      const z = -Math.sin(angle) * radius; // Negative Z (toward center from south wall)
      shape.lineTo(x, z);
    }
    
    // Close back to origin
    shape.lineTo(0, 0);
    
    return shape;
  }, [radius]);
  
  // Create basin geometry with depth
  const basinGeometry = useMemo(() => {
    const segments = 64;
    const depth = 0.4; // How deep the pond basin goes
    
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];
    
    // Create layered geometry for depth effect
    const layers = 8;
    
    for (let layer = 0; layer <= layers; layer++) {
      const layerDepth = (layer / layers) * depth;
      const layerRadius = radius * (1 - layer / (layers * 2)); // Gradually smaller
      
      // Center vertex for this layer
      const centerIndex = vertices.length / 3;
      vertices.push(0, -layerDepth, 0);
      uvs.push(0.5, 0.5);
      
      // Arc vertices for this layer
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * (Math.PI / 2);
        const x = -Math.cos(angle) * layerRadius;
        const z = -Math.sin(angle) * layerRadius;
        
        vertices.push(x, -layerDepth, z);
        uvs.push(i / segments, layer / layers);
        
        // Create triangles (except for last layer)
        if (layer < layers && i < segments) {
          const current = centerIndex + i + 1;
          const next = centerIndex + i + 2;
          const belowCenter = centerIndex + segments + 2;
          const belowCurrent = belowCenter + i + 1;
          const belowNext = belowCenter + i + 2;
          
          // Top triangle
          indices.push(centerIndex, current, next);
          
          // Side triangles
          if (layer > 0) {
            indices.push(current, belowCurrent, next);
            indices.push(next, belowCurrent, belowNext);
          }
        }
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [radius]);
  
  // PLA-style water shader with reflections and depth
  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDeepWater: { value: new THREE.Color(0x3B9DB5) }, // Deeper blue-teal
        uShallowWater: { value: new THREE.Color(0x7FD8E8) }, // Lighter teal
        uFoam: { value: new THREE.Color(0xC4EEF5) }, // White-ish foam
        uSunColor: { value: new THREE.Color(0xFFFFDD) }, // Warm sunlight
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vWave;
        
        // Improved wave function for natural water movement
        float wave(vec2 pos, float time) {
          return sin(pos.x * 2.0 + time * 1.5) * 0.015 +
                 sin(pos.y * 1.8 + time * 1.2) * 0.015 +
                 sin((pos.x + pos.y) * 1.5 + time) * 0.01;
        }
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Calculate wave displacement
          vec3 pos = position;
          float w = wave(pos.xy, uTime);
          pos.z += w;
          vWave = w;
          
          // Calculate normal for wave
          float offset = 0.1;
          float wX = wave(pos.xy + vec2(offset, 0.0), uTime);
          float wY = wave(pos.xy + vec2(0.0, offset), uTime);
          
          vec3 tangentX = normalize(vec3(offset, 0.0, wX - w));
          vec3 tangentY = normalize(vec3(0.0, offset, wY - w));
          vNormal = normalize(cross(tangentY, tangentX));
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepWater;
        uniform vec3 uShallowWater;
        uniform vec3 uFoam;
        uniform vec3 uSunColor;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vWave;
        
        void main() {
          // Distance from center (for depth gradient)
          float distFromCenter = length(vPosition.xy);
          float depthFactor = smoothstep(0.0, 1.0, distFromCenter / 10.0);
          
          // Animated ripples
          float ripple1 = sin(vUv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
          float ripple2 = sin(vUv.y * 18.0 - uTime * 1.8) * 0.5 + 0.5;
          float ripples = (ripple1 * ripple2) * 0.2;
          
          // Caustics effect (underwater light patterns)
          float caustic1 = sin(vPosition.x * 3.0 + vPosition.y * 2.5 + uTime * 0.5);
          float caustic2 = sin(vPosition.x * 2.5 - vPosition.y * 3.0 - uTime * 0.4);
          float caustics = (caustic1 * caustic2) * 0.15 + 0.15;
          
          // Mix deep and shallow water based on depth
          vec3 waterColor = mix(uShallowWater, uDeepWater, depthFactor * 0.5);
          
          // Add ripples and caustics
          waterColor = mix(waterColor, uShallowWater, ripples);
          waterColor += uSunColor * caustics * 0.1;
          
          // Foam at edges
          float edgeFoam = smoothstep(0.95, 1.0, distFromCenter / 10.0);
          waterColor = mix(waterColor, uFoam, edgeFoam * 0.3);
          
          // Fresnel effect for reflections
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.0);
          vec3 reflectionColor = mix(waterColor, uSunColor, fresnel * 0.3);
          
          // Keep colors vibrant
          vec3 finalColor = mix(waterColor, reflectionColor, 0.4);
          
          // Opacity - more transparent at edges
          float alpha = mix(0.85, 0.92, depthFactor);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);
  
  // Basin material - earthy brown
  const basinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x6B5A3D, // Brown earth color
      roughness: 0.9,
      metalness: 0.1,
    });
  }, []);
  
  // Animate water
  useFrame((state) => {
    if (waterRef.current) {
      const material = waterRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <group position={position}>
      {/* Pond basin - creates depth */}
      <mesh
        ref={basinRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        receiveShadow
      >
        <primitive object={basinGeometry} />
        <primitive object={basinMaterial} />
      </mesh>
      
      {/* Water surface - quarter circle filling corner */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <shapeGeometry args={[pondShape]} />
        <primitive object={waterMaterial} />
      </mesh>
    </group>
  );
}
