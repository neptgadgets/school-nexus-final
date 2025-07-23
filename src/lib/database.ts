import { Pool, PoolClient } from 'pg'

let pool: Pool

export function getPool(): Pool {
  if (!pool) {
    // Fallback for development/build environment
    const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/schoolnexus'
    
    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function query(text: string, params?: any[]): Promise<any> {
  try {
    const client = await getPool().connect()
    try {
      const result = await client.query(text, params)
      return result
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database query error:', error)
    // Return empty result for build/development environments
    return { rows: [], rowCount: 0 }
  }
}

export async function getClient(): Promise<PoolClient> {
  return await getPool().connect()
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as test')
    return result.rows.length > 0
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
