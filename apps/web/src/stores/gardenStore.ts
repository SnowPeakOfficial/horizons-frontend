/**
 * Garden Store
 * Manages garden state and operations
 */

import { create } from 'zustand';
import gardenService from '../services/gardenService';
import flowerService from '../services/flowerService';
import { deleteMediaFiles } from '../services/uploadService';
import type { Garden, CreateGardenRequest, UpdateGardenRequest } from '../types/api.types';

interface GardenState {
  gardens: Garden[];
  currentGarden: Garden | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Actions
  fetchGardens: () => Promise<void>;
  fetchGardenById: (id: string) => Promise<void>;
  createGarden: (data: CreateGardenRequest) => Promise<Garden>;
  updateGarden: (id: string, data: UpdateGardenRequest) => Promise<Garden>;
  deleteGarden: (id: string) => Promise<void>;
  setCurrentGarden: (garden: Garden | null) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useGardenStore = create<GardenState>((set) => ({
  gardens: [],
  currentGarden: null,
  isLoading: false,
  error: null,
  successMessage: null,

  fetchGardens: async () => {
    set({ isLoading: true, error: null });
    try {
      const gardens = await gardenService.getMyGardens();
      set({ gardens, isLoading: false });
    } catch (error) {
      const err = error as { message?: string; statusCode?: number; error?: string };
      let errorMsg = 'Unable to load your gardens. Please try again.';
      if (err.error === 'NETWORK_ERROR' || err.statusCode === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      }
      set({ error: errorMsg, isLoading: false });
    }
  },

  fetchGardenById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const garden = await gardenService.getGarden(id);
      set({ currentGarden: garden, isLoading: false });
    } catch (error) {
      const err = error as { message?: string; status?: number; statusCode?: number; response?: { status?: number }; error?: string };
      const status = err.status ?? err.response?.status ?? err.statusCode;
      let errorMsg = 'Unable to load this garden. Please try again.';
      if (err.error === 'NETWORK_ERROR' || status === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      } else if (status === 403 || status === 401) {
        errorMsg = "You don't have access to this garden.";
      } else if (status === 404) {
        errorMsg = "This garden doesn't exist or may have been deleted.";
      }
      set({ error: errorMsg, isLoading: false, currentGarden: null });
      // Re-throw so GardenPage can handle 403 with a redirect (no toast)
      const enhanced = new Error(errorMsg) as Error & { status?: number };
      enhanced.status = status;
      throw enhanced;
    }
  },

  createGarden: async (data: CreateGardenRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newGarden = await gardenService.createGarden(data);
      set((state) => ({
        gardens: [...state.gardens, newGarden],
        isLoading: false,
        successMessage: 'Garden created! 🌸',
      }));
      return newGarden;
    } catch (error) {
      const err = error as { message?: string; statusCode?: number; error?: string };
      let errorMsg = 'Unable to create your garden. Please try again.';
      if (err.error === 'NETWORK_ERROR' || err.statusCode === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      } else if (err.statusCode === 403) {
        // Pass through tier limit messages as-is — they're already user-friendly
        errorMsg = err.message || "You've reached your garden limit. Upgrade your plan to create more gardens.";
      } else if (err.statusCode && err.statusCode >= 500) {
        errorMsg = 'Something went wrong on our end. Please try again in a moment.';
      }
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  updateGarden: async (id: string, data: UpdateGardenRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedGarden = await gardenService.updateGarden(id, data);
      set((state) => ({
        gardens: state.gardens.map((g) => (g.id === id ? updatedGarden : g)),
        currentGarden: state.currentGarden?.id === id ? updatedGarden : state.currentGarden,
        isLoading: false,
        successMessage: 'Garden updated!',
      }));
      return updatedGarden;
    } catch (error) {
      const err = error as { message?: string; statusCode?: number; error?: string };
      let errorMsg = 'Unable to update this garden. Please try again.';
      if (err.error === 'NETWORK_ERROR' || err.statusCode === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      } else if (err.statusCode === 403) {
        errorMsg = err.message || "You don't have permission to update this garden.";
      } else if (err.statusCode && err.statusCode >= 500) {
        errorMsg = 'Something went wrong on our end. Please try again in a moment.';
      }
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  deleteGarden: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all flowers with content BEFORE deleting the garden, so we can
      // collect the Firebase Storage URLs and clean them up afterwards.
      // If this fails (e.g. network issue), we still proceed — media cleanup
      // is fire-and-forget and should never block the delete itself.
      const flowers = await flowerService.getGardenFlowers(id, true).catch(() => []);
      const mediaUrls = flowers.flatMap((f) =>
        (f.content ?? []).flatMap((c) => [c.imageUrl, c.voiceUrl, c.videoUrl])
      );

      // Delete garden from DB first (source of truth — cascades to flowers/content in DB)
      await gardenService.deleteGarden(id);

      // Clean up Firebase Storage files fire-and-forget (non-blocking)
      deleteMediaFiles(mediaUrls);

      set((state) => ({
        gardens: state.gardens.filter((g) => g.id !== id),
        currentGarden: state.currentGarden?.id === id ? null : state.currentGarden,
        isLoading: false,
        successMessage: 'Garden deleted',
      }));
    } catch (error) {
      const err = error as { message?: string; statusCode?: number; error?: string };
      let errorMsg = 'Unable to delete this garden. Please try again.';
      if (err.error === 'NETWORK_ERROR' || err.statusCode === 0) {
        errorMsg = "Our servers are temporarily unavailable. Please try again in a moment.";
      } else if (err.statusCode === 403) {
        errorMsg = 'Only the garden owner can delete this garden.';
      } else if (err.statusCode && err.statusCode >= 500) {
        errorMsg = 'Something went wrong on our end. Please try again in a moment.';
      }
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  setCurrentGarden: (garden: Garden | null) => {
    set({ currentGarden: garden });
  },

  clearError: () => {
    set({ error: null });
  },

  clearSuccess: () => {
    set({ successMessage: null });
  },
}));
