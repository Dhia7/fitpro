import type { DayMealPlan, Meal } from "@/types";
import { Apple, Coffee, Sun, Sunset, UtensilsCrossed } from "lucide-react";

interface MealPlanProps {
  mealPlan: DayMealPlan[];
}

const guidelines = [
  "Drink at least 8 glasses of water daily",
  "Meal prep on Sundays for the week ahead",
  "Adjust portion sizes based on hunger and activity level",
  "Try to eat within 1 hour of your workout",
  "Limit processed foods and added sugars",
];

function mealSections(day: DayMealPlan) {
  return [
    { label: "Breakfast", meal: day.meals.breakfast },
    { label: "Lunch", meal: day.meals.lunch },
    { label: "Dinner", meal: day.meals.dinner },
    ...day.meals.snacks.map((meal, index) => ({
      label: day.meals.snacks.length > 1 ? `Snack ${index + 1}` : "Snack",
      meal,
    })),
  ];
}

function MealIcon({ label }: { label: string }) {
  const className = "h-4 w-4 shrink-0 text-blue-600";
  if (label === "Breakfast") return <Coffee className={className} />;
  if (label === "Lunch") return <Sun className={className} />;
  if (label === "Dinner") return <Sunset className={className} />;
  return <Apple className={className} />;
}

function MacroChip({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-xl px-3 py-2 text-center ${tone}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

function MealSection({ label, meal }: { label: string; meal: Meal }) {
  return (
    <article className="grid gap-3 px-5 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:px-6">
      <div className="flex items-center gap-2 sm:block">
        <div className="flex items-center gap-2">
          <MealIcon label={label} />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        </div>
        <p className="text-xs font-medium text-slate-400 sm:mt-1 sm:pl-6">{meal.time}</p>
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">{meal.name}</p>
        {meal.description ? <p className="mt-1 text-sm leading-relaxed text-slate-500">{meal.description}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{meal.calories} cal</span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">P {meal.protein}g</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">C {meal.carbs}g</span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">F {meal.fats}g</span>
        </div>
      </div>
    </article>
  );
}

export function MealPlan({ mealPlan }: MealPlanProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-blue-600" />
          <h2 className="font-display text-2xl font-bold text-slate-900">Weekly Meal Plan</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Every day of the week, with each meal, the timing, and the macros that go with it.
        </p>
      </div>

      <div className="space-y-6">
        {mealPlan.map((dayPlan) => (
          <section
            key={dayPlan.day}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print-break-inside-avoid"
          >
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-6 w-2 rounded-full bg-blue-600" />
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{dayPlan.day}</h3>
                  <p className="text-sm text-slate-500">{dayPlan.totalMacros.calories} calories</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MacroChip label="Protein" value={`${dayPlan.totalMacros.protein}g`} tone="bg-blue-50 text-blue-800" />
                <MacroChip label="Carbs" value={`${dayPlan.totalMacros.carbs}g`} tone="bg-emerald-50 text-emerald-800" />
                <MacroChip label="Fats" value={`${dayPlan.totalMacros.fats}g`} tone="bg-amber-50 text-amber-800" />
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {mealSections(dayPlan).map((section) => (
                <MealSection key={`${dayPlan.day}-${section.label}`} label={section.label} meal={section.meal} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print-break-inside-avoid">
        <h3 className="font-display text-lg font-bold text-slate-900">Nutrition Guidelines</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {guidelines.map((item) => (
            <li key={item} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
