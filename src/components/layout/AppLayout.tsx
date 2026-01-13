import { ReactNode, useEffect } from 'react';
import BottomNavigation from './BottomNavigation';
import { useAppStore } from '@/lib/store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

const AppLayout = ({ children, showBottomNav = true }: AppLayoutProps) => {
  const { t } = useTranslation();
  const { isOffline, setOfflineStatus } = useAppStore();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status
    setOfflineStatus(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOfflineStatus]);

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Banner */}
      {isOffline && (
        <Alert className="mx-4 mt-4 border-warning bg-warning/10">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            {t('offlineMessage')}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <main className={cn(
        "min-h-screen",
        showBottomNav ? "pb-16" : "" // Account for bottom nav
      )}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;