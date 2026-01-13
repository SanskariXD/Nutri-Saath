import { Home, Scan, BookOpen, User, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      to: '/consumer',
      icon: Home,
      label: t('home'),
      active: location.pathname === '/consumer'
    },
    {
      to: '/consumer/learn',
      icon: BookOpen,
      label: t('learn'),
      active: location.pathname.startsWith('/consumer/learn')
    },
    {
      to: '/consumer/scan',
      icon: Scan,
      label: t('scan'),
      active: location.pathname === '/consumer/scan',
      center: true
    },
    {
      to: '/consumer/info',
      icon: AlertTriangle,
      label: t('info'),
      active: location.pathname === '/consumer/info',
    },
    {
      to: '/consumer/profile',
      icon: User,
      label: t('profile'),
      active: location.pathname.startsWith('/consumer/profile')
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex h-16 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label, active, center }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative",
              center && "mx-2",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {center ? (
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                "bg-gradient-primary shadow-material-lg hover:shadow-glow interactive-scale",
                "-mt-6 border-4 border-background"
              )}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            ) : (
              <>
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    active && "scale-110"
                  )}
                />
                <span className="text-xs font-medium">{label}</span>
                {active && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;