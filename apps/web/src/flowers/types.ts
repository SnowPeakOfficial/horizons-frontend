/**
 * Flower System Types
 * Matches backend schema for flowers and garden content
 */

export type UserTier = 'FREE' | 'PRO' | 'PREMIUM';

export interface FlowerDefinition {
  id: number;
  name: string;
  description: string;
  color: string;
  modelPath: string;
  budModelPath?: string; // Optional: for flowers like cactus with separate bud model
  symbolism: string;
  defaultScale: number;
  tier: UserTier;
  emoji: string;
}

export type FlowerState = 'BUD' | 'BLOOMED' | 'OPEN';
export type FlowerType = 'STANDARD' | 'BLOOMING';

export interface PlacedFlower {
  id: string;
  flowerDefinitionId: number;
  gardenId: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  scale: number;
  placedAt: Date;
  type: FlowerType;  // STANDARD or BLOOMING
  state: FlowerState;  // Current bloom state
  bloomAt?: Date;  // Optional scheduled bloom time
  bloomedAt?: Date;  // When the flower actually bloomed
  recipientName?: string;  // Who the flower is for
  plantedBy?: {
    name: string;
    email?: string;
  };  // Who planted the flower
}

/**
 * Available flower definitions
 * Keys match backend flower definition keys exactly
 */
export const FLOWER_DEFINITIONS: Record<string, FlowerDefinition> = {
  // ============================================
  // FREE TIER (3 flowers)
  // ============================================
  
  forget_me_not: {
    id: 1,
    name: 'Forget-Me-Not',
    description: 'A small bloom with a lasting memory — soft, steady, unforgettable.',
    color: '#87CEEB',
    modelPath: '/models/flowers/ForgetMeNot.glb',
    symbolism: 'A small bloom with a lasting memory — soft, steady, unforgettable.',
    defaultScale: 1.2,
    tier: 'FREE',
    emoji: '💙'
  },
  
  daisy_simple: {
    id: 2,
    name: 'Daisy',
    description: 'A gentle kind of joy — simple, sincere, and quietly bright.',
    color: '#FFFFFF',
    modelPath: '/models/flowers/Daisy.glb',
    symbolism: 'A gentle kind of joy — simple, sincere, and quietly bright.',
    defaultScale: 1.5,
    tier: 'FREE',
    emoji: '🌼'
  },
  
  // Alias for backward compatibility
  daisy: {
    id: 2,
    name: 'Daisy',
    description: 'A gentle kind of joy — simple, sincere, and quietly bright.',
    color: '#FFFFFF',
    modelPath: '/models/flowers/Daisy.glb',
    symbolism: 'A gentle kind of joy — simple, sincere, and quietly bright.',
    defaultScale: 1.5,
    tier: 'FREE',
    emoji: '🌼'
  },
  
  sunflower_bright: {
    id: 3,
    name: 'Sunflower',
    description: 'Always turning toward the light — bold, loyal, and full of warmth.',
    color: '#FFD700',
    modelPath: '/models/flowers/Sunflower.glb',
    symbolism: 'Always turning toward the light — bold, loyal, and full of warmth.',
    defaultScale: 1.35,
    tier: 'FREE',
    emoji: '🌻'
  },
  
  // ============================================
  // PRO TIER (5 flowers)
  // ============================================
  
  rose_classic: {
    id: 4,
    name: 'Rose',
    description: 'Love in its most classic form — deep, intentional, and enduring.',
    color: '#FF0000',
    modelPath: '/models/flowers/Rose.glb',
    symbolism: 'Love in its most classic form — deep, intentional, and enduring.',
    defaultScale: 0.0144,
    tier: 'PRO',
    emoji: '🌹'
  },
  
  tulip_spring: {
    id: 5,
    name: 'Tulip',
    description: 'A fresh beginning — graceful, hopeful, and full of possibility.',
    color: '#FF69B4',
    modelPath: '/models/flowers/Tulip.glb',
    symbolism: 'A fresh beginning — graceful, hopeful, and full of possibility.',
    defaultScale: 1.0,
    tier: 'PRO',
    emoji: '🌷'
  },
  
  hibiscus_tropical: {
    id: 6,
    name: 'Hibiscus',
    description: 'Vivid and expressive — a bloom that feels like sunlight on skin.',
    color: '#FF6B9D',
    modelPath: '/models/flowers/Hibiscus.glb',
    symbolism: 'Vivid and expressive — a bloom that feels like sunlight on skin.',
    defaultScale: 1.1,
    tier: 'PRO',
    emoji: '🌺'
  },
  
  cactus_resilient: {
    id: 7,
    name: 'Cactus Flower',
    description: 'Beauty that survives the harshest seasons — strong, rare, and quietly radiant.',
    color: '#FF1493',
    modelPath: '/models/flowers/Cactus.glb',
    budModelPath: '/models/flowers/BarrelCactus.glb', // Special: use barrel cactus as bud
    symbolism: 'Beauty that survives the harshest seasons — strong, rare, and quietly radiant.',
    defaultScale: 0.8,
    tier: 'PRO',
    emoji: '🌵'
  },
  
  desert_lily: {
    id: 8,
    name: 'Desert Lily',
    description: 'A rare bloom against the odds — proof that hope can grow anywhere.',
    color: '#FFFACD',
    modelPath: '/models/flowers/DesertLily.glb',
    symbolism: 'A rare bloom against the odds — proof that hope can grow anywhere.',
    defaultScale: 1.0,
    tier: 'PRO',
    emoji: '🏜️'
  },
  
  // ============================================
  // PREMIUM TIER (3 flowers)
  // ============================================
  
  iris_reflective: {
    id: 9,
    name: 'Iris',
    description: 'A bloom of depth and reflection — carrying quiet wisdom and grace.',
    color: '#9370DB',
    modelPath: '/models/flowers/Iris.glb',
    symbolism: 'A bloom of depth and reflection — carrying quiet wisdom and grace.',
    defaultScale: 1.0,
    tier: 'PREMIUM',
    emoji: '💜'
  },
  
  orchid_rare: {
    id: 10,
    name: 'Orchid',
    description: 'Delicate and extraordinary — a bloom reserved for moments that matter.',
    color: '#DA70D6',
    modelPath: '/models/flowers/Orchid.glb',
    symbolism: 'Delicate and extraordinary — a bloom reserved for moments that matter.',
    defaultScale: 0.9,
    tier: 'PREMIUM',
    emoji: '🌸'
  },
  
  lotus_still: {
    id: 11,
    name: 'Lotus',
    description: 'Rising untouched from still waters — serene, resilient, and transformed.',
    color: '#FFC0CB',
    modelPath: '/models/flowers/Lotus.glb',
    symbolism: 'Rising untouched from still waters — serene, resilient, and transformed.',
    defaultScale: 1.0,
    tier: 'PREMIUM',
    emoji: '🪷'
  }
};

/**
 * Get flower definition by ID
 */
export function getFlowerDefinition(id: number): FlowerDefinition | undefined {
  return Object.values(FLOWER_DEFINITIONS).find(def => def.id === id);
}

/**
 * Generate unique flower ID
 */
export function generateFlowerId(): string {
  return `flower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
