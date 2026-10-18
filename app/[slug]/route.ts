import { NextResponse } from 'next/server'

const links = new Map<string, string>()

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const target = typeof body?.url === 'string' ? body.url.trim() : ''
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''

  if (!target || !/^https?:\/\//i.test(target) || !slug) {
    return NextResponse.json({ error: { message: 'A valid URL and alias are required.' } }, { status: 400 })
  }

  links.set(slug, target)
  return NextResponse.json({ slug, url: target })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const target = links.get(slug)

  if (!target) {
    return NextResponse.json({ error: { message: 'Short URL not found.' } }, { status: 404 })
  }

  return NextResponse.redirect(target)
}
