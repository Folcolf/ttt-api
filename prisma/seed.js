import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

const userData = [
  {
    name: 'Alice',
    role: 'USER',
    credential: {
      create: {
        email: 'alice@prisma.io',
        hash: await hash('alice', {
          type: 2,
          hashLength: 32,
        }),
      },
    },
  },
  {
    name: 'Bob',
    role: 'USER',
    credential: {
      create: {
        email: 'bob@prisma.io',
        hash: await hash('bob', {
          type: 2,
          hashLength: 32,
        }),
      },
    },
  },
]

async function deleteData() {
  await prisma.game.deleteMany({})
  await prisma.credential.deleteMany({})
  await prisma.user.deleteMany({})
}

async function main() {
  console.log(`Start seeding ...`)

  await deleteData()

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
