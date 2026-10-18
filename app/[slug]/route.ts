import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: { message: 'Short URL not found.' } }, { status: 404 })
}
