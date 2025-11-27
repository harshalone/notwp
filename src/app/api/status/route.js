import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch latest version from notwp.com
    const versionResponse = await fetch('https://www.notwp.com/api/status', {
      cache: 'no-store',
    });

    if (!versionResponse.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to fetch version from remote',
          server_status: 'running',
          latest_version: null,
        },
        { status: 500 }
      );
    }

    const versionData = await versionResponse.json();
    const latestVersion = versionData.version || null;

    return NextResponse.json({
      status: versionData.status,
      server_status: versionData.server_status,
      app_version: versionData.app_version,
      latest_version: versionData.app_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        server_status: 'running',
        latest_version: null,
      },
      { status: 500 }
    );
  }
}
