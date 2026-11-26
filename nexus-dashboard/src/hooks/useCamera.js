import { useState, useCallback } from 'react'

export const DEFAULT_CAM_URL = import.meta.env.VITE_CAM_URL || ''

export function useCamera(initialUrl = DEFAULT_CAM_URL) {
  const [camUrl, setCamUrl] = useState(initialUrl)

  const syncCamera = useCallback((nextUrl) => {
    if (nextUrl) {
      setCamUrl(nextUrl)
    }
  }, [])

  return {
    camUrl: camUrl || DEFAULT_CAM_URL,
    setCamUrl,
    syncCamera,
  }
}