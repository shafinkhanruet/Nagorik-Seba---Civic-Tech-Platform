
import { useState } from 'react';
import apiClient from '../../services/apiClient';

export const useNotificationsApi = () => {
  const [loading, setLoading] = useState(false);

  const markNotificationRead = async (id: string) => {
    setLoading(true);
    try {
      console.log("INITIATING: markNotificationRead", id);
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark read", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      console.log("INITIATING: markAllRead");
      await apiClient.post('/notifications/read-all');
    } catch (err) {}
  };

  return { loading, markNotificationRead, markAllRead };
};
