/**
 * LetterPreviewFlower
 * Tiny shared 3D flower mesh used inside LetterPreviewModal.
 */

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

interface Props {
  modelPath: string;
  scale: number;
  offset?: [number, number, number];
}

export default function LetterPreviewFlower({ modelPath, scale, offset = [0, 0, 0] }: Props) {
  const { scene } = useGLTF(modelPath);
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} scale={scale} position={offset} />;
}
