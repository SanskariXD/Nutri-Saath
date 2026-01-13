import React, { useEffect, useState } from 'react';
import { getOnboardingComplete, setOnboardingComplete } from '@/lib/storage';
import Onboarding from '@/pages/Onboarding';

interface OnboardingGateProps {
  children: React.ReactNode;
}

const useOnboardingGate = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingComplete = getOnboardingComplete();
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    setOnboardingComplete(true);
    setShowOnboarding(false);
  };

  return { showOnboarding, completeOnboarding };
};

const OnboardingGate: React.FC<OnboardingGateProps> = ({ children }) => {
  const { showOnboarding, completeOnboarding } = useOnboardingGate();

  if (showOnboarding) {
    return <Onboarding onDone={completeOnboarding} />;
  }

  return <>{children}</>;
};

export default OnboardingGate;
