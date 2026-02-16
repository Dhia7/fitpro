import { useState, useEffect } from "react";
import type { ProgressTracking as ProgressTrackingType } from "@/types";
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
import { Input } from "./ui/input";
import { TrendingUp, Target, FileText } from "lucide-react";

interface ProgressTrackingProps {
  progress: ProgressTrackingType;
}

interface WeeklyProgress {
  [key: string]: {
    current?: string;
    week2?: string;
    week4?: string;
    week8?: string;
  };
}

export function ProgressTracking({ progress }: ProgressTrackingProps) {
  const storageKey = `progress_${progress.measurements.weight || 'default'}`;
  
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Initialize current values from progress data if not already saved
        const initialized: WeeklyProgress = {};
        if (progress.measurements.weight) {
          initialized.weight = {
            current: parsed.weight?.current || progress.measurements.weight.toString(),
            week2: parsed.weight?.week2 || "",
            week4: parsed.weight?.week4 || "",
            week8: parsed.weight?.week8 || "",
          };
        }
        if (progress.measurements.bodyFat) {
          initialized.bodyFat = {
            current: parsed.bodyFat?.current || progress.measurements.bodyFat.toString(),
            week2: parsed.bodyFat?.week2 || "",
            week4: parsed.bodyFat?.week4 || "",
            week8: parsed.bodyFat?.week8 || "",
          };
        }
        if (progress.measurements.chest) {
          initialized.chest = {
            current: parsed.chest?.current || progress.measurements.chest.toString(),
            week2: parsed.chest?.week2 || "",
            week4: parsed.chest?.week4 || "",
            week8: parsed.chest?.week8 || "",
          };
        }
        if (progress.measurements.waist) {
          initialized.waist = {
            current: parsed.waist?.current || progress.measurements.waist.toString(),
            week2: parsed.waist?.week2 || "",
            week4: parsed.waist?.week4 || "",
            week8: parsed.waist?.week8 || "",
          };
        }
        if (progress.measurements.hips) {
          initialized.hips = {
            current: parsed.hips?.current || progress.measurements.hips.toString(),
            week2: parsed.hips?.week2 || "",
            week4: parsed.hips?.week4 || "",
            week8: parsed.hips?.week8 || "",
          };
        }
        if (progress.measurements.arms) {
          initialized.arms = {
            current: parsed.arms?.current || progress.measurements.arms.toString(),
            week2: parsed.arms?.week2 || "",
            week4: parsed.arms?.week4 || "",
            week8: parsed.arms?.week8 || "",
          };
        }
        if (progress.measurements.thighs) {
          initialized.thighs = {
            current: parsed.thighs?.current || progress.measurements.thighs.toString(),
            week2: parsed.thighs?.week2 || "",
            week4: parsed.thighs?.week4 || "",
            week8: parsed.thighs?.week8 || "",
          };
        }
        return initialized;
      } catch {
        // Fall through to initialization
      }
    }
    // Initialize from progress data
    const initialized: WeeklyProgress = {};
    if (progress.measurements.weight) {
      initialized.weight = { current: progress.measurements.weight.toString() };
    }
    if (progress.measurements.bodyFat) {
      initialized.bodyFat = { current: progress.measurements.bodyFat.toString() };
    }
    if (progress.measurements.chest) {
      initialized.chest = { current: progress.measurements.chest.toString() };
    }
    if (progress.measurements.waist) {
      initialized.waist = { current: progress.measurements.waist.toString() };
    }
    if (progress.measurements.hips) {
      initialized.hips = { current: progress.measurements.hips.toString() };
    }
    if (progress.measurements.arms) {
      initialized.arms = { current: progress.measurements.arms.toString() };
    }
    if (progress.measurements.thighs) {
      initialized.thighs = { current: progress.measurements.thighs.toString() };
    }
    return initialized;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(weeklyProgress));
  }, [weeklyProgress, storageKey]);

  const handleInputChange = (
    measurement: string,
    week: "current" | "week2" | "week4" | "week8",
    value: string
  ) => {
    setWeeklyProgress((prev) => ({
      ...prev,
      [measurement]: {
        ...prev[measurement],
        [week]: value,
      },
    }));
  };

  const getInputValue = (measurement: string, week: "current" | "week2" | "week4" | "week8") => {
    return weeklyProgress[measurement]?.[week] || "";
  };

  const getCurrentValue = (measurement: string) => {
    return getInputValue(measurement, "current") || progress.measurements[measurement as keyof typeof progress.measurements]?.toString() || "";
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Progress Tracking</h2>
      </div>

      {/* Measurements */}
      <Card className="print-break-inside-avoid">
        <CardHeader>
          <CardTitle>Body Measurements</CardTitle>
          <CardDescription>
            Record your measurements weekly to track progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Measurement</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Week 2</TableHead>
                <TableHead>Week 4</TableHead>
                <TableHead>Week 8</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progress.measurements.weight && (
                <TableRow>
                  <TableCell className="font-medium">Weight (kg)</TableCell>
                  <TableCell>
                    <span className="print-only">{getCurrentValue("weight")}</span>
                    <Input
                      type="number"
                      placeholder={progress.measurements.weight.toString()}
                      value={getCurrentValue("weight")}
                      onChange={(e) => handleInputChange("weight", "current", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("weight", "week2") || getCurrentValue("weight")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("weight")}
                      value={getInputValue("weight", "week2")}
                      onChange={(e) => handleInputChange("weight", "week2", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("weight", "week4") || getCurrentValue("weight")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("weight")}
                      value={getInputValue("weight", "week4")}
                      onChange={(e) => handleInputChange("weight", "week4", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("weight", "week8") || getCurrentValue("weight")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("weight")}
                      value={getInputValue("weight", "week8")}
                      onChange={(e) => handleInputChange("weight", "week8", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                </TableRow>
              )}
              {progress.measurements.bodyFat && (
                <TableRow>
                  <TableCell className="font-medium">Body Fat (%)</TableCell>
                  <TableCell>
                    <span className="print-only">{getCurrentValue("bodyFat")}</span>
                    <Input
                      type="number"
                      placeholder={progress.measurements.bodyFat.toString()}
                      value={getCurrentValue("bodyFat")}
                      onChange={(e) => handleInputChange("bodyFat", "current", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("bodyFat", "week2") || getCurrentValue("bodyFat")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("bodyFat")}
                      value={getInputValue("bodyFat", "week2")}
                      onChange={(e) => handleInputChange("bodyFat", "week2", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("bodyFat", "week4") || getCurrentValue("bodyFat")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("bodyFat")}
                      value={getInputValue("bodyFat", "week4")}
                      onChange={(e) => handleInputChange("bodyFat", "week4", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("bodyFat", "week8") || getCurrentValue("bodyFat")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("bodyFat")}
                      value={getInputValue("bodyFat", "week8")}
                      onChange={(e) => handleInputChange("bodyFat", "week8", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                </TableRow>
              )}
              {progress.measurements.chest && (
                <TableRow>
                  <TableCell className="font-medium">Chest (in)</TableCell>
                  <TableCell>
                    <span className="print-only">{getCurrentValue("chest")}</span>
                    <Input
                      type="number"
                      placeholder={progress.measurements.chest.toString()}
                      value={getCurrentValue("chest")}
                      onChange={(e) => handleInputChange("chest", "current", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("chest", "week2") || getCurrentValue("chest")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("chest")}
                      value={getInputValue("chest", "week2")}
                      onChange={(e) => handleInputChange("chest", "week2", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("chest", "week4") || getCurrentValue("chest")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("chest")}
                      value={getInputValue("chest", "week4")}
                      onChange={(e) => handleInputChange("chest", "week4", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("chest", "week8") || getCurrentValue("chest")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("chest")}
                      value={getInputValue("chest", "week8")}
                      onChange={(e) => handleInputChange("chest", "week8", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                </TableRow>
              )}
              {progress.measurements.waist && (
                <TableRow>
                  <TableCell className="font-medium">Waist (in)</TableCell>
                  <TableCell>
                    <span className="print-only">{getCurrentValue("waist")}</span>
                    <Input
                      type="number"
                      placeholder={progress.measurements.waist.toString()}
                      value={getCurrentValue("waist")}
                      onChange={(e) => handleInputChange("waist", "current", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("waist", "week2") || getCurrentValue("waist")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("waist")}
                      value={getInputValue("waist", "week2")}
                      onChange={(e) => handleInputChange("waist", "week2", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("waist", "week4") || getCurrentValue("waist")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("waist")}
                      value={getInputValue("waist", "week4")}
                      onChange={(e) => handleInputChange("waist", "week4", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("waist", "week8") || getCurrentValue("waist")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("waist")}
                      value={getInputValue("waist", "week8")}
                      onChange={(e) => handleInputChange("waist", "week8", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                </TableRow>
              )}
              {progress.measurements.hips && (
                <TableRow>
                  <TableCell className="font-medium">Hips (in)</TableCell>
                  <TableCell>
                    <span className="print-only">{getCurrentValue("hips")}</span>
                    <Input
                      type="number"
                      placeholder={progress.measurements.hips.toString()}
                      value={getCurrentValue("hips")}
                      onChange={(e) => handleInputChange("hips", "current", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("hips", "week2") || getCurrentValue("hips")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("hips")}
                      value={getInputValue("hips", "week2")}
                      onChange={(e) => handleInputChange("hips", "week2", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("hips", "week4") || getCurrentValue("hips")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("hips")}
                      value={getInputValue("hips", "week4")}
                      onChange={(e) => handleInputChange("hips", "week4", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("hips", "week8") || getCurrentValue("hips")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("hips")}
                      value={getInputValue("hips", "week8")}
                      onChange={(e) => handleInputChange("hips", "week8", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                </TableRow>
              )}
              {progress.measurements.arms && (
                <TableRow>
                  <TableCell className="font-medium">Arms (in)</TableCell>
                  <TableCell>
                    <span className="print-only">{getCurrentValue("arms")}</span>
                    <Input
                      type="number"
                      placeholder={progress.measurements.arms.toString()}
                      value={getCurrentValue("arms")}
                      onChange={(e) => handleInputChange("arms", "current", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("arms", "week2") || getCurrentValue("arms")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("arms")}
                      value={getInputValue("arms", "week2")}
                      onChange={(e) => handleInputChange("arms", "week2", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("arms", "week4") || getCurrentValue("arms")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("arms")}
                      value={getInputValue("arms", "week4")}
                      onChange={(e) => handleInputChange("arms", "week4", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("arms", "week8") || getCurrentValue("arms")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("arms")}
                      value={getInputValue("arms", "week8")}
                      onChange={(e) => handleInputChange("arms", "week8", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                </TableRow>
              )}
              {progress.measurements.thighs && (
                <TableRow>
                  <TableCell className="font-medium">Thighs (in)</TableCell>
                  <TableCell>
                    <span className="print-only">{getCurrentValue("thighs")}</span>
                    <Input
                      type="number"
                      placeholder={progress.measurements.thighs.toString()}
                      value={getCurrentValue("thighs")}
                      onChange={(e) => handleInputChange("thighs", "current", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("thighs", "week2") || getCurrentValue("thighs")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("thighs")}
                      value={getInputValue("thighs", "week2")}
                      onChange={(e) => handleInputChange("thighs", "week2", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("thighs", "week4") || getCurrentValue("thighs")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("thighs")}
                      value={getInputValue("thighs", "week4")}
                      onChange={(e) => handleInputChange("thighs", "week4", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="print-only">{getInputValue("thighs", "week8") || getCurrentValue("thighs")}</span>
                    <Input
                      type="number"
                      placeholder={getCurrentValue("thighs")}
                      value={getInputValue("thighs", "week8")}
                      onChange={(e) => handleInputChange("thighs", "week8", e.target.value)}
                      className="w-20 h-8 no-print"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card className="print-break-inside-avoid">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Short-term Goals (4-8 weeks)</h4>
              <ul className="space-y-1 text-sm">
                {progress.goals.shortTerm.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Long-term Goals (3-6 months)</h4>
              <ul className="space-y-1 text-sm">
                {progress.goals.longTerm.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="print-break-inside-avoid">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Trainer Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{progress.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
}

