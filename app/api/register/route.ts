import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User, { hashPassword } from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body as {
      email?: string;
      username?: string;
      password?: string;
    };

    if (!email || !username || !password) {
      return NextResponse.json(
        { message: 'Email, username and password are required' },
        { status: 400 },
      );
    }

    await connectDB();

    // Reject duplicates explicitly with a friendly error.
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 },
      );
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username already in use' },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 },
    );
  } catch (error: any) {
    // Mongoose duplicate key error (race condition fallback).
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern ?? {})[0] ?? 'field';
      return NextResponse.json(
        { message: `${field} already in use` },
        { status: 409 },
      );
    }
    console.error('Register API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
