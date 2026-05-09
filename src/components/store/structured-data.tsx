'use client'

import { useEffect, useState } from 'react'

interface StructuredDataProps {
  type: 'product' | 'breadcrumb'
  data: Record<string, unknown>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getJsonLd = () => {
    switch (type) {
      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: data.image,
          sku: data.sku,
          brand: data.brand
            ? {
                '@type': 'Brand',
                name: data.brand,
              }
            : undefined,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'USD',
            availability: data.availability || 'https://schema.org/InStock',
            url: data.url,
            priceValidUntil: data.priceValidUntil,
          },
          ...(data.review
            ? {
                review: {
                  '@type': 'Review',
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: data.review.rating,
                    bestRating: '5',
                  },
                  author: {
                    '@type': 'Person',
                    name: data.review.author,
                  },
                },
              }
            : {}),
          ...(data.aggregateRating
            ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: data.aggregateRating.ratingValue,
                  reviewCount: data.aggregateRating.reviewCount,
                  bestRating: '5',
                },
              }
            : {}),
        }

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: (data.items as Array<{ name: string; url: string }>)?.map(
            (item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url,
            })
          ),
        }

      default:
        return null
    }
  }

  const jsonLd = getJsonLd()
  if (!jsonLd) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}
