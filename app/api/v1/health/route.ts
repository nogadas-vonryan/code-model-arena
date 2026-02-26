import { NextResponse } from 'next/server';
import { HealthResponse } from '@/types/api';

const startTime = Date.now();
const VERSION = '0.1.0';

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: VERSION,
    uptime,
  });
}
