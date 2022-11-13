declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NODE_ENV: 'development' | 'production'
    JWT_PRIVATE_KEY: string
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}