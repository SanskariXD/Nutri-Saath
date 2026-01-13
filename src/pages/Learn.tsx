import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  Clock,
  CheckCircle,
  Play,
  Target,
  AlertCircle,
  Utensils,
  Baby,
  Heart,
  Beaker,
  Award,
  Leaf,
  ShieldCheck,
  Factory,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: any;
  gradient: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  actionableCheck: string;
  whatYouLearn: string[];
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Food Adulteration Detection Guide',
    description: 'Learn simple DIY methods to check for common food adulterations at home using FSSAI DART guidelines.',
    duration: '8 min',
    icon: Beaker,
    gradient: 'from-red-500 to-pink-500',
    difficulty: 'Beginner',
    tags: ['Adulteration', 'Safety', 'DIY', '🔥 Essential'],
    actionableCheck: 'Use simple tests like turmeric paper for milk, iodine for starch in everyday items',
    whatYouLearn: [
      'How to test milk purity with simple household items',
      'Detect artificial colors in sweets and spices',
      'Identify starch adulteration in milk products',
      'FSSAI-approved DIY testing methods'
    ]
  },
  {
    id: 2,
    title: 'Per-100g vs Per-Serving',
    description: 'Learn how food companies hide high sugar and sodium by using confusing serving sizes.',
    duration: '3 min',
    icon: Target,
    gradient: 'from-blue-500 to-purple-600',
    difficulty: 'Beginner',
    tags: ['Basics', 'Reading Labels'],
    actionableCheck: 'Always check if nutrition is per 100g or per serving - companies use tiny servings to hide truth',
    whatYouLearn: [
      'Why per-100g values are more reliable for comparison',
      'How companies manipulate serving sizes',
      'Calculate actual intake from serving information',
      'Real examples from popular Indian snacks'
    ]
  },
  {
    id: 3,
    title: 'Hidden Sugars Decoded',
    description: 'Discover 56+ names for sugar that companies use to trick consumers.',
    duration: '4 min',
    icon: AlertCircle,
    gradient: 'from-pink-500 to-red-500',
    difficulty: 'Beginner',
    tags: ['Sugar', 'Ingredients'],
    actionableCheck: 'Look for -ose endings (glucose, fructose) and syrup ingredients in first 5 items',
    whatYouLearn: [
      'All 56+ names companies use to hide sugar',
      'How to spot "healthy" products loaded with sugar',
      'Difference between natural and added sugars',
      'Safe daily sugar limits for your family'
    ]
  },
  {
    id: 4,
    title: 'Sodium Traps in Packaged Foods',
    description: 'Identify high-sodium foods that seem healthy but can harm your heart.',
    duration: '5 min',
    icon: Heart,
    gradient: 'from-orange-500 to-yellow-500',
    difficulty: 'Intermediate',
    tags: ['Sodium', 'Heart Health'],
    actionableCheck: 'Reject products with >400mg sodium per 100g - your heart will thank you',
    whatYouLearn: [
      'Hidden sources of sodium beyond table salt',
      'How to read sodium content correctly',
      'Impact of high sodium on blood pressure',
      'Healthier low-sodium alternatives'
    ]
  },
  {
    id: 5,
    title: 'Kids Snacks & Harmful Additives',
    description: 'Protect your children from artificial colors, flavors, and preservatives.',
    duration: '6 min',
    icon: Baby,
    gradient: 'from-green-500 to-teal-500',
    difficulty: 'Intermediate',
    tags: ['Children', 'Additives'],
    actionableCheck: 'Avoid E-numbers E129, E102, E621 (MSG) in children\'s food - linked to hyperactivity',
    whatYouLearn: [
      'Most dangerous additives for children',
      'How to decode E-numbers on labels',
      'Natural alternatives to artificial colors',
      'Safer snack options for kids'
    ]
  },
  {
    id: 6,
    title: 'Fats & "No Trans Fat" Gotchas',
    description: 'Understand good fats vs bad fats and how companies hide trans fats legally.',
    duration: '4 min',
    icon: Utensils,
    gradient: 'from-indigo-500 to-purple-500',
    difficulty: 'Advanced',
    tags: ['Fats', 'Trans Fat'],
    actionableCheck: 'Check ingredients for "partially hydrogenated" oils - that\'s hidden trans fat',
    whatYouLearn: [
      'Difference between saturated, unsaturated, and trans fats',
      'How companies legally claim "0g trans fat"',
      'Healthiest cooking oils for Indian cuisine',
      'Reading fat content like a nutrition expert'
    ]
  },
  {
    id: 7,
    title: 'Certifications That Matter',
    description: 'Understand Indian food certifications: Jaivik Bharat, +F Fortified, ODOP, and more.',
    duration: '5 min',
    icon: Award,
    gradient: 'from-purple-500 to-pink-500',
    difficulty: 'Beginner',
    tags: ['Certifications', 'Trust'],
    actionableCheck: 'Look for official certification logos - they ensure quality and compliance',
    whatYouLearn: [
      'What Jaivik Bharat organic certification means',
      'Benefits of +F fortified foods for nutrition',
      'How ODOP supports local economies',
      'Spotting fake vs real certification marks'
    ]
  },
  {
    id: 8,
    title: 'Healthy Eating Habits',
    description: 'Simple daily habits for better nutrition: plate method, hydration, and mindful eating.',
    duration: '4 min',
    icon: Leaf,
    gradient: 'from-emerald-500 to-green-500',
    difficulty: 'Beginner',
    tags: ['Habits', 'Wellness'],
    actionableCheck: 'Follow the plate method: half veggies, quarter protein, quarter carbs',
    whatYouLearn: [
      'The plate method for balanced meals',
      'Why hydration matters more than you think',
      'Mindful eating techniques',
      'Building sustainable healthy habits'
    ]
  }
];

const Learn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completedLessons, completeLesson } = useAppStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const completedCount = completedLessons.length;
  const progressPercent = (completedCount / lessons.length) * 100;

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleStartLesson = (lessonId: number) => {
    completeLesson(lessonId);
    // In a real app, this would navigate to detailed lesson content
    setSelectedLesson(null);
  };

  const isCompleted = (lessonId: number) => completedLessons.includes(lessonId);

  if (selectedLesson) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background pb-24">
          <div className="px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLesson(null)}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                {selectedLesson.difficulty}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedLesson.duration}
              </Badge>
            </div>

            {/* Lesson Hero */}
            <div className={cn(
              "relative overflow-hidden rounded-3xl p-8 mb-8 text-white shadow-2xl",
              "bg-gradient-to-br", selectedLesson.gradient
            )}>
              <div className="relative z-10">
                <selectedLesson.icon className="w-16 h-16 mb-6 opacity-90" />
                <h1 className="text-3xl font-bold mb-4">{selectedLesson.title}</h1>
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  {selectedLesson.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />
            </div>

            {/* Lesson Content */}
            <Card className="mb-8 shadow-material-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  What You'll Learn
                </h2>
                <div className="space-y-4 mb-8">
                  {selectedLesson.whatYouLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-success/10 border border-success/20 rounded-2xl p-6">
                  <h3 className="font-semibold text-success mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Key Takeaway
                  </h3>
                  <p className="text-success-foreground leading-relaxed">{selectedLesson.actionableCheck}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button
              onClick={() => handleStartLesson(selectedLesson.id)}
              className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={isCompleted(selectedLesson.id)}
            >
              {isCompleted(selectedLesson.id) ? (
                <>
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Lesson Completed
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-3" />
                  Start Learning
                </>
              )}
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background pb-24">
        {/* Header */}
        <header className="px-6 pt-12 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-material-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Learn Smart Reading
              </h1>
              <p className="text-muted-foreground">Master food label literacy in {lessons.length} lessons</p>
            </div>
          </div>

          {/* Progress Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 shadow-material-md overflow-hidden rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Your Progress</h3>
                  <p className="text-muted-foreground text-sm">
                    {completedCount} of {lessons.length} lessons completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{Math.round(progressPercent)}%</div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={progressPercent} className="h-2 mb-2 rounded-full bg-muted" />
              <p className="text-xs text-muted-foreground">
                {completedCount === lessons.length
                  ? "🎉 All lessons completed! You're now a label reading expert!"
                  : `${lessons.length - completedCount} lessons remaining`
                }
              </p>
            </CardContent>
          </Card>
        </header>

        {/* Lessons Grid */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-1 gap-4">
            {lessons
              .sort((a, b) => {
                const aCompleted = isCompleted(a.id);
                const bCompleted = isCompleted(b.id);
                if (aCompleted === bCompleted) return 0;
                return aCompleted ? 1 : -1;
              })
              .map((lesson, index) => {
                const completed = isCompleted(lesson.id);
                return (
                  <Card
                    key={lesson.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-material-lg",
                      "interactive-scale stagger-item border-2 overflow-hidden rounded-2xl",
                      completed
                        ? "bg-success/5 border-success/30 hover:border-success/50"
                        : "hover:border-primary/50"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                          "bg-gradient-to-br", lesson.gradient
                        )}>
                          {completed ? (
                            <CheckCircle className="h-7 w-7 text-white" />
                          ) : (
                            <lesson.icon className="h-7 w-7 text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-lg font-semibold leading-tight">{lesson.title}</h3>
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {lesson.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {lesson.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{lesson.duration}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Bottom CTA */}
          {completedCount === lessons.length && (
            <Card className="mt-8 bg-gradient-to-r from-success/10 to-primary/10 border-success/30 shadow-material-lg">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-success to-primary flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Congratulations! 🎉</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                  You've completed all lessons and are now equipped to make healthier food choices for your family.
                </p>
                <Button
                  onClick={() => navigate('/consumer/scan')}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  Start Scanning Products
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Trust Matters Section */}
          <Card className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-xl overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" /> Why Trust Matters
                </h3>
                <p className="opacity-90 text-sm mb-4 leading-relaxed">
                  In an era of misinformation, verifiable labels are your best defense.
                  NutriSaath connects you directly to the producer's compliance data through our Trust Layer.
                </p>
                <Badge variant="secondary" className="bg-white text-blue-700 hover:bg-white/90">
                  Read our Mission
                </Badge>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <ShieldCheck className="w-32 h-32 -mr-8 -mb-8" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Learn;