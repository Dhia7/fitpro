import type { DayMealPlan } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface MacroCircleProps {
  dayPlan: DayMealPlan;
}

export function MacroCircle({ dayPlan }: MacroCircleProps) {
  const { totalMacros } = dayPlan;
  const { calories, protein, carbs, fats } = totalMacros;
  
  // Calculate percentages for the circle segments
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fats: 9 cal/g
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatsCals = fats * 9;
  const totalCals = proteinCals + carbsCals + fatsCals;
  
  const proteinPercent = (proteinCals / totalCals) * 100;
  const carbsPercent = (carbsCals / totalCals) * 100;
  const fatsPercent = (fatsCals / totalCals) * 100;
  
  // Calculate angles for pie chart (starting from top)
  const proteinAngle = (proteinPercent / 100) * 360;
  const carbsAngle = (carbsPercent / 100) * 360;
  const fatsAngle = (fatsPercent / 100) * 360;
  
  // Starting angles
  let currentAngle = -90; // Start from top
  
  const proteinStartAngle = currentAngle;
  const proteinEndAngle = currentAngle + proteinAngle;
  currentAngle += proteinAngle;
  
  const carbsStartAngle = currentAngle;
  const carbsEndAngle = currentAngle + carbsAngle;
  currentAngle += carbsAngle;
  
  const fatsStartAngle = currentAngle;
  const fatsEndAngle = currentAngle + fatsAngle;
  
  // Helper function to create arc path
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(radius, radius, radius, endAngle);
    const end = polarToCartesian(radius, radius, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", radius, radius,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  const radius = 100;
  const center = 120;
  
  // Calculate midpoint angles for label positioning
  const proteinMidAngle = proteinStartAngle + (proteinAngle / 2);
  const carbsMidAngle = carbsStartAngle + (carbsAngle / 2);
  const fatsMidAngle = fatsStartAngle + (fatsAngle / 2);
  
  // Calculate label positions (positioned at 70% of radius from center)
  const labelRadius = radius * 0.7;
  const proteinLabelPos = polarToCartesian(center, center, labelRadius, proteinMidAngle);
  const carbsLabelPos = polarToCartesian(center, center, labelRadius, carbsMidAngle);
  const fatsLabelPos = polarToCartesian(center, center, labelRadius, fatsMidAngle);
  
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <svg width="240" height="240" viewBox="0 0 240 240" className="mb-4">
        {/* Protein segment */}
        <path
          d={createArcPath(proteinStartAngle, proteinEndAngle, radius)}
          fill="#3b82f6"
          className="opacity-80 hover:opacity-100 transition-opacity"
        />
        
        {/* Carbs segment */}
        <path
          d={createArcPath(carbsStartAngle, carbsEndAngle, radius)}
          fill="#10b981"
          className="opacity-80 hover:opacity-100 transition-opacity"
        />
        
        {/* Fats segment */}
        <path
          d={createArcPath(fatsStartAngle, fatsEndAngle, radius)}
          fill="#f59e0b"
          className="opacity-80 hover:opacity-100 transition-opacity"
        />
        
        {/* Percentage labels on each segment */}
        {/* Protein percentage */}
        <text
          x={proteinLabelPos.x}
          y={proteinLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.4)"
          strokeWidth="0.5"
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
        >
          {proteinPercent.toFixed(0)}%
        </text>
        <text
          x={proteinLabelPos.x}
          y={proteinLabelPos.y + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-semibold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.4)"
          strokeWidth="0.3"
          style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)' }}
        >
          Protein
        </text>
        
        {/* Carbs percentage */}
        <text
          x={carbsLabelPos.x}
          y={carbsLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.4)"
          strokeWidth="0.5"
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
        >
          {carbsPercent.toFixed(0)}%
        </text>
        <text
          x={carbsLabelPos.x}
          y={carbsLabelPos.y + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-semibold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.4)"
          strokeWidth="0.3"
          style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)' }}
        >
          Carbs
        </text>
        
        {/* Fats percentage */}
        <text
          x={fatsLabelPos.x}
          y={fatsLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.4)"
          strokeWidth="0.5"
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
        >
          {fatsPercent.toFixed(0)}%
        </text>
        <text
          x={fatsLabelPos.x}
          y={fatsLabelPos.y + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-semibold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.4)"
          strokeWidth="0.3"
          style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)' }}
        >
          Fats
        </text>
        
        {/* Calories text without background circle */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="text-3xl font-bold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth="0.5"
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
        >
          {calories}
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          className="text-sm font-semibold"
          fill="white"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth="0.3"
          style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
        >
          Calories
        </text>
      </svg>
      
      {/* Summary with totals */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-4">
        {/* Protein */}
        <div className="flex flex-col items-center text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm font-semibold">Protein</span>
          </div>
          <span className="text-xl font-bold text-blue-600 mb-1">{protein}g</span>
          <span className="text-xs text-muted-foreground">
            {proteinPercent.toFixed(0)}% of calories
          </span>
        </div>
        
        {/* Carbs */}
        <div className="flex flex-col items-center text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold">Carbs</span>
          </div>
          <span className="text-xl font-bold text-green-600 mb-1">{carbs}g</span>
          <span className="text-xs text-muted-foreground">
            {carbsPercent.toFixed(0)}% of calories
          </span>
        </div>
        
        {/* Fats */}
        <div className="flex flex-col items-center text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-sm font-semibold">Fats</span>
          </div>
          <span className="text-xl font-bold text-amber-600 mb-1">{fats}g</span>
          <span className="text-xs text-muted-foreground">
            {fatsPercent.toFixed(0)}% of calories
          </span>
        </div>
      </div>

      {/* Macro breakdown table by meal */}
      <div className="w-full max-w-4xl">
        <h3 className="text-sm font-semibold mb-3 text-center">Macro Breakdown by Meal</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Macro</TableHead>
              <TableHead className="text-center">Breakfast</TableHead>
              <TableHead className="text-center">Lunch</TableHead>
              <TableHead className="text-center">Dinner</TableHead>
              {dayPlan.meals.snacks.map((_, idx) => (
                <TableHead key={idx} className="text-center">
                  Snack {idx + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Protein row */}
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Protein
                </div>
              </TableCell>
              <TableCell className="text-center">{dayPlan.meals.breakfast.protein}g</TableCell>
              <TableCell className="text-center">{dayPlan.meals.lunch.protein}g</TableCell>
              <TableCell className="text-center">{dayPlan.meals.dinner.protein}g</TableCell>
              {dayPlan.meals.snacks.map((snack, idx) => (
                <TableCell key={idx} className="text-center">
                  {snack.protein}g
                </TableCell>
              ))}
            </TableRow>
            
            {/* Carbs row */}
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Carbs
                </div>
              </TableCell>
              <TableCell className="text-center">{dayPlan.meals.breakfast.carbs}g</TableCell>
              <TableCell className="text-center">{dayPlan.meals.lunch.carbs}g</TableCell>
              <TableCell className="text-center">{dayPlan.meals.dinner.carbs}g</TableCell>
              {dayPlan.meals.snacks.map((snack, idx) => (
                <TableCell key={idx} className="text-center">
                  {snack.carbs}g
                </TableCell>
              ))}
            </TableRow>
            
            {/* Fats row */}
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  Fats
                </div>
              </TableCell>
              <TableCell className="text-center">{dayPlan.meals.breakfast.fats}g</TableCell>
              <TableCell className="text-center">{dayPlan.meals.lunch.fats}g</TableCell>
              <TableCell className="text-center">{dayPlan.meals.dinner.fats}g</TableCell>
              {dayPlan.meals.snacks.map((snack, idx) => (
                <TableCell key={idx} className="text-center">
                  {snack.fats}g
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

