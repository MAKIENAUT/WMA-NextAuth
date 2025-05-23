// app/api/posts/route.ts
import { NextResponse } from 'next/server';

// Define headers outside the functions so they're available in all cases
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req: Request) {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const data = await req.json();
    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Hello World' },
    { headers: corsHeaders }
  );
}