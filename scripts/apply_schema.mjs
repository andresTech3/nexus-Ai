import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'sleisgocuwawjguoxkxy'

if (!DB_PASSWORD) {
  console.error('Error: Debes definir la variable SUPABASE_DB_PASSWORD para ejecutar este script.')
  process.exit(1)
}

async function run() {
  const client = new Client({
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 5432,
    user: `postgres.${PROJECT_REF}`,
    password: DB_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log(`Conectando a Supabase (${PROJECT_REF})...`)
    await client.connect()
    console.log('¡Conexión exitosa!')

    const schemaPath = path.join(rootDir, 'docs/migrations/00000_complete_nexusai_schema.sql')
    const sql = fs.readFileSync(schemaPath, 'utf8')
    console.log('Aplicando migración del esquema...')
    await client.query(sql)
    console.log('¡Esquema aplicado exitosamente!')

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `)
    console.log('\n--- TABLAS ACTIVAS EN SUPABASE ---')
    res.rows.forEach(r => console.log(`✓ public.${r.table_name}`))
  } catch (err) {
    console.error('Error aplicando esquema:', err)
  } finally {
    await client.end()
  }
}

run()
