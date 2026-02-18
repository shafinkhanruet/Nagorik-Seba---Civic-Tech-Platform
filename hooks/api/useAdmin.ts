
import { useState } from 'react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const toggleCrisisMode = async (active: boolean, reason: string) => {
    setLoading(true);
    try {
      await apiClient.post('/admin/crisis', { active, reason });
      addToast(`Crisis Mode ${active ? 'Activated' : 'Deactivated'}`, active ? 'error' : 'success');
    } catch (err: any) {
      addToast('Failed to update crisis state', 'error');
    } finally {
      setLoading(false);
    }
  };

  const moderateContent = async (id: string, action: string, reason: string) => {
    setLoading(true);
    try {
      await apiClient.post('/admin/moderate', { id, action, reason });
      addToast('Moderation action applied', 'success');
    } catch (err) {
      addToast('Moderation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (id: string, status: string, reason: string) => {
    setLoading(true);
    try {
      await apiClient.post(`/admin/projects/${id}/status`, { status, reason });
      addToast(`Project status updated to ${status}`, 'success');
    } catch (err) {
      addToast('Failed to update project', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { loading, toggleCrisisMode, moderateContent, updateProjectStatus };
};
