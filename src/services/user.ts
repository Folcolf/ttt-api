import { User } from '@prisma/client'
import { hash } from 'argon2'
import prisma from '../db'
import type { Pagination } from '../types/pagination'
import { UserCredential } from '../types/user'

/**
 * Get users with pagination
 */
const find = async ({ page, limit }: Pagination): Promise<User[]> => {
  const skip = (page - 1) * limit

  return prisma.user.findMany({
    include: {
      credential: {
        select: {
          id: true,
          email: true,
          error: true,
        },
      },
    },
    skip,
    take: limit,
  })
}

/**
 * Find a user by id
 */
const getById = async (id: string): Promise<UserCredential> => {
  return prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      credential: {
        select: {
          id: true,
          email: true,
          error: true,
        },
      },
    },
  })
}

/**
 * Update a user by id
 */
const update = async (id: string, data: User): Promise<User> => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

/**
 * Update password of a user by id
 */
const updatePassword = async (id: string, password: string): Promise<User> => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      credential: {
        update: {
          hash: await hash(password, {
            type: 2,
            hashLength: 32,
          }),
        },
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

/**
 * Delete a user by id
 */
const remove = async (id: string): Promise<boolean> => {
  const userExist = await getById(id)

  if (userExist.credential) {
    await prisma.credential.delete({
      where: {
        id: userExist.credential.id,
      },
    })
  }

  const user = await prisma.user.delete({
    where: {
      id,
    },
  })

  return user != null
}

export default {
  find,
  getById,
  update,
  updatePassword,
  remove,
}
