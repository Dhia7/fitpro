# Email Verification Setup Guide

This guide will help you set up the email verification system for your workout plan application.

## Overview

The email verification system ensures users confirm their email address before accessing the workout plan. Here's the flow:

1. User enters email on landing page
2. System generates a unique verification token and stores it in Supabase
3. Verification email is sent via Resend
4. User clicks the verification link
5. System verifies the token and grants access to the workout plan

## Setup Steps

### 1. Supabase Setup

#### A. Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Note your Project URL and anon key

#### B. Run SQL Migration
1. In your Supabase dashboard, go to the SQL Editor
2. Open the file `supabase/migrations/001_add_email_verification.sql`
3. Copy the contents and run it in the SQL Editor
4. This creates the `email_submissions` table with verification fields

### 2. Resend Setup (Email Service)

#### A. Create Resend Account
1. Sign up at [https://resend.com](https://resend.com)
2. Verify your account
3. Go to the API Keys section and create a new API key
4. Copy the API key (starts with `re_`)

#### B. Verify Your Domain
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS verification steps
4. Once verified, you can send emails from addresses like `noreply@yourdomain.com`

**Note:** For testing, you can use Resend's test domain, but emails might go to spam.

### 3. Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Resend Configuration
VITE_RESEND_API_KEY=re_your_resend_api_key_here
```

**Important:** Never commit the `.env` file to git!

### 4. Supabase Edge Function Setup

The edge function handles sending verification emails. You need to deploy it and set secrets.

#### A. Install Supabase CLI
```bash
npm install -g supabase
```

#### B. Link Your Project
```bash
supabase login
supabase link --project-ref your-project-id
```

#### C. Set Edge Function Secrets
```bash
supabase secrets set RESEND_API_KEY=re_your_resend_api_key_here
supabase secrets set FROM_EMAIL="FitPlan Pro <noreply@yourdomain.com>"
supabase secrets set APP_NAME="FitPlan Pro"
```

#### D. Deploy the Edge Function
```bash
supabase functions deploy send-verification-email
```

### 5. Local Development

For local testing, you can use Supabase's built-in Inbucket email service:

1. Start Supabase locally:
```bash
supabase start
```

2. Access the Inbucket UI at `http://localhost:54324`
3. All emails sent locally will appear there instead of being sent to real addresses

## How It Works

### User Flow

1. **Landing Page**: User enters email and clicks "Get Free Access"
2. **Email Submission**: 
   - Email is saved to Supabase with `verified: false`
   - A unique verification token is generated
   - Verification email is sent via edge function
3. **Verification Page**: User sees "Check Your Email" message
4. **Email Verification**: User clicks link in email
5. **Access Granted**: Token is validated, email marked as verified, user sees workout plan

### Security Features

- **Unique Tokens**: Each email gets a cryptographically secure random token
- **Token Expiration**: Tokens expire after 7 days (configurable in SQL)
- **Resend Limits**: Maximum 3 resend attempts per hour
- **CORS Protection**: Edge function has proper CORS headers
- **RLS Policies**: Database has Row Level Security enabled

### Database Schema

The `email_submissions` table includes:
- `email` - User's email address (unique)
- `verified` - Boolean indicating verification status
- `verification_token` - Unique token for verification
- `verified_at` - Timestamp when verified
- `resend_count` - Number of times verification was resent
- `last_resend_at` - Timestamp of last resend

## Customization

### Email Template

Edit the HTML template in:
```
supabase/functions/send-verification-email/index.ts
```

Look for the `html` variable and customize:
- Colors (search for `#007bff`)
- Logo/text (search for `APP_NAME`)
- Email content

### Token Expiration

Change the expiration period in the SQL migration:
```sql
-- Current: 7 days
DELETE FROM email_submissions 
WHERE verified = FALSE 
AND submitted_at < NOW() - INTERVAL '7 days';
```

### Resend Limits

Change the maximum resend attempts in `src/lib/emailService.ts`:
```typescript
if (data.resend_count >= 3) { // Change this number
```

## Troubleshooting

### Emails Not Being Sent

1. Check Resend API key is correct in both `.env` and edge function secrets
2. Verify your domain is verified in Resend
3. Check Supabase Edge Function logs in dashboard
4. For local testing, use Inbucket at `http://localhost:54324`

### Verification Link Not Working

1. Check that the URL in the email matches your domain
2. Verify the token exists in the database
3. Check browser console for errors
4. Ensure Supabase RLS policies are set correctly

### Database Errors

1. Run the SQL migration again if table structure is wrong
2. Check RLS policies are enabled
3. Verify you have proper permissions

## Testing

### Local Testing

1. Start the dev server: `npm run dev`
2. Enter any email address
3. Check Inbucket at `http://localhost:54324`
4. Click the verification link
5. You should be redirected to the workout plan

### Production Testing

1. Deploy your app
2. Use a real email address
3. Check spam folder if email doesn't arrive
4. Click the verification link
5. Verify access is granted

## Next Steps

After setting up email verification, you might want to:

1. Add email analytics tracking
2. Implement rate limiting for submissions
3. Add captcha to prevent spam
4. Create a user dashboard
5. Add password protection for additional security

## Support

For issues with:
- **Supabase**: https://supabase.com/support
- **Resend**: https://resend.com/support
- **Edge Functions**: Check Supabase dashboard logs
