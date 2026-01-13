import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Receipt,
  Share2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/components/layout/AppLayout';
import ScoreBadge from '@/components/ui/score-badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BillItem {
  name: string;
  qty: number;
  unitPrice: number;
  barcode?: string;
  grade?: 'A' | 'B' | 'C' | 'D' | 'E';
  issues?: string[];
}

interface BillData {
  merchant: string;
  date: string;
  items: BillItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  rawText?: string;
  receiptId?: string;
}

const BillSummary = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Get bill data from navigation state or use demo data
  const billData: BillData = location.state?.billData || {
    merchant: "Demo Store",
    date: new Date().toLocaleDateString(),
    items: [
      {
        name: "Maggi 2-Minute Noodles",
        qty: 2,
        unitPrice: 12,
        grade: 'D',
        issues: ['High sodium', 'Trans fats', 'Artificial flavors']
      },
      {
        name: "Amul Fresh Paneer",
        qty: 1,
        unitPrice: 85,
        grade: 'A',
        issues: []
      },
      {
        name: "Britannia Good Day Cookies",
        qty: 3,
        unitPrice: 15,
        grade: 'C',
        issues: ['High sugar', 'Palm oil']
      },
      {
        name: "Tata Salt",
        qty: 1,
        unitPrice: 22,
        grade: 'B',
        issues: ['Refined salt']
      },
      {
        name: "Saffola Refined Oil",
        qty: 1,
        unitPrice: 180,
        grade: 'C',
        issues: ['Highly processed', 'Refined oil']
      }
    ],
    subtotal: 356,
    tax: 35.6,
    total: 391.6
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return 'text-success border-success/30 bg-success/10';
      case 'B': return 'text-primary border-primary/30 bg-primary/10';
      case 'C': return 'text-warning border-warning/30 bg-warning/10';
      case 'D': return 'text-orange-500 border-orange-300 bg-orange-50';
      case 'E': return 'text-destructive border-destructive/30 bg-destructive/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getOverallScore = () => {
    const gradeValues = { A: 90, B: 75, C: 60, D: 45, E: 30 };
    const totalScore = billData.items.reduce((sum, item) => {
      return sum + (gradeValues[item.grade || 'C'] * item.qty);
    }, 0);
    const totalItems = billData.items.reduce((sum, item) => sum + item.qty, 0);
    return Math.round(totalScore / totalItems);
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 55) return 'C';
    if (score >= 40) return 'D';
    return 'E';
  };

  const overallScore = getOverallScore();
  const overallGrade = getGradeFromScore(overallScore);

  const healthyItems = billData.items.filter(item => ['A', 'B'].includes(item.grade || 'C'));
  const concernItems = billData.items.filter(item => ['D', 'E'].includes(item.grade || 'C'));

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Shopping Health Report',
          text: `Just analyzed my shopping bill! Overall health score: ${overallScore}/100 (Grade ${overallGrade})`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Bill summary link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleProductClick = (barcode: string) => {
    navigate(`/consumer/product/${barcode}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
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

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              {t('share')}
            </Button>
          </div>
        </header>

        <div className="px-6 py-6 space-y-6">
          {/* Bill Header */}
          <Card className="shadow-material-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{t('shopping_analysis')}</h1>
                    <p className="text-muted-foreground">{billData.merchant} • {billData.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₹{billData.total}</div>
                  <p className="text-sm text-muted-foreground">{billData.items.length} items</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('overallHealthScore')}</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold">{overallScore}/100</div>
                    <Badge variant="outline" className={getGradeColor(overallGrade)}>
                      Grade {overallGrade}
                    </Badge>
                  </div>
                </div>
                <ScoreBadge
                  score={{ score: overallScore, grade: overallGrade, reasons: [] }}
                  size="lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-material-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-success">{healthyItems.length}</div>
                    <p className="text-xs text-muted-foreground">{t('healthy_choices')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-material-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-destructive">{concernItems.length}</div>
                    <p className="text-xs text-muted-foreground">{t('items_of_concern')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Analysis */}
          <Card className="shadow-material-md">
            <CardHeader>
              <CardTitle>{t('product_breakdown')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {billData.items.map((item, index) => (
                  <div key={item.barcode}>
                    <div
                      className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedItem(expandedItem === item.barcode ? null : item.barcode)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium truncate">{item.name}</h3>
                            <Badge variant="outline" className={cn("text-xs", getGradeColor(item.grade))}>
                              Grade {item.grade || 'C'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Qty: {item.qty}</span>
                            <span>₹{item.unitPrice}</span>
                            {item.issues && item.issues.length > 0 && (
                              <span className="text-destructive">{item.issues.length} issues</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(item.barcode);
                          }}
                        >
                          {t('view_details')}
                        </Button>
                      </div>

                      {/* Expanded Issues */}
                      {expandedItem === item.barcode && item.issues && item.issues.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium text-destructive mb-2">{t('health_concerns')}:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.issues.map((issue, issueIndex) => (
                              <Badge key={issueIndex} variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {index < billData.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="shadow-material-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t('great_choices')}
                </h4>
                <p className="text-sm text-success-foreground">
                  {healthyItems.length > 0
                    ? `Keep choosing products like ${healthyItems.map(item => item.name).join(', ')}. These are nutritious options!`
                    : "Try to add more fresh, unprocessed foods to your cart next time."
                  }
                </p>
              </div>

              {concernItems.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                  <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {t('consider_alternatives')}
                  </h4>
                  <p className="text-sm text-destructive-foreground">
                    Consider replacing highly processed items like {concernItems.slice(0, 2).map(item => item.name).join(', ')} with healthier alternatives.
                  </p>
                </div>
              )}

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <h4 className="font-medium text-primary mb-2">{t('next_time')}:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check nutrition labels before adding to cart</li>
                  <li>• Look for products with Grade A or B ratings</li>
                  <li>• Avoid items with high sodium, sugar, or trans fats</li>
                  <li>• Choose whole foods over processed alternatives</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/consumer/scan')}
              className="h-12"
            >
              {t('scan_more_products')}
            </Button>
            <Button
              onClick={() => navigate('/consumer/learn')}
              className="h-12 bg-gradient-primary"
            >
              {t('learn_label_reading')}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BillSummary;