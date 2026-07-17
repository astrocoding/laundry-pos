import { PrismaClient, Role, MachineType, MachineStatus, ServiceType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // 1. Clean up existing data to prevent unique constraint errors during re-seeding
  await prisma.auditLog.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.machineQueue.deleteMany()
  await prisma.machineSession.deleteMany()
  await prisma.machineReservation.deleteMany()
  await prisma.order.deleteMany()
  await prisma.pricingRule.deleteMany()
  await prisma.walletLedger.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.machine.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Users
  const passwordHash = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: {
      name: 'Owner User',
      email: 'owner@laundry.local',
      phone: '08110000001',
      passwordHash,
      role: Role.OWNER,
    }
  })

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@laundry.local',
      phone: '08110000002',
      passwordHash,
      role: Role.ADMIN,
    }
  })

  const customer1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '08110000003',
      passwordHash,
      role: Role.USER,
      wallet: {
        create: {
          balance: 100000,
        }
      }
    }
  })
  
  // Ledger for initial top up
  const customerWallet = await prisma.wallet.findUnique({ where: { userId: customer1.id } })
  if (customerWallet) {
    await prisma.walletLedger.create({
      data: {
        walletId: customerWallet.id,
        type: 'TOPUP',
        amount: 100000,
        balanceBefore: 0,
        balanceAfter: 100000,
        referenceType: 'SYSTEM_INIT',
      }
    })
  }

  // 3. Create Machines
  await Promise.all([
    prisma.machine.create({ data: { code: 'W1', name: 'Washer 10kg', type: MachineType.WASHER, capacityKg: 10, locationZone: 'Front' } }),
    prisma.machine.create({ data: { code: 'W2', name: 'Washer 10kg', type: MachineType.WASHER, capacityKg: 10, locationZone: 'Front' } }),
    prisma.machine.create({ data: { code: 'W3', name: 'Washer 15kg', type: MachineType.WASHER, capacityKg: 15, locationZone: 'Front' } }),
    prisma.machine.create({ data: { code: 'W4', name: 'Washer 15kg', type: MachineType.WASHER, capacityKg: 15, locationZone: 'Back' } }),
    prisma.machine.create({ data: { code: 'W5', name: 'Washer 20kg', type: MachineType.WASHER, capacityKg: 20, locationZone: 'Back', status: MachineStatus.MAINTENANCE } }),
  ])

  await Promise.all([
    prisma.machine.create({ data: { code: 'D1', name: 'Dryer 15kg', type: MachineType.DRYER, capacityKg: 15, locationZone: 'Front' } }),
    prisma.machine.create({ data: { code: 'D2', name: 'Dryer 15kg', type: MachineType.DRYER, capacityKg: 15, locationZone: 'Front' } }),
    prisma.machine.create({ data: { code: 'D3', name: 'Dryer 20kg', type: MachineType.DRYER, capacityKg: 20, locationZone: 'Back' } }),
    prisma.machine.create({ data: { code: 'D4', name: 'Dryer 20kg', type: MachineType.DRYER, capacityKg: 20, locationZone: 'Back' } }),
  ])

  // 4. Create Pricing Rules
  await prisma.pricingRule.createMany({
    data: [
      { name: 'Washer Regular', serviceType: ServiceType.WASH, machineType: MachineType.WASHER, durationMinutes: 25, price: 15000 },
      { name: 'Washer Heavy', serviceType: ServiceType.WASH, machineType: MachineType.WASHER, durationMinutes: 35, price: 20000 },
      { name: 'Dryer Regular', serviceType: ServiceType.DRY, machineType: MachineType.DRYER, durationMinutes: 15, price: 10000 },
      { name: 'Dryer Extra Dry', serviceType: ServiceType.DRY, machineType: MachineType.DRYER, durationMinutes: 25, price: 15000 },
    ]
  })

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
