import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, ArrowRight, AlertCircle, Loader2, Moon, Sun, User } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { authService } from "../lib/authService";

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has email saved in localStorage
    const storedEmail = authService.getUserEmail();
    if (storedEmail) {
      setSavedEmail(storedEmail);
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    if (!savedEmail) return;
    
    setIsLoading(true);
    try {
      // Verify email still exists in database
      const exists = await authService.checkEmailExists(savedEmail);
      if (exists) {
        navigate("/dashboard");
      } else {
        // Email not in database anymore, clear and start fresh
        authService.clearAuth();
        setSavedEmail(null);
        setError("Session expired. Please enter your email again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      const result = await authService.requestAccess(email);
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error requesting access:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
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

        {/* Main Content */}
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {savedEmail ? "Welcome Back!" : "Get Started"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {savedEmail ? (
                // Returning user view
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">Welcome back</p>
                    <p className="font-semibold text-lg">{savedEmail}</p>
                  </div>
                  <Button
                    onClick={handleContinue}
                    disabled={isLoading}
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Continue to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <button
                    onClick={() => {
                      authService.clearAuth();
                      setSavedEmail(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-primary underline"
                  >
                    Use different email
                  </button>
                </div>
              ) : (
                // New user view
                <>
                  <p className="text-muted-foreground text-center">
                    Enter your email to access your personalized workout and meal plans
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
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
                    
                    {error && (
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      size="lg"
                      className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Get Access
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 FitPlan Pro. Transform your fitness journey today.</p>
        </footer>
      </div>
    </div>
  );
}
