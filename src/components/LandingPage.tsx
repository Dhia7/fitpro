import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Moon,
  Sun,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Dumbbell,
  UtensilsCrossed,
  Printer,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { authService, getLocalAccessKey } from "../lib/authService";

type AccessMethod = "email" | "key";

const highlights = [
  {
    icon: Dumbbell,
    title: "My workout routine",
    text: "The sessions I follow through the week, with sets, reps, and rest.",
  },
  {
    icon: UtensilsCrossed,
    title: "My meal plan",
    text: "What I eat on those days, with the calories and macros.",
  },
  {
    icon: Printer,
    title: "Keep it with me",
    text: "I can print the routine and meals, or save them as a PDF.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const localAccessKey = getLocalAccessKey();
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [method, setMethod] = useState<AccessMethod>("email");
  const [value, setValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  const isKeySession =
    !!localAccessKey &&
    !!savedEmail &&
    savedEmail.toLowerCase() === localAccessKey.toLowerCase();

  useEffect(() => {
    const storedEmail = authService.getUserEmail();
    if (storedEmail) {
      setSavedEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (!savedEmail) {
      inputRef.current?.focus();
    }
  }, [method, savedEmail]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const switchMethod = (next: AccessMethod) => {
    setMethod(next);
    setValue("");
    setError("");
    setShowKey(false);
  };

  const handleContinue = async () => {
    if (!savedEmail) return;

    setIsLoading(true);
    setError("");
    try {
      const exists = await authService.checkEmailExists(savedEmail);
      if (exists) {
        navigate("/dashboard");
      } else {
        authService.clearAuth();
        setSavedEmail(null);
        setError("That sign-in is no longer valid. Enter your email again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = value.trim();
    if (!trimmed) {
      setError(method === "key" ? "Enter your access key." : "Enter your email address.");
      return;
    }

    if (method === "email" && !validateEmail(trimmed)) {
      setError("Enter a valid email address, like name@email.com.");
      return;
    }

    if (method === "key" && localAccessKey && trimmed.toLowerCase() !== localAccessKey.toLowerCase()) {
      setError("That access key doesn’t match the one set up on this computer.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.requestAccess(trimmed);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (submitError) {
      setError("Something went wrong. Please try again.");
      console.error("Error submitting access:", submitError);
    } finally {
      setIsLoading(false);
    }
  };

  const startOver = () => {
    authService.clearAuth();
    setSavedEmail(null);
    setValue("");
    setError("");
    setMethod("email");
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <section className="relative overflow-hidden bg-[hsl(222_47%_11%)] text-[hsl(210_40%_98%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-primary/20"
        />

        <div className="relative flex h-full flex-col justify-between px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight">My plan</p>
              <p className="text-sm text-white/70">Getting in shape</p>
            </div>
          </div>

          <div className="my-10 max-w-md lg:my-0">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              My plan to get in shape.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              This is my workout routine and the meal plan that goes with it. Training days, what I eat, and the goal I’m working toward.
            </p>

            <ul className="mt-8 hidden space-y-4 sm:block">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className="block text-sm text-white/70">{item.text}</span>
                  </span>
                </li>
                );
              })}
            </ul>
          </div>

          <p className="hidden text-sm text-white/55 lg:block">
            A personal plan I can open here and take with me.
          </p>
        </div>
      </section>

      <main className="relative flex items-center justify-center px-4 py-8 sm:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="absolute right-4 top-4 h-10 w-10"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="w-full max-w-md">
          {savedEmail ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Back to my plan</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isKeySession
                    ? "This browser already has access to my routine and meals."
                    : "Continue with the email saved on this device."}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/60 px-4 py-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {isKeySession ? (
                    <KeyRound className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <User className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {isKeySession ? "Access" : "Email"}
                  </p>
                  <p className="truncate text-base font-semibold">
                    {isKeySession ? "Local access key" : savedEmail}
                  </p>
                </div>
              </div>

              {error && (
                <p id={errorId} role="alert" className="flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </p>
              )}

              <Button
                onClick={handleContinue}
                disabled={isLoading}
                size="lg"
                className="h-12 w-full text-base font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Opening my plan...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={startOver}
                className="w-full text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {isKeySession ? "Use a different sign-in" : "Use a different email"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Open my plan</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {localAccessKey
                    ? "Use your email, or the access key on this computer, to see the routine and meals."
                    : "Enter your email to open my workout routine and meal plan."}
                </p>
              </div>

              {localAccessKey && (
                <div
                  role="tablist"
                  aria-label="Sign-in method"
                  className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    id="access-tab-email"
                    aria-selected={method === "email"}
                    aria-controls="access-panel"
                    onClick={() => switchMethod("email")}
                    className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${
                      method === "email"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="access-tab-key"
                    aria-selected={method === "key"}
                    aria-controls="access-panel"
                    onClick={() => switchMethod("key")}
                    className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${
                      method === "key"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                    Access key
                  </button>
                </div>
              )}

              <form
                id="access-panel"
                role={localAccessKey ? "tabpanel" : undefined}
                aria-labelledby={localAccessKey ? (method === "key" ? "access-tab-key" : "access-tab-email") : undefined}
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-2">
                  <label htmlFor={inputId} className="text-sm font-medium">
                    {method === "key" ? "Access key" : "Email"}
                  </label>
                  <div className="relative">
                    {method === "key" ? (
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    )}
                    <Input
                      ref={inputRef}
                      id={inputId}
                      type={method === "key" && !showKey ? "password" : method === "key" ? "text" : "email"}
                      inputMode={method === "email" ? "email" : "text"}
                      autoComplete={method === "email" ? "email" : "off"}
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder={method === "key" ? "Enter your access key" : "name@email.com"}
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        setError("");
                      }}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? errorId : undefined}
                      className={`h-12 pl-10 ${method === "key" ? "pr-12" : ""}`}
                    />
                    {method === "key" && (
                      <button
                        type="button"
                        onClick={() => setShowKey((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showKey ? "Hide access key" : "Show access key"}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {method === "key"
                      ? "The key is checked on this computer and is not sent anywhere."
                      : "Saved in this browser so I can come straight back to the plan."}
                  </p>
                </div>

                {error && (
                  <p id={errorId} role="alert" className="flex items-start gap-2 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !value.trim()}
                  size="lg"
                  className="h-12 w-full text-base font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Opening my plan...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
