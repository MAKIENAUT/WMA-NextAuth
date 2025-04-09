// app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { hash } from 'bcrypt';

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

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user's password and remove reset token fields
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" }
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