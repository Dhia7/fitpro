export interface ClientInfo {
  name: string;
  startDate: string;
  endDate: string;
  trainerName: string;
  trainerEmail?: string;
  goal?: string;
  height?: string;
  weight?: number;
  bodyFat?: number;
  instagram?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  time: string;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface DayMealPlan {
  day: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
  totalMacros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
}

export interface ProgressTracking {
  measurements: {
    weight?: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  goals: {
    shortTerm: string[];
    longTerm: string[];
  };
  notes: string;
}






