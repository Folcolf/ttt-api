import { User } from '@prisma/client'

export type UserCredential = User & {
  credential: {
    error: number
    id: string
    email: string
  } | null
}
