import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface IngredientsListProps {
  ingredientsRaw: string;
  allergens: string[];
  additives: string[];
}

const IngredientsList = ({ ingredientsRaw, allergens, additives }: IngredientsListProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdditiveDetails, setShowAdditiveDetails] = useState(false);
  
  // Parse ingredients from raw text
  const ingredients = ingredientsRaw
    .split(/[,\(\)]+/)
    .map(ing => ing.trim())
    .filter(ing => ing.length > 0);
  
  // Additive information database
  const additiveInfo: Record<string, { name: string; purpose: string; safety: 'safe' | 'moderate' | 'concerning' }> = {
    'E471': { name: 'Mono- and diglycerides', purpose: 'Emulsifier', safety: 'safe' },
    'E472e': { name: 'Mono- and diacetyltartaric acid esters', purpose: 'Emulsifier', safety: 'safe' },
    'E501i': { name: 'Potassium carbonate', purpose: 'Acidity regulator', safety: 'safe' },
    'E307b': { name: 'Mixed tocopherols', purpose: 'Antioxidant', safety: 'safe' },
    'E621': { name: 'Monosodium glutamate (MSG)', purpose: 'Flavor enhancer', safety: 'moderate' },
    'E951': { name: 'Aspartame', purpose: 'Artificial sweetener', safety: 'concerning' },
    'E952': { name: 'Cyclamate', purpose: 'Artificial sweetener', safety: 'concerning' },
    'E129': { name: 'Allura Red AC', purpose: 'Food coloring', safety: 'concerning' },
    'E102': { name: 'Tartrazine', purpose: 'Yellow food coloring', safety: 'concerning' }
  };
  
  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe': return 'bg-success/10 text-success border-success/30';
      case 'moderate': return 'bg-warning/10 text-warning border-warning/30';
      case 'concerning': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };
  
  const getSafetyText = (safety: string) => {
    switch (safety) {
      case 'safe': return 'Generally Safe';
      case 'moderate': return 'Use in Moderation';
      case 'concerning': return 'May Cause Concerns';
      default: return 'Unknown';
    }
  };
  
  const concerningAdditives = additives.filter(additive => {
    const info = additiveInfo[additive];
    return info && info.safety === 'concerning';
  });
  
  const allergenLabels: Record<string, string> = {
    'gluten': 'Contains Gluten',
    'milk': 'Contains Milk',
    'egg': 'Contains Egg',
    'soy': 'Contains Soy',
    'peanut': 'Contains Peanut',
    'shellfish': 'Contains Shellfish',
    'sesame': 'Contains Sesame'
  };
  
  return (
    <Card className="shadow-material-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Ingredients & Additives
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Allergen Warnings */}
        {allergens.length > 0 && (
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-destructive mb-2">Allergen Warning</h4>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen) => (
                    <Badge
                      key={allergen}
                      variant="destructive"
                      className="text-xs"
                    >
                      {allergenLabels[allergen] || allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Concerning Additives Alert */}
        {concerningAdditives.length > 0 && (
          <div className="p-4 rounded-lg bg-warning/5 border border-warning/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-warning mb-2">
                  {concerningAdditives.length} Concerning Additive{concerningAdditives.length > 1 ? 's' : ''} Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {concerningAdditives.map((additive) => {
                    const info = additiveInfo[additive];
                    return (
                      <Badge
                        key={additive}
                        variant="outline"
                        className="text-xs bg-warning/10 text-warning border-warning/30"
                      >
                        {additive} - {info?.name || 'Unknown'}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Ingredients List */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground">Complete Ingredients List</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ingredientsRaw}
          </p>
        </div>
        
        {/* Additives Breakdown */}
        {additives.length > 0 && (
          <div>
            <Collapsible open={showAdditiveDetails} onOpenChange={setShowAdditiveDetails}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    Additive Details ({additives.length} found)
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    showAdditiveDetails && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4">
                <div className="space-y-3">
                  {additives.map((additive) => {
                    const info = additiveInfo[additive];
                    return (
                      <div
                        key={additive}
                        className="flex items-start justify-between p-4 rounded-lg bg-muted/30 border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm font-semibold text-primary">
                              {additive}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                info ? getSafetyColor(info.safety) : getSafetyColor('unknown')
                              )}
                            >
                              {info ? getSafetyText(info.safety) : 'Unknown'}
                            </Badge>
                          </div>
                          {info && (
                            <>
                              <p className="text-sm font-medium text-foreground">
                                {info.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Purpose: {info.purpose}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> E-numbers are EU codes for food additives that are approved for use in food products. 
                    While most are safe in typical consumption amounts, some individuals may be sensitive to certain additives.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IngredientsList;