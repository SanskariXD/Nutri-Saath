import { useNavigate } from 'react-router-dom';
import { Scan, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const StickyBottomBar = () => {
  const navigate = useNavigate();

  const handleScanAnother = () => {
    navigate('/consumer/scan');
  };

  const handleGoHome = () => {
    navigate('/consumer');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center gap-3 px-6 py-4 max-w-md mx-auto">
        <Button
          variant="outline"
          onClick={handleGoHome}
          className="flex-1 gap-2 h-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Button>

        <Button
          onClick={handleScanAnother}
          className={cn(
            "flex-2 gap-3 h-12 text-base font-semibold",
            "bg-gradient-primary hover:shadow-glow interactive-scale"
          )}
        >
          <div className="p-1 rounded-lg bg-white/20">
            <Scan className="w-5 h-5 text-white" />
          </div>
          Scan Another Product
        </Button>
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background/95" />
    </div>
  );
};

export default StickyBottomBar;