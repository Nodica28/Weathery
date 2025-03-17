'use client'
import { useEffect, useState } from 'react'
import RadarMapSection from './modules/radarMap'

export default function Radar() {
  const [currentLocation, setCurrentLocation] = useState<{
    name: string
    latitude: number
    longitude: number
    country: string
  } | null>(null)

  useEffect(() => {
    const location = localStorage.getItem('selectedLocation')
      ? JSON.parse(localStorage.getItem('selectedLocation')!)
      : null

    setCurrentLocation(location)
  }, [])

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-6">
      {currentLocation && <RadarMapSection location={currentLocation} />}
    </div>
  )
}
