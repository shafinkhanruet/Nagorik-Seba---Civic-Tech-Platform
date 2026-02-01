
import React, { Suspense } from 'react';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../context/ToastContext';
import { NotificationProvider } from '../context/NotificationContext';
import { DemoModeIndicator } from '../components/DemoModeIndicator';
import { SessionWarning } from '../components/SessionWarning';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { Loader2 } from 'lucide-react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <AppProvider>
      <ToastProvider>
        <NotificationProvider>
          {/* Debug/Environment Indicators */}
          <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex justify-center">
             <div className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-b shadow-lg opacity-90">
               Preview Environment (HashRouter)
             </div>
          </div>
          
          <DemoModeIndicator />
          <SessionWarning />
          <RoleSwitcher />
          
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
          }>
            {children}
          </Suspense>
        </NotificationProvider>
      </ToastProvider>
    </AppProvider>
  );
};
