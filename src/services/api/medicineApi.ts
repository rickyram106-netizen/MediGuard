import { apiClient } from './apiClient';

export interface Medicine {
  id: number;
  userId: number;
  medicineName: string;
  genericName: string | null;
  brandName: string | null;
  dosage: string | null;
  unit: string | null;
  frequency: string | null;
  beforeFood: boolean;
  startDate: string;
  endDate: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineRequest {
  medicineName: string;
  genericName?: string;
  brandName?: string;
  dosage?: string;
  unit?: string;
  frequency?: string;
  beforeFood: boolean;
  startDate: string;
  endDate?: string | null;
  notes?: string;
  isActive: boolean;
}

export const medicineApi = {
  getAll: async (): Promise<Medicine[]> => {
    return apiClient<Medicine[]>('/medicine');
  },

  getById: async (id: number): Promise<Medicine> => {
    return apiClient<Medicine>(`/medicine/${id}`);
  },

  create: async (medicine: MedicineRequest): Promise<Medicine> => {
    const response = await apiClient<{ message: string; result: Medicine }>('/medicine', {
      method: 'POST',
      body: JSON.stringify(medicine),
    });

    return response.result;
  },

  update: async (
    id: number,
    medicine: MedicineRequest
  ): Promise<Medicine> => {
    const response = await apiClient<{ message: string; medicine: Medicine }>(
      `/medicine/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(medicine),
      }
    );

    return response.medicine;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient(`/medicine/${id}`, {
      method: 'DELETE',
    });
  },
};