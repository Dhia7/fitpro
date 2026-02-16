import type { DayMealPlan } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { UtensilsCrossed, Coffee, Sun, Sunset, Apple } from "lucide-react";
import { MacroCircle } from "./MacroCircle";

interface MealPlanProps {
  mealPlan: DayMealPlan[];
}

export function MealPlan({ mealPlan }: MealPlanProps) {
  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return <Coffee className="h-4 w-4" />;
      case "lunch":
        return <Sun className="h-4 w-4" />;
      case "dinner":
        return <Sunset className="h-4 w-4" />;
      case "snack":
        return <Apple className="h-4 w-4" />;
      default:
        return <UtensilsCrossed className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <UtensilsCrossed className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Weekly Meal Plan</h2>
      </div>

      {mealPlan.map((dayPlan, index) => (
        <Card key={index} className="print-break-inside-avoid">
          <CardHeader>
            <CardTitle>{dayPlan.day}</CardTitle>
            <CardDescription>
              Daily Total: {dayPlan.totalMacros.calories} cal | P:{" "}
              {dayPlan.totalMacros.protein}g | C: {dayPlan.totalMacros.carbs}g |
              F: {dayPlan.totalMacros.fats}g
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Macro Circle Visualization */}
            <div className="mb-6 pb-6 border-b">
              <MacroCircle dayPlan={dayPlan} />
            </div>

            {/* Meals Table */}
            <div className="mb-6">
              <h4 className="font-semibold mb-4">Daily Meals Overview</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meal</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                    <TableHead className="text-right">Protein (g)</TableHead>
                    <TableHead className="text-right">Carbs (g)</TableHead>
                    <TableHead className="text-right">Fats (g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Breakfast */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getMealIcon("breakfast")}
                        <span>Breakfast</span>
                      </div>
                    </TableCell>
                    <TableCell>{dayPlan.meals.breakfast.name}</TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.breakfast.calories}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.breakfast.protein}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.breakfast.carbs}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.breakfast.fats}
                    </TableCell>
                  </TableRow>

                  {/* Lunch */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getMealIcon("lunch")}
                        <span>Lunch</span>
                      </div>
                    </TableCell>
                    <TableCell>{dayPlan.meals.lunch.name}</TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.lunch.calories}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.lunch.protein}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.lunch.carbs}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.lunch.fats}
                    </TableCell>
                  </TableRow>

                  {/* Dinner */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getMealIcon("dinner")}
                        <span>Dinner</span>
                      </div>
                    </TableCell>
                    <TableCell>{dayPlan.meals.dinner.name}</TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.dinner.calories}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.dinner.protein}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.dinner.carbs}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPlan.meals.dinner.fats}
                    </TableCell>
                  </TableRow>

                  {/* Snacks */}
                  {dayPlan.meals.snacks.map((snack, snackIndex) => (
                    <TableRow key={snackIndex}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getMealIcon("snack")}
                          <span>Snack {snackIndex + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell>{snack.name}</TableCell>
                      <TableCell className="text-right">
                        {snack.calories}
                      </TableCell>
                      <TableCell className="text-right">
                        {snack.protein}
                      </TableCell>
                      <TableCell className="text-right">{snack.carbs}</TableCell>
                      <TableCell className="text-right">{snack.fats}</TableCell>
                    </TableRow>
                  ))}

                  {/* Daily Total */}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={2} className="font-semibold">
                      Daily Total
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {dayPlan.totalMacros.calories}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {dayPlan.totalMacros.protein}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {dayPlan.totalMacros.carbs}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {dayPlan.totalMacros.fats}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-muted/50 print-break-inside-avoid">
        <CardHeader>
          <CardTitle className="text-lg">Nutrition Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Drink at least 8 glasses of water daily</li>
            <li>• Meal prep on Sundays for the week ahead</li>
            <li>• Adjust portion sizes based on hunger and activity level</li>
            <li>• Try to eat within 1 hour of your workout</li>
            <li>• Limit processed foods and added sugars</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

