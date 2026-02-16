import type { ClientInfo } from "@/types";
import { Calendar, User, Target, Moon, Sun, Instagram } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

interface HeaderProps {
  clientInfo: ClientInfo;
}

export function Header({ clientInfo }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Card className="mb-6 print-break-inside-avoid">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {clientInfo.name}
            </h1>
            {(clientInfo.height || clientInfo.weight || clientInfo.bodyFat !== undefined) && (
              <p className="text-sm text-muted-foreground mb-2">
                {clientInfo.height && `Height: ${clientInfo.height}`}
                {clientInfo.height && (clientInfo.weight || clientInfo.bodyFat !== undefined) && " • "}
                {clientInfo.weight && `Weight: ${clientInfo.weight}kg`}
                {clientInfo.weight && clientInfo.bodyFat !== undefined && " • "}
                {clientInfo.bodyFat !== undefined && `Body Fat: ${clientInfo.bodyFat}%`}
              </p>
            )}
            <p className="text-muted-foreground mb-2">
              Personal Workout & Meal Plan
            </p>
            {clientInfo.instagram && (
              <a
                href={`https://instagram.com/${clientInfo.instagram.replace('@', '').replace('https://instagram.com/', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
            )}
          </div>
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {clientInfo.startDate} - {clientInfo.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Trainer: {clientInfo.trainerName}</span>
            </div>
            {clientInfo.goal && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span>{clientInfo.goal}</span>
              </div>
            )}
            <div className="flex justify-end mt-2 no-print">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

