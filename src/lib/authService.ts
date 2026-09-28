import { isSupabaseConfigured, supabase } from './supabase';

const LOCAL_LIST_KEY = 'local_email_access';

export function isLocalAccessMode(): boolean {
  if (import.meta.env.VITE_EMAIL_SERVICE === 'localStorage') return true;
  return import.meta.env.DEV && !isSupabaseConfigured;
}

export function getLocalAccessKey(): string | null {
  if (!isLocalAccessMode()) return null;
  const key = (import.meta.env.VITE_LOCAL_ACCESS_KEY as string | undefined)?.trim();
  return key || null;
}

function readLocalEmails(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export interface AccessResponse {
  success: boolean;
  message: string;
  email?: string;
  isReturning?: boolean;
}

class AuthService {
  private readonly STORAGE_KEY = 'user_email';

  async requestAccess(email: string): Promise<AccessResponse> {
    const normalized = email.trim().toLowerCase();

    if (isLocalAccessMode()) {
      return this.requestLocalAccess(normalized);
    }

    if (!supabase) {
      return {
        success: false,
        message: 'Email access is not configured. Add Supabase keys or a local access key.'
      };
    }

    try {
      // Check if email already exists
      const { data: existingData } = await supabase
        .from('email_access')
        .select('email, created_at')
        .eq('email', normalized)
        .single();

      const isReturning = !!existingData;

      if (!isReturning) {
        // New user - save to database
        const { error: insertError } = await supabase
          .from('email_access')
          .insert({
            email: normalized,
            created_at: new Date().toISOString(),
            last_accessed: new Date().toISOString()
          });

        if (insertError) throw insertError;
      } else {
        // Returning user - update last_accessed
        await supabase
          .from('email_access')
          .update({
            last_accessed: new Date().toISOString()
          })
          .eq('email', normalized);
      }

      // Store in localStorage for this device
      localStorage.setItem(this.STORAGE_KEY, normalized);

      return {
        success: true,
        message: isReturning ? 'Welcome back!' : 'Access granted!',
        email: normalized,
        isReturning
      };

    } catch (error) {
      console.error('Error requesting access:', error);
      return {
        success: false,
        message: 'Failed to save email. Please try again.'
      };
    }
  }

  private requestLocalAccess(email: string): AccessResponse {
    const emails = readLocalEmails();
    const isReturning = emails.includes(email);

    if (!isReturning) {
      emails.push(email);
      localStorage.setItem(LOCAL_LIST_KEY, JSON.stringify(emails));
    }

    localStorage.setItem(this.STORAGE_KEY, email);

    return {
      success: true,
      message: isReturning ? 'Welcome back!' : 'Access granted!',
      email,
      isReturning
    };
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();

    if (isLocalAccessMode()) {
      return readLocalEmails().includes(normalized);
    }

    if (!supabase) return false;

    try {
      const { data } = await supabase
        .from('email_access')
        .select('email')
        .eq('email', normalized)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  clearAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const authService = new AuthService();
