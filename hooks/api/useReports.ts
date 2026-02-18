
import { useState, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import { Report } from '../../types';
import { useToast } from '../../context/ToastContext';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const fetchReports = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await apiClient.get('/reports', { params });
      setReports(response.data);
    } catch (err: any) {
      addToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const submitReport = async (formData: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/reports', formData);
      addToast('Report submitted successfully', 'success');
      // Optimistic update or refresh
      fetchReports(); 
      return response.data;
    } catch (err: any) {
      addToast('Submission failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (reportId: string, type: 'support' | 'doubt') => {
    try {
      const response = await apiClient.post(`/reports/${reportId}/vote`, { type });
      setReports(prev => prev.map(r => r.id === reportId ? { 
        ...r, 
        weightedSupport: response.data.newWeightedScore,
        truthScore: response.data.newTruthScore 
      } : r));
      addToast('Vote recorded', 'success');
    } catch (err: any) {
      addToast('Voting failed', 'error');
    }
  };

  return { reports, loading, fetchReports, submitReport, castVote };
};
