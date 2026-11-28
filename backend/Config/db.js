import mariadb from 'mariadb'
import dotenv from 'dotenv'

dotenv.config()

export const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nexus_db',
  connectionLimit: 5,
})

export async function initDatabase() {
  let conn
  try {
    conn = await pool.getConnection()

    await conn.query(`
      CREATE TABLE IF NOT EXISTS telemetry_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        mode VARCHAR(32) DEFAULT 'house',
        battery DECIMAL(5,2),
        gas INT,
        flame BOOLEAN DEFAULT FALSE,
        distance DECIMAL(6,2),
        robot_state VARCHAR(32),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await conn.query(`
      CREATE TABLE IF NOT EXISTS attendance_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        uid VARCHAR(64) NOT NULL,
        name VARCHAR(120),
        event_type ENUM('Entry', 'Exit') NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await conn.query(`
      CREATE TABLE IF NOT EXISTS hazard_alerts (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        level VARCHAR(24) DEFAULT 'critical',
        message VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('MariaDB connected and tables verified.')
  } finally {
    if (conn) conn.release()
  }
}