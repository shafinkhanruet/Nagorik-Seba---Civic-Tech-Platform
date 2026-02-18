
import { useState } from 'react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';

export const useRTI = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const fetchRequests = async (params?: any) => {
    setLoading(true);
    try {
      const response = await apiClient.get('/rti', { params });
      return response.data;
    } catch (err) {
      addToast('Failed to fetch RTI requests', 'error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitRTI = async (payload: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/rti', payload);
      addToast('RTI Request filed successfully', 'success');
      return response.data;
    } catch (err: any) {
      addToast('Failed to file RTI', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const respondToRTI = async (id: string, responseText: string) => {
    setLoading(true);
    try {
      await apiClient.post(`/admin/rti/${id}/response`, { response: responseText });
      addToast('Response sent', 'success');
    } catch (err: any) {
      addToast('Failed to send response', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchRequests, submitRTI, respondToRTI };
};
