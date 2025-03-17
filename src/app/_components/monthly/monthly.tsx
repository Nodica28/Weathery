'use client'
import { getWeather } from '@/actions/weather'
import { DailyForecast, MeasureMentUnits } from '@/types/weatherType'
import { useEffect, useState } from 'react'
import MonthlyForecastSection from './modules/monthlyForecast'

export default function Monthly() {
  const [dailyForecast, setDailyForecast] = useState<DailyForecast | null>(null)
  const [dailyUnits, setDailyUnits] = useState<any | null>(null)
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

    setDailyForecast(data.daily || null)
    setDailyUnits(data.daily_units || null)
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-6">
      {dailyForecast && currentLocation && dailyUnits && (
        <MonthlyForecastSection
          dailyForecast={dailyForecast}
          location={currentLocation}
        />
      )}
    </div>
  )
}
