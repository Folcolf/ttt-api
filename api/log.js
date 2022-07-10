import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, splat, printf, colorize } = winston.format

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

const appLevel = args[0] || 'info'
const date = new Date()

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
          (info) =>
            JSON.stringify({
              time: info.timestamp,
              level: info.level,
              message: info.message,
            }) + ','
        )
      ),
      filename: `logs/server.${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}.log`,
    }),
  ],
})

export default log
