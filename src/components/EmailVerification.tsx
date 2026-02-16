import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, AlertCircle, Loader2, Mail, ArrowLeft, RefreshCw, Dumbbell, Moon, Sun } from "lucide-react";
import { emailService } from "../lib/emailService";
import { useTheme } from "./ThemeProvider";

interface EmailVerificationProps {
  token: string | null;
  email: string | null;
  onVerified: () => void;
  onBackToLanding: () => void;
}

type VerificationState = 'verifying' | 'success' | 'error' | 'pending';

export function EmailVerification({ 
  token, 
  email, 
  onVerified, 
  onBackToLanding 
}: EmailVerificationProps) {
  const { theme, toggleTheme } = useTheme();
  const [verificationState, setVerificationState] = useState<VerificationState>(
    token ? 'verifying' : 'pending'
  );
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  useEffect(() => {
    if (verificationState === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verificationState === 'success' && countdown === 0) {
      onVerified();
    }
  }, [verificationState, countdown, onVerified]);

  const verifyEmail = async (verificationToken: string) => {
    setVerificationState('verifying');
    
    try {
      const result = await emailService.verifyEmail(verificationToken);
      
      if (result.success) {
        setVerificationState('success');
        setMessage(result.message);
      } else {
        setVerificationState('error');
        setMessage(result.message);
      }
    } catch (error) {
      setVerificationState('error');
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      const result = await emailService.resendVerificationEmail(email);
      
      if (result.success) {
        setResendSuccess(true);
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Failed to resend verification email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleManualVerify = () => {
    const storedToken = localStorage.getItem('verification_token');
    if (storedToken) {
      verifyEmail(storedToken);
    } else {
      setVerificationState('error');
      setMessage("No verification token found. Please submit your email again.");
    }
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'verifying':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-4">{message}</p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to your workout plan in {countdown} seconds...
            </p>
            <Button 
              onClick={onVerified} 
              className="mt-4"
            >
              Go to Workout Plan Now
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            
            <div className="space-y-3">
              {email && (
                <Button 
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  variant="outline"
                  className="w-full"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={handleManualVerify}
                variant="outline"
                className="w-full"
              >
                Try Verify Again
              </Button>
              
              <Button 
                onClick={onBackToLanding}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign Up
              </Button>
            </div>
            
            {resendSuccess && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Verification email resent! Please check your inbox.
                </p>
              </div>
            )}
          </div>
        );

      case 'pending':
      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-muted-foreground mb-2">
              We've sent a verification link to:
            </p>
            <p className="font-semibold text-lg mb-6">{email}</p>
            <p className="text-sm text-muted-foreground mb-6">
              Click the link in the email to verify your account and access your workout plan.
            </p>
            
            <div className="space-y-3">
              {email && (
                <Button 
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  variant="outline"
                  className="w-full"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend Email
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={handleManualVerify}
                variant="outline"
                className="w-full"
              >
                I've Clicked the Link
              </Button>
              
              <Button 
                onClick={onBackToLanding}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Use Different Email
              </Button>
            </div>
            
            {resendSuccess && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Verification email resent! Please check your inbox.
                </p>
              </div>
            )}
          </div>
        );
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
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-6 h-6 text-primary" />
                  <h1 className="text-3xl font-bold text-primary">
                    FitPlan Pro
                  </h1>
                </div>
                <p className="text-muted-foreground">
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

        {/* Verification Card */}
        <div className="flex justify-center items-center min-h-[50vh]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Email Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
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

export default EmailVerification;
