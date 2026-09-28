import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WorkoutPlan } from "./components/WorkoutPlan";
import { MealPlan } from "./components/MealPlan";
import {
  Printer,
  Dumbbell,
  Calendar,
  CalendarRange,
  Apple,
  ClipboardList,
  Trophy,
  Ruler,
  Scale,
  Activity,
  Target,
  Instagram,
  CheckCircle2,
  ShieldAlert,
  Award,
  TrendingUp,
  ShieldCheck,
  Info,
} from "lucide-react";

import {
  sampleClientInfo,
  sampleWorkoutPlan,
  sampleProgress,
  completeMealPlan,
} from "./data/sampleData";

type DashboardTab = "workout" | "meals" | "guidelines" | "goals";

const trainingTips = [
  "Always warm up for 5-10 minutes before starting",
  "Do not skip stretching after the workout",
  "Focus on proper form over heavy weight",
  "Stay hydrated throughout your workout",
  "Progressive overload: aim to increase weight or reps weekly",
  "Get adequate rest between workout days",
];

const trainerGuidelines = [
  {
    title: "Absolute Consistency",
    body: "Consistency is the absolute primary key element. Never skip scheduled timeline protocols.",
  },
  {
    title: "Protein Target Adherence",
    body: "Hit your calculated protein target daily. Target a range of 1.6–2.2g per single kilogram of overall body weight.",
  },
  {
    title: "Creatine Protocol",
    body: "Take precisely 5g of pure micronized creatine daily before or directly post training. Maintain identical timeline.",
  },
  {
    title: "Hydration Parameters",
    body: "Maintain high intracellular hydration constants. Target an absolute minimum threshold of 3–5 litres daily.",
  },
  {
    title: "Sleep & Neural Recovery",
    body: "Secure 7–8 hours of high-quality uninterrupted deep sleep per nocturnal block to facilitate tissue rebuilding.",
  },
  {
    title: "Log Metrics & Photos",
    body: "Document weight metrics via applications (MyFitnessPal, Hevy). Capture clean posture progress pictures every 2 weeks.",
  },
];

function noteQuote(notes: string) {
  return notes
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("Remember:"));
}

function averageMacros() {
  const days = completeMealPlan.length || 1;
  const totals = completeMealPlan.reduce(
    (sum, day) => ({
      protein: sum.protein + day.totalMacros.protein,
      carbs: sum.carbs + day.totalMacros.carbs,
      fats: sum.fats + day.totalMacros.fats,
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );
  return {
    protein: Math.round(totals.protein / days),
    carbs: Math.round(totals.carbs / days),
    fats: Math.round(totals.fats / days),
  };
}

function MainContent() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("workout");
  const printRef = useRef<HTMLDivElement>(null);
  const macros = averageMacros();
  const remember = noteQuote(sampleProgress.notes);
  const instagram = sampleClientInfo.instagram?.replace("@", "");

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${sampleClientInfo.name}_Workout_Plan`,
  });

  const tabs: { id: DashboardTab; label: string; icon: typeof Dumbbell }[] = [
    { id: "workout", label: "Workout Schedule Split", icon: CalendarRange },
    { id: "meals", label: "Nutrition & Meal Blueprint", icon: Apple },
    { id: "guidelines", label: "Trainer Guidelines & Tips", icon: ClipboardList },
    { id: "goals", label: "Targets & Milestone Matrix", icon: Trophy },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
      <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight">{sampleClientInfo.name}</span>
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              Premium Coaching Portal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-500 md:flex">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-medium">
              {sampleClientInfo.startDate} – {sampleClientInfo.endDate}
            </span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </button>
        </div>
      </header>

      <main ref={printRef} className="mx-auto w-full max-w-[1440px] flex-1 p-4 md:p-8 lg:p-12">
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-bl from-blue-50/80 to-transparent" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  {sampleClientInfo.name}
                </h1>
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                  1-Year Periodization Plan
                </span>
              </div>
              <p className="text-lg font-medium text-slate-600">Personal Workout & Meal Plan</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {sampleClientInfo.height && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    <Ruler className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">Height:</span> {sampleClientInfo.height}
                  </span>
                )}
                {sampleClientInfo.weight && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    <Scale className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">Weight:</span> {sampleClientInfo.weight}kg
                  </span>
                )}
                {sampleClientInfo.bodyFat !== undefined && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    <Activity className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">Body Fat:</span> {sampleClientInfo.bodyFat}%
                  </span>
                )}
              </div>
            </div>

            <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl lg:max-w-md">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Target className="h-4 w-4" />
                Primary Focus Directive
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-200">{sampleClientInfo.goal}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                <span>Coach Assigned: {sampleClientInfo.trainerName}</span>
                {instagram && (
                  <a
                    href={`https://instagram.com/${instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    @{instagram}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="no-print mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors ${
                    selected
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className={activeTab === "workout" ? "block" : "hidden print:block"}>
          <WorkoutPlan workoutDays={sampleWorkoutPlan} />
        </div>

        <div className={activeTab === "meals" ? "block space-y-8" : "hidden space-y-8 print:block"}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="font-display mb-4 text-lg font-bold">Target Macronutrients</h3>
                <p className="mb-6 text-sm text-slate-500">
                  Average of the meals already written into this week.
                </p>
                <MacroBar label="Protein" value={`${macros.protein}g`} width="85%" bar="bg-blue-600" />
                <MacroBar label="Carbohydrates" value={`${macros.carbs}g`} width="70%" bar="bg-amber-500" />
                <MacroBar label="Fats" value={`${macros.fats}g`} width="55%" bar="bg-slate-700" />
              </div>
              <div className="-mx-6 -mb-6 mt-6 rounded-b-2xl border-t border-slate-100 bg-blue-50/50 p-6">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-blue-800">
                  Daily directive
                </span>
                <p className="text-xs font-medium text-blue-900">5g of creatine, at the same time every day.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-display mb-4 text-lg font-bold">Hydration</h3>
              <p className="mb-6 text-sm text-slate-500">Aim for 3–5 litres of water across the day.</p>
              <div className="flex h-28 items-end justify-between gap-2">
                {[
                  ["40%", "bg-blue-100 text-blue-800", "1.5L"],
                  ["65%", "bg-blue-200 text-blue-800", "2.5L"],
                  ["80%", "bg-blue-300 text-blue-800", "3.5L"],
                  ["100%", "bg-blue-600 text-white", "4.5L"],
                ].map(([height, color, label]) => (
                  <div
                    key={label}
                    className={`flex w-full items-end justify-center rounded-t-md py-1 text-[10px] font-bold ${color}`}
                    style={{ height }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Drink steadily, and take a full litre inside the workout window.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-display mb-4 text-lg font-bold">80% Clean Nutrition Rule</h3>
              <p className="mb-4 text-sm text-slate-500">
                Most of the week stays on whole food so training and recovery stay consistent.
              </p>
              <ol className="space-y-3 text-xs font-medium text-slate-700">
                {[
                  "Protein and slower carbs first.",
                  "Keep added sugar and processed food rare.",
                  "Prep on Sunday so the week does not drift.",
                ].map((item, index) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <MealPlan mealPlan={completeMealPlan} />
        </div>

        <div className={activeTab === "guidelines" ? "block space-y-8" : "hidden space-y-8 print:block"}>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-display text-xl font-bold">Trainer Notes</h3>
              <p className="text-sm text-slate-500">The habits that keep the plan moving.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trainerGuidelines.map((item, index) => (
                <article key={item.title} className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">{item.body}</p>
                </article>
              ))}
            </div>
            {remember && (
              <p className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center text-xs font-medium italic leading-relaxed text-blue-900">
                {remember}
              </p>
            )}
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <h3 className="font-display text-lg font-bold">Training Tips</h3>
              </div>
              <ul className="space-y-3 text-sm font-medium text-slate-600">
                {trainingTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 text-white">
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-blue-400">
                  Safety
                </span>
                <h4 className="font-display mb-3 text-xl font-bold">Joints before ego</h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  If a joint hurts instead of the muscle working, drop the load and slow the lowering portion of the rep.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-800 pt-4 text-xs text-slate-300">
                <Award className="h-5 w-5 text-amber-400" />
                Built to last the full year of this plan.
              </div>
            </section>
          </div>
        </div>

        <div className={activeTab === "goals" ? "block" : "hidden print:block"}>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-display text-xl font-bold">Target Outcome Hierarchy</h3>
              <p className="text-sm text-slate-500">What this year is aiming at, near and far.</p>
            </div>
            {sampleClientInfo.goal && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-blue-800">
                  Overarching focus
                </span>
                <p className="text-sm font-bold text-blue-900">{sampleClientInfo.goal}</p>
              </div>
            )}
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
              <GoalList title="Short-Term Targets" icon={TrendingUp} tone="blue" items={sampleProgress.goals.shortTerm} />
              <GoalList title="Long-Term Milestones" icon={ShieldCheck} tone="emerald" items={sampleProgress.goals.longTerm} />
            </div>
          </section>
        </div>
      </main>

      <footer className="no-print mt-12 border-t border-slate-200 bg-white px-6 py-6 text-center text-xs font-medium text-slate-400">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 sm:flex-row">
          <span>
            {sampleClientInfo.name} © {sampleClientInfo.startDate} – {sampleClientInfo.endDate}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Info className="h-3.5 w-3.5 text-blue-500" />
            My workout routine and meal plan for getting in shape.
          </span>
        </div>
      </footer>
    </div>
  );
}

function MacroBar({
  label,
  value,
  width,
  bar,
}: {
  label: string;
  value: string;
  width: string;
  bar: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-sm font-medium">
        <span className="text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${bar}`} style={{ width }} />
      </div>
    </div>
  );
}

function GoalList({
  title,
  icon: Icon,
  tone,
  items,
}: {
  title: string;
  icon: typeof TrendingUp;
  tone: "blue" | "emerald";
  items: string[];
}) {
  const dot = tone === "blue" ? "bg-blue-600" : "bg-emerald-500";
  const iconColor = tone === "blue" ? "text-blue-600" : "text-emerald-600";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <h4 className="font-display text-base font-bold">{title}</h4>
      </div>
      <ul className="space-y-2.5 text-xs font-medium text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
