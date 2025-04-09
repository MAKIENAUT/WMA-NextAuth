// app/api/forgot-password/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    // Check if user exists
    const user = await db.collection('users').findOne({ email });
    
    // Even if user doesn't exist, we don't reveal that for security
    if (!user) {
      // We return success even if the user doesn't exist for security reasons
      return NextResponse.json({
        success: true,
        message: 'If your email exists in our system, you will receive a password reset link'
      });
    }

    // Generate reset token and expiration (24 hours from now)
    const resetToken = generateToken();
    const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save token to database
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          resetToken,
          resetTokenExpires 
        } 
      }
    );

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: 'WMA <no-reply@westmigrationagency.com>', // Update with your domain
      to: [email],
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, you can ignore this email - your account is still secure.</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>WMA Team</p>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">If the button doesn't work, copy and paste this URL into your browser: ${resetUrl}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email address'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}