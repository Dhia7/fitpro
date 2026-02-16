import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Header } from "./components/Header";
import { WorkoutPlan } from "./components/WorkoutPlan";
import { MealPlan } from "./components/MealPlan";
import { LandingPage } from "./components/LandingPage";
import { EmailVerification } from "./components/EmailVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Printer, Dumbbell, UtensilsCrossed } from "lucide-react";
import EmailService, { emailService } from "./lib/emailService";
import {
  sampleClientInfo,
  sampleWorkoutPlan,
  sampleProgress,
  sampleMealPlan,
} from "./data/sampleData";

type AppState = 'landing' | 'verification' | 'main';

function App() {
  const [activeTab, setActiveTab] = useState("workout");
  const [appState, setAppState] = useState<AppState>('landing');
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track visitor on app load
    EmailService.trackVisitor();
    
    // Check URL for verification token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      setVerificationToken(token);
      setAppState('verification');
      // Clear the token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    // Check if user has already verified their email
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const verifiedEmail = localStorage.getItem('verified_email');
    const emailVerified = localStorage.getItem('email_verified') === 'true';
    const pendingVerificationEmail = localStorage.getItem('pending_verification_email');
    
    if (verifiedEmail && emailVerified) {
      // User is fully verified, check status with server
      try {
        const status = await emailService.checkVerificationStatus(verifiedEmail);
        if (status.verified) {
          setAppState('main');
          return;
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }
    
    if (pendingVerificationEmail) {
      // User has submitted email but not verified yet
      setPendingEmail(pendingVerificationEmail);
      setAppState('verification');
      return;
    }
    
    // Check old localStorage key for backward compatibility
    const hasEmailSubmitted = localStorage.getItem('email_submitted') === 'true';
    if (hasEmailSubmitted && verifiedEmail && emailVerified) {
      setAppState('main');
      return;
    }
    
    // Default to landing page
    setAppState('landing');
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      const result = await emailService.submitEmail(email);
      
      if (result.success) {
        setPendingEmail(email);
        setAppState('verification');
        
        // If email was already verified, go straight to main
        if (result.message.includes('already verified')) {
          setTimeout(() => {
            setAppState('main');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      // Still show verification page for better UX
      setPendingEmail(email);
      setAppState('verification');
    }
  };

  const handleVerified = () => {
    setAppState('main');
    setVerificationToken(null);
    setPendingEmail(null);
  };

  const handleBackToLanding = () => {
    EmailService.clearVerificationData();
    setAppState('landing');
    setVerificationToken(null);
    setPendingEmail(null);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${sampleClientInfo.name}_Workout_Plan`,
    pageStyle: `
      @page {
        size: letter;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  // Render based on app state
  if (appState === 'landing') {
    return <LandingPage onEmailSubmit={handleEmailSubmit} />;
  }

  if (appState === 'verification') {
    return (
      <EmailVerification
        token={verificationToken}
        email={pendingEmail}
        onVerified={handleVerified}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Print Button */}
        <div className="flex justify-end mb-4 no-print">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>

        {/* Printable Content */}
        <div ref={printRef}>
          {/* Header */}
          <Header clientInfo={sampleClientInfo} />

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 no-print h-auto p-2 gap-3 bg-muted/50 rounded-lg">
              <TabsTrigger 
                value="workout"
                className="flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold transition-all rounded-lg min-h-[60px] cursor-pointer border-2 bg-background/50 border-border/50 hover:border-primary/50 hover:bg-background hover:shadow-md active:scale-[0.98] hover:scale-[1.01] hover:-translate-y-0.5"
              >
                <Dumbbell className="h-5 w-5" />
                Workout Plan
              </TabsTrigger>
              <TabsTrigger 
                value="meal"
                className="flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold transition-all rounded-lg min-h-[60px] cursor-pointer border-2 bg-background/50 border-border/50 hover:border-primary/50 hover:bg-background hover:shadow-md active:scale-[0.98] hover:scale-[1.01] hover:-translate-y-0.5"
              >
                <UtensilsCrossed className="h-5 w-5" />
                Meal Plan
              </TabsTrigger>
            </TabsList>

            {/* Workout Plan Tab */}
            <TabsContent value="workout">
              <WorkoutPlan 
                workoutDays={sampleWorkoutPlan}
                goal={sampleClientInfo.goal}
                goals={sampleProgress.goals}
                trainerNotes={sampleProgress.notes}
              />
            </TabsContent>

            {/* Meal Plan Tab */}
            <TabsContent value="meal">
              <MealPlan mealPlan={sampleMealPlan} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground no-print">
          <p>
            This template is customizable. Edit the data in{" "}
            <code className="bg-muted px-2 py-1 rounded">
              src/data/sampleData.ts
            </code>{" "}
            to personalize it for your clients.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
