import { NextResponse } from 'next/server';
import { checkDatabaseStatus } from '@/lib/db-status';

export async function GET() {
  try {
    const status = await checkDatabaseStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      {
        canConnect: false,
        tablesExist: false,
        isSetup: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
