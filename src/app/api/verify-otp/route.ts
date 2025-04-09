import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    // Find the verification token
    const verificationToken = await db.collection('verificationTokens').findOne({
      identifier: email,
      token: otp,
      expires: { $gt: new Date() }, // Check if token is not expired
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Delete the verification token (one-time use)
    await db.collection('verificationTokens').deleteOne({
      _id: verificationToken._id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}