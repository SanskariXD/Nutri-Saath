import { useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Shield, Zap, Star, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Onboarding = ({ onDone }: { onDone: () => void }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const features = [
    {
      icon: Zap,
      title: 'Instant Health Analysis',
      description: 'Scan any packaged food and get instant health scores based on Indian dietary guidelines and your personal health profile.',
      highlight: 'AI-Powered Scanning'
    },
    {
      icon: Heart,
      title: 'Personalized for India',
      description: 'Designed specifically for Indian foods, ingredients, and health conditions. Supports diabetes, hypertension, and child-specific recommendations.',
      highlight: 'Made with ❤️ for Bharat'
    },
    {
      icon: Shield,
      title: 'FSSAI Integration',
      description: 'Direct reporting to Food Safety and Standards Authority of India. Help improve food safety standards across the nation.',
      highlight: 'Government Connected'
    }
  ];
  
  const uniqueFeatures = [
    'First app to decode Indian food labels in Hindi, Kannada & English',
    'Specific alerts for Indian health conditions (diabetes, BP)',
    'ABHA Health ID integration for seamless health tracking',
    'Poshan Tracker connectivity for national nutrition monitoring',
    'Real-time FSSAI license verification',
    'Child-safe ingredient analysis with Indian context'
  ];
  
  const handleNext = () => {
    if (currentStep < features.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onDone();
      navigate('/');
    }
  };
  
  const handleSkip = () => {
    onDone();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-6">
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          Skip Tour
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        {currentStep < features.length ? (
          /* Feature Steps */
          <div className="max-w-md mx-auto space-y-8 text-center">
            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 mb-8">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    index === currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            
            {/* Feature Card */}
            <Card className="bg-gradient-to-br from-card to-accent/10 border-primary/20 shadow-material-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow">
                  {React.createElement(features[currentStep].icon, {
                    className: "w-10 h-10 text-white"
                  })}
                </div>
                
                <div className="space-y-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {features[currentStep].highlight}
                  </Badge>
                  
                  <h2 className="text-2xl font-bold text-foreground">
                    {features[currentStep].title}
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {features[currentStep].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Final Step - Unique Features & Disclaimer */
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-hero mx-auto flex items-center justify-center shadow-glow">
                <Star className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="text-foreground">NutriSaath!</span>
              </h2>
              
              <p className="text-lg text-muted-foreground">
                India's First Comprehensive Food Label Scanner
              </p>
            </div>
            
            {/* Unique Features */}
            <Card className="bg-gradient-to-r from-success/5 to-primary/5 border-success/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-success flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  What Makes Us Unique
                </h3>
                
                <div className="space-y-2">
                  {uniqueFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Disclaimer */}
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                      Important Disclaimer
                    </h4>
                    <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                      <p>
                        NutriSaath is an independent food analysis tool created to promote health awareness. 
                        We are not affiliated with any food companies or brands.
                      </p>
                      <p>
                        Our health recommendations are based on WHO, ICMR, and FSSAI guidelines. 
                        Always consult healthcare professionals for personalized medical advice.
                      </p>
                      <p>
                        Product information is sourced from packaging and public databases. 
                        For concerns about our analysis, please contact us through the app.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Made with Love */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Made with ❤️ for a healthier India
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>🇮🇳</span>
                <span>Digital India Initiative</span>
                <span>🇮🇳</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleNext}
            className="w-full h-12 text-base font-semibold bg-gradient-primary interactive-scale"
          >
            {currentStep < features.length ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Start Using NutriSaath
                <Heart className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {currentStep < features.length && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              Step {currentStep + 1} of {features.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;