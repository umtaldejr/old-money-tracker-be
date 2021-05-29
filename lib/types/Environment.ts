type Environment = NodeJS.ProcessEnv & {
  JWT_SECRET: string
  DATABASE_URL: string
}

export default Environment;
