'use client'

import { useEffect } from 'react'

// تعریف و اکسپورت type Position
export type Position = {
  lat: number
  lng: number
}

type MapPickerProps = {
  onLocationChange?: (loc: Position) => void
}

const MapPicker = ({ onLocationChange }: MapPickerProps) => {
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({ lat: 35.6892, lng: 51.389 }) // تهران
    }
  }, [onLocationChange])

  return (
    <div className="h-48 rounded bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">اینجا نقشه خواهد بود</p>
    </div>
  )
}

export default MapPicker
