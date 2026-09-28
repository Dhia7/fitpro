import type { WorkoutDay } from "@/types";
import { Sofa } from "lucide-react";

interface WorkoutPlanProps {
  workoutDays: WorkoutDay[];
}

function isRecoveryDay(day: WorkoutDay) {
  return /rest/i.test(day.focus);
}

export function WorkoutPlan({ workoutDays }: WorkoutPlanProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Weekly Exercise Protocols</h2>
          <p className="mt-1 text-sm text-slate-500">
            The sessions for the week, with sets, reps, rest, and the notes that go with each lift.
          </p>
        </div>
        <div className="flex items-center gap-4 self-start text-xs font-semibold text-slate-600 md:self-center">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            Training
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            Recovery
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {workoutDays.map((day) => {
          const recovery = isRecoveryDay(day);
          return (
            <section
              key={day.day}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print-break-inside-avoid"
            >
              <div
                className={`flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-6 py-4 ${
                  recovery ? "bg-emerald-50/50" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-6 w-2 rounded-full ${recovery ? "bg-emerald-500" : "bg-blue-600"}`} />
                  <h3 className="font-display text-lg font-bold text-slate-900">{day.day}</h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    recovery ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {day.focus}
                </span>
              </div>

              {recovery && day.exercises.length <= 2 ? (
                <div className="space-y-3 p-6 text-sm font-medium text-slate-600">
                  {day.exercises.map((exercise) => (
                    <div
                      key={exercise.name}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
                    >
                      <Sofa className="h-5 w-5 shrink-0 text-emerald-500" />
                      <span>
                        <span className="font-semibold text-slate-900">{exercise.name}</span>
                        {exercise.notes ? ` — ${exercise.notes}` : ""}
                        {exercise.reps && exercise.reps !== "-" ? ` (${exercise.reps})` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="border-b border-slate-100 bg-white text-xs font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Exercise</th>
                        <th className="px-6 py-4">Sets</th>
                        <th className="px-6 py-4">Reps</th>
                        <th className="px-6 py-4">Rest</th>
                        <th className="px-6 py-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {day.exercises.map((exercise, index) => (
                        <tr key={exercise.name} className={index % 2 === 1 ? "bg-slate-50/30" : undefined}>
                          <td className="px-6 py-4 font-bold text-slate-900">{exercise.name}</td>
                          <td className="px-6 py-4">{exercise.sets}</td>
                          <td className="px-6 py-4">{exercise.reps}</td>
                          <td className="px-6 py-4">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{exercise.rest}</span>
                          </td>
                          <td className="min-w-56 px-6 py-4 text-xs leading-relaxed text-slate-500">
                            {exercise.notes || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
