import { useState, useCallback } from 'react'
import { clamp, rnd } from './telemetryConfig'

export const calcVoltage = (battery) => 9 + (battery / 100) * 3.6 // 3S pack: 9.0 V to 12.6 V

export function useBattery(initialBattery = 82) {
  const [battery, setBattery] = useState(initialBattery)

  const syncBattery = useCallback((nextBattery) => {
    if (typeof nextBattery === 'number') {
      setBattery(clamp(nextBattery, 0, 100))
    }
  }, [])

  const simulateBatteryTick = useCallback(() => {
    setBattery((prev) => clamp(prev - rnd(0, 0.15), 5, 100))
  }, [])

  return {
    battery,
    voltage: calcVoltage(battery),
    setBattery,
    syncBattery,
    simulateBatteryTick,
  }
}