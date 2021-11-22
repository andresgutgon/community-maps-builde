export default function getEnvVarValue (key: string, suffix: string): string | null {
  const keyAsEnv = key.replace('-', '_').toUpperCase()
  return process.env[`${keyAsEnv}${suffix}`]
}

