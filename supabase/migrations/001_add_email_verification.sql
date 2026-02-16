-- Supabase SQL Migration for Email Verification System
-- Run this in your Supabase SQL Editor

-- 1. Add verification columns to email_submissions table (or create new table)
-- If the table doesn't exist, create it first:
CREATE TABLE IF NOT EXISTS email_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verified_at TIMESTAMP,
    source VARCHAR(100),
    visitor_id VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    referrer VARCHAR(500),
    page_url VARCHAR(500),
    resend_count INTEGER DEFAULT 0,
    last_resend_at TIMESTAMP
);

-- 2. If table exists, add verification columns:
DO $$
BEGIN
    -- Add verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_submissions' AND column_name = 'verified') THEN
        ALTER TABLE email_submissions ADD COLUMN verified BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add verification_token column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_submissions' AND column_name = 'verification_token') THEN
        ALTER TABLE email_submissions ADD COLUMN verification_token VARCHAR(255);
    END IF;

    -- Add verified_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_submissions' AND column_name = 'verified_at') THEN
        ALTER TABLE email_submissions ADD COLUMN verified_at TIMESTAMP;
    END IF;

    -- Add resend_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_submissions' AND column_name = 'resend_count') THEN
        ALTER TABLE email_submissions ADD COLUMN resend_count INTEGER DEFAULT 0;
    END IF;

    -- Add last_resend_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_submissions' AND column_name = 'last_resend_at') THEN
        ALTER TABLE email_submissions ADD COLUMN last_resend_at TIMESTAMP;
    END IF;
END $$;

-- 3. Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_verification_token ON email_submissions(verification_token);

-- 4. Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_email ON email_submissions(email);

-- 5. Create Row Level Security (RLS) policies
-- Enable RLS
ALTER TABLE email_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for new signups)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON email_submissions;
CREATE POLICY "Allow anonymous inserts"
    ON email_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow reading own record by token
DROP POLICY IF EXISTS "Allow reading by verification token" ON email_submissions;
CREATE POLICY "Allow reading by verification token"
    ON email_submissions
    FOR SELECT
    TO anon
    USING (verification_token IS NOT NULL);

-- Policy: Allow updating by verification token (for verification)
DROP POLICY IF EXISTS "Allow updating by verification token" ON email_submissions;
CREATE POLICY "Allow updating by verification token"
    ON email_submissions
    FOR UPDATE
    TO anon
    USING (verification_token IS NOT NULL);

-- 6. Create function to cleanup old unverified emails (optional - runs daily)
CREATE OR REPLACE FUNCTION cleanup_unverified_emails()
RETURNS void AS $$
BEGIN
    DELETE FROM email_submissions 
    WHERE verified = FALSE 
    AND submitted_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 7. Create a view for analytics (optional)
CREATE OR REPLACE VIEW email_submission_stats AS
SELECT 
    COUNT(*) as total_submissions,
    COUNT(CASE WHEN verified THEN 1 END) as verified_submissions,
    COUNT(CASE WHEN NOT verified THEN 1 END) as pending_verifications,
    DATE(submitted_at) as submission_date
FROM email_submissions
GROUP BY DATE(submitted_at)
ORDER BY submission_date DESC;
