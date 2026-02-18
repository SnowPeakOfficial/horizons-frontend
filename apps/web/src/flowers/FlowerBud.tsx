import { useMemo } from 'react';
import { Shape, DoubleSide, ExtrudeGeometry } from 'three';

interface FlowerBudProps {
  position?: [number, number, number];
  scale?: number;
  color?: string; // Kept for API compatibility — not used (all buds identical)
}

/**
 * Leaf — ExtrudeGeometry for thickness, quadratic Bezier for leaf silhouette.
 * The shape draws upward from (0,0), so the base of the leaf is the origin.
 * Parent group rotation controls which direction the leaf sweeps.
 */
function Leaf({ leafScale = 1 }: { leafScale?: number }) {
  const geometry = useMemo(() => {
    const s = leafScale;
    const shape = new Shape();

    shape.moveTo(0, 0);
    shape.quadraticCurveTo(-0.3 * s, 0.5 * s, 0, 1.0 * s); // left edge
    shape.quadraticCurveTo( 0.3 * s, 0.5 * s, 0, 0);        // right edge back

    return new ExtrudeGeometry(shape, {
      depth: 0.04 * s,
      bevelEnabled: true,
      bevelThickness: 0.006 * s,
      bevelSize: 0.006 * s,
      bevelSegments: 2,
      curveSegments: 16,
    });
  }, [leafScale]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        color="#72c435"
        roughness={0.55}
        metalness={0}
        side={DoubleSide}
        emissive="#2a5c0a"
        emissiveIntensity={0.04}
      />
    </mesh>
  );
}

/**
 * Sprout — 🌱 in 3D
 *
 * Static, no animation.
 * Leaves emerge from stem top in OPPOSITE directions:
 *   Left leaf:  rotation.y = 0        →  extends in the +Z direction
 *   Right leaf: rotation.y = Math.PI  →  extends in the -Z direction (opposite)
 *   Both leaves tilt upward via rotation.x = -0.4
 *
 * Size: scale * 1.294 (1.125 * 1.15 — 15% bigger than the previous version)
 */
export function FlowerBud({
  position = [0, 0, 0],
  scale = 1,
}: FlowerBudProps) {
  // 15% bigger than the previous 1.125x version → 1.125 * 1.15 ≈ 1.294
  const s = scale * 1.6;

  // Stem top is at y = stemHeight = 0.8 * s
  const stemHeight = 0.8 * s;

  return (
    <group position={position}>

      {/* ── STEM ── */}
      <mesh position={[0, stemHeight / 2, 0]}>
        <cylinderGeometry args={[
          0.032 * s,    // radiusTop
          0.05 * s,     // radiusBottom
          stemHeight,   // height
          8
        ]} />
        <meshStandardMaterial
          color="#52a020"
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      {/* ── LEFT LEAF ──
          Positioned at stem top.
          rotation.y = 0      → leaf extends in the +Z direction.
          rotation.x = -0.4   → tilts upward from horizontal.
      ── */}
      <group
        position={[0, stemHeight, 0]}
        rotation={[-0.4, 0, 0]}
      >
        <Leaf leafScale={0.4 * s} />
      </group>

      {/* ── RIGHT LEAF ──
          Same position at stem top.
          rotation.y = Math.PI → leaf extends in the -Z direction (opposite).
          rotation.x = -0.4    → tilts upward from horizontal.
          Slightly smaller for natural asymmetry.
      ── */}
      <group
        position={[0, stemHeight, 0]}
        rotation={[-0.4, Math.PI, 0]}
      >
        <Leaf leafScale={0.38 * s} />
      </group>

    </group>
  );
}
