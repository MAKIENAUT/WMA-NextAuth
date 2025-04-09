// app/api/forgot-password/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { hash } from 'bcrypt';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

// Function to generate a temporary password that complies with the password policy
function generateTemporaryPassword(): string {
  // Ensure at least one of each required character type
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '@$!%*?&';

  // Start with one character of each required type
  let password = '';
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

  // Fill the rest to reach 12 characters
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = 4; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  // Shuffle the password to avoid patterns
  return password.split('').sort(() => 0.5 - Math.random()).join('');
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

    // Generate reset token, temporary password, and expiration (24 hours from now)
    const resetToken = generateToken();
    const temporaryPassword = generateTemporaryPassword();
    const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Hash the temporary password
    const hashedTempPassword = await hash(temporaryPassword, 10);

    // Save token, temp password, and set isTemporaryPassword flag to database
    // Also initialize resetAttempts to 0
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpires,
          resetAttempts: 0,
          password: hashedTempPassword,
          isTemporaryPassword: true
        }
      }
    );

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email with Resend including both link and temporary password
    const { data, error } = await resend.emails.send({
      from: 'WMA <no-reply@westmigrationagency.com>', // Update with your domain
      to: [email],
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">F
          <h2>Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. You have two options:</p>
          
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9; border-radius: 5px;">
            <p><strong>Option 1:</strong> Click the button below to set a new password:</p>
            <div style="margin: 15px 0;">
              <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #666;"><strong>Note:</strong> You will have 3 attempts to reset your password with this link.</p>
            <p style="font-size: 13px; color: #666;"><strong>Password requirements:</strong> At least 8 characters, including uppercase and lowercase letters, a number, and a special character (@$!%*?&).</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9; border-radius: 5px;">
            <p><strong>Option 2:</strong> Use this temporary password to sign in:</p>
            <p style="font-family: monospace; font-size: 16px; background-color: #eee; padding: 10px; border-radius: 4px;">${temporaryPassword}</p>
            <p style="font-size: 13px; color: #666;">This temporary password has been set on your account. You can change it after signing in.</p>
          </div>
          
          <p>If you didn't request this password reset, please contact support immediately as someone may be trying to access your account.</p>
          <p>This link and temporary password will expire in 24 hours.</p>
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
      message: 'Password reset link and temporary password sent to your email address'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}