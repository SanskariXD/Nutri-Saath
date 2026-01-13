import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Scan, Search, Clock, Badge as BadgeIcon, User, BookOpen, MessageCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { recentScans, abhaConnected, currentProfile } = useAppStore();

  const handleScan = () => {
    navigate('/scan');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (barcode: string) => {
    navigate(`/product/${barcode}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        {/* Header */}
        <header className="relative px-6 pt-12 pb-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/15 to-primary/15 rounded-full blur-2xl translate-y-24 -translate-x-24" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-material-lg">
                  <BadgeIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Label Samjhega India</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                      ✓ Smart Scanner
                    </Badge>
                    {abhaConnected && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                        Health ID Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div 
                  className="w-12 h-12 rounded-2xl bg-card shadow-material-md flex items-center justify-center mb-2 cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Profile</p>
                <p className="text-sm font-semibold capitalize text-primary">{currentProfile.type}</p>
              </div>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Scan Smart.
                </span>
                <br />
                <span className="text-foreground">Eat Safer.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Decode food labels instantly. Protect your family from hidden dangers.
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{recentScans.length}</div>
                  <div className="text-xs text-muted-foreground">Products Scanned</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">100%</div>
                  <div className="text-xs text-muted-foreground">Indian Focused</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">3</div>
                  <div className="text-xs text-muted-foreground">Languages</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Actions */}
        <div className="px-6 space-y-6 mb-8">
          {/* Scan Button - Hero CTA */}
          <div className="relative">
            <Button
              onClick={handleScan}
              className={cn(
                "w-full h-20 text-xl font-bold rounded-3xl relative overflow-hidden",
                "bg-gradient-primary hover:shadow-glow shadow-material-lg",
                "transition-all duration-300 interactive-scale group"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20">
                  <Scan className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">Open Scanner</div>
                  <div className="text-sm text-white/80">Scan any product instantly</div>
                </div>
              </div>
            </Button>
            
            {/* Floating indicators */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full animate-pulse-glow shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 hover:shadow-material-md transition-all duration-200 interactive-scale cursor-pointer group">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto group-hover:bg-secondary/20 transition-colors">
                  <Search className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Search Products</h3>
                  <p className="text-xs text-muted-foreground">Find by name or brand</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-material-md transition-all duration-200 interactive-scale cursor-pointer group"
              onClick={() => navigate('/learn')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Learn Reading</h3>
                  <p className="text-xs text-muted-foreground">Master label literacy</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="p-4 shadow-material-md">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, brand, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 rounded-xl border-0 bg-muted/50 focus:bg-background transition-colors"
                />
              </div>
              <Button 
                onClick={handleSearch}
                variant="default"
                className="h-12 px-6 rounded-xl bg-gradient-primary interactive-scale"
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </div>
          </Card>
        </div>

        {/* Daily Tip Card */}
        <div className="px-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 shadow-material-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Did You Know?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    A regular samosa contains more calories (262) than a packet of chips (150)! Always check serving sizes on labels.
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Assistant */}
        <div className="px-6 mb-8">
          <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Food Assistant</h3>
                    <p className="text-xs text-muted-foreground">Ask me anything about nutrition</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Chat Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <div className="px-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{t('recentScans')}</h3>
          </div>

          {recentScans.length > 0 ? (
            <div className="space-y-3">
              {recentScans.slice(0, 5).map((product, index) => (
                <Card
                  key={product.barcode}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-material-md",
                    "interactive-scale stagger-item"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleProductClick(product.barcode)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          product.vegMark === 'veg' ? 'bg-success' : 'bg-destructive'
                        )} />
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-muted/30">
              <CardContent>
                <Scan className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">{t('noRecentScans')}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleScan}
                >
                  Start Scanning
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;