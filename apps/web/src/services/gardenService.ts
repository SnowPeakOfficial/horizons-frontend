/**
 * Garden Service
 * Handles all garden-related API calls
 */

import api from './api';
import type {
  Garden,
  CreateGardenRequest,
  UpdateGardenRequest,
  AddGardenMemberRequest,
  GardenMember,
  GardenDefinition,
} from '../types/api.types';

class GardenService {
  /**
   * Get all gardens for current user
   */
  async getMyGardens(): Promise<Garden[]> {
    const response = await api.get<Garden[]>('/gardens');
    return response.data;
  }

  /**
   * Get a specific garden by ID
   */
  async getGarden(gardenId: string): Promise<Garden> {
    const response = await api.get<Garden>(`/gardens/${gardenId}`);
    return response.data;
  }

  /**
   * Create a new garden
   */
  async createGarden(data: CreateGardenRequest): Promise<Garden> {
    const response = await api.post<Garden>('/gardens', data);
    return response.data;
  }

  /**
   * Update an existing garden
   */
  async updateGarden(gardenId: string, data: UpdateGardenRequest): Promise<Garden> {
    const response = await api.patch<Garden>(`/gardens/${gardenId}`, data);
    return response.data;
  }

  /**
   * Delete a garden
   */
  async deleteGarden(gardenId: string): Promise<void> {
    await api.delete(`/gardens/${gardenId}`);
  }

  /**
   * Archive a garden
   */
  async archiveGarden(gardenId: string): Promise<Garden> {
    return this.updateGarden(gardenId, { status: 'ARCHIVED' });
  }

  /**
   * Add a member to a garden
   */
  async addMember(gardenId: string, data: AddGardenMemberRequest): Promise<GardenMember> {
    const response = await api.post<GardenMember>(`/gardens/${gardenId}/members`, data);
    return response.data;
  }

  /**
   * Remove a member from a garden
   */
  async removeMember(gardenId: string, memberId: string): Promise<void> {
    await api.delete(`/gardens/${gardenId}/members/${memberId}`);
  }

  /**
   * Get all available garden definitions
   */
  async getGardenDefinitions(): Promise<GardenDefinition[]> {
    const response = await api.get<GardenDefinition[]>('/garden-definitions');
    return response.data;
  }

  /**
   * Get garden definitions available for user's tier
   */
  async getMyGardenDefinitions(): Promise<GardenDefinition[]> {
    const response = await api.get<GardenDefinition[]>('/garden-definitions/my-tier');
    return response.data;
  }
}

export default new GardenService();
