import client, { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import prisma from '../db'

import type { Register } from '../types/register'
import type { Login } from '../types/login'

export default {
  /**
   * Check if the user is present in the database and if the password is correct
   *
   * @param {Login} login
   * @returns {*} Promise<User>
   */
  login: async ({ email, password }: Login): Promise<User> => {
    const credential = await prisma.credential.findUniqueOrThrow({
      where: {
        email,
      },
    })

    if (credential.error > 5) {
      throw new Error('Too many login attempts')
    }

    if (!(await verify(credential.hash, password))) {
      await prisma.credential.update({
        where: {
          id: credential.id,
        },
        data: {
          error: credential.error + 1,
        },
      })

      throw new Error('Invalid password')
    }

    await prisma.credential.update({
      where: {
        id: credential.id,
      },
      data: {
        error: 0,
      },
    })
    return prisma.user.findUniqueOrThrow({
      where: {
        id: credential.userId,
      },
      include: {
        credential: {
          select: {
            email: true,
            error: true,
          },
        },
      },
    })
  },

  /**
   * Create a new user in the database and return the user if isn't already present
   *
   * @param {Register} user
   * @returns {*} Promise<User>
   */
  register: async ({ email, name, password }: Register): Promise<User> => {
    const alreadyExists = await prisma.user.findFirst({
      where: {
        credential: {
          email,
        },
      },
    })

    if (alreadyExists !== null) {
      throw new Error('User already exists')
    }

    const hashedPassword = await hash(password, {
      type: 2,
      hashLength: 32,
    })

    return prisma.user.create({
      data: {
        name,
        credential: {
          create: {
            email,
            hash: hashedPassword,
          },
        },
        role: client.Role.USER,
      },
    })
  },
}
