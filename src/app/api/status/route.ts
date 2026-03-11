// app/api/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabaseClient';

export type StatusValue = 'ok' | 'maintenance' | 'outage';

export type StatusResponse = {
  status: StatusValue;
  message: string;
  expectedDowntime: string | null;
  updatedAt: string;
};

const STATUS_ROW_ID = '00000000-0000-0000-0000-000000000001';

function rowToResponse(row: {
  status: string;
  message: string;
  expected_downtime: string | null;
  updated_at: string;
}): StatusResponse {
  return {
    status: row.status as StatusValue,
    message: row.message ?? '',
    expectedDowntime: row.expected_downtime ?? null,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('service_status')
      .select('status, message, expected_downtime, updated_at')
      .eq('id', STATUS_ROW_ID)
      .single();

    if (error) {
      console.error('GET /api/status:', error);
      const message =
        process.env.NODE_ENV === 'development'
          ? `${error.message} (code: ${error.code})`
          : 'Kunne ikke hente status';
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Ingen status funnet' },
        { status: 404 }
      );
    }

    return NextResponse.json(rowToResponse(data));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('GET /api/status threw:', e);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

const VALID_STATUSES: StatusValue[] = ['ok', 'maintenance', 'outage'];

export async function POST(request: NextRequest) {
  let body: { status?: string; message?: string; expectedDowntime?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Ugyldig JSON i body' },
      { status: 400 }
    );
  }

  const status = body.status?.trim();
  const message = typeof body.message === 'string' ? body.message : '';
  const expectedDowntime =
    body.expectedDowntime === null || body.expectedDowntime === undefined
      ? null
      : String(body.expectedDowntime).trim() || null;

  if (!status || !VALID_STATUSES.includes(status as StatusValue)) {
    return NextResponse.json(
      { error: 'status må være ok, maintenance eller outage' },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('service_status')
    .update({ status, message, expected_downtime: expectedDowntime })
    .eq('id', STATUS_ROW_ID)
    .select('status, message, expected_downtime, updated_at')
    .single();

  if (error) {
    console.error('POST /api/status:', error);
    return NextResponse.json(
      { error: 'Kunne ikke oppdatere status' },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: 'Ingen rad oppdatert' },
      { status: 404 }
    );
  }

  return NextResponse.json(rowToResponse(data));
}