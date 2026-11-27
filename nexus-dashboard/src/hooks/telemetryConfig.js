export const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_ESP32_URL
export const GAS_LIMIT = 400
export const STOP_DISTANCE = 20

export const STATE_COPY = {
  following: 'Following the line',
  obstacle: 'Stopped, waiting for the path to clear',
  alert: 'Stopped, safety alert active',
}

export const rnd = (a, b) => a + Math.random() * (b - a)
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export const deriveState = ({ gas, flame, distance }) =>
  gas > GAS_LIMIT || flame ? 'alert' : distance < STOP_DISTANCE ? 'obstacle' : 'following'

export async function fetchRobotStatus() {
  const res = await fetch(`${API}/api/status`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}