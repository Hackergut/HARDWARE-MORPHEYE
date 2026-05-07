import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const hardwareWallets = await prisma.category.create({
    data: {
      name: 'Hardware Wallets',
      slug: 'hardware-wallets',
      description: 'Secure your crypto with the best hardware wallets from authorized reseller',
      image: '/images/cat-hardware.jpg',
      featured: true,
      sortOrder: 1,
    },
  })

  const accessories = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Premium accessories for your hardware wallet',
      image: '/images/cat-accessories.jpg',
      featured: true,
      sortOrder: 2,
    },
  })

  const bundles = await prisma.category.create({
    data: {
      name: 'Bundles & Kits',
      slug: 'bundles',
      description: 'Save more with curated bundles and starter kits',
      image: '/images/cat-bundles.jpg',
      featured: true,
      sortOrder: 3,
    },
  })

  const recovery = await prisma.category.create({
    data: {
      name: 'Recovery & Backup',
      slug: 'recovery-backup',
      description: 'Metal seed phrase storage and backup solutions',
      image: '/images/cat-recovery.jpg',
      featured: false,
      sortOrder: 4,
    },
  })

  // Create products - Hardware Wallets
  const products = [
    {
      name: 'Ledger Nano X',
      slug: 'ledger-nano-x',
      description: 'The Ledger Nano X is the premium hardware wallet for crypto investors who want security and mobility. With Bluetooth connectivity, manage your portfolio on the go with the Ledger Live mobile app. Supports over 5,500 coins and tokens including Bitcoin, Ethereum, XRP, and more.',
      shortDesc: 'Bluetooth-enabled premium hardware wallet with 5,500+ coin support',
      price: 149.99,
      comparePrice: 169.99,
      images: JSON.stringify(['/images/ledger-nano-x-1.jpg', '/images/ledger-nano-x-2.jpg', '/images/ledger-nano-x-3.jpg']),
      categoryId: hardwareWallets.id,
      brand: 'Ledger',
      sku: 'LDG-NX-001',
      stock: 45,
      featured: true,
      active: true,
      specs: JSON.stringify({
        'Connectivity': 'USB-C, Bluetooth 5.0',
        'Supported Coins': '5,500+',
        'Screen': 'OLED 128x32px',
        'Battery': '100mAh, up to 8 hours',
        'Dimensions': '72mm × 18.6mm × 11.75mm',
        'Weight': '34g',
        'Certification': 'CC EAL5+',
        'Storage': 'Up to 100 apps'
      }),
      tags: JSON.stringify(['ledger', 'bluetooth', 'mobile', 'premium']),
      rating: 4.8,
      reviewCount: 2847,
    },
    {
      name: 'Ledger Nano S Plus',
      slug: 'ledger-nano-s-plus',
      description: 'The Ledger Nano S Plus offers enhanced security and capacity at an accessible price point. With a larger screen and more storage than the original Nano S, it supports over 5,500 cryptocurrencies. A certified Secure Element chip protects your private keys.',
      shortDesc: 'Enhanced security hardware wallet with larger screen',
      price: 79.99,
      comparePrice: 99.99,
      images: JSON.stringify(['/images/ledger-nano-s-plus-1.jpg', '/images/ledger-nano-s-plus-2.jpg']),
      categoryId: hardwareWallets.id,
      brand: 'Ledger',
      sku: 'LDG-NSP-001',
      stock: 120,
      featured: true,
      active: true,
      specs: JSON.stringify({
        'Connectivity': 'USB-C',
        'Supported Coins': '5,500+',
        'Screen': 'OLED 128x64px',
        'Battery': 'N/A (USB powered)',
        'Dimensions': '104mm × 22mm × 10mm',
        'Weight': '21g',
        'Certification': 'CC EAL5+',
        'Storage': 'Up to 100 apps'
      }),
      tags: JSON.stringify(['ledger', 'usb-c', 'value', 'entry-level']),
      rating: 4.7,
      reviewCount: 5123,
    },
    {
      name: 'Trezor Model T',
      slug: 'trezor-model-t',
      description: 'The Trezor Model T is the flagship hardware wallet from SatoshiLabs. Featuring a full-color touchscreen, it provides an intuitive and secure way to manage your crypto portfolio. Open-source firmware ensures complete transparency and auditability.',
      shortDesc: 'Premium touchscreen hardware wallet with open-source firmware',
      price: 219.99,
      comparePrice: 249.99,
      images: JSON.stringify(['/images/trezor-t-1.jpg', '/images/trezor-t-2.jpg', '/images/trezor-t-3.jpg']),
      categoryId: hardwareWallets.id,
      brand: 'Trezor',
      sku: 'TRZ-MT-001',
      stock: 30,
      featured: true,
      active: true,
      specs: JSON.stringify({
        'Connectivity': 'USB-C',
        'Supported Coins': '1,800+',
        'Screen': 'LCD Color Touchscreen 240x240px',
        'Battery': 'N/A (USB powered)',
        'Dimensions': '64mm × 39mm × 10mm',
        'Weight': '22g',
        'Certification': 'Open Source',
        'Storage': 'Unlimited'
      }),
      tags: JSON.stringify(['trezor', 'touchscreen', 'open-source', 'premium']),
      rating: 4.9,
      reviewCount: 1876,
    },
    {
      name: 'Trezor Safe 3',
      slug: 'trezor-safe-3',
      description: 'The Trezor Safe 3 combines next-generation security with an accessible price. Featuring a Secure Element chip and haptic feedback, it delivers the trusted Trezor experience in a compact form factor. Supports Shamir backup for enhanced recovery options.',
      shortDesc: 'Next-gen secure hardware wallet with Secure Element',
      price: 79.99,
      comparePrice: null,
      images: JSON.stringify(['/images/trezor-safe3-1.jpg', '/images/trezor-safe3-2.jpg']),
      categoryId: hardwareWallets.id,
      brand: 'Trezor',
      sku: 'TRZ-S3-001',
      stock: 85,
      featured: true,
      active: true,
      specs: JSON.stringify({
        'Connectivity': 'USB-C',
        'Supported Coins': '1,800+',
        'Screen': 'OLED 128x64px',
        'Battery': 'N/A (USB powered)',
        'Dimensions': '62mm × 37mm × 9mm',
        'Weight': '18g',
        'Certification': 'Secure Element + Open Source',
        'Backup': 'Shamir Backup supported'
      }),
      tags: JSON.stringify(['trezor', 'secure-element', 'shamir', 'value']),
      rating: 4.6,
      reviewCount: 943,
    },
    {
      name: 'Ledger Stax',
      slug: 'ledger-stax',
      description: 'The Ledger Stax reimagines hardware wallets with a revolutionary curved E Ink touchscreen. Designed by Tony Fadell (iPod creator), it features a unique magnetic stackable design, Qi wireless charging, and NFC. The future of crypto security is here.',
      shortDesc: 'Revolutionary curved E Ink display hardware wallet by iPod creator',
      price: 399.99,
      comparePrice: null,
      images: JSON.stringify(['/images/ledger-stax-1.jpg', '/images/ledger-stax-2.jpg', '/images/ledger-stax-3.jpg']),
      categoryId: hardwareWallets.id,
      brand: 'Ledger',
      sku: 'LDG-STX-001',
      stock: 15,
      featured: true,
      active: true,
      specs: JSON.stringify({
        'Connectivity': 'USB-C, Bluetooth, NFC',
        'Supported Coins': '5,500+',
        'Screen': 'Curved E Ink Touchscreen',
        'Battery': 'Qi Wireless Charging, 400mAh',
        'Dimensions': '86mm × 56mm × 8mm',
        'Weight': '45g',
        'Certification': 'CC EAL5+',
        'Charging': 'Qi Wireless + USB-C'
      }),
      tags: JSON.stringify(['ledger', 'e-ink', 'premium', 'nfc', 'wireless']),
      rating: 4.5,
      reviewCount: 412,
    },
    {
      name: 'Keystone Pro 3',
      slug: 'keystone-pro-3',
      description: 'The Keystone Pro 3 is an air-gapped hardware wallet using QR code signing for maximum security. With a 4-inch touchscreen, fingerprint sensor, and open-source firmware, it provides the ultimate combination of security and usability.',
      shortDesc: 'Air-gapped QR code hardware wallet with fingerprint sensor',
      price: 119.99,
      comparePrice: 149.99,
      images: JSON.stringify(['/images/keystone-pro3-1.jpg', '/images/keystone-pro3-2.jpg']),
      categoryId: hardwareWallets.id,
      brand: 'Keystone',
      sku: 'KST-P3-001',
      stock: 35,
      featured: false,
      active: true,
      specs: JSON.stringify({
        'Connectivity': 'QR Code (Air-gapped)',
        'Supported Coins': '5,000+',
        'Screen': '4" IPS Touchscreen',
        'Battery': '1000mAh',
        'Dimensions': '110mm × 56mm × 10mm',
        'Weight': '68g',
        'Security': 'Fingerprint Sensor',
        'Backup': 'Shamir Backup + Multi-share'
      }),
      tags: JSON.stringify(['keystone', 'air-gapped', 'qr-code', 'fingerprint']),
      rating: 4.7,
      reviewCount: 628,
    },
    // Accessories
    {
      name: 'Ledger Pod Case',
      slug: 'ledger-pod-case',
      description: 'Premium protective case designed specifically for Ledger Nano X and S Plus. Features shock-absorbing foam interior, waterproof zipper, and carabiner clip for on-the-go security.',
      shortDesc: 'Premium protective case for Ledger Nano wallets',
      price: 29.99,
      comparePrice: 39.99,
      images: JSON.stringify(['/images/ledger-case-1.jpg']),
      categoryId: accessories.id,
      brand: 'Ledger',
      sku: 'LDG-POD-001',
      stock: 200,
      featured: false,
      active: true,
      specs: JSON.stringify({
        'Material': 'EVA Foam + Nylon',
        'Compatibility': 'Ledger Nano X, Nano S Plus',
        'Water Resistance': 'IP54',
        'Dimensions': '120mm × 60mm × 30mm',
        'Weight': '35g'
      }),
      tags: JSON.stringify(['case', 'protection', 'ledger', 'accessory']),
      rating: 4.4,
      reviewCount: 312,
    },
    {
      name: 'Trezor USB-C Cable Pack',
      slug: 'trezor-usb-cable-pack',
      description: 'Official USB-C cable replacement pack for Trezor hardware wallets. Includes 2 premium braided cables (1m and 0.5m) with reinforced connectors designed for reliable data transfer.',
      shortDesc: 'Official USB-C cable pack for Trezor wallets',
      price: 14.99,
      comparePrice: null,
      images: JSON.stringify(['/images/trezor-cable-1.jpg']),
      categoryId: accessories.id,
      brand: 'Trezor',
      sku: 'TRZ-CBL-001',
      stock: 300,
      featured: false,
      active: true,
      specs: JSON.stringify({
        'Cable Length': '1m + 0.5m',
        'Connector': 'USB-C to USB-A',
        'Material': 'Braided Nylon',
        'Compatibility': 'Trezor Model T, Safe 3, Safe 5'
      }),
      tags: JSON.stringify(['cable', 'usb-c', 'trezor', 'accessory']),
      rating: 4.3,
      reviewCount: 187,
    },
    // Bundles
    {
      name: 'Ledger Starter Pack',
      slug: 'ledger-starter-pack',
      description: 'Everything you need to start securing your crypto. Includes a Ledger Nano X, Ledger Pod Case, and a bonus Ledger Recovery Sheet. Save 15% compared to buying individually.',
      shortDesc: 'Complete starter pack: Nano X + Case + Recovery Sheet',
      price: 159.99,
      comparePrice: 189.97,
      images: JSON.stringify(['/images/ledger-starter-1.jpg', '/images/ledger-starter-2.jpg']),
      categoryId: bundles.id,
      brand: 'Ledger',
      sku: 'LDG-BDL-001',
      stock: 25,
      featured: true,
      active: true,
      specs: JSON.stringify({
        'Includes': 'Ledger Nano X, Pod Case, Recovery Sheet',
        'Savings': '15% off individual prices',
        'Warranty': '2 years'
      }),
      tags: JSON.stringify(['bundle', 'starter', 'ledger', 'value']),
      rating: 4.8,
      reviewCount: 456,
    },
    {
      name: 'Dual Vault Bundle',
      slug: 'dual-vault-bundle',
      description: 'Maximum security with redundancy. Get a Trezor Model T and a Ledger Nano X — two different secure chips, two different firmware stacks. Perfect for splitting holdings across devices for ultimate protection.',
      shortDesc: 'Trezor Model T + Ledger Nano X dual security bundle',
      price: 299.99,
      comparePrice: 369.98,
      images: JSON.stringify(['/images/dual-bundle-1.jpg', '/images/dual-bundle-2.jpg']),
      categoryId: bundles.id,
      brand: 'Multi',
      sku: 'MUL-BDL-001',
      stock: 10,
      featured: true,
      active: true,
      specs: JSON.stringify({
        'Includes': 'Trezor Model T + Ledger Nano X',
        'Savings': '19% off individual prices',
        'Warranty': '2 years each'
      }),
      tags: JSON.stringify(['bundle', 'dual', 'trezor', 'ledger', 'premium']),
      rating: 4.9,
      reviewCount: 234,
    },
    // Recovery
    {
      name: 'Cryptosteel Capsule',
      slug: 'cryptosteel-capsule',
      description: 'The ultimate stainless steel backup solution. Fireproof up to 1400°C, waterproof, and shockproof. Store your 24-word seed phrase on laser-etched character tiles that slide into the sealed capsule.',
      shortDesc: 'Stainless steel seed phrase backup — fireproof & waterproof',
      price: 59.99,
      comparePrice: 79.99,
      images: JSON.stringify(['/images/cryptosteel-1.jpg', '/images/cryptosteel-2.jpg']),
      categoryId: recovery.id,
      brand: 'Cryptosteel',
      sku: 'CST-CAP-001',
      stock: 60,
      featured: false,
      active: true,
      specs: JSON.stringify({
        'Material': 'AISI 304 Stainless Steel',
        'Temperature Resistance': 'Up to 1400°C',
        'Capacity': '24-word seed phrase',
        'Character Set': 'Full alphanumeric',
        'Dimensions': '103mm × 30mm',
        'Weight': '150g'
      }),
      tags: JSON.stringify(['recovery', 'steel', 'backup', 'seed-phrase']),
      rating: 4.7,
      reviewCount: 1234,
    },
    {
      name: 'Billfodl Stainless Steel Wallet',
      slug: 'billfodl-stainless-steel',
      description: 'A robust stainless steel recovery seed storage device. Simply slide the character tiles to spell out your seed phrase. No power, no batteries — just indestructible metal protecting your crypto.',
      shortDesc: 'Metal seed phrase storage — indestructible backup',
      price: 49.99,
      comparePrice: null,
      images: JSON.stringify(['/images/billfodl-1.jpg']),
      categoryId: recovery.id,
      brand: 'Billfodl',
      sku: 'BFL-SSW-001',
      stock: 90,
      featured: false,
      active: true,
      specs: JSON.stringify({
        'Material': 'Marine Grade 316 Stainless Steel',
        'Temperature Resistance': 'Up to 1200°C',
        'Capacity': '24-word seed phrase',
        'Dimensions': '96mm × 59mm × 6mm',
        'Weight': '165g'
      }),
      tags: JSON.stringify(['recovery', 'steel', 'backup', 'seed-phrase']),
      rating: 4.5,
      reviewCount: 876,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'Morpheye' },
    { key: 'tagline', value: 'Authorized Hardware Wallet Reseller' },
    { key: 'meta_description', value: 'Morpheye - Your trusted authorized reseller of Ledger, Trezor, and Keystone hardware wallets. Secure your crypto with certified devices, fast shipping, and expert support.' },
    { key: 'meta_pixel_id', value: '' },
    { key: 'currency', value: 'USD' },
    { key: 'shipping_fee', value: '9.99' },
    { key: 'free_shipping_threshold', value: '150' },
    { key: 'tax_rate', value: '0' },
    { key: 'contact_email', value: 'support@morpheye.com' },
    { key: 'facebook_url', value: 'https://facebook.com/morpheye' },
    { key: 'twitter_url', value: 'https://twitter.com/morpheye' },
    { key: 'instagram_url', value: 'https://instagram.com/morpheye' },
    { key: 'telegram_url', value: 'https://t.me/morpheye' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting })
  }

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@morpheye.com',
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log('✅ Seed data created successfully!')
  console.log(`  - ${4} categories`)
  console.log(`  - ${products.length} products`)
  console.log(`  - ${settings.length} site settings`)
  console.log(`  - 1 admin user`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
