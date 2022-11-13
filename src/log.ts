import { createWriteStream, readdirSync, unlinkSync } from 'fs'
import path from 'path'
import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, splat, printf, colorize } = winston.format

const date = new Date()
const args = process.argv.slice(2)
const appLevel = args[0] || 'info'

const directory = 'logs'
const filenameServer = `${directory}/server.${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}.log`

const filenameAccess = `${directory}/access.${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}.log`

if (appLevel === 'debug') {
  for (const file of readdirSync(directory)) {
    unlinkSync(path.join(directory, file))
  }
}

const myFormat = (uppercase: boolean) =>
  printf(({ level, message, timestamp, ...metadata }) => {
    if (uppercase) {
      level = level.toUpperCase()
    }

    let msg = `${timestamp} [${level}] : ${message} `
    if (metadata.length > 0) {
      msg += JSON.stringify(metadata)
    }
    return msg
  })

const log = createLogger({
  level: appLevel,
  transports: [
    new transports.Console({
      level: appLevel,
      format: combine(colorize(), splat(), format.timestamp(), myFormat(false)),
    }),
    new transports.File({
      format: combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        printf(
          info =>
            JSON.stringify({
              time: info.timestamp,
              level: info.level,
              message: info.message,
            }) + ','
        )
      ),
      filename: filenameServer,
    }),
  ],
})

// create a write stream (in append mode)
const accessLogStream = createWriteStream(filenameAccess, { flags: 'a' })

export { accessLogStream }
export default log
