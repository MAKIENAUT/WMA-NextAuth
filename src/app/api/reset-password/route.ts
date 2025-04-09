// app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { hash } from 'bcrypt';

const MAX_RESET_ATTEMPTS = 3;

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    // Basic validation
    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    // Find user with matching token and email
    const user = await db.collection('users').findOne({
      email,
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }  // Check if token is not expired
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    // Check if maximum attempts reached
    const resetAttempts = user.resetAttempts || 0;
    if (resetAttempts >= MAX_RESET_ATTEMPTS) {
      // Invalidate the token by setting expiration to a past date
      await db.collection('users').updateOne(
        { email },
        {
          $set: { resetTokenExpires: new Date(0) }
        }
      );

      return NextResponse.json(
        { error: 'Maximum password reset attempts reached. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user's password, remove reset token fields, and reset isTemporaryPassword flag
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          isTemporaryPassword: false
        },
        $unset: { resetToken: "", resetTokenExpires: "", resetAttempts: "" }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

// Add an endpoint to validate token and increment attempt counter
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing token or email' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    // Find user with matching token and email
    const user = await db.collection('users').findOne({
      email,
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const resetAttempts = user.resetAttempts || 0;

    // Check if max attempts reached
    if (resetAttempts >= MAX_RESET_ATTEMPTS) {
      return NextResponse.json({
        valid: false,
        error: 'Maximum password reset attempts reached. Please request a new password reset.'
      });
    }

    // Increment the attempt counter
    await db.collection('users').updateOne(
      { email, resetToken: token },
      { $inc: { resetAttempts: 1 } }
    );

    return NextResponse.json({
      valid: true,
      attemptsLeft: MAX_RESET_ATTEMPTS - (resetAttempts + 1)
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}