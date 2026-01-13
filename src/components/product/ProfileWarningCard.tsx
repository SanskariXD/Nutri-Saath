import { AlertTriangle, Heart, Activity, Baby } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, UserProfile, HealthScore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ProfileWarningCardProps {
  product: Product;
  profile: UserProfile;
  healthScore: HealthScore;
}

const ProfileWarningCard = ({ product, profile, healthScore }: ProfileWarningCardProps) => {
  const warnings = [];
  const ingredientsText = product.ingredientsRaw?.toLowerCase() ?? '';
  
  // Check for diabetes concerns
  if (profile.conditions.includes('diabetes') && product.nutrients.sugar > 5) {
    warnings.push({
      type: 'diabetes',
      severity: product.nutrients.sugar > 10 ? 'high' : 'medium',
      message: product.nutrients.sugar > 10 
        ? 'High sugar content - Not recommended for diabetes'
        : 'Moderate sugar content - Consume in moderation',
      icon: Activity,
      color: product.nutrients.sugar > 10 ? 'destructive' : 'warning'
    });
  }
  
  // Check for hypertension concerns
  if (profile.conditions.includes('hypertension') && product.nutrients.sodium > 120) {
    warnings.push({
      type: 'hypertension',
      severity: product.nutrients.sodium > 400 ? 'high' : 'medium',
      message: product.nutrients.sodium > 400
        ? 'Very high sodium - Avoid if possible'
        : 'Moderate sodium - Monitor your intake',
      icon: Heart,
      color: product.nutrients.sodium > 400 ? 'destructive' : 'warning'
    });
  }
  
  // Check for child-specific concerns
  if (profile.type === 'child') {
    const hasSweeteners = product.additives.some(additive => 
      ['E951', 'E952', 'E954', 'E955'].includes(additive)
    );
    
    if (hasSweeteners) {
      warnings.push({
        type: 'child_sweeteners',
        severity: 'medium',
        message: 'Contains artificial sweeteners - Not recommended for children',
        icon: Baby,
        color: 'warning'
      });
    }
    
    if (product.additives.length > 2) {
      warnings.push({
        type: 'child_additives',
        severity: 'medium',
        message: 'Multiple additives present - Consider alternatives',
        icon: Baby,
        color: 'warning'
      });
    }
  }
  
  // Check for allergen matches
  const allergenMatches = product.allergens.filter((allergen) =>
    profile.allergies.includes(allergen as UserProfile['allergies'][number])
  );
  
  if (allergenMatches.length > 0) {
    warnings.push({
      type: 'allergens',
      severity: 'high',
      message: `Contains allergens: ${allergenMatches.join(', ')}`,
      icon: AlertTriangle,
      color: 'destructive'
    });
  }
  
  // Check dietary restrictions
  if (profile.diet === 'vegan' && product.vegMark !== 'veg') {
    warnings.push({
      type: 'diet_vegan',
      severity: 'high',
      message: 'Contains non-vegetarian ingredients',
      icon: AlertTriangle,
      color: 'destructive'
    });
  }
  
  if (profile.diet === 'jain' && ['onion', 'garlic'].some((item) => ingredientsText.includes(item))) {
    warnings.push({
      type: 'diet_jain',
      severity: 'high',
      message: 'May contain onion/garlic - Not suitable for Jain diet',
      icon: AlertTriangle,
      color: 'destructive'
    });
  }
  
  if (warnings.length === 0) {
    return (
      <Card className="bg-success/5 border-success/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-success">âœ“ Suitable for your profile</p>
              <p className="text-sm text-muted-foreground">
                No specific health concerns detected for your dietary needs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const highSeverityWarnings = warnings.filter(w => w.severity === 'high');
  const cardVariant = highSeverityWarnings.length > 0 ? 'destructive' : 'warning';
  
  return (
    <Card className={cn(
      "border-2",
      cardVariant === 'destructive' 
        ? 'bg-destructive/5 border-destructive/30' 
        : 'bg-warning/5 border-warning/30'
    )}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            cardVariant === 'destructive' ? 'bg-destructive/10' : 'bg-warning/10'
          )}>
            <AlertTriangle className={cn(
              "w-5 h-5",
              cardVariant === 'destructive' ? 'text-destructive' : 'text-warning'
            )} />
          </div>
          <div className="flex-1">
            <p className={cn(
              "font-semibold",
              cardVariant === 'destructive' ? 'text-destructive' : 'text-warning'
            )}>
              {highSeverityWarnings.length > 0 ? 'Health Alert!' : 'Health Notice'}
            </p>
            <p className="text-sm text-muted-foreground">
              {warnings.length} concern{warnings.length > 1 ? 's' : ''} found for your profile
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {warnings.map((warning, index) => {
            const IconComponent = warning.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  warning.color === 'destructive' && 'bg-destructive/10',
                  warning.color === 'warning' && 'bg-warning/10'
                )}>
                  <IconComponent className={cn(
                    "w-4 h-4",
                    warning.color === 'destructive' && 'text-destructive',
                    warning.color === 'warning' && 'text-warning'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {warning.message}
                  </p>
                  {warning.type === 'allergens' && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {allergenMatches.map((allergen) => (
                        <Badge 
                          key={allergen}
                          variant="destructive" 
                          className="text-xs"
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {highSeverityWarnings.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-sm font-medium text-destructive">
              Recommendation: Avoid this product or consult with your healthcare provider
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileWarningCard;
