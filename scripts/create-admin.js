#!/usr/bin/env node

/**
 * Create admin user for testing
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...')

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@a9dhily.com' },
      update: {
        role: 'ADMIN',
        isVerified: true,
        isActive: true
      },
      create: {
        email: 'admin@a9dhily.com',
        name: 'Admin User',
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
        emailVerified: new Date(),
        lastActive: new Date()
      },
    })

    console.log('✅ Admin user created/updated successfully!')
    console.log('\n📋 Admin User Details:')
    console.log(`- Email: ${adminUser.email}`)
    console.log(`- Name: ${adminUser.name}`)
    console.log(`- Role: ${adminUser.role}`)
    console.log(`- ID: ${adminUser.id}`)
    console.log(`- Verified: ${adminUser.isVerified}`)
    console.log(`- Active: ${adminUser.isActive}`)
    
    console.log('\n🔑 You can now sign in with:')
    console.log('Email: admin@a9dhily.com')
    console.log('(Use Google OAuth to sign in)')
    
    console.log('\n🌐 Access admin panel at:')
    console.log('http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
