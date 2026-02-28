import { useGLTF } from '@react-three/drei';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { PlacedFlower, FlowerDefinition } from './types';
import { AnimatedFlowerBloom } from './AnimatedFlowerBloom';

interface FlowerModelProps {
  flower: PlacedFlower;
  definition: FlowerDefinition;
  onHover?: (hovered: boolean, flower?: PlacedFlower, definition?: FlowerDefinition, worldPosition?: { x: number; y: number; z: number }, screenPosition?: { x: number; y: number }) => void;
  onClick?: (flower: PlacedFlower) => void;
  onDragStart?: (flower: PlacedFlower) => void;
  onDrag?: (flower: PlacedFlower, position: { x: number; y: number; z: number }) => void;
  onDragEnd?: (flower: PlacedFlower, position: { x: number; y: number; z: number }) => void;
  draggable?: boolean;
}

/**
 * FlowerModel - Renders a single flower in the 3D garden
 * Supports hover, click, and drag interactions
 */
export function FlowerModel({
  flower,
  definition,
  onHover,
  onClick,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = true
}: FlowerModelProps) {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const dragPlaneRef = useRef<THREE.Mesh>(null);
  const hoverTimeoutRef = useRef<number>();
  const { camera, raycaster, gl, scene } = useThree();
  const dragOffsetRef = useRef(new THREE.Vector3());
  const pointerDownTimeRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  
  // Derive bloom state from flower state (no useEffect needed)
  const isBloom = flower.state === 'BLOOMED' || flower.state === 'OPEN';
  
  // Create invisible drag plane at ground level
  const dragPlane = useMemo(() => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    return plane;
  }, []);
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    // Show immediately (no delay on hover)
    setHovered(true);
    // Pass flower data, world position, and screen position to parent
    const worldPos = meshRef.current
      ? { x: meshRef.current.position.x, y: meshRef.current.position.y, z: meshRef.current.position.z }
      : { x: flower.position.x, y: flower.position.y, z: flower.position.z };
    const screenPos = { x: e.clientX, y: e.clientY };
    onHover?.(true, flower, definition, worldPos, screenPos);
    if (draggable) {
      document.body.style.cursor = 'grab';
    }
  };
  
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    // Small 50ms delay to prevent flicker, but short enough for rapid switching
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHovered(false);
      onHover?.(false);
      if (!dragging) {
        document.body.style.cursor = 'default';
      }
    }, 50);
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    // Calculate time and distance since pointer down
    const clickDuration = Date.now() - pointerDownTimeRef.current;
    const pointerMoveDist = Math.sqrt(
      Math.pow(e.clientX - pointerDownPosRef.current.x, 2) +
      Math.pow(e.clientY - pointerDownPosRef.current.y, 2)
    );
    
    // Only trigger click if it was quick and didn't move much (not a drag)
    if (clickDuration < 300 && pointerMoveDist < 10) {
      console.log(`🌸 Flower clicked: ${definition.name} (state: ${flower.state})`);
      onClick?.(flower);
    } else {
      console.log(`🚫 Click ignored (drag detected): duration=${clickDuration}ms, distance=${pointerMoveDist}px`);
    }
  };
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (draggable) {
      e.stopPropagation();
      
      // Track pointer down time and position for click detection
      pointerDownTimeRef.current = Date.now();
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      
      setDragging(true);
      onDragStart?.(flower);
      document.body.style.cursor = 'grabbing';
      
      // Calculate offset from click point to flower center
      if (meshRef.current) {
        const flowerPos = meshRef.current.position;
        dragOffsetRef.current.set(
          e.point.x - flowerPos.x,
          0,
          e.point.z - flowerPos.z
        );
      }
    }
  };
  
  // Use global pointer move for smooth dragging
  useEffect(() => {
    if (!dragging || !draggable) return;
    
    const handleGlobalPointerMove = (event: PointerEvent) => {
      if (!meshRef.current) return;
      
      // Convert screen coordinates to normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Raycast to terrain (or fallback to flat plane)
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // Try to find terrain mesh
      const terrainMesh = scene.getObjectByName('terrain');
      let newX = 0;
      let newY = 0;
      let newZ = 0;
      
      if (terrainMesh) {
        // Raycast against actual terrain
        const intersects = raycaster.intersectObject(terrainMesh, false);
        
        if (intersects.length > 0) {
          const intersectPoint = intersects[0].point;
          newX = intersectPoint.x;
          newY = intersectPoint.y; // Use terrain height!
          newZ = intersectPoint.z;
        } else {
          // Fallback to flat plane if no intersection
          const intersectPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(dragPlane, intersectPoint);
          if (intersectPoint) {
            newX = intersectPoint.x - dragOffsetRef.current.x;
            newY = 0;
            newZ = intersectPoint.z - dragOffsetRef.current.z;
          }
        }
      } else {
        // No terrain found, use flat plane
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, intersectPoint);
        if (intersectPoint) {
          newX = intersectPoint.x - dragOffsetRef.current.x;
          newY = 0;
          newZ = intersectPoint.z - dragOffsetRef.current.z;
        }
      }
      
      // Constrain to garden bounds
      const maxDistance = 28; // Match garden size (60/2 = 30, slight padding)
      const distance = Math.sqrt(newX ** 2 + newZ ** 2);
      if (distance > maxDistance) {
        const scale = maxDistance / distance;
        newX *= scale;
        newZ *= scale;
        
        // Recalculate Y at constrained position if we have terrain
        if (terrainMesh) {
          const constrainedRay = new THREE.Raycaster(
            new THREE.Vector3(newX, 100, newZ),
            new THREE.Vector3(0, -1, 0)
          );
          const constrainedIntersects = constrainedRay.intersectObject(terrainMesh, false);
          if (constrainedIntersects.length > 0) {
            newY = constrainedIntersects[0].point.y;
          }
        }
      }
      
      const newPosition = { x: newX, y: newY, z: newZ };
      meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
      onDrag?.(flower, newPosition);
    };
    
    const handleGlobalPointerUp = () => {
      setDragging(false);
      document.body.style.cursor = hovered ? 'grab' : 'default';
      
      if (meshRef.current) {
        const finalPosition = {
          x: meshRef.current.position.x,
          y: meshRef.current.position.y,
          z: meshRef.current.position.z
        };
        onDragEnd?.(flower, finalPosition);
      }
    };
    
    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [dragging, draggable, camera, raycaster, gl, dragPlane, flower, onDrag, onDragEnd, hovered]);
  
  return (
    <group
      ref={meshRef}
      position={[flower.position.x, flower.position.y, flower.position.z]}
      rotation={[0, flower.rotation, 0]}
      scale={definition.defaultScale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      {/* Animated bloom transition */}
      <AnimatedFlowerBloom
        definition={definition}
        isBloom={isBloom}
        scale={flower.scale}
        onBloomComplete={() => {
          console.log(`${definition.name} bloomed!`);
        }}
      />
      
      
      {/* Hover indicator - subtle circle on ground */}
      {hovered && (
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0.05, 0]}
          scale={1 / definition.defaultScale}
        >
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial 
            color={
              // Mystery mode: hide color for BLOOMING buds
              flower.type === 'BLOOMING' && flower.state === 'BUD'
                ? '#A8B89F'  // Neutral sage green (matches bud color)
                : definition.color  // Actual flower color after bloom
            }
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}

// Preload all flower models
// FREE Tier
useGLTF.preload('/models/flowers/ForgetMeNot.glb');
useGLTF.preload('/models/flowers/Daisy.glb');
useGLTF.preload('/models/flowers/Sunflower.glb');

// PRO Tier
useGLTF.preload('/models/flowers/Rose.glb');
useGLTF.preload('/models/flowers/Tulip.glb');
useGLTF.preload('/models/flowers/Hibiscus.glb');
useGLTF.preload('/models/flowers/Cactus.glb');
useGLTF.preload('/models/flowers/BarrelCactus.glb'); // Cactus bud
useGLTF.preload('/models/flowers/DesertLily.glb');

// PREMIUM Tier
useGLTF.preload('/models/flowers/Iris.glb');
useGLTF.preload('/models/flowers/Orchid.glb');
useGLTF.preload('/models/flowers/Lotus.glb');
