import { Game } from '@prisma/client'
import prisma from '../db'
import type { Pagination } from './../types/pagination'

/**
 * Get games with pagination
 */
const find = async (
  id: string,
  { page, limit }: Pagination
): Promise<Game[]> => {
  const skip = (page - 1) * limit

  return prisma.game.findMany({
    skip,
    take: limit,
    where: {
      userId: id,
    },
  })
}

/**
 * Find all games played by a user
 */
const findByUser = async (id: string, { page, limit }: Pagination) => {
  const skip = (page - 1) * limit

  return prisma.game.findMany({
    skip,
    take: limit,
    where: {
      userId: id,
      OR: {
        opponentId: id,
      },
    },
  })
}

/**
 * Find a game by id
 */
const getById = async (id: string): Promise<Game> => {
  return prisma.game.findUniqueOrThrow({
    where: {
      id,
    },
  })
}

/**
 * Count the number of games for a user or all users
 */
const count = async (id?: string): Promise<number> => {
  let search = {}

  if (id !== undefined) {
    search = {
      where: {
        userId: id,
      },
    }
  }

  return prisma.game.count(search)
}

/**
 * Create a game between two users
 */
const create = async ({ userId }: Game): Promise<Game> => {
  if (!userId) {
    throw new Error('User ID is required')
  }
  return prisma.game.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

/**
 * Update a game
 */
const update = async (id: string, data: Partial<Game>): Promise<Game> => {
  return prisma.game.update({
    where: {
      id,
    },
    data,
  })
}

/**
 * Remove a game by id
 */
const remove = async (id: string): Promise<Game> => {
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

/**
 * Check if a game is finished
 */
const isFinished = ({ board }: Game): string | null => {
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

  win.forEach(line => {
    const [a, b, c] = line
    if (
      board[a].value &&
      board[a].value === board[b].value &&
      board[a].value === board[c].value
    ) {
      return board[a].value
    }
  })

  if (!board.map(cell => cell.value).includes(null)) {
    return 'draw'
  }

  return null
}

export default {
  find,
  findByUser,
  getById,
  count,
  create,
  update,
  remove,
  isFinished,
}
