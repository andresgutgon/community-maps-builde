type CommunityEnvType = {
  host: string
  token: string
}
export default function findCommunity (slug: string): CommunityEnvType | null {
  const slugEnv = slug.replace('-', '_').toUpperCase()
  const host =  process.env[`${slugEnv}_HOST`]
  const token = process.env[`${slugEnv}_SECRET_TOKEN`]

  if (!host || !token) return null

  return { host, token }
}

