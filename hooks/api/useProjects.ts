
import { useState } from 'react';
import apiClient from '../../services/apiClient';
import { ProjectProposalData } from '../../types';
import { useToast } from '../../context/ToastContext';

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectProposalData[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/projects');
      setProjects(response.data);
    } finally {
      setLoading(false);
    }
  };

  const submitOpinion = async (projectId: string, vote: string, reason: string) => {
    setLoading(true);
    try {
      await apiClient.post(`/projects/${projectId}/opinion`, { vote, reason });
      addToast('Opinion recorded in registry', 'success');
      await fetchProjects(); // Refresh status
    } catch (err: any) {
      addToast('Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, fetchProjects, submitOpinion };
};
