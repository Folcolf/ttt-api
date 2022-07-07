import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, splat, timestamp, printf } = winston.format

const args = process.argv.slice(2)

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}] : ${message} `
  if (metadata.length > 0) {
    msg += JSON.stringify(metadata)
  }
  return msg
})

const level = args[0] || 'info'

const log = createLogger({
  level,
  format: combine(splat(), timestamp(), myFormat),
  transports: [new transports.Console({ level })],
})

export default log
