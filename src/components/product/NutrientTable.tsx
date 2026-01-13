import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Product } from '@/lib/store';
import { cn } from '@/lib/utils';

interface NutrientTableProps {
  nutrients: Product['nutrients'];
}

const NutrientTable = ({ nutrients }: NutrientTableProps) => {
  const { t } = useTranslation();
  const [servingMode, setServingMode] = useState<'per100g' | 'perServing'>('per100g');
  
  // Assuming standard serving size of 70g for instant noodles
  const servingSize = 70; // grams
  
  const calculateServing = (per100g: number) => {
    return servingMode === 'perServing' ? (per100g * servingSize) / 100 : per100g;
  };
  
  const getUnit = (nutrient: string) => {
    if (nutrient === 'energy') return servingMode === 'perServing' ? 'kcal' : 'kcal/100g';
    return servingMode === 'perServing' ? 'g' : 'g/100g';
  };
  
  const getHealthLevel = (nutrient: string, value: number) => {
    // Per 100g thresholds (WHO/FSSAI guidelines)
    const thresholds = {
      sugar: { low: 5, medium: 22.5 },
      sodium: { low: 120, medium: 600 },
      saturatedFat: { low: 3, medium: 5 },
      transFat: { low: 0, medium: 0.5 },
      fiber: { low: 3, medium: 6 } // Higher is better for fiber
    };
    
    const threshold = thresholds[nutrient as keyof typeof thresholds];
    if (!threshold) return 'neutral';
    
    if (nutrient === 'fiber') {
      // For fiber, higher is better
      if (value >= threshold.medium) return 'good';
      if (value >= threshold.low) return 'medium';
      return 'poor';
    } else {
      // For sugar, sodium, fats - lower is better
      if (value <= threshold.low) return 'good';
      if (value <= threshold.medium) return 'medium';
      return 'poor';
    }
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'good': return 'text-success bg-success/10 border-success/30';
      case 'medium': return 'text-warning bg-warning/10 border-warning/30';
      case 'poor': return 'text-destructive bg-destructive/10 border-destructive/30';
      default: return 'text-muted-foreground bg-muted/10 border-muted/30';
    }
  };
  
  const getLevelText = (level: string) => {
    switch (level) {
      case 'good': return 'Low';
      case 'medium': return 'Medium';
      case 'poor': return 'High';
      default: return '-';
    }
  };
  
  const nutrientRows = [
    {
      key: 'energy',
      label: 'Energy',
      value: calculateServing(nutrients.energy),
      unit: 'kcal',
      level: 'neutral'
    },
    {
      key: 'protein',
      label: 'Protein',
      value: calculateServing(nutrients.protein),
      unit: getUnit('protein'),
      level: 'neutral'
    },
    {
      key: 'carbohydrates',
      label: 'Carbohydrates',
      value: calculateServing(nutrients.carbohydrates),
      unit: getUnit('carbohydrates'),
      level: 'neutral'
    },
    {
      key: 'sugar',
      label: '• of which Sugars',
      value: calculateServing(nutrients.sugar),
      unit: getUnit('sugar'),
      level: getHealthLevel('sugar', nutrients.sugar),
      isSubItem: true
    },
    {
      key: 'fat',
      label: 'Total Fat',
      value: calculateServing(nutrients.fat),
      unit: getUnit('fat'),
      level: 'neutral'
    },
    {
      key: 'saturatedFat',
      label: '• Saturated Fat',
      value: calculateServing(nutrients.saturatedFat),
      unit: getUnit('saturatedFat'),
      level: getHealthLevel('saturatedFat', nutrients.saturatedFat),
      isSubItem: true
    },
    {
      key: 'transFat',
      label: '• Trans Fat',
      value: calculateServing(nutrients.transFat),
      unit: getUnit('transFat'),
      level: getHealthLevel('transFat', nutrients.transFat),
      isSubItem: true
    },
    {
      key: 'sodium',
      label: 'Sodium',
      value: calculateServing(nutrients.sodium),
      unit: servingMode === 'perServing' ? 'mg' : 'mg/100g',
      level: getHealthLevel('sodium', nutrients.sodium)
    }
  ];
  
  if (nutrients.fiber) {
    nutrientRows.push({
      key: 'fiber',
      label: 'Dietary Fiber',
      value: calculateServing(nutrients.fiber),
      unit: getUnit('fiber'),
      level: getHealthLevel('fiber', nutrients.fiber)
    });
  }
  
  return (
    <Card className="shadow-material-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Nutrition Information</CardTitle>
          
          <ToggleGroup
            type="single"
            value={servingMode}
            onValueChange={(value) => value && setServingMode(value as any)}
            className="bg-muted/50 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="per100g"
              className="text-xs px-3 py-1 data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              Per 100g
            </ToggleGroupItem>
            <ToggleGroupItem
              value="perServing"
              className="text-xs px-3 py-1 data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              Per Serving ({servingSize}g)
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y">
          {nutrientRows.map((row, index) => (
            <div
              key={row.key}
              className={cn(
                "flex items-center justify-between px-6 py-4 hover:bg-accent/30 transition-colors",
                row.isSubItem && "pl-12 bg-muted/20"
              )}
            >
              <div className="flex-1">
                <span className={cn(
                  "font-medium",
                  row.isSubItem ? "text-sm text-muted-foreground" : "text-foreground"
                )}>
                  {row.label}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium min-w-[80px] text-right">
                  {row.value.toFixed(1)} {row.unit}
                </span>
                
                {row.level !== 'neutral' && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium min-w-[60px] justify-center",
                      getLevelColor(row.level)
                    )}
                  >
                    {getLevelText(row.level)}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Health Guidelines */}
        <div className="p-6 bg-muted/30 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>* Based on WHO/FSSAI nutritional guidelines</p>
            <p>* Daily values may vary based on your caloric needs</p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              Low (Better choice)
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              Medium (Consume in moderation)
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive"></span>
              High (Limit intake)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutrientTable;