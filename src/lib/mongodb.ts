import { MongoClient, Document } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

if (!uri) {
  throw new Error('Missing MONGODB_URI. Set it in .env.local')
}

const dbName = process.env.MONGODB_DB || 'hacvent'

// Global is used here to preserve the value across hot reloads in development
let cachedClient: MongoClient | null = null

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client
}

export async function getDb() {
  const client = await getMongoClient()
  return client.db(dbName)
}

export async function getCollection<T extends Document = Document>(name: string) {
  const db = await getDb()
  return db.collection<T>(name)
}
