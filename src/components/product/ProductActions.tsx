import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Share2, 
  Flag, 
  BookOpen, 
  Heart, 
  ExternalLink,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ProductActionsProps {
  product: Product;
}

const ProductActions = ({ product }: ProductActionsProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAddedToList, setIsAddedToList] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const handleAddToList = () => {
    setIsAddedToList(!isAddedToList);
    toast({
      title: isAddedToList ? "Removed from list" : "Added to shopping list",
      description: isAddedToList 
        ? `${product.name} removed from your list`
        : `${product.name} added to your shopping list`,
    });
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${product.name} - Health Analysis`,
          text: `Check out this health analysis for ${product.name}`,
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
  
  const handleReportToFSSAI = () => {
    // Mock FSSAI reporting - in real app, would integrate with FSSAI portal
    toast({
      title: "Report submitted",
      description: "Your report has been submitted to FSSAI for review",
    });
  };
  
  const handleLearnMore = () => {
    // Navigate to learning section about food additives/ingredients
    window.open('/learn', '_blank');
  };
  
  const handlePoshanTracker = () => {
    // Mock Poshan Tracker integration
    toast({
      title: "Added to Poshan Tracker",
      description: "Nutritional data logged in your health profile",
    });
  };
  
  const actions = [
    {
      id: 'addToList',
      label: isAddedToList ? 'Remove from List' : 'Add to Shopping List',
      icon: isAddedToList ? Check : Plus,
      variant: isAddedToList ? 'outline' : 'default',
      onClick: handleAddToList,
      description: 'Save for your next shopping trip'
    },
    {
      id: 'share',
      label: 'Share Analysis',
      icon: Share2,
      variant: 'outline',
      onClick: handleShare,
      description: 'Share with family & friends'
    },
    {
      id: 'poshan',
      label: 'Log to Poshan Tracker',
      icon: Heart,
      variant: 'outline',
      onClick: handlePoshanTracker,
      description: 'Track nutritional intake'
    },
    {
      id: 'report',
      label: 'Report to FSSAI',
      icon: Flag,
      variant: 'outline',
      onClick: handleReportToFSSAI,
      description: 'Report safety concerns'
    },
    {
      id: 'learn',
      label: 'Learn About Ingredients',
      icon: BookOpen,
      variant: 'outline',
      onClick: handleLearnMore,
      description: 'Understand food labels better'
    }
  ];
  
  return (
    <Card className="shadow-material-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant as any}
                onClick={action.onClick}
                className={cn(
                  "w-full justify-start h-auto p-4 text-left",
                  action.id === 'addToList' && isAddedToList && "bg-success/10 border-success/30 text-success"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    action.id === 'addToList' && isAddedToList 
                      ? "bg-success/20" 
                      : "bg-primary/10"
                  )}>
                    <IconComponent className={cn(
                      "w-5 h-5",
                      action.id === 'addToList' && isAddedToList 
                        ? "text-success" 
                        : "text-primary"
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{action.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Poshan Tracker Integration Info */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                Poshan Tracker Integration
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                Connect with Government of India's Poshan Tracker to monitor your family's nutrition intake 
                and contribute to national health data.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePoshanTracker}
                className="bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* FSSAI Reporting Notice */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Food Safety Reporting
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Found incorrect information or safety concerns? Report directly to FSSAI 
                to help improve food safety standards across India.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductActions;