// Manual exercise name mappings for better API matching
// Some exercises might have slightly different names in the API
export const exerciseNameMappings: Record<string, string> = {
  "Incline Dumbbell Press": "incline-dumbbell-press",
  "Single arm lateral raises": "lateral-raise",
  "Triceps Pushdown": "tricep-pushdown",
  "Bent Over Row": "bent-over-row",
  "Lat Pulldown": "lat-pulldown",
  "Reverse Flyes Rear Delts": "reverse-fly",
  "Barbell Curls": "barbell-curl",
  "Hammer Curls": "hammer-curl",
  "Leg Press / Leg Extension": "leg-extension",
  "Romanian Deadlifts": "romanian-deadlift",
  "Leg Curls": "leg-curl",
  "Hanging Leg Raises": "hanging-leg-raise",
  "Overhead Dumbbell Press": "overhead-press",
  "Arnold Press": "arnold-press",
  "Seated Cable Rows": "seated-cable-row",
  "Dumbbell Bicep Curls": "dumbbell-curl",
  "Overhead Tricep Extension": "overhead-tricep-extension",
  "Barbell Squats": "barbell-squat",
  "Chest Dips": "chest-dip",
};

/**
 * Get the API-friendly name for an exercise
 */
export function getApiFriendlyName(exerciseName: string): string {
  return exerciseNameMappings[exerciseName] || exerciseName;
}





