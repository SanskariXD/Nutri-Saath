
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Package, Smartphone, AlertTriangle, TrendingUp, LayoutDashboard, ChevronLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProducerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        {
            to: '/producer/profile',
            icon: Users,
            label: 'Compliance Profile'
        },
        {
            to: '/producer',
            icon: LayoutDashboard,
            label: 'Dashboard',
            exact: true
        },
        {
            to: '/producer/wizard',
            icon: Package,
            label: 'Label Wizard'
        },
        {
            to: '/producer/trust-code',
            icon: Smartphone,
            label: 'Trust Code QR'
        },
        {
            to: '/producer/recalls',
            icon: AlertTriangle,
            label: 'Batch & Recall'
        },
        {
            to: '/producer/market',
            icon: TrendingUp,
            label: 'Market Trends'
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-card border-b md:border-r border-border shrink-0">
                <div className="p-4 border-b border-border flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/start')}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="font-bold text-lg">Producer Portal</h1>
                </div>

                <nav className="p-4 space-y-1 flex overflow-x-auto md:flex-col md:overflow-visible no-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.to
                            : location.pathname.startsWith(item.to);

                        return (
                            <Button
                                key={item.to}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 whitespace-nowrap md:whitespace-normal",
                                    isActive ? "font-medium" : "text-muted-foreground"
                                )}
                                onClick={() => navigate(item.to)}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </Button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ProducerLayout;
