import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Shield,
  AlertTriangle,
  Utensils,
  Baby,
  Users,
  UserCheck,
  Languages,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  Globe,
  LogOut,
  UserPlus,
  RotateCcw,
  ExternalLink,
  Activity,
  Edit,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/lib/store';
import type { UserProfile } from '@/lib/store';
import { cn } from '@/lib/utils';
import { setAppLanguage } from '@/lib/i18n';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    currentProfile,
    setProfile,
    abhaConnected,
    setAbhaConnected,
    language,
    setLanguage,
    recentScans,
    clearRecentScans
  } = useAppStore();

  const [showAbhaDialog, setShowAbhaDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(currentProfile);

  // Mock multiple profiles - in real app, would be stored in backend
  const [profiles] = useState([
    { id: 'main', name: 'My Profile', profile: currentProfile, isActive: true },
    { id: 'child1', name: 'Arjun (Child)', profile: { type: 'child' as const, conditions: [], allergies: ['milk' as const], diet: 'veg' as const }, isActive: false },
    { id: 'parent2', name: 'Priya (Diabetes)', profile: { type: 'adult' as const, conditions: ['diabetes' as const], allergies: [], diet: 'veg' as const }, isActive: false },
  ]);

  const profileTypes = [
    {
      value: 'adult' as const,
      label: 'Adult (18-59)',
      icon: Users,
      description: 'Standard nutritional guidelines'
    },
    {
      value: 'child' as const,
      label: 'Child (2-17)',
      icon: Baby,
      description: 'Child-safe additives & lower limits'
    },
    {
      value: 'senior' as const,
      label: 'Senior (60+)',
      icon: UserCheck,
      description: 'Heart-friendly & low sodium focus'
    }
  ];

  const conditions = [
    { value: 'diabetes' as const, label: 'Diabetes', icon: AlertTriangle },
    { value: 'hypertension' as const, label: 'High Blood Pressure', icon: Heart }
  ];

  const allergies = [
    { value: 'peanut' as const, label: 'Peanut' },
    { value: 'milk' as const, label: 'Milk/Dairy' },
    { value: 'egg' as const, label: 'Egg' },
    { value: 'soy' as const, label: 'Soy' },
    { value: 'gluten' as const, label: 'Gluten/Wheat' },
    { value: 'shellfish' as const, label: 'Shellfish' },
    { value: 'sesame' as const, label: 'Sesame' }
  ];

  const dietOptions = [
    { value: 'none' as const, label: 'No Restriction', icon: Utensils },
    { value: 'veg' as const, label: 'Vegetarian', icon: Utensils },
    { value: 'vegan' as const, label: 'Vegan', icon: Utensils },
    { value: 'jain' as const, label: 'Jain', icon: Utensils }
  ];

  const languages = [
    { value: 'en' as const, label: 'English', flag: '🇺🇸' },
    { value: 'hi' as const, label: 'हिंदी', flag: '🇮🇳' },
    { value: 'kn' as const, label: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ];

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setShowProfileDialog(false);
  };

  const handleAbhaConnect = () => {
    // Mock ABHA connection
    setAbhaConnected(true);
    setShowAbhaDialog(false);
  };

  const handleAbhaDisclaimerAccept = () => {
    setShowAbhaDialog(false);
    // Here you would redirect to actual ABHA service
    window.open('https://healthid.ndhm.gov.in/register', '_blank');
  };

  const handlePoshanTrackerDisclaimer = () => {
    // Show disclaimer and then redirect
    if (confirm(`Disclaimer: You will be redirected to the official Poshan Tracker website (poshantracker.women-child.gov.in). This is a government service for nutrition monitoring. Your data will be handled according to government privacy policies. Do you want to continue?`)) {
      handlePoshanTracker();
    }
  };

  const handleSwitchProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setProfile(profile.profile);
      setShowProfileSwitcher(false);
    }
  };

  const handleLogout = () => {
    // Clear user data and redirect to onboarding
    navigate('/onboarding');
  };

  const handlePoshanTracker = () => {
    // Mock Poshan Tracker integration
    window.open('https://poshantracker.women-child.gov.in/', '_blank');
  };

  const getHealthRiskCount = () => {
    return currentProfile.conditions.length + currentProfile.allergies.length;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
        {/* Header */}
        <header className="px-4 md:px-5 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-material-lg">
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">{t('profile_health_title')}</h1>
                <p className="text-sm text-muted-foreground">{t('profile_health_subtitle')}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfileManager(true)}
              className="rounded-xl"
            >
              <Users className="w-4 h-4 mr-2" />
              {t('switch_profile')}
            </Button>
          </div>

          {/* Profile Summary Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 shadow-material-md rounded-2xl">
            <CardContent className="p-4 md:p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-lg capitalize">{t('profile_type_with_label', { type: currentProfile.type })}</h3>
                <p className="text-muted-foreground text-sm">
                  {t('health_considerations_tracked', { count: getHealthRiskCount() })}
                </p>
              </div>

              {/* Profile Manager Modal */}
              {showProfileManager && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <Card className="w-full max-w-md rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{t('switch_profile')}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setShowProfileManager(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {profiles.map((profile) => (
                        <Card key={profile.id} className="cursor-pointer hover:bg-accent/50 rounded-xl">
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1" onClick={() => handleSwitchProfile(profile.id)}>
                              <User className="w-5 h-5" />
                              <div className="flex-1">
                                <div className="font-medium">{profile.name}</div>
                                <div className="text-sm text-muted-foreground">{profile.profile.type}</div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setTempProfile(profile.profile);
                                setShowProfileDialog(true);
                                setShowProfileManager(false);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

                {/* Profile Editor Dialog */}
                <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('edit_profile')}</DialogTitle>
                      <DialogDescription>
                        {t('edit_profile_description')}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      {/* Profile Type */}
                      <div className="space-y-4">
                        <Label>{t('profile_type')}</Label>
                        <RadioGroup
                          value={tempProfile.type}
                          onValueChange={(value) =>
                            setTempProfile({ ...tempProfile, type: value as UserProfile['type'] })
                          }
                        >
                          {profileTypes.map((type) => (
                            <div key={type.value} className="flex items-start space-x-2 p-2">
                              <RadioGroupItem value={type.value} id={type.value} />
                              <div className="grid gap-1.5 leading-none">
                                <Label htmlFor={type.value}>{type.label}</Label>
                                <p className="text-sm text-muted-foreground">
                                  {t(type.description)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Health Conditions */}
                      <div className="space-y-4">
                        <Label>{t('health_conditions')}</Label>
                        <div className="grid gap-2">
                          {conditions.map((condition) => (
                            <div key={condition.value} className="flex items-center space-x-2">
                              <Switch
                                id={condition.value}
                                checked={tempProfile.conditions.includes(condition.value)}
                                onCheckedChange={(checked) => {
                                  setTempProfile({
                                    ...tempProfile,
                                    conditions: checked
                                      ? [...tempProfile.conditions, condition.value]
                                      : tempProfile.conditions.filter(c => c !== condition.value)
                                  });
                                }}
                              />
                              <Label htmlFor={condition.value}>{condition.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Allergies */}
                      <div className="space-y-4">
                        <Label>{t('food_allergies')}</Label>
                        <div className="grid gap-2">
                          {allergies.map((allergy) => (
                            <div key={allergy.value} className="flex items-center space-x-2">
                              <Switch
                                id={allergy.value}
                                checked={tempProfile.allergies.includes(allergy.value)}
                                onCheckedChange={(checked) => {
                                  setTempProfile({
                                    ...tempProfile,
                                    allergies: checked
                                      ? [...tempProfile.allergies, allergy.value]
                                      : tempProfile.allergies.filter(a => a !== allergy.value)
                                  });
                                }}
                              />
                              <Label htmlFor={allergy.value}>{allergy.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Diet */}
                      <div className="space-y-4">
                        <Label>{t('dietary_preference')}</Label>
                        <RadioGroup
                          value={tempProfile.diet}
                          onValueChange={(value) => setTempProfile({ ...tempProfile, diet: value })}
                        >
                          {dietOptions.map((diet) => (
                            <div key={diet.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={diet.value} id={diet.value} />
                              <Label htmlFor={diet.value}>{diet.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
                        {t('cancel')}
                      </Button>
                      <Button onClick={() => {
                        setProfile(tempProfile);
                        setShowProfileDialog(false);
                      }}>
                        {t('save_changes')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{currentProfile.conditions.length}</div>
                  <div className="text-xs text-muted-foreground">{t('conditions')}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-warning">{currentProfile.allergies.length}</div>
                  <div className="text-xs text-muted-foreground">{t('allergies')}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-secondary capitalize">{currentProfile.diet}</div>
                  <div className="text-xs text-muted-foreground">{t('diet')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Settings Sections */}
        <div className="px-4 md:px-5 space-y-6 pb-8">
          {/* Health ID & Trackers */}
          <Card className="shadow-material-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('health_id_title')}</CardTitle>
                  <CardDescription>{t('health_id_subtitle')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={showAbhaDialog} onOpenChange={setShowAbhaDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start p-4 h-auto rounded-xl">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">{t('abha_health_id')}</div>
                        <div className="text-xs text-muted-foreground">{t('digital_health_records')}</div>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('abha_health_id')}</DialogTitle>
                    <DialogDescription>
                      {t('connect_unified_health_ecosystem')}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('what_is_abha')}</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {t('what_is_abha_desc')}
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                      <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">{t('privacy_notice')}</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {t('privacy_notice_desc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setShowAbhaDialog(false)} className="flex-1">
                      {t('cancel')}
                    </Button>
                    <Button onClick={handleAbhaDisclaimerAccept} className="flex-1 bg-gradient-primary">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('continue')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="w-full justify-start p-4 h-auto rounded-xl"
                onClick={handlePoshanTrackerDisclaimer}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{t('poshan_tracker')}</div>
                    <div className="text-xs text-muted-foreground">{t('nutrition_monitoring')}</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="shadow-material-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Languages className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('language_region')}</CardTitle>
                  <CardDescription>{t('choose_language')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {languages.map((lang) => (
                <div
                  key={lang.value}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                    "border-2",
                    language === lang.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={async () => {
                    setLanguage(lang.value);
                    await setAppLanguage(lang.value);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                  </div>
                  {language === lang.value && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="shadow-material-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('data_privacy')}</CardTitle>
                  <CardDescription>{t('manage_history_data')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('recent_scans')}</p>
                  <p className="text-sm text-muted-foreground">{t('products_stored_locally', { count: recentScans.length })}</p>
                </div>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={clearRecentScans}
                  disabled={recentScans.length === 0}
                >
                  {t('clear_history')}
                </Button>
              </div>

              <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                  {t('data_storage_notice')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="shadow-material-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t('help_support')}</CardTitle>
                    <CardDescription>{t('help_support_desc')}</CardDescription>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;