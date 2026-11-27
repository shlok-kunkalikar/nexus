import { useState, useCallback } from 'react'
import { API } from './telemetryConfig'

export const CARDS = [
  { uid: 'A1B2C3D4', name: 'Aarav Shah' },
  { uid: 'E5F6A7B8', name: 'Diya Patel' },
  { uid: 'C9D0E1F2', name: 'Kabir Mehta' },
  { uid: '0F1E2D3C', name: 'Meera Nair' },
]

async function postAttendance(card) {
  const res = await fetch(`${API}/api/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: card.uid, name: card.name }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useAttendance(onLog) {
  const [attendance, setAttendance] = useState([])

  const syncAttendance = useCallback((rows) => {
    if (Array.isArray(rows)) {
      setAttendance(
        rows.map((r) => ({
          ...r,
          time: r.time ? new Date(r.time) : new Date(),
        }))
      )
    }
  }, [])

  const tapCard = useCallback(
    async (card = CARDS[Math.floor(Math.random() * CARDS.length)]) => {
      if (API) {
        try {
          const { record } = await postAttendance(card)
          const formatted = { ...record, time: record.time ? new Date(record.time) : new Date() }
          setAttendance((rows) => [formatted, ...rows.filter((r) => r.id !== formatted.id)])
          onLog?.('info', `${formatted.name} marked ${formatted.type.toLowerCase()}.`)
          return
        } catch {
          // Fall back to local toggle if offline
        }
      }

      setAttendance((rows) => {
        const last = rows.find((r) => r.uid === card.uid)
        const type = last?.type === 'Entry' ? 'Exit' : 'Entry'
        onLog?.('info', `${card.name} marked ${type.toLowerCase()}.`)
        return [{ id: crypto.randomUUID(), ...card, type, time: new Date() }, ...rows]
      })
    },
    [onLog]
  )

  return {
    attendance,
    setAttendance,
    syncAttendance,
    tapCard,
  }
}