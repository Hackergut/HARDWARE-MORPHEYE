import { db } from '@/lib/db'

async function seed() {
  const codes = [
    {
      code: 'WELCOME10',
      description: '10% off your first order',
      type: 'percentage',
      value: 10,
      minPurchase: null,
      maxUses: null,
      active: true,
    },
    {
      code: 'SAVE25',
      description: '25% off orders over $200',
      type: 'percentage',
      value: 25,
      minPurchase: 200,
      maxUses: null,
      active: true,
    },
    {
      code: 'FLAT15',
      description: '$15 off orders over $100',
      type: 'fixed',
      value: 15,
      minPurchase: 100,
      maxUses: null,
      active: true,
    },
  ]

  for (const promo of codes) {
    const existing = await db.promoCode.findUnique({ where: { code: promo.code } })
    if (!existing) {
      await db.promoCode.create({ data: promo })
      console.log(`Created promo code: ${promo.code}`)
    } else {
      console.log(`Promo code already exists: ${promo.code}`)
    }
  }

  console.log('Seed complete')
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect())
