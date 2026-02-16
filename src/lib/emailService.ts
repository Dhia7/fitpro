import { supabase } from './supabase';

export interface EmailSubmission {
  email: string;
  timestamp: string;
  source: string;
  visitorId?: string;
  verified?: boolean;
  verificationToken?: string;
  verifiedAt?: string | null;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  email?: string;
}

interface EmailServiceConfig {
  webhookUrl?: string;
  service: 'mailchimp' | 'convertkit' | 'webhook' | 'localStorage' | 'supabase';
  apiKey?: string;
  listId?: string;
  resendApiKey?: string;
}

class EmailService {
  constructor(_config: EmailServiceConfig) {}

  private generateVerificationToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async submitEmail(email: string, visitorId?: string): Promise<{ success: boolean; message: string; token?: string }> {
    const submission: EmailSubmission = {
      email,
      timestamp: new Date().toISOString(),
      source: 'landing_page',
      visitorId,
      verified: false,
      verificationToken: this.generateVerificationToken(),
      verifiedAt: null
    };

    try {
      const result = await this.submitToSupabase(submission);
      
      if (result.success && result.token) {
        await this.sendVerificationEmail(email, result.token);
        localStorage.setItem('pending_verification_email', email);
        localStorage.setItem('verification_token', result.token);
      }
      
      return result;
    } catch (error) {
      console.error('Error submitting email:', error);
      return { 
        success: false, 
        message: 'Failed to submit email. Please try again.' 
      };
    }
  }

  private async submitToSupabase(submission: EmailSubmission): Promise<{ success: boolean; message: string; token?: string }> {
    try {
      const { data, error } = await supabase
        .from('email_submissions')
        .upsert([
          {
            email: submission.email,
            source: submission.source,
            visitor_id: submission.visitorId,
            submitted_at: submission.timestamp,
            user_agent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            page_url: window.location.href,
            verified: false,
            verification_token: submission.verificationToken,
            resend_count: 0
          }
        ], {
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select('verification_token, verified')
        .single();

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (data?.verified) {
        return { 
          success: true, 
          message: 'Email already verified. Redirecting...',
          token: data.verification_token
        };
      }

      return { 
        success: true, 
        message: 'Email submitted successfully. Please check your inbox for verification.',
        token: submission.verificationToken
      };
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      
      const existingToken = localStorage.getItem('verification_token');
      const existingEmail = localStorage.getItem('pending_verification_email');
      
      if (existingEmail === submission.email && existingToken) {
        return {
          success: true,
          message: 'Verification email already sent. Please check your inbox.',
          token: existingToken
        };
      }
      
      localStorage.setItem('pending_verification_email', submission.email);
      localStorage.setItem('verification_token', submission.verificationToken!);
      
      return { 
        success: true, 
        message: 'Email saved locally. Please check your inbox.',
        token: submission.verificationToken
      };
    }
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${window.location.origin}/verify?token=${token}`;
    
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          verificationUrl,
          token
        }
      });

      if (error) {
        console.error('Error invoking edge function:', error);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }

  async verifyEmail(token: string): Promise<EmailVerificationResponse> {
    try {
      const { data, error } = await supabase
        .from('email_submissions')
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
          verification_token: null
        })
        .eq('verification_token', token)
        .select('email, verified')
        .single();

      if (error) {
        throw new Error(`Verification failed: ${error.message}`);
      }

      if (!data) {
        return {
          success: false,
          message: 'Invalid or expired verification token.'
        };
      }

      if (data.verified) {
        localStorage.setItem('email_verified', 'true');
        localStorage.setItem('verified_email', data.email);
        localStorage.removeItem('pending_verification_email');
        localStorage.removeItem('verification_token');

        return {
          success: true,
          message: 'Email verified successfully!',
          email: data.email
        };
      }

      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      return {
        success: false,
        message: 'An error occurred during verification. Please try again.'
      };
    }
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase
        .from('email_submissions')
        .select('verification_token, verified, resend_count, last_resend_at')
        .eq('email', email)
        .single();

      if (error || !data) {
        return {
          success: false,
          message: 'Email not found. Please submit your email first.'
        };
      }

      if (data.verified) {
        return {
          success: false,
          message: 'This email is already verified.'
        };
      }

      if (data.resend_count >= 3) {
        const lastResend = data.last_resend_at ? new Date(data.last_resend_at) : null;
        const now = new Date();
        if (lastResend && (now.getTime() - lastResend.getTime()) < 3600000) {
          return {
            success: false,
            message: 'Too many resend attempts. Please wait 1 hour before trying again.'
          };
        }
      }

      const newToken = this.generateVerificationToken();
      
      const { error: updateError } = await supabase
        .from('email_submissions')
        .update({
          verification_token: newToken,
          resend_count: (data.resend_count || 0) + 1,
          last_resend_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        throw new Error(`Failed to update token: ${updateError.message}`);
      }

      await this.sendVerificationEmail(email, newToken);
      localStorage.setItem('verification_token', newToken);

      return {
        success: true,
        message: 'Verification email resent successfully! Please check your inbox.'
      };
    } catch (error) {
      console.error('Error resending verification:', error);
      return {
        success: false,
        message: 'Failed to resend verification email. Please try again.'
      };
    }
  }

  async checkVerificationStatus(email: string): Promise<{ verified: boolean; email?: string }> {
    try {
      const { data, error } = await supabase
        .from('email_submissions')
        .select('verified, email')
        .eq('email', email)
        .single();

      if (error || !data) {
        const localVerified = localStorage.getItem('email_verified') === 'true';
        const localEmail = localStorage.getItem('verified_email');
        return { 
          verified: localVerified && localEmail === email,
          email: localEmail || undefined
        };
      }

      if (data.verified) {
        localStorage.setItem('email_verified', 'true');
        localStorage.setItem('verified_email', data.email);
        localStorage.removeItem('pending_verification_email');
        localStorage.removeItem('verification_token');
      }

      return { verified: data.verified, email: data.email };
    } catch (error) {
      console.error('Error checking verification status:', error);
      const localVerified = localStorage.getItem('email_verified') === 'true';
      const localEmail = localStorage.getItem('verified_email');
      return { 
        verified: localVerified && localEmail === email,
        email: localEmail || undefined
      };
    }
  }

  static trackVisitor(): string {
    let visitorId = localStorage.getItem('visitor_id');
    
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
      
      const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
      localStorage.setItem('visit_count', visitCount.toString());
      
      localStorage.setItem('first_visit', new Date().toISOString());
    } else {
      const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
      localStorage.setItem('visit_count', visitCount.toString());
    }
    
    localStorage.setItem('last_visit', new Date().toISOString());
    
    return visitorId;
  }

  static getVisitorAnalytics() {
    return {
      visitorId: localStorage.getItem('visitor_id'),
      visitCount: parseInt(localStorage.getItem('visit_count') || '0'),
      firstVisit: localStorage.getItem('first_visit'),
      lastVisit: localStorage.getItem('last_visit'),
      emailSubmissions: JSON.parse(localStorage.getItem('email_submissions') || '[]'),
      verifiedEmail: localStorage.getItem('verified_email'),
      emailVerified: localStorage.getItem('email_verified') === 'true'
    };
  }

  static clearVerificationData(): void {
    localStorage.removeItem('email_verified');
    localStorage.removeItem('verified_email');
    localStorage.removeItem('pending_verification_email');
    localStorage.removeItem('verification_token');
    localStorage.removeItem('email_submitted');
  }
}

const serviceType = (import.meta.env.VITE_EMAIL_SERVICE as EmailServiceConfig['service']) || 'supabase';

export const emailService = new EmailService({
  service: serviceType,
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY
});

export default EmailService;
