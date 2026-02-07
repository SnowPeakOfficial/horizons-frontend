/**
 * Flower Service
 * Handles all flower-related API calls
 */

import api from './api';
import type {
  Flower,
  FlowerDefinition,
  PlantFlowerRequest,
  AddFlowerContentRequest,
  UpdateFlowerPositionRequest,
  FlowerContent,
} from '../types/api.types';

class FlowerService {
  /**
   * Get all flowers in a garden
   */
  async getGardenFlowers(gardenId: string): Promise<Flower[]> {
    const response = await api.get<Flower[]>(`/gardens/${gardenId}/flowers`);
    return response.data;
  }

  /**
   * Get a specific flower by ID
   */
  async getFlower(flowerId: string): Promise<Flower> {
    const response = await api.get<Flower>(`/flowers/${flowerId}`);
    return response.data;
  }

  /**
   * Plant a new flower
   */
  async plantFlower(data: PlantFlowerRequest): Promise<Flower> {
    const response = await api.post<Flower>('/flowers', data);
    return response.data;
  }

  /**
   * Update flower position
   */
  async updateFlowerPosition(data: UpdateFlowerPositionRequest): Promise<Flower> {
    const response = await api.patch<Flower>(
      `/flowers/${data.flowerId}/position`,
      { position: data.position, rotation: data.rotation }
    );
    return response.data;
  }

  /**
   * Delete a flower
   */
  async deleteFlower(flowerId: string): Promise<void> {
    await api.delete(`/flowers/${flowerId}`);
  }

  /**
   * Add content to a flower
   */
  async addContent(data: AddFlowerContentRequest): Promise<FlowerContent> {
    const response = await api.post<FlowerContent>(
      `/flowers/${data.flowerId}/content`,
      {
        phase: data.phase,
        text: data.text,
        voiceUrl: data.voiceUrl,
        videoUrl: data.videoUrl,
      }
    );
    return response.data;
  }

  /**
   * Trigger a flower to bloom (if it's in BUD state)
   */
  async bloomFlower(flowerId: string): Promise<Flower> {
    const response = await api.post<Flower>(`/flowers/${flowerId}/bloom`);
    return response.data;
  }

  /**
   * Get all available flower definitions
   */
  async getFlowerDefinitions(): Promise<FlowerDefinition[]> {
    const response = await api.get<FlowerDefinition[]>('/flower-definitions');
    return response.data;
  }

  /**
   * Get flower definitions available for user's tier
   */
  async getMyFlowerDefinitions(): Promise<FlowerDefinition[]> {
    const response = await api.get<FlowerDefinition[]>('/flower-definitions/my-tier');
    return response.data;
  }

  /**
   * Get a specific flower definition
   */
  async getFlowerDefinition(definitionId: string): Promise<FlowerDefinition> {
    const response = await api.get<FlowerDefinition>(`/flower-definitions/${definitionId}`);
    return response.data;
  }
}

export default new FlowerService();
