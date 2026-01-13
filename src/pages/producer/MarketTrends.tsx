
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, BarChart3, ArrowUpRight } from 'lucide-react';

const MarketTrends = () => {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
                <p className="text-muted-foreground">Insights powered by NutriSaath consumer network & ONDC trends.</p>
                <Badge variant="outline" className="mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Note: Data shown is for demonstration purposes.
                </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* High Demand Categories */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5 text-green-600" /> High Demand
                        </CardTitle>
                        <CardDescription>Top searching categories this week</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-medium">Organic Millets</p>
                                <p className="text-xs text-muted-foreground">Health - Bangalore</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">+24%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-medium">Jaggery Cookies</p>
                                <p className="text-xs text-muted-foreground">Bakery - Mumbai</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">+18%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-medium">Low Sodium Chips</p>
                                <p className="text-xs text-muted-foreground">Snacks - Delhi</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">+12%</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* District Opportunities */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="w-5 h-5 text-blue-600" /> ODOP Insights
                        </CardTitle>
                        <CardDescription>Opportunities for district products</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <ArrowUpRight className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-900">Tumakuru Ragi</p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        High demand in urban metro clusters. Consider smaller 200g trial packs for wider reach.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            <p>Connecting your ODOP product to ONDC creates 3x visibility in non-native districts.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Batch Recommendations */}
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart3 className="w-5 h-5 text-purple-600" /> Smart Forecast
                        </CardTitle>
                        <CardDescription>Recommended production planning</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Millet Cookies Inventory</span>
                                    <span className="text-sm text-muted-foreground">Low (4 days left)</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[15%]"></div>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="font-bold text-purple-900 mb-1">Recommendation:</p>
                                <p className="text-sm text-purple-800">
                                    Schedule a batch of <strong>500 units</strong> of Millet Cookies for next Monday to meet predicted weekend surge.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MarketTrends;
