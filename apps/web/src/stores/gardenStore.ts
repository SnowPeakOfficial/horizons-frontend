/**
 * Garden Store
 * Manages garden state and operations
 */

import { create } from 'zustand';
import gardenService from '../services/gardenService';
import type { Garden, CreateGardenRequest, UpdateGardenRequest } from '../types/api.types';
import toast from 'react-hot-toast';

interface GardenState {
  gardens: Garden[];
  currentGarden: Garden | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchGardens: () => Promise<void>;
  fetchGardenById: (id: string) => Promise<void>;
  createGarden: (data: CreateGardenRequest) => Promise<Garden>;
  updateGarden: (id: string, data: UpdateGardenRequest) => Promise<Garden>;
  deleteGarden: (id: string) => Promise<void>;
  setCurrentGarden: (garden: Garden | null) => void;
  clearError: () => void;
}

export const useGardenStore = create<GardenState>((set) => ({
  gardens: [],
  currentGarden: null,
  isLoading: false,
  error: null,

  fetchGardens: async () => {
    set({ isLoading: true, error: null });
    try {
      const gardens = await gardenService.getMyGardens();
      set({ gardens, isLoading: false });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to fetch gardens';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  fetchGardenById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const garden = await gardenService.getGarden(id);
      set({ currentGarden: garden, isLoading: false });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to fetch garden';
      set({ error: errorMsg, isLoading: false, currentGarden: null });
      toast.error(errorMsg);
    }
  },

  createGarden: async (data: CreateGardenRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newGarden = await gardenService.createGarden(data);
      set((state) => ({
        gardens: [...state.gardens, newGarden],
        isLoading: false,
      }));
      toast.success('Garden created successfully! 🌸');
      return newGarden;
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to create garden';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
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
      }));
      toast.success('Garden updated successfully!');
      return updatedGarden;
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to update garden';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  deleteGarden: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await gardenService.deleteGarden(id);
      set((state) => ({
        gardens: state.gardens.filter((g) => g.id !== id),
        currentGarden: state.currentGarden?.id === id ? null : state.currentGarden,
        isLoading: false,
      }));
      toast.success('Garden deleted');
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to delete garden';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  setCurrentGarden: (garden: Garden | null) => {
    set({ currentGarden: garden });
  },

  clearError: () => {
    set({ error: null });
  },
}));
