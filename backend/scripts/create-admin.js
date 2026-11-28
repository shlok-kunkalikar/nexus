import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import pool from '../src/db.js'
dotenv.config()

const nexId = String(process.env.ADMIN_NEX_ID || '').trim().toUpperCase()
const password = process.env.ADMIN_PASSWORD || ''
const name = process.env.ADMIN_NAME || 'NEXUS Administrator'

if (!nexId || !password) {
  console.error('Set ADMIN_NEX_ID and ADMIN_PASSWORD in backend/.env before running this command.')
  process.exit(1)
}
if (password.length < 10) {
  console.error('Choose an initial password with at least 10 characters.')
  process.exit(1)
}

try {
  const hash = await bcrypt.hash(password, 12)
  await pool.execute(
    `INSERT INTO users (nex_id, full_name, password_hash, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), role = 'admin', is_active = TRUE`,
    [nexId, name, hash]
  )
  console.log(`Admin account ${nexId} is ready. Keep its password private.`)
} catch (error) {
  console.error('Could not create admin:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
