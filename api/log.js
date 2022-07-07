import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, splat, timestamp, printf, colorize } = winston.format

const args = process.argv.slice(2)

const myFormat = (uppercase) =>
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

const level = args[0] || 'info'
const date = new Date()

const log = createLogger({
  level,
  format: combine(splat(), timestamp(), myFormat(true)),
  transports: [
    new transports.Console({
      level,
      format: combine(colorize(), splat(), timestamp(), myFormat(false)),
    }),
    new transports.File({ filename: `logs/server.${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.log` }),
  ],
})

export default log
