import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, splat, timestamp, printf } = winston.format

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if (metadata.length > 0) {
    msg += JSON.stringify(metadata)
  }
  return msg
})

const log = createLogger({
  level: 'debug',
  format: combine(format.colorize(), splat(), timestamp(), myFormat),
  transports: [new transports.Console({ level: 'info' })],
})

export default log
