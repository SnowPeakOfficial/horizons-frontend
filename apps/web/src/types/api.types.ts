/**
 * API Types - Matching backend schema
 * These types define the contract between frontend and backend
 */

// ============================================
// USER & AUTHENTICATION
// ============================================

export const UserTier = {
  FREE: 'FREE',
  PRO: 'PRO',
  PREMIUM: 'PREMIUM',
} as const;

export type UserTier = (typeof UserTier)[keyof typeof UserTier];

export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  tier: UserTier;
  createdAt: string;
  updatedAt: string;
  emailPreferences?: EmailPreferences;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// ============================================
// GARDENS
// ============================================

export const GardenStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;

export type GardenStatus = (typeof GardenStatus)[keyof typeof GardenStatus];

export const GardenMemberRole = {
  OWNER: 'OWNER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  VIEWER: 'VIEWER',
} as const;

export type GardenMemberRole = (typeof GardenMemberRole)[keyof typeof GardenMemberRole];

export interface GardenDefinition {
  id: string;
  key: string;
  displayName: string;
  description: string | null;
  primaryColor: string;
  secondaryColor: string;
  skyGradient: string;
  groundTexture: string;
  ambientLight: string;
  weatherEffect: string;
  motionLevel: string;
  tierAccess: UserTier;
  isLimitedEdition: boolean;
  createdAt: string;
}

export interface Garden {
  id: string;
  ownerId: string;
  title: string;
  gardenDefinitionId: string | null;
  status: GardenStatus;
  createdAt: string;
  updatedAt: string;
  gardenDefinition?: GardenDefinition;
  members?: GardenMember[];
  flowers?: Flower[];
  _count?: {
    flowers: number;
    members: number;
  };
}

export interface GardenMember {
  id: string;
  gardenId: string;
  userId: string;
  role: GardenMemberRole;
  joinedAt: string;
  user?: User;
}

export interface CreateGardenRequest {
  title: string;
  gardenDefinitionId?: string;
}

export interface UpdateGardenRequest {
  title?: string;
  gardenDefinitionId?: string;
  status?: GardenStatus;
}

export interface AddGardenMemberRequest {
  email: string;
  role?: GardenMemberRole;
}

// ============================================
// FLOWERS
// ============================================

export const FlowerType = {
  STANDARD: 'STANDARD',
  BLOOMING: 'BLOOMING',
} as const;

export type FlowerType = (typeof FlowerType)[keyof typeof FlowerType];

export const FlowerState = {
  OPEN: 'OPEN',
  BUD: 'BUD',
  BLOOMED: 'BLOOMED',
} as const;

export type FlowerState = (typeof FlowerState)[keyof typeof FlowerState];

export const FlowerAnimation = {
  NONE: 'NONE',
  GENTLE_SWAY: 'GENTLE_SWAY',
  PULSE: 'PULSE',
  ROTATE: 'ROTATE',
  FLOAT: 'FLOAT',
} as const;

export type FlowerAnimation = (typeof FlowerAnimation)[keyof typeof FlowerAnimation];

export const FlowerParticle = {
  NONE: 'NONE',
  SPARKLES: 'SPARKLES',
  PETALS_FALLING: 'PETALS_FALLING',
  FIREFLIES: 'FIREFLIES',
  SHIMMER: 'SHIMMER',
} as const;

export type FlowerParticle = (typeof FlowerParticle)[keyof typeof FlowerParticle];

export const FlowerContentPhase = {
  SEED: 'SEED',
  BLOOM: 'BLOOM',
  IMMEDIATE: 'IMMEDIATE',
} as const;

export type FlowerContentPhase = (typeof FlowerContentPhase)[keyof typeof FlowerContentPhase];

export interface FlowerDefinition {
  id: string;
  key: string;
  displayName: string;
  description: string | null;
  baseStyle: string;
  defaultColor: string;
  isBloomableAllowed: boolean;
  tierAccess: UserTier;
  isLimitedEdition: boolean;
  createdAt: string;
}

export interface FlowerContent {
  id: string;
  flowerId: string;
  phase: FlowerContentPhase;
  text: string | null;
  voiceUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
}

export interface Flower {
  id: string;
  gardenId: string;
  plantedByUserId: string;
  flowerDefinitionId: string;
  type: FlowerType;
  state: FlowerState;
  bloomAt: string | null;
  customColor: string | null;
  customScale: number;
  hasGlow: boolean;
  glowColor: string | null;
  glowIntensity: number;
  animationStyle: FlowerAnimation;
  particleEffect: FlowerParticle;
  createdAt: string;
  bloomedAt: string | null;
  updatedAt: string;
  
  // Position data (stored as JSON in backend, but we need it structured)
  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: number;
  
  // Relations
  flowerDefinition?: FlowerDefinition;
  content?: FlowerContent[];
  plantedBy?: User;
}

export interface PlantFlowerRequest {
  gardenId: string;
  flowerDefinitionId: string;
  type: FlowerType;
  bloomAt?: string; // ISO date string for BLOOMING type
  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: number;
  customColor?: string;
  customScale?: number;
  hasGlow?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  animationStyle?: FlowerAnimation;
  particleEffect?: FlowerParticle;
}

export interface AddFlowerContentRequest {
  flowerId: string;
  phase: FlowerContentPhase;
  text?: string;
  voiceUrl?: string;
  videoUrl?: string;
}

export interface UpdateFlowerPositionRequest {
  flowerId: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: number;
}

// ============================================
// SUBSCRIPTIONS
// ============================================

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  TRIALING: 'TRIALING',
  CANCELED: 'CANCELED',
  PAST_DUE: 'PAST_DUE',
  INCOMPLETE: 'INCOMPLETE',
  INCOMPLETE_EXPIRED: 'INCOMPLETE_EXPIRED',
  UNPAID: 'UNPAID',
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  tier: UserTier;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckoutSessionRequest {
  tier: 'PRO' | 'PREMIUM';
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface ChangeTierRequest {
  tier: UserTier;
}

// ============================================
// EMAIL PREFERENCES
// ============================================

export interface EmailPreferences {
  id: string;
  userId: string;
  bloomNotifications: boolean;
  invitations: boolean;
  accountUpdates: boolean;
  marketing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmailPreferencesRequest {
  bloomNotifications?: boolean;
  invitations?: boolean;
  accountUpdates?: boolean;
  marketing?: boolean;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}
