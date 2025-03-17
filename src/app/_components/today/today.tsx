'use client'
import { getWeather } from '@/actions/weather'
import {
  CurrentUnits,
  CurrentWeather,
  MeasureMentUnits,
} from '@/types/weatherType'
import { useEffect, useState } from 'react'
import CurrentWeatherSection from './modules/current'
import { BeatLoader } from 'react-spinners'

export default function Today() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null,
  )
  const [currentUnits, setCurrentUnits] = useState<CurrentUnits | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    name: string
    latitude: number
    longitude: number
    country: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const location = localStorage.getItem('selectedLocation')
      ? JSON.parse(localStorage.getItem('selectedLocation')!)
      : null

    const measurementUnits = localStorage.getItem('measurementUnits')
      ? JSON.parse(localStorage.getItem('measurementUnits')!)
      : { temperature: 'celsius', wind_speed: 'kmh', precipitation: 'mm' }

    setCurrentLocation(location)

    if (location) {
      handleGetWeather(
        Number(location.latitude.toFixed(2)),
        Number(location.longitude.toFixed(2)),
        measurementUnits,
      )
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Small timeout to let the initial render complete
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  async function handleGetWeather(
    latitude: number,
    longitude: number,
    measurementUnits: MeasureMentUnits,
  ) {
    setIsLoading(true)
    try {
      const data = await getWeather(latitude, longitude, measurementUnits)

      setCurrentWeather(data.current_weather)
      setCurrentUnits(data.current_units)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <BeatLoader className={isAnimating ? 'animate-beat' : ''} />
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-6">
      {currentWeather && currentLocation && currentUnits ? (
        <CurrentWeatherSection
          currentUnits={{
            apparent_temperature: currentUnits.apparent_temperature,
            interval: currentUnits.interval,
            is_day: currentUnits.is_day,
            precipitation: currentUnits.precipitation,
            rain: currentUnits.rain,
            relative_humidity_2m: currentUnits.relative_humidity_2m,
            temperature_2m: currentUnits.temperature_2m,
            time: currentUnits.time,
            weather_code: currentUnits.weather_code,
            wind_direction_10m: currentUnits.wind_direction_10m,
            wind_gusts_10m: currentUnits.wind_gusts_10m,
            wind_speed_10m: currentUnits.wind_speed_10m,
          }}
          currentWeather={{
            time: currentWeather.time,
            temperature_2m: currentWeather.temperature_2m,
            weather_code: currentWeather.weather_code,
            apparent_temperature: currentWeather.apparent_temperature,
            precipitation: currentWeather.precipitation,
            relative_humidity_2m: currentWeather.relative_humidity_2m,
            wind_direction_10m: currentWeather.wind_direction_10m,
            wind_gusts_10m: currentWeather.wind_gusts_10m,
            wind_speed_10m: currentWeather.wind_speed_10m,
          }}
          location={{
            name: currentLocation.name,
            country: currentLocation.country,
          }}
        />
      ) : (
        <div className="text-center">
          <p>No weather data available. Please select a location.</p>
        </div>
      )}
    </div>
  )
}
