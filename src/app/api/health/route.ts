import { NextResponse } from 'next/server';
import { buildHealthPayload } from '@/lib/health';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(buildHealthPayload());
}
