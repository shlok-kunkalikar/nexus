import { useState, useEffect, useRef, useCallback } from 'react'
import { GAS_LIMIT, rnd } from './telemetryConfig'

export { GAS_LIMIT }

export function useGasFlame(initialGas = 180, initialFlame = false) {
  const [gas, setGas] = useState(initialGas)
  const [flame, setFlame] = useState(initialFlame)
  const [gasHistory, setGasHistory] = useState(() => Array(30).fill(Math.round(initialGas)))
  const spike = useRef(0)

  const isGasDetected = typeof gas === 'number' && gas > GAS_LIMIT
  const isFlameDetected = Boolean(flame)
  const hazardDetected = isGasDetected || isFlameDetected

  useEffect(() => {
    setGasHistory((h) => [...h.slice(1), Math.round(gas)])
  }, [gas])

  const syncGasFlame = useCallback(({ gas: nextGas, flame: nextFlame }) => {
    if (typeof nextGas === 'number') setGas(nextGas)
    if (typeof nextFlame === 'boolean') setFlame(nextFlame)
  }, [])

  // Only call this when explicitly testing simulated sensor data
  const simulateGasFlameTick = useCallback(() => {
    if (spike.current > 0) spike.current--
    else if (Math.random() > 0.96) spike.current = 4

    const nextGas = spike.current > 0 ? rnd(420, 620) : rnd(150, 240)
    const nextFlame = spike.current > 0 && Math.random() > 0.5

    setGas(nextGas)
    setFlame(nextFlame)
    return { gas: nextGas, flame: nextFlame }
  }, [])

  return {
    gas,
    flame,
    gasHistory,
    GAS_LIMIT,
    isGasDetected,
    isFlameDetected,
    hazardDetected,
    setGas,
    setFlame,
    syncGasFlame,
    simulateGasFlameTick,
  }
}