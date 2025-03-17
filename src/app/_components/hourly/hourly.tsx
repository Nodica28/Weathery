'use client'
import { getWeather } from '@/actions/weather'
import { HourlyForecast, MeasureMentUnits } from '@/types/weatherType'
import { useEffect, useState } from 'react'
import HourlyForecastSection from './modules/hourlyForecast'

export default function Hourly() {
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast | null>(
    null,
  )
  const [hourlyUnits, setHourlyUnits] = useState<any | null>(null)
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

    const measurementUnits = localStorage.getItem('measurementUnits')
      ? JSON.parse(localStorage.getItem('measurementUnits')!)
      : null

    setCurrentLocation(location)

    if (location) {
      handleGetWeather(
        Number(location.latitude.toFixed(2)),
        Number(location.longitude.toFixed(2)),
        measurementUnits,
      )
    }
  }, [])

  async function handleGetWeather(
    latitude: number,
    longitude: number,
    measurementUnits: MeasureMentUnits,
  ) {
    const data = await getWeather(latitude, longitude, measurementUnits)
    console.log(data)

    setHourlyForecast(data.hourly || null)
    setHourlyUnits(data.hourly_units || null)
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-6">
      {hourlyForecast && currentLocation && hourlyUnits && (
        <HourlyForecastSection
          hourlyForecast={hourlyForecast}
          hourlyUnits={hourlyUnits}
          location={currentLocation}
        />
      )}
    </div>
  )
}
