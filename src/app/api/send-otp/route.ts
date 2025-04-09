// app/api/send-otp/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import clientPromise from '@/app/lib/mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT = 3; // Max 3 OTPs per 15 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Apply rate limiting
    const now = Date.now();
    const rateData = rateLimiter.get(email) || { count: 0, lastReset: now };
    
    // Reset count if window has passed
    if (now - rateData.lastReset > RATE_LIMIT_WINDOW) {
      rateData.count = 0;
      rateData.lastReset = now;
    }
    
    // Check if rate limit exceeded
    if (rateData.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Increment count and save
    rateData.count++;
    rateLimiter.set(email, rateData);
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Store OTP in database
    await db.collection('verificationTokens').insertOne({
      identifier: email,
      token: otp,
      expires: expiresAt,
    });

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: 'WMA <no-reply@westmigrationagency.com>', // Update with your domain
      to: [email],
      subject: 'Verify your email',
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}