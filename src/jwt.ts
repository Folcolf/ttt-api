import { Request } from 'express'
import {
  decodeJwt,
  JWTPayload,
  jwtVerify,
  JWTVerifyResult,
  SignJWT,
} from 'jose'
import log from './log'

const enc = new TextEncoder()
const privateKey = new Uint8Array(enc.encode(process.env.JWT_PRIVATE_KEY))
/**
 * Get jwt from request
 */
const getJWT = (req: Request): string | undefined => {
  return req.headers.authorization?.split(' ')[1]
}

/**
 * Get the user from jwt
 */
const getJWTdata = (req: Request) => {
  const jwt = getJWT(req)
  log.debug(jwt)
  if (!jwt) {
    return undefined
  }
  return decodeJwt(jwt)
}

/**
 * Check if the user is logged
 */
const jwtValid = (jwt: string): Promise<JWTVerifyResult> => {
  return jwtVerify(jwt, privateKey)
}

const createJWT = (data: JWTPayload) => {
  return new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(privateKey)
}

export { getJWTdata, getJWT, jwtValid, createJWT }
