import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, CheckCircle, Dumbbell, UtensilsCrossed, Target, TrendingUp, Users, AlertCircle, Loader2, Moon, Sun, ArrowRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface LandingPageProps {
  onEmailSubmit: (email: string) => void;
}

export function LandingPage({ onEmailSubmit }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await onEmailSubmit(email);
      setIsSubmitted(true);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error submitting email:", error);
    } finally {
      setIsLoading(false);
    }
  };



  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
                <p className="text-muted-foreground">Redirecting you to your workout plan...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header - Matching main app style */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-primary mb-2">
                  FitPlan Pro
                </h1>
                <p className="text-muted-foreground mb-2">
                  Personal Workout & Meal Plan Platform
                </p>
              </div>
              
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-8 w-8"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Email Capture Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Transform Your <span className="text-primary">Fitness Journey</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Get personalized workout and meal plans designed by certified trainers. 
                Track your progress and achieve your goals faster.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="pl-12 h-12"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    size="lg"
                    className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Accessing...
                      </>
                    ) : (
                      <>
                        Get Free Access
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Features Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Target className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Goal Setting</h3>
                  <p className="text-sm text-muted-foreground">Define clear fitness objectives</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Dumbbell className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Custom Workouts</h3>
                  <p className="text-sm text-muted-foreground">Personalized exercise plans</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Meal Planning</h3>
                  <p className="text-sm text-muted-foreground">Nutrition tailored to your goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Trainers</h3>
              <p className="text-muted-foreground text-sm">Plans designed by certified fitness professionals</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-muted-foreground text-sm">Join thousands who achieved their fitness goals</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground text-sm">Visualize your journey to stay motivated</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer - Matching main app style */}
        <footer className="pt-6 border-t text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4" />
            <span className="font-semibold">FitPlan Pro</span>
          </div>
          <p>© 2026 FitPlan Pro. Transform your fitness journey today.</p>
        </footer>
      </div>
    </div>
  );
}
