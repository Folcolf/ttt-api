import client from '@prisma/client'
import { hash } from 'argon2'
import prisma from '../db.js'

/**
 * Get users with pagination
 *
 * @param {Object} pagination
 * @returns {Promise<client.User[]>}
 */
const find = async ({ page, limit }) => {
  const skip = (page - 1) * limit

  return prisma.user.findMany({
    include: {
      Credential: {
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
 *
 * @param {string} id
 * @returns {Promise<client.User>}
 */
const getById = async id => {
  return prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      Credential: {
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
 *
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<client.User>}
 */
const update = async (id, data) => {
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
 *
 * @param {string} id
 * @param {string} password
 * @returns {Promise<client.User>}
 */
const updatePassword = async (id, password) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: await hash(password, {
        type: 2,
        hashLength: 32,
      }),
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

/**
 * Delete a user by id
 *
 * @param {string} id
 * @returns {Promise<boolean>}
 */
const remove = async id => {
  const userExist = await getById(id)

  const credential = await prisma.credential.delete({
    where: {
      id: userExist.Credential.id,
    },
  })

  if (!credential) {
    throw new Error('Credential not found')
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
