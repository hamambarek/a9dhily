#!/usr/bin/env node

/**
 * Seed test data for development
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedTestData() {
  try {
    console.log('🌱 Seeding test data...')

    // Create a test user if it doesn't exist
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        emailVerified: new Date(),
      },
    })

    console.log('✅ Test user created/updated:', testUser.email)

    // Create a test product if it doesn't exist
    const testProduct = await prisma.product.upsert({
      where: { id: 'prod_test_123' },
      update: {},
      create: {
        id: 'prod_test_123',
        title: 'Test Product',
        description: 'A test product for payment testing',
        price: 10.00,
        currency: 'USD',
        category: 'Electronics',
        condition: 'NEW',
        images: ['https://via.placeholder.com/300x200'],
        location: 'Test City',
        country: 'US',
        city: 'Test City',
        isActive: true,
        isFeatured: false,
        sellerId: testUser.id,
      },
    })

    console.log('✅ Test product created/updated:', testProduct.title)

    // Create a test seller user
    const testSeller = await prisma.user.upsert({
      where: { email: 'seller@example.com' },
      update: {},
      create: {
        email: 'seller@example.com',
        name: 'Test Seller',
        role: 'USER',
        emailVerified: new Date(),
      },
    })

    console.log('✅ Test seller created/updated:', testSeller.email)

    console.log('🎉 Test data seeding completed!')
    console.log('\n📋 Test Data Summary:')
    console.log(`- Test User: ${testUser.email} (ID: ${testUser.id})`)
    console.log(`- Test Seller: ${testSeller.email} (ID: ${testSeller.id})`)
    console.log(`- Test Product: ${testProduct.title} (ID: ${testProduct.id})`)

  } catch (error) {
    console.error('❌ Error seeding test data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
if (require.main === module) {
  seedTestData()
}

module.exports = { seedTestData }
