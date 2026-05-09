import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '9', 10)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { published: true }
    if (category) where.category = category

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.blogPost.count({ where }),
    ])

    const parsed = posts.map((p) => ({
      ...p,
      tags: (() => { try { return JSON.parse(p.tags || '[]') } catch { return [] } })(),
    }))

    return NextResponse.json({
      posts: parsed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, image, category, author, published, featured, tags, readTime } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image: image || null,
        category: category || null,
        author: author || 'Morpheye',
        published: published ?? false,
        featured: featured ?? false,
        tags: tags ? JSON.stringify(tags) : '[]',
        readTime: readTime || null,
      },
    })

    const parsed = {
      ...post,
      tags: (() => { try { return JSON.parse(post.tags || '[]') } catch { return [] } })(),
    }

    return NextResponse.json(parsed, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
