import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATION_SECRET;

// Valid cache tags that can be purged
const VALID_TAGS = ['products', 'categories', 'banners', 'global-setting'] as const;
type ValidTag = (typeof VALID_TAGS)[number];

/**
 * POST /api/revalidate
 *
 * Called by Strapi webhooks when content changes.
 * Body: { secret: string, tag?: string, path?: string }
 *
 * Examples:
 *   { secret: "xxx", tag: "products" }         → revalidates all product cache
 *   { secret: "xxx", tag: "banners" }           → revalidates banner cache
 *   { secret: "xxx", path: "/productos/camiseta-polo" } → revalidates specific page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, tag, path } = body as {
      secret?: string;
      tag?: string;
      path?: string;
    };

    // Validate secret
    if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate by tag
    if (tag) {
      if (!VALID_TAGS.includes(tag as ValidTag)) {
        return NextResponse.json(
          { message: `Invalid tag. Valid tags: ${VALID_TAGS.join(', ')}` },
          { status: 400 }
        );
      }
      revalidateTag(tag, {});
      return NextResponse.json({ revalidated: true, tag, timestamp: Date.now() });
    }

    // Revalidate by path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
    }

    // Revalidate everything if no tag or path specified
    for (const t of VALID_TAGS) {
      revalidateTag(t, {});
    }
    return NextResponse.json({ revalidated: true, all: true, timestamp: Date.now() });
  } catch {
    return NextResponse.json({ message: 'Failed to parse request body' }, { status: 400 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    validTags: VALID_TAGS,
    timestamp: Date.now(),
  });
}
