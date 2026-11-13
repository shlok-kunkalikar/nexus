import { useCallback, useEffect, useRef, useState } from 'react'

const API = import.meta.env.VITE_ESP32_URL
const GAS_LIMIT = 400
const STOP_DISTANCE = 20
const CARDS = [
  { uid: 'A1B2C3D4', name: 'Aarav Shah' },
  { uid: 'E5F6A7B8', name: 'Diya Patel' },
  { uid: 'C9D0E1F2', name: 'Kabir Mehta' },
  { uid: '0F1E2D3C', name: 'Meera Nair' },
]
const rnd = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

const deriveState = (t) =>
  t.gas > GAS_LIMIT || t.flame ? 'alert' : t.distance < STOP_DISTANCE ? 'obstacle' : 'following'

export const STATE_COPY = {
  following: 'Following the line',
  obstacle: 'Stopped, waiting for the path to clear',
  alert: 'Stopped, safety alert active',
}

export function useTelemetry() {
  const [t, setT] = useState({
    mode: 'house', online: true, battery: 82, gas: 180, flame: false,
    distance: 120, ir: [0, 1, 0], state: 'following',
  })
  const [gasHistory, setGasHistory] = useState(Array(30).fill(180))
  const [events, setEvents] = useState([])
  const [attendance, setAttendance] = useState([])
  const prev = useRef('following')
  const spike = useRef(0)

  const log = useCallback((level, message) =>
    setEvents((e) => [{ id: crypto.randomUUID(), level, message, time: new Date() }, ...e].slice(0, 60)), [])

  // Data source: ESP32 if configured, otherwise simulator
  useEffect(() => {
    const tick = async () => {
      if (API) {
        try {
          const res = await fetch(`${API}/api/status`)
          const data = await res.json()
          setT((p) => ({ ...p, ...data, online: true, state: deriveState({ ...p, ...data }) }))
        } catch { setT((p) => ({ ...p, online: false })) }
        return
      }
      setT((p) => {
        if (spike.current > 0) spike.current--
        else if (Math.random() > 0.96) spike.current = 4
        const n = {
          ...p,
          battery: clamp(p.battery - rnd(0, 0.15), 5, 100),
          gas: spike.current > 0 ? rnd(420, 620) : rnd(150, 240),
          flame: spike.current > 0 && Math.random() > 0.5,
          distance: Math.random() > 0.9 ? rnd(8, 18) : rnd(40, 160),
          ir: [Math.round(Math.random() * 0.6), 1, Math.round(Math.random() * 0.6)],
        }
        return { ...n, state: deriveState(n) }
      })
    }
    const id = setInterval(tick, 1500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => setGasHistory((h) => [...h.slice(1), Math.round(t.gas)]), [t.gas])

  useEffect(() => {
    if (prev.current === t.state) return
    prev.current = t.state
    if (t.state === 'alert') log('critical', t.flame ? 'Flame detected. Robot stopped.' : 'Gas leak detected. Robot stopped.')
    else if (t.state === 'obstacle') log('warning', `Obstacle at ${Math.round(t.distance)} cm. Waiting.`)
    else log('info', 'Path clear. Resumed line following.')
  }, [t.state, t.flame, t.distance, log])

  const voltage = 9 + (t.battery / 100) * 3.6 // 3S pack: 9.0 V to 12.6 V

  // First tap = entry, second tap = exit
  const tapCard = useCallback((card = CARDS[Math.floor(Math.random() * CARDS.length)]) => {
    setAttendance((rows) => {
      const last = rows.find((r) => r.uid === card.uid)
      const type = last?.type === 'Entry' ? 'Exit' : 'Entry'
      log('info', `${card.name} marked ${type.toLowerCase()}.`)
      return [{ id: crypto.randomUUID(), ...card, type, time: new Date() }, ...rows]
    })
  }, [log])

  const setMode = (mode) => { setT((p) => ({ ...p, mode })); log('info', `Switched to ${mode} mode.`) }

  return { t: { ...t, voltage }, gasHistory, events, attendance, tapCard, setMode, GAS_LIMIT }
}
