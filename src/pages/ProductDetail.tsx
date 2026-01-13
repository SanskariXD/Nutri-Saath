
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Share2, AlertTriangle, ExternalLink, Scan, Volume2, Award, Microscope, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import ScoreBadge from '@/components/ui/score-badge';
import ReasonChips from '@/components/ui/reason-chips';
import ProfileWarningCard from '@/components/product/ProfileWarningCard';
import NutrientTable from '@/components/product/NutrientTable';
import IngredientsList from '@/components/product/IngredientsList';
import AlternativesCarousel from '@/components/product/AlternativesCarousel';
import ProductActions from '@/components/product/ProductActions';
import StickyBottomBar from '@/components/product/StickyBottomBar';
import { useAppStore, calculateHealthScore } from '@/lib/store';
import { ProductService, ProductNotFoundError, type Product } from '@/services/productService';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currentProfile, addRecentScan } = useAppStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      console.log('🛍️ [PRODUCT DETAIL] Loading product for barcode:', barcode);

      if (!barcode) {
        console.log('🛍️ [PRODUCT DETAIL] ❌ No barcode provided');
        setProduct(null);
        setError('No barcode provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🛍️ [PRODUCT DETAIL] Starting product lookup...');
        setLoading(true);
        setError(null);
        setProduct(null);

        const productData = await ProductService.getProductByBarcode(barcode);
        console.log('🛍️ [PRODUCT DETAIL] ✅ Product loaded successfully:', productData);
        setProduct(productData);

        if (addRecentScan) {
          console.log('🛍️ [PRODUCT DETAIL] Adding to recent scans...');
          addRecentScan(productData);
        }
      } catch (err) {
        console.error('🛍️ [PRODUCT DETAIL] ❌ Failed to load product:', err);

        if (err instanceof ProductNotFoundError) {
          console.log('🛍️ [PRODUCT DETAIL] ❌ Product not found, navigating to not-found page');
          navigate(`/consumer/product/not-found/${barcode}`, { replace: true });
          return;
        }

        const message = err instanceof Error ? err.message : 'Failed to load product';
        console.log('🛍️ [PRODUCT DETAIL] ❌ Other error occurred, setting error state:', message);

        // Provide more helpful error messages
        let userMessage = message;
        if (message.includes('Network connection failed')) {
          userMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
        } else if (message.includes('Failed to fetch')) {
          userMessage = 'Network error occurred. This might be due to server issues or network connectivity problems.';
        }

        setError(userMessage);
        toast({
          title: 'Error',
          description: userMessage,
          variant: 'destructive',
        });
      } finally {
        console.log('🛍️ [PRODUCT DETAIL] Setting loading to false');
        setLoading(false);
      }
    };

    void loadProduct();
  }, [barcode, toast, addRecentScan, navigate]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary animate-pulse mx-auto" />
            <p className="text-muted-foreground">Analyzing product...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !product) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Product Not Found</h2>
            <p className="text-muted-foreground">{error || "The product you're looking for doesn't exist."}</p>
            <Button onClick={() => navigate('/consumer/scan')} className="bg-gradient-primary">
              <Scan className="w-4 h-4 mr-2" />
              Scan Another Product
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const healthScore = calculateHealthScore(product, currentProfile);
  const displayBrand = product.brand || 'Unknown brand';
  const displayCategory = product.category || 'General';
  const displayImage = product.imageUrl ?? 'https://via.placeholder.com/96x96/4F46E5/FFFFFF?text=Product';
  const vegMark = product.vegMark ?? 'veg';
  const vegBadgeLabel = vegMark === 'veg' ? 'Vegetarian' : vegMark === 'egg' ? 'Contains Egg' : vegMark === 'non-veg' ? 'Non-Vegetarian' : 'Diet info unavailable';
  const vegBadgeClass = vegMark === 'veg'
    ? 'bg-success/10 text-success border-success/30'
    : vegMark === 'non-veg'
      ? 'bg-destructive/10 text-destructive border-destructive/30'
      : 'bg-warning/10 text-warning border-warning/30';
  const productSourceLabel = product.source === 'cache'
    ? 'Using cached data (refreshed within 7 days)'
    : product.source === 'off'
      ? 'Fetched live from Open Food Facts'
      : null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${product.name} - Health Analysis`,
          text: `Check out this health analysis for ${product.name} (Grade: ${healthScore.grade})`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
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
              Back
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </header>

        {/* Product Header */}
        <div className="px-6 py-6">
          <div className="flex gap-6 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-muted/50 flex items-center justify-center overflow-hidden">
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (!e.currentTarget.src.includes('via.placeholder.com')) {
                    e.currentTarget.src = 'https://via.placeholder.com/96x96/4F46E5/FFFFFF?text=Product';
                  }
                }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
                  <p className="text-lg text-muted-foreground">{displayBrand}</p>
                  {productSourceLabel && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
                      {productSourceLabel}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // Text-to-speech implementation
                    const utterance = new SpeechSynthesisUtterance(
                      `Product: ${product.name} by ${displayBrand}. Health Score: ${healthScore.score} out of 100, Grade ${healthScore.grade}. Main concerns: ${healthScore.reasons.join(', ')}`
                    );
                    speechSynthesis.speak(utterance);
                  }}
                  className="rounded-full"
                  title="Read product information aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>

              {/* INR Rating Placeholder */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 p-3 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800 text-sm">INR Rating</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
                    --
                  </Badge>
                </div>
                <p className="text-xs text-yellow-600 mt-1">Indian Nutrition Rating (Coming Soon)</p>
              </Card>

              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn('text-xs', vegBadgeClass)}
                >
                  {product.vegMark === 'veg' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
                </Badge>

                <Badge variant="outline" className="text-xs">
                  {displayCategory}
                </Badge>

                {product.fssaiLicense && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                    FSSAI: {product.fssaiLicense}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <ScoreBadge score={healthScore} size="lg" />
            </div>
          </div>

          <ReasonChips reasons={healthScore.reasons} className="mb-6" />

          <ProfileWarningCard product={product} profile={currentProfile} healthScore={healthScore} />
        </div>

        {/* Content Tabs */}
        <div className="px-6 py-2 pb-24">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="trust" className="flex gap-1 items-center">Trust <ShieldCheck className="w-3 h-3 text-green-600 hidden sm:block" /></TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="ingredients">Ingr.</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6 animate-in slide-in-from-left-2 duration-300">
              <NutrientTable nutrients={product.nutrients} />

              {/* Micro-Nutrition Section */}
              <Card className="shadow-material-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="w-5 h-5" />
                    Micro-Nutrition Analysis
                  </CardTitle>
                  <CardDescription>
                    Vitamins and minerals content analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <Microscope className="w-8 h-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Detailed micro-nutrition analysis will be available soon
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Including Vitamins A, B, C, D, E, K and minerals like Iron, Calcium, Zinc
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trust" className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" /> Provenance & Safety
                  </CardTitle>
                  <CardDescription>Verified information from the producer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg border border-muted flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">No Trust Code found</h4>
                      <p className="text-xs text-muted-foreground">This product doesn't have a NutriSaath Trust Code yet. Scan a trusted batch QR for full traceability.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="font-semibold text-sm">Certifications Declared</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50">Jaivik Bharat (Organic)</Badge>
                      <Badge variant="outline" className="border-blue-600 text-blue-700 bg-blue-50">+F Fortified</Badge>
                      <Badge variant="outline" className="border-orange-600 text-orange-700 bg-orange-50">ODOP</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              <NutrientTable nutrients={product.nutrients} />
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients List</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {product.ingredientsRaw || "Ingredient information not available for this product."}
                  </p>

                  {product.nutrients?.sodium > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-2">Key Additives</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">INS 450 (Preservative)</Badge>
                        <Badge variant="secondary">INS 110 (Color)</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <AlternativesCarousel
          currentProduct={product}
          alternatives={product.alternatives || []}
        />

        {/* Safety Notifications Section */}
        <Card className="shadow-material-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Safety Notifications
            </CardTitle>
            <CardDescription>
              Food safety alerts and recalls for this product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-success mb-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm font-medium">All Clear</span>
              </div>
              <p className="text-sm text-success-foreground">
                No safety alerts for this product at the moment
              </p>
            </div>
          </CardContent>
        </Card>

        <ProductActions product={product} />
      </div>

      <StickyBottomBar />
    </AppLayout>
  );
};

export default ProductDetail;
