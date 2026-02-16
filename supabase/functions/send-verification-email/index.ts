// Supabase Edge Function to send verification emails using Resend
// File: supabase/functions/send-verification-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'FitPlan Pro <noreply@yourdomain.com>'
const APP_NAME = Deno.env.get('APP_NAME') || 'FitPlan Pro'

interface RequestBody {
  email: string
  verificationUrl: string
  token: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate API key
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured. Please contact support.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { email, verificationUrl, token }: RequestBody = await req.json()

    if (!email || !verificationUrl || !token) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, verificationUrl, token' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Construct email HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - ${APP_NAME}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #007bff;
              margin-bottom: 10px;
            }
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 15px 30px;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #0056b3;
            }
            .link {
              word-break: break-all;
              color: #007bff;
              font-size: 14px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .info-box {
              background-color: #f8f9fa;
              border-left: 4px solid #007bff;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            
            <h1>Verify Your Email Address</h1>
            
            <p>Thank you for signing up for ${APP_NAME}! To access your personalized workout and meal plans, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify My Email</a>
            </div>
            
            <div class="info-box">
              <strong>Didn't request this?</strong><br>
              If you didn't create an account with us, you can safely ignore this email.
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p class="link">${verificationUrl}</p>
            
            <p>This verification link will expire in 7 days.</p>
            
            <div class="footer">
              <p>© 2026 ${APP_NAME}. All rights reserved.</p>
              <p>Transform your fitness journey today.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email using Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `Verify your email address - ${APP_NAME}`,
        html: html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', data)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: data 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Verification email sent successfully to:', email)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification email sent successfully',
        messageId: data.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
