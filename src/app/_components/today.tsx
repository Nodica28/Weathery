'use client'
import { getWeather } from '@/actions/weather'
import { WeatherData } from '@/types/weatherType'
import { useEffect, useState } from 'react'

export default function Today() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    name: string
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
    const location = localStorage.getItem('selectedLocation')
      ? JSON.parse(localStorage.getItem('selectedLocation')!)
      : null

    console.log(location)

    setCurrentLocation(location)

    // make the decimals for longitude and latitude only 2 digits
    if (location) {
      handleGetWeather(
        Number(location.latitude.toFixed(2)),
        Number(location.longitude.toFixed(2)),
      )
    }
  }, [])

  async function handleGetWeather(latitude: number, longitude: number) {
    const data = await getWeather(latitude, longitude)
    console.log(data)

    setWeatherData(data)
  }

  console.log(currentLocation?.name)

  return (
    <div>
      <p className="font-bold text-2xl">{currentLocation?.name}</p>
      {weatherData && (
        <div>
          <p className="font-semibold text-xl">Weather Information</p>
          <p>Temperature: {weatherData.longitude}°C</p>
          <p>Humidity: {weatherData.latitude}%</p>
          <p>Wind Speed: {weatherData.time} m/s</p>
        </div>
      )}
    </div>
  )
}
