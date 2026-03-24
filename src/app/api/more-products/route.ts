import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export async function GET() {
  try {
    const res = await fetch('https://v0-api-endpoint-request.vercel.app/api/more-products', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ success: false, products: [] }, { status: res.status });
    }
    const data = await res.json() as ApiResponse;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, products: [] }, { status: 500 });
  }
}
