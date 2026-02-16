import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { WorkoutPlan } from "./components/WorkoutPlan";
import { MealPlan } from "./components/MealPlan";
import { LandingPage } from "./components/LandingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Printer, Dumbbell, UtensilsCrossed } from "lucide-react";
import { authService } from "./lib/authService";
import {
  sampleClientInfo,
  sampleWorkoutPlan,
  sampleProgress,
  sampleMealPlan,
} from "./data/sampleData";

function MainContent() {
  const [activeTab, setActiveTab] = useState("workout");
  const printRef = useRef<HTMLDivElement>(null);
  const userEmail = authService.getUserEmail();

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 no-print">
          <div className="text-sm text-muted-foreground">
            {userEmail && `Logged in as: ${userEmail}`}
          </div>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>

        {/* Printable Content */}
        <div ref={printRef}>
          <Header clientInfo={sampleClientInfo} />

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

            <TabsContent value="workout">
              <WorkoutPlan 
                workoutDays={sampleWorkoutPlan}
                goal={sampleClientInfo.goal}
                goals={sampleProgress.goals}
                trainerNotes={sampleProgress.notes}
              />
            </TabsContent>

            <TabsContent value="meal">
              <MealPlan mealPlan={sampleMealPlan} />
            </TabsContent>
          </Tabs>
        </div>

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
