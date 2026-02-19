/**
 * Flower Store
 * Manages flower state and operations
 */

import { create } from 'zustand';
import flowerService from '../services/flowerService';
import type { Flower, PlantFlowerRequest, FlowerDefinition } from '../types/api.types';
import toast from 'react-hot-toast';

interface FlowerState {
  flowers: Flower[];
  flowerDefinitions: FlowerDefinition[];
  selectedFlower: Flower | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFlowersByGarden: (gardenId: string) => Promise<void>;
  fetchFlowerDefinitions: () => Promise<void>;
  plantFlower: (gardenId: string, data: Omit<PlantFlowerRequest, 'gardenId'>) => Promise<Flower>;
  deleteFlower: (flowerId: string) => Promise<void>;
  setSelectedFlower: (flower: Flower | null) => void;
  clearError: () => void;
}

export const useFlowerStore = create<FlowerState>((set) => ({
  flowers: [],
  flowerDefinitions: [],
  selectedFlower: null,
  isLoading: false,
  error: null,

  fetchFlowersByGarden: async (gardenId: string) => {
    set({ isLoading: true, error: null });
    try {
      const flowers = await flowerService.getGardenFlowers(gardenId);
      set({ flowers, isLoading: false });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to fetch flowers';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  fetchFlowerDefinitions: async () => {
    set({ isLoading: true, error: null });
    try {
      const flowerDefinitions = await flowerService.getFlowerDefinitions();
      set({ flowerDefinitions, isLoading: false });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to fetch flower types';
      set({ error: errorMsg, isLoading: false });
      console.error('Failed to fetch flower definitions:', error);
    }
  },

  plantFlower: async (gardenId: string, data: Omit<PlantFlowerRequest, 'gardenId'>) => {
    set({ isLoading: true, error: null });
    try {
      const newFlower = await flowerService.plantFlower(gardenId, data);
      set((state) => ({
        flowers: [...state.flowers, newFlower],
        isLoading: false,
      }));
      toast.success('Flower planted successfully! 🌸');
      return newFlower;
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to plant flower';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  deleteFlower: async (flowerId: string) => {
    set({ isLoading: true, error: null });
    try {
      await flowerService.deleteFlower(flowerId);
      set((state) => ({
        flowers: state.flowers.filter((f) => f.id !== flowerId),
        selectedFlower: state.selectedFlower?.id === flowerId ? null : state.selectedFlower,
        isLoading: false,
      }));
      toast.success('Flower removed');
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to delete flower';
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  setSelectedFlower: (flower: Flower | null) => {
    set({ selectedFlower: flower });
  },

  clearError: () => {
    set({ error: null });
  },
}));
