import type { WorkoutDay } from "@/types";
import {
  Card,
  CardContent,
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
import { Dumbbell, Target, FileText } from "lucide-react";

interface WorkoutPlanProps {
  workoutDays: WorkoutDay[];
  goal?: string;
  goals?: {
    shortTerm: string[];
    longTerm: string[];
  };
  trainerNotes?: string;
}

export function WorkoutPlan({ workoutDays, goal, goals, trainerNotes }: WorkoutPlanProps) {
  const hasGoals = goal || (goals && (goals.shortTerm.length > 0 || goals.longTerm.length > 0));

  return (
    <div className="space-y-6">
      {trainerNotes && (
        <Card className="bg-muted/50 print-break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Trainer Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm whitespace-pre-line">{trainerNotes}</div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-break-inside-avoid">
        <Card className="bg-muted/50 print-break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-lg">Training Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Always warm up for 5-10 minutes before starting</li>
              <li>• Do not skip stretching after the workout</li>
              <li>• Focus on proper form over heavy weight</li>
              <li>• Stay hydrated throughout your workout</li>
              <li>• Progressive overload: aim to increase weight or reps weekly</li>
              <li>• Get adequate rest between workout days</li>
            </ul>
          </CardContent>
        </Card>

        {hasGoals && (
          <Card className="bg-muted/50 print-break-inside-avoid">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Primary Goal</h4>
                  <p className="text-sm">{goal}</p>
                </div>
              )}
              {goals && goals.shortTerm.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Short-Term Goals</h4>
                  <ul className="space-y-1 text-sm">
                    {goals.shortTerm.map((g, index) => (
                      <li key={index}>• {g}</li>
                    ))}
                  </ul>
                </div>
              )}
              {goals && goals.longTerm.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Long-Term Goals</h4>
                  <ul className="space-y-1 text-sm">
                    {goals.longTerm.map((g, index) => (
                      <li key={index}>• {g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Weekly Workout Plan</h2>
      </div>

      {workoutDays.map((day, index) => (
        <Card key={index} className="print-break-inside-avoid">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{day.day}</span>
              <span className="text-base font-normal text-muted-foreground">
                {day.focus}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Exercise</TableHead>
                  <TableHead>Sets</TableHead>
                  <TableHead>Reps</TableHead>
                  <TableHead>Rest</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {day.exercises.map((exercise, exerciseIndex) => (
                  <TableRow key={exerciseIndex}>
                    <TableCell className="font-medium">
                      {exercise.name}
                    </TableCell>
                    <TableCell>{exercise.sets}</TableCell>
                    <TableCell>{exercise.reps}</TableCell>
                    <TableCell>{exercise.rest}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {exercise.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
