import { cn } from '@/lib/utils';
import { HealthScore } from '@/lib/store';

interface ScoreBadgeProps {
  score: HealthScore;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ScoreBadge = ({ score, size = 'md', animated = true }: ScoreBadgeProps) => {
  const radius = size === 'lg' ? 40 : size === 'md' ? 32 : 24;
  const strokeWidth = size === 'lg' ? 4 : 3;
  const circumference = 2 * Math.PI * radius;
  
  const gradeColors = {
    A: 'text-success',
    B: 'text-primary',
    C: 'text-warning',
    D: 'text-orange-500',
    E: 'text-destructive'
  };

  const gradeBgColors = {
    A: 'bg-success/10',
    B: 'bg-primary/10', 
    C: 'bg-warning/10',
    D: 'bg-orange-500/10',
    E: 'bg-destructive/10'
  };

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl', 
    lg: 'text-2xl'
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-full",
      sizes[size],
      gradeBgColors[score.grade]
    )}>
      {/* Animated SVG Ring */}
      <svg 
        className="absolute inset-0 transform -rotate-90"
        width="100%" 
        height="100%"
      >
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border opacity-20"
        />
        
        {/* Score circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(gradeColors[score.grade], animated && "transition-all duration-1000 ease-out")}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animated 
              ? circumference - (circumference * score.score) / 100 
              : circumference
          }}
        />
      </svg>
      
      {/* Score Text */}
      <div className="flex flex-col items-center justify-center">
        <span className={cn(
          "font-bold leading-none",
          textSizes[size],
          gradeColors[score.grade]
        )}>
          {score.grade}
        </span>
        <span className={cn(
          "text-xs font-medium leading-none opacity-80",
          gradeColors[score.grade]
        )}>
          {score.score}
        </span>
      </div>
    </div>
  );
};

export default ScoreBadge;