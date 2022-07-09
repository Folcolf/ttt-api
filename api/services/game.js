import client from '@prisma/client'
import prisma from '../db.js'

/**
 * Get games with pagination
 *
 * @param {Object} pagination
 * @returns {Promise<client.Game[]>}
 */
const find = async ({ page, limit, id }) => {
  const skip = (page - 1) * limit

  const games = await prisma.game.findMany({
    skip,
    take: limit,
    where: {
      userId: id,
    },
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
 * Count the number of games for a user or all users
 *
 * @param {*} id
 * @return {*}
 */
const count = async (id) => {
  let search = {}

  if (id !== undefined) {
    search = {
      where: {
        userId: id,
      },
    }
  }

  const game = await prisma.game.count(search)

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

const isFinished = (board) => {
  const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  win.forEach((line) => {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  })

  if (!board.includes(null)) {
    return 'draw'
  }

  return null
}

export default {
  find,
  getById,
  count,
  create,
  update,
  remove,
  isFinished,
}
