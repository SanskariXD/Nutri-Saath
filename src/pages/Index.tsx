import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Search,
  Clock,
  User,
  BookOpen,
  MessageCircle,
  Lightbulb,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { recentScans, currentProfile } = useAppStore();

  const handleScan = () => {
    navigate('/consumer/scan');
  };

  const handleBillScan = () => {
    navigate('/consumer/bill-scan');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/consumer/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (barcode: string) => {
    navigate(`/consumer/product/${barcode}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
        {/* Streamlined Header */}
        <header className="relative px-4 md:px-5 pt-16 pb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('tagline').split('.')[0]}.
                </span>
                <br />
                <span className="text-foreground">{t('tagline').split('.')[1]}</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('decode_labels_instant')}
              </p>
            </div>

            <div className="text-right">
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card shadow-material-md flex items-center justify-center mb-3 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => navigate('/consumer/profile')}
              >
                <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <p className="text-xs md:text-sm font-semibold capitalize text-primary">{currentProfile.type}</p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{recentScans.length}</div>
              <div className="text-sm text-muted-foreground">{t('scanned')}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-success">100%</div>
              <div className="text-sm text-muted-foreground">{t('india_focused')}</div>
            </div>
          </div>
        </header>

        {/* Main Actions */}
        <div className="px-4 md:px-5 space-y-8 mb-12">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleScan}
              className={cn(
                "h-12 md:h-14 text-sm md:text-base font-bold rounded-2xl relative overflow-hidden",
                "bg-gradient-primary hover:shadow-glow shadow-material-lg",
                "transition-all duration-300 interactive-scale group"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <Scan className="w-5 h-5 text-white" />
                <span className="text-white">{t('scan_product')}</span>
              </div>
            </Button>

            <Button
              onClick={handleBillScan}
              variant="outline"
              className={cn(
                "h-12 md:h-14 text-sm md:text-base font-bold rounded-2xl border-2",
                "hover:bg-secondary/10 border-secondary/30 hover:border-secondary/50",
                "transition-all duration-300 interactive-scale"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <Receipt className="w-5 h-5 text-secondary" />
                <span className="text-secondary">{t('bill_scan')}</span>
              </div>
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="shadow-material-md">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder={t('search_home_placeholder')}
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
                  {t('search')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="p-6 hover:shadow-material-md transition-all duration-200 interactive-scale cursor-pointer group"
              onClick={() => navigate('/consumer/learn')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('learn_reading')}</h3>
                  <p className="text-xs text-muted-foreground">{t('master_labels')}</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-material-md transition-all duration-200 interactive-scale cursor-pointer group"
              onClick={() => navigate('/consumer/food-assistant')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto group-hover:bg-secondary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('food_assistant')}</h3>
                  <p className="text-xs text-muted-foreground">{t('ask_nutrition_ai')}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="px-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 shadow-material-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{t('did_you_know')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {t('tip_samosa_vs_chips')}
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                    {t('learnMore')} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <div className="px-6 pb-8">
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
                <p className="text-muted-foreground mb-4">{t('noRecentScans')}</p>
                <Button
                  variant="outline"
                  onClick={handleScan}
                >
                  {t('openScanner')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;