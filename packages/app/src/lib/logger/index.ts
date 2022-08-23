export const LogLevel = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}

export interface Logger {
  log: (level: keyof typeof LogLevel, data: string) => void
}