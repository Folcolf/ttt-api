import client from '@prisma/client'
import prisma from '../db.js'

/**
 * Get games with pagination
 *
 * @param {Object} pagination
 * @returns {Promise<client.Game[]>}
 */
const find = async ({ page, limit }) => {
  const skip = (page - 1) * limit

  const games = await prisma.game.findMany({
    skip,
    take: limit,
  })

  return games
}

/**
 * Find a game by id
 *
 * @param {string} id
 * @returns {Promise<client.Game>}
 */
const getById = async (id) => {
  const game = await prisma.game.findUniqueOrThrow({
    where: {
      id,
    },
  })

  return game
}

/**
 * Create a game between two users
 *
 * @param {client.Game} game
 * @returns {Promise<client.Game>}
 */
const create = async ({ userId, opponentId }) => {
  const game = await prisma.game.create({
    data: {
      User: {
        connect: {
          id: userId,
        },
      },
      opponentId,
    },
  })

  return game
}

/**
 * Update a game by id
 *
 * @param {string} id
 * @param {client.Game} data
 * @returns {Promise<client.Game>}
 */
const update = async (id, data) => {
  const game = await prisma.game.update({
    where: {
      id,
    },
    data,
  })

  if (!game) {
    throw new Error('Game not found')
  }

  return game
}

/**
 * Remove a game by id
 *
 * @param {string} id
 * @returns {Promise<client.Game>}
 */
const remove = async (id) => {
  const game = await prisma.game.delete({
    where: {
      id,
    },
  })

  if (!game) {
    throw new Error('Game not found')
  }

  return game
}

export default {
  find,
  getById,
  create,
  update,
  remove,
}
