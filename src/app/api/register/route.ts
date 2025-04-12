// app/api/register/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { username, email, password, emailVerified } = await request.json();
    
    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const result = await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
      emailVerified: emailVerified || false,
      role: 'user',
      isAllowedDashboard: false,
      createdAt: new Date()
    });

    // Return success response, filtering out the password
    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        username,
        email,
        emailVerified,
        role: 'user',
        isAllowedDashboard: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}