import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import mongoose from 'mongoose';

export async function GET() {
  // Do not expose secrets; only presence/shape.
  const requiredVars = [
    'MONGODB_URI',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];
  const env = Object.fromEntries(
    requiredVars.map((k) => [k, Boolean(process.env[k])]),
  );

  // Reuse the cached connection (singleton in config/database.ts)
  // rather than connecting + disconnecting on every health hit, which
  // would thrash the pool and hide connection issues under latency.
  const report: Record<string, unknown> = {
    runtime: 'node',
    node: process.version,
    env,
    mongo: { connected: false, readyState: null as number | null, error: null as string | null },
  };

  try {
    await connectDB();
    // mongoose.connection.readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    report.mongo = {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      error: null,
    };
  } catch (err) {
    report.mongo = {
      connected: false,
      readyState: mongoose.connection.readyState ?? null,
      error: err instanceof Error ? err.message : 'Unknown connection error',
    };
    return NextResponse.json(report, { status: 503 });
  }

  return NextResponse.json(report, { status: 200 });
}
