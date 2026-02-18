
import { useState } from 'react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';

export const useCommunity = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const submitRepairFix = async (issueId: string, proof: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/community/repairs/${issueId}/fix`, proof);
      addToast('Fix submitted for verification', 'success');
      return response.data;
    } catch (err: any) {
      addToast('Failed to submit fix', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, submitRepairFix };
};
