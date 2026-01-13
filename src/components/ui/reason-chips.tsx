import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ReasonChipsProps {
  reasons: string[];
  className?: string;
}

const ReasonChips = ({ reasons, className }: ReasonChipsProps) => {
  const { t } = useTranslation();
  
  if (reasons.length === 0) return null;

  const getVariant = (reason: string) => {
    if (reason.includes('very_high') || reason.includes('trans_fat') || reason.includes('diabetes_concern')) {
      return 'destructive';
    }
    if (reason.includes('high') || reason.includes('hypertension_concern')) {
      return 'secondary';
    }
    return 'outline';
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {reasons.map((reason, index) => (
        <Badge
          key={reason}
          variant={getVariant(reason)}
          className={cn(
            "stagger-item text-xs transition-all duration-200",
            "hover:scale-105"
          )}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {t(reason)}
        </Badge>
      ))}
    </div>
  );
};

export default ReasonChips;