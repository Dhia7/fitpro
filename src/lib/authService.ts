import { supabase } from './supabase';

export interface AccessResponse {
  success: boolean;
  message: string;
  email?: string;
  isReturning?: boolean;
}

class AuthService {
  private readonly STORAGE_KEY = 'user_email';

  async requestAccess(email: string): Promise<AccessResponse> {
    try {
      // Check if email already exists
      const { data: existingData } = await supabase
        .from('email_access')
        .select('email, created_at')
        .eq('email', email)
        .single();

      const isReturning = !!existingData;

      if (!isReturning) {
        // New user - save to database
        const { error: insertError } = await supabase
          .from('email_access')
          .insert({
            email,
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
          .eq('email', email);
      }

      // Store in localStorage for this device
      localStorage.setItem(this.STORAGE_KEY, email);

      return {
        success: true,
        message: isReturning ? 'Welcome back!' : 'Access granted!',
        email,
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

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('email_access')
        .select('email')
        .eq('email', email)
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
