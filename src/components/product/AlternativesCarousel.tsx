import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ScoreBadge from '@/components/ui/score-badge';
import { Product, useAppStore, calculateHealthScore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface AlternativesCarouselProps {
  currentProduct: Product;
  alternatives: string[]; // array of barcodes
}

const AlternativesCarousel = ({ currentProduct, alternatives }: AlternativesCarouselProps) => {
  const navigate = useNavigate();
  const { currentProfile } = useAppStore();

  // Mock alternative products - replace with API calls
  const alternativeProducts: Product[] = [
    {
      barcode: '8901030875824',
      name: 'Yippee! Magic Masala Noodles',
      brand: 'ITC Foods',
      category: 'Instant Noodles',
      vegMark: 'veg',
      fssaiLicense: '10012022001340',
      imageUrl: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=Product',
      nutrients: {
        energy: 389,
        protein: 8.2,
        carbohydrates: 58.7,
        sugar: 8.1,
        fat: 11.9,
        saturatedFat: 4.2,
        transFat: 0,
        sodium: 654,
        fiber: 3.2
      },
      ingredientsRaw: 'Refined Wheat Flour, Edible Vegetable Oil, Salt, Spices & Condiments, Turmeric Powder',
      allergens: ['gluten'],
      additives: ['E471', 'E501i'],
      alternatives: []
    },
    {
      barcode: '8901030875831',
      name: 'Sunfeast YiPPee! Mood Masala',
      brand: 'ITC Foods',
      category: 'Instant Noodles',
      vegMark: 'veg',
      fssaiLicense: '10012022001340',
      imageUrl: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=Product',
      nutrients: {
        energy: 395,
        protein: 9.1,
        carbohydrates: 59.3,
        sugar: 9.8,
        fat: 12.8,
        saturatedFat: 5.1,
        transFat: 0,
        sodium: 723,
        fiber: 2.8
      },
      ingredientsRaw: 'Refined Wheat Flour, Palm Oil, Salt, Sugar, Spice Extracts, Natural Flavoring Substances',
      allergens: ['gluten'],
      additives: ['E471', 'E621'],
      alternatives: []
    }
  ];

  const currentScore = calculateHealthScore(currentProduct, currentProfile);

  // Filter and score alternatives
  const scoredAlternatives = alternativeProducts
    .map(product => ({
      product,
      score: calculateHealthScore(product, currentProfile)
    }))
    .sort((a, b) => b.score.score - a.score.score); // Sort by best score first

  if (scoredAlternatives.length === 0) {
    return (
      <Card className="shadow-material-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Better Alternatives
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No alternatives found in this category. We're constantly updating our database!
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleProductClick = (barcode: string) => {
    navigate(`/consumer/product/${barcode}`);
  };

  return (
    <Card className="shadow-material-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Better Alternatives
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
            {scoredAlternatives.filter(alt => alt.score.score > currentScore.score).length} Better Options
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="space-y-4">
          {scoredAlternatives.map(({ product, score }, index) => {
            const isBetter = score.score > currentScore.score;
            const scoreDiff = score.score - currentScore.score;

            return (
              <Card
                key={product.barcode}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-material-md interactive-scale",
                  isBetter && "bg-success/5 border-success/30"
                )}
                onClick={() => handleProductClick(product.barcode)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=Product';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                        </div>

                        <ScoreBadge score={score} size="sm" animated={false} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            product.vegMark === 'veg' ? 'bg-success' : 'bg-destructive'
                          )} />

                          {isBetter && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                              <Star className="w-3 h-3 mr-1" />
                              {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} pts better
                            </Badge>
                          )}

                          {product.additives.length < currentProduct.additives.length && (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                              Fewer additives
                            </Badge>
                          )}

                          {product.nutrients.sugar < currentProduct.nutrients.sugar && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                              Less sugar
                            </Badge>
                          )}
                        </div>

                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Smart Recommendations:</strong> These alternatives are selected based on your health profile,
            similar price range, and availability in Indian markets.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativesCarousel;