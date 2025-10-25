import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  const report: Record<string, unknown> = {
    runtime: 'edge-disabled',
    node: process.version,
    env: {},
    mongo: { connected: false, error: null as null | string },
  };

  // Do not expose secrets; only presence/shape
  const requiredVars = [
    'MONGODB_URI',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];
  report.env = Object.fromEntries(
    requiredVars.map((k) => [k, Boolean(process.env[k])])
  );

  // Try DB connection quickly with a 3s timeout
  const uri = process.env.MONGODB_URI as string | undefined;
  if (uri) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 } as any);
      clearTimeout(timeout);
      report.mongo = { connected: true, error: null };
      await mongoose.disconnect();
    } catch (err: any) {
      report.mongo = { connected: false, error: err?.message || 'connect error' };
    }
  }

  return NextResponse.json(report, { status: 200 });
}


