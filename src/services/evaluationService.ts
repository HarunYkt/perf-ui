import api from '../lib/api';
import { Evaluation } from '../types';

export interface EvaluationSummary {
  totalEvaluations: number;
  averageScore: number;
  evaluationsByType: Record<string, number>;
  recentEvaluations: Evaluation[];
}

// Evaluation API Service
export const evaluationService = {
  // GET /api/evaluations/me
  async getMySummary(): Promise<EvaluationSummary> {
    const { data } = await api.get('/evaluations/me');
    return data;
  },

  // GET /api/evaluations/me/given
  async getMyEvaluations(): Promise<Evaluation[]> {
    const { data } = await api.get('/evaluations/me/given');
    return data;
  },

  // GET /api/evaluations/{userId}
  async getEvaluationsForUser(userId: number): Promise<Evaluation[]> {
    const { data } = await api.get(`/evaluations/${userId}`);
    return data;
  },

  // GET /api/evaluations/me/received - Get evaluations received by current user with filters
  async getMyReceivedEvaluations(filters?: {
    year?: number;
    quarter?: string;
    type?: string;
  }): Promise<{
    evaluations: any[];
    statistics: {
      averageScore: number;
      totalCount: number;
      typeBreakdown: Record<string, number>;
      yearBreakdown: Record<string, number>;
    };
    filters: {
      year: number | null;
      quarter: string | null;
      type: string | null;
    };
  }> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.quarter) params.append('quarter', filters.quarter);
    if (filters?.type) params.append('type', filters.type);
    
    const { data } = await api.get(`/evaluations/me/received?${params.toString()}`);
    return data;
  }
};
