import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NotificationItem, WatchlistItem, NotificationSettings, NotificationType } from '../types';

interface NotificationContextType {
  notifications: NotificationItem[];
  watchlist: WatchlistItem[];
  settings: NotificationSettings;
  unreadCount: number;
  toggleFollow: (item: WatchlistItem) => void;
  isFollowing: (id: string) => boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateSettings: (newSettings: NotificationSettings) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_SETTINGS: NotificationSettings = {
  emailAlerts: true,
  pushAlerts: true,
  projectUpdates: true,
  districtScores: true,
  reportStatus: true,
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'project',
    title: 'Project Budget Update',
    message: 'The "Meghna Bridge" project budget has been revised.',
    timestamp: '10 mins ago',
    read: false,
    link: '/app/govt-projects'
  },
  {
    id: '2',
    type: 'district',
    title: 'District Score Changed',
    message: 'Sylhet district integrity score increased by 2%.',
    timestamp: '2 hours ago',
    read: false,
    link: '/app/integrity'
  },
  {
    id: '3',
    type: 'report',
    title: 'Report Verified',
    message: 'Your report regarding "Road Repair" has been verified by the community.',
    timestamp: '1 day ago',
    read: true,
    link: '/app/reports'
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  // Load from local storage on mount
  useEffect(() => {
    const savedNotifs = localStorage.getItem('civic_notifications');
    const savedWatchlist = localStorage.getItem('civic_watchlist');
    const savedSettings = localStorage.getItem('civic_notif_settings');

    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    } else {
      setNotifications(MOCK_NOTIFICATIONS); // Load mock if empty for demo
    }

    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('civic_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('civic_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('civic_notif_settings', JSON.stringify(settings));
  }, [settings]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleFollow = (item: WatchlistItem) => {
    setWatchlist(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFollowing = (id: string) => {
    return watchlist.some(i => i.id === id);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      watchlist,
      settings,
      unreadCount,
      toggleFollow,
      isFollowing,
      markAsRead,
      markAllAsRead,
      updateSettings,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};