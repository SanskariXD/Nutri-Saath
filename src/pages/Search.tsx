import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Scan, RefreshCcw, Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductService, type Product } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  // Check backend health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await ProductService.checkBackendHealth();
      setBackendHealthy(healthy);
    };
    checkHealth();
  }, []);

  // Auto-search when query changes from URL
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      handleSearch(urlQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery?: string) => {
    const trimmed = (searchQuery || query).trim();
    if (!trimmed) {
      setError(t('enter_product_name'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults([]);

      console.log('🔍 [SEARCH PAGE] Searching for:', trimmed);
      const { products } = await ProductService.searchProducts(trimmed, 1, 20, true);
      console.log('🔍 [SEARCH PAGE] Search results:', products);

      setResults(products);

      // Update URL with search query
      setSearchParams({ q: trimmed });

      if (products.length === 0) {
        toast({
          title: t('no_matches_found'),
          description: t('try_different_spelling'),
        });
      } else {
        toast({
          title: t('search_completed'),
          description: t('found_count', { count: products.length }),
        });
      }
    } catch (err) {
      console.error('🔍 [SEARCH PAGE] Search failed:', err);
      const message = err instanceof Error ? err.message : t('unable_to_search');
      setError(message);
      toast({
        title: t('search_failed'),
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const handleProductClick = (product: Product) => {
    console.log('🔍 [SEARCH PAGE] Product clicked:', product.barcode);
    navigate(`/consumer/product/${product.barcode}`);
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </Button>

            <h1 className="text-lg font-semibold">{t('search_products')}</h1>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/consumer/scan')}
              className="gap-2"
            >
              <Scan className="w-4 h-4" />
              {t('scan')}
            </Button>
          </div>
        </header>

        <div className="px-6 py-6">
          {/* Search Form */}
          <Card className="shadow-material-lg mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{t('search_products')}</CardTitle>
              <CardDescription>
                {t('search_products_subtitle')}
              </CardDescription>
              {backendHealthy !== null && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${backendHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {t('backend_status', { status: backendHealthy ? t('connected') : t('disconnected') })}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('enter_product_placeholder')}
                    className="h-12 text-base"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    className="h-12 px-6"
                    disabled={loading || !query.trim()}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    {loading ? t('searching') : t('search')}
                  </Button>
                </div>
              </form>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-12 flex items-center justify-center gap-2"
                  onClick={() => navigate('/consumer/scan')}
                >
                  <Scan className="w-4 h-4" />
                  {t('scan_barcode')}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 flex items-center justify-center gap-2"
                  onClick={() => navigate('/')}
                >
                  <RefreshCcw className="w-4 h-4" />
                  {t('go_home')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {results.length > 0 && (
            <Card className="shadow-material-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  {t('search_results')}
                </CardTitle>
                <CardDescription>
                  {t('found_count', { count: results.length })} {t('matching_query', { query })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map((product) => (
                  <div
                    key={product.barcode}
                    className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/48x48/4F46E5/FFFFFF?text=Product'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (!e.currentTarget.src.includes('via.placeholder.com')) {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48/4F46E5/FFFFFF?text=Product';
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand || 'Brand unavailable'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {product.category || 'General'}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${product.vegMark === 'veg'
                                ? 'bg-success/10 text-success border-success/30'
                                : product.vegMark === 'non-veg'
                                  ? 'bg-destructive/10 text-destructive border-destructive/30'
                                  : 'bg-warning/10 text-warning border-warning/30'
                              }`}
                          >
                            {product.vegMark === 'veg' ? '🟢 ' + t('veg') :
                              product.vegMark === 'non-veg' ? '🔴 ' + t('non_veg') :
                                product.vegMark === 'egg' ? '🟡 ' + t('contains_egg') : t('diet_info_unavailable')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                      >
                        {t('view_details')}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {t('barcode')}: {product.barcode}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* No Results Message */}
          {!loading && query && results.length === 0 && !error && (
            <Card className="shadow-material-md">
              <CardContent className="py-8 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">{t('no_products_found')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('no_products_found_try', { query })}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• {t('tip_different_spelling')}</li>
                  <li>• {t('tip_brand_instead')}</li>
                  <li>• {t('tip_scan_instead')}</li>
                </ul>
                <Button onClick={() => navigate('/consumer/scan')} className="bg-gradient-primary">
                  <Scan className="w-4 h-4 mr-2" />
                  {t('scan_barcode_instead')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SearchPage;
