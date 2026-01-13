import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, ArrowLeft, Scan, RefreshCcw } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductService, type Product } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const ProductNotFound = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Enter a product name to search');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { products } = await ProductService.searchProducts(trimmed, 1, 10, true);
      setResults(products);
      if (products.length === 0) {
        toast({
          title: 'No matches',
          description: 'Try a different spelling or scan another side of the pack.',
        });
      }
    } catch (err) {
      console.error('Product search failed', err);
      const message = err instanceof Error ? err.message : 'Unable to search products right now';
      setError(message);
      toast({
        title: 'Search failed',
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

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Badge variant="outline" className="uppercase tracking-wide text-xs">
              Barcode {barcode ?? 'unknown'}
            </Badge>
          </div>

          <Card className="shadow-material-lg">
            <CardHeader>
              <CardTitle className="text-xl">No Product Found</CardTitle>
              <CardDescription>
                We could not find details for this barcode. This might be because:
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• The product is not in our food database</li>
                  <li>• It's a non-food item (electronics, books, etc.)</li>
                  <li>• The barcode is damaged or unclear</li>
                  <li>• It's a very new product not yet indexed</li>
                </ul>
                Try searching by name or scan another side of the package where the full barcode might be available.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="product-search">
                  Search for the product manually
                </label>
                <div className="flex gap-3">
                  <Input
                    id="product-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Enter product or brand name"
                    className="h-12"
                  />
                  <Button type="submit" className="h-12 px-6" disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </form>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-12 flex items-center justify-center gap-2"
                  onClick={() => navigate('/consumer/scan')}
                >
                  <Scan className="w-4 h-4" />
                  Scan another product
                </Button>
                <Button
                  variant="outline"
                  className="h-12 flex items-center justify-center gap-2"
                  onClick={() => navigate('/')}
                >
                  <RefreshCcw className="w-4 h-4" />
                  Go to home
                </Button>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card className="shadow-material-md">
              <CardHeader>
                <CardTitle className="text-lg">Matching products</CardTitle>
                <CardDescription>
                  Tap a result to view detailed nutrition information pulled from Open Food Facts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.barcode}
                    className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">{result.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.brand || 'Brand unavailable'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Barcode: {result.barcode}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/consumer/product/${result.barcode}`)}
                    >
                      View details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductNotFound;
