import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  Calendar, 
  ExternalLink, 
  Bell,
  Shield,
  Info as InfoIcon,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'recall' | 'warning' | 'advisory';
  title: string;
  description: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  affectedProducts: string[];
  source: string;
  link?: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'recall',
    title: 'Maggi Noodles Recall - Lead & MSG Issues',
    description: 'FSSAI has banned Maggi noodles due to excess lead content and undeclared MSG. All variants recalled from market.',
    date: '2015-06-05',
    severity: 'high',
    affectedProducts: ['Maggi 2-Minute Noodles', 'Maggi Cuppa Noodles'],
    source: 'FSSAI',
    link: 'https://fssai.gov.in'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Artificial Colors in Sweets - Festival Alert',
    description: 'High levels of non-permitted artificial colors detected in festival sweets. Consumers advised to check for FSSAI license.',
    date: '2024-10-15',
    severity: 'medium',
    affectedProducts: ['Festival Sweets', 'Colored Mithai'],
    source: 'State Food Authority',
  },
  {
    id: '3',
    type: 'advisory',
    title: 'Packaged Water Quality Advisory',
    description: 'Regular monitoring of packaged drinking water brands. Some brands found non-compliant with BIS standards.',
    date: '2024-09-20',
    severity: 'medium',
    affectedProducts: ['Various Water Brands'],
    source: 'Bureau of Indian Standards'
  }
];

const Info = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recall': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'warning': return 'bg-warning/10 text-warning border-warning/30';
      case 'advisory': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
        {/* Header */}
        <header className="px-6 pt-12 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-material-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Food Safety Alerts
              </h1>
              <p className="text-muted-foreground">Stay informed about food recalls & safety</p>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="shadow-material-md">
            <CardContent className="p-4">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts, products, or brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              
              <Tabs value={selectedType} onValueChange={setSelectedType}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="recall">Recalls</TabsTrigger>
                  <TabsTrigger value="warning">Warnings</TabsTrigger>
                  <TabsTrigger value="advisory">Advisory</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </header>

        {/* Alerts List */}
        <div className="px-6 pb-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-destructive">{mockAlerts.filter(a => a.type === 'recall').length}</div>
              <div className="text-xs text-muted-foreground">Active Recalls</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-warning">{mockAlerts.filter(a => a.type === 'warning').length}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{mockAlerts.filter(a => a.type === 'advisory').length}</div>
              <div className="text-xs text-muted-foreground">Advisories</div>
            </Card>
          </div>

          {/* Alerts */}
          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => (
              <Card
                key={alert.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-material-md interactive-scale stagger-item",
                  "border-l-4",
                  alert.severity === 'high' ? 'border-l-destructive' :
                  alert.severity === 'medium' ? 'border-l-warning' : 'border-l-muted'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor(alert.type)} variant="outline">
                        {alert.type.toUpperCase()}
                      </Badge>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(alert.date).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{alert.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Affected Products:</h4>
                      <div className="flex flex-wrap gap-2">
                        {alert.affectedProducts.map((product, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        Source: {alert.source}
                      </div>
                      {alert.link && (
                        <Button variant="outline" size="sm" className="text-xs">
                          <ExternalLink className="w-3 h-3 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <Card className="p-8 text-center">
              <CardContent>
                <InfoIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No alerts found matching your criteria.</p>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Get Instant Alerts</h3>
                    <p className="text-sm text-muted-foreground">Enable notifications for critical food safety alerts</p>
                  </div>
                </div>
                <Button variant="outline">
                  Enable Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Info;