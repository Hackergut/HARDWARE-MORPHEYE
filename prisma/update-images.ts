import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update product images to use actual generated images
  await prisma.product.updateMany({
    where: { brand: 'Ledger', slug: 'ledger-nano-x' },
    data: { images: JSON.stringify(['/images/ledger-nano-x.jpg']) },
  })

  await prisma.product.updateMany({
    where: { brand: 'Ledger', slug: 'ledger-nano-s-plus' },
    data: { images: JSON.stringify(['/images/ledger-nano-x.jpg']) },
  })

  await prisma.product.updateMany({
    where: { brand: 'Trezor', slug: 'trezor-model-t' },
    data: { images: JSON.stringify(['/images/trezor-model-t.jpg']) },
  })

  await prisma.product.updateMany({
    where: { brand: 'Trezor', slug: 'trezor-safe-3' },
    data: { images: JSON.stringify(['/images/trezor-model-t.jpg']) },
  })

  await prisma.product.updateMany({
    where: { brand: 'Ledger', slug: 'ledger-stax' },
    data: { images: JSON.stringify(['/images/ledger-stax.jpg']) },
  })

  await prisma.product.updateMany({
    where: { brand: 'Keystone', slug: 'keystone-pro-3' },
    data: { images: JSON.stringify(['/images/ledger-nano-x.jpg']) },
  })

  // Accessories, Bundles, Recovery use hero banner as fallback
  await prisma.product.updateMany({
    where: { slug: 'ledger-pod-case' },
    data: { images: JSON.stringify(['/images/hero-banner.jpg']) },
  })

  await prisma.product.updateMany({
    where: { slug: 'trezor-usb-cable-pack' },
    data: { images: JSON.stringify(['/images/hero-banner.jpg']) },
  })

  await prisma.product.updateMany({
    where: { slug: 'ledger-starter-pack' },
    data: { images: JSON.stringify(['/images/ledger-nano-x.jpg']) },
  })

  await prisma.product.updateMany({
    where: { slug: 'dual-vault-bundle' },
    data: { images: JSON.stringify(['/images/ledger-nano-x.jpg']) },
  })

  await prisma.product.updateMany({
    where: { slug: 'cryptosteel-capsule' },
    data: { images: JSON.stringify(['/images/hero-banner.jpg']) },
  })

  await prisma.product.updateMany({
    where: { slug: 'billfodl-stainless-steel' },
    data: { images: JSON.stringify(['/images/hero-banner.jpg']) },
  })

  console.log('✅ Product images updated to use real generated images')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
