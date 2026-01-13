
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Package, Smartphone, AlertTriangle, TrendingUp } from 'lucide-react';

const ProducerDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Producer Dashboard</h1>
                    <p className="text-muted-foreground">Manage your products, batches and compliance.</p>
                </div>
                <Button onClick={() => navigate('/producer/wizard')}>
                    + New Label Draft
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Across 3 product lines</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Recalls</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Action required immediately</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/producer/wizard')}>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                            <Package className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Label Wizard</h3>
                            <p className="text-sm text-muted-foreground">Draft FSSAI compliant labels</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/producer/trust-code')}>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="p-4 rounded-full bg-secondary/10 text-secondary">
                            <Smartphone className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Trust Code</h3>
                            <p className="text-sm text-muted-foreground">Generate QR for batches</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/producer/recalls')}>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Recalls</h3>
                            <p className="text-sm text-muted-foreground">Manage product recalls</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => { }}>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                            <TrendingUp className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Market Trends</h3>
                            <p className="text-sm text-muted-foreground">View demand insights</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProducerDashboard;
