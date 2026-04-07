/**
 * Flower Store
 * Manages flower state and operations
 */

import { create } from 'zustand';
import flowerService from '../services/flowerService';
import { deleteMediaFiles } from '../services/uploadService';
import type { Flower, PlantFlowerRequest, FlowerDefinition } from '../types/api.types';
import toast from 'react-hot-toast';

interface FlowerState {
  flowers: Flower[];
  flowerDefinitions: FlowerDefinition[];
  selectedFlower: Flower | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Actions
  fetchFlowersByGarden: (gardenId: string) => Promise<void>;
  fetchFlowerDefinitions: () => Promise<void>;
  plantFlower: (gardenId: string, data: Omit<PlantFlowerRequest, 'gardenId'>) => Promise<Flower>;
  pushFlower: (flower: Flower) => void;
  deleteFlower: (flowerId: string) => Promise<void>;
  setSelectedFlower: (flower: Flower | null) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useFlowerStore = create<FlowerState>((set, get) => ({
  flowers: [],
  flowerDefinitions: [],
  selectedFlower: null,
  isLoading: false,
  error: null,
  successMessage: null,

  fetchFlowersByGarden: async (gardenId: string) => {
    set({ isLoading: true, error: null });
    try {
      const flowers = await flowerService.getGardenFlowers(gardenId);
      set({ flowers, isLoading: false });
    } catch (error) {
      const err = error as { message?: string; status?: number; statusCode?: number; response?: { status?: number }; error?: string };
      const status = err.status ?? err.response?.status ?? err.statusCode;
      let errorMsg = 'Unable to load flowers. Please try again.';
      if (err.error === 'NETWORK_ERROR' || status === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      } else if (status === 403) {
        errorMsg = "You don't have access to this garden.";
      }
      set({ error: errorMsg, isLoading: false });
      // Re-throw with status so GardenPage can handle 403 (no toast here)
      const enhanced = new Error(errorMsg) as Error & { status?: number };
      enhanced.status = status;
      throw enhanced;
    }
  },

  fetchFlowerDefinitions: async () => {
    set({ isLoading: true, error: null });
    try {
      const flowerDefinitions = await flowerService.getFlowerDefinitions();
      set({ flowerDefinitions, isLoading: false });
    } catch (error) {
      // Not shown to users — just log it silently
      set({ isLoading: false });
      console.error('Failed to fetch flower definitions:', error);
    }
  },

  plantFlower: async (gardenId: string, data: Omit<PlantFlowerRequest, 'gardenId'>) => {
    set({ isLoading: true, error: null });
    try {
      const newFlower = await flowerService.plantFlower(gardenId, data);
      // NOTE: We intentionally do NOT add the flower to state.flowers here.
      // The caller (PlantFlowerPanel) is responsible for uploading media,
      // calling addContent, and then calling pushFlower() once everything
      // is ready — so the flower appears in the garden fully populated.
      set({ isLoading: false });
      return newFlower;
    } catch (error) {
      const err = error as { message?: string; statusCode?: number; error?: string; code?: string };
      let errorMsg = 'Unable to plant this flower. Please try again.';
      if (err.error === 'NETWORK_ERROR' || err.statusCode === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      } else if (err.statusCode === 403) {
        // Pass through tier limit / permission messages — they're already user-friendly
        errorMsg = err.message || "You don't have permission to plant flowers in this garden.";
      } else if (err.statusCode && err.statusCode >= 500) {
        errorMsg = 'Something went wrong on our end. Please try again in a moment.';
      } else if (err.message && !err.message.toLowerCase().includes('standard') && !err.message.toLowerCase().includes('blooming')) {
        // Pass through readable backend messages, but block developer-facing ones
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  /**
   * Adds a fully-populated flower to the garden view.
   * Called by PlantFlowerPanel after all uploads and addContent calls are done,
   * so the flower appears in the garden with its media already attached.
   */
  pushFlower: (flower: Flower) => {
    set((state) => ({
      flowers: [...state.flowers, flower],
      successMessage: 'Flower planted! 🌸',
    }));
  },

  deleteFlower: async (flowerId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Collect all media URLs from the flower's content before deleting
      const flower = get().flowers.find((f) => f.id === flowerId);
      const mediaUrls = flower?.content?.flatMap((c) => [
        c.imageUrl,
        c.voiceUrl,
        c.videoUrl,
      ]) ?? [];

      // Delete flower from DB first (source of truth)
      await flowerService.deleteFlower(flowerId);

      // Clean up Firebase Storage files fire-and-forget (non-blocking)
      deleteMediaFiles(mediaUrls);

      set((state) => ({
        flowers: state.flowers.filter((f) => f.id !== flowerId),
        selectedFlower: state.selectedFlower?.id === flowerId ? null : state.selectedFlower,
        isLoading: false,
        successMessage: 'Flower removed',
      }));
    } catch (error) {
      const err = error as { message?: string; statusCode?: number; error?: string };
      let errorMsg = 'Unable to remove this flower. Please try again.';
      if (err.error === 'NETWORK_ERROR' || err.statusCode === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      } else if (err.statusCode === 403) {
        errorMsg = 'Only the person who planted this flower or the garden owner can remove it.';
      } else if (err.statusCode && err.statusCode >= 500) {
        errorMsg = 'Something went wrong on our end. Please try again in a moment.';
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  setSelectedFlower: (flower: Flower | null) => {
    set({ selectedFlower: flower });
  },

  clearError: () => {
    set({ error: null });
  },

  clearSuccess: () => {
    set({ successMessage: null });
  },
}));
