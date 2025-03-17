'use client'
import { getWeather } from '@/actions/weather'
import {
  CurrentUnits,
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  MeasureMentUnits,
} from '@/types/weatherType'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

// Monthly trend preview component
const MonthlyTrendPreview = ({
  dailyForecast,
}: {
  dailyForecast: DailyForecast
}) => {
  // Only show first 7 days if we have them
  const days = dailyForecast?.time?.slice(0, 7) || []
  const maxTemps = dailyForecast?.temperature_2m_max?.slice(0, 7) || []
  const minTemps = dailyForecast?.temperature_2m_min?.slice(0, 7) || []

  // Find min and max for scaling
  const allTemps = [...maxTemps, ...minTemps]
  const minTemp = Math.min(...allTemps)
  const maxTemp = Math.max(...allTemps)
  const range = maxTemp - minTemp

  // Scale to percentage height (0-100%)
  const getHeight = (temp: number) => {
    return ((temp - minTemp) / (range || 1)) * 60 + 15 // 15-75% height range for better visibility
  }

  return (
    <div className="h-40 rounded-md flex items-end justify-between gap-1 px-2 pt-4 pb-2 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/30">
      {days.length > 0 ? (
        days.map((day, i) => (
          <div
            key={day}
            className="flex flex-col items-center flex-1 group hover:opacity-90 transition-opacity"
          >
            <div className="text-xs font-medium mb-1 text-primary">
              {maxTemps[i]}°
            </div>
            <div className="w-full flex justify-center gap-1 relative">
              {/* Connecting line between max and min */}
              <div
                className="absolute w-[1px] bg-gray-200 dark:bg-gray-700"
                style={{
                  height: `${getHeight(maxTemps[i]) - getHeight(minTemps[i])}%`,
                  top: `${100 - getHeight(maxTemps[i])}%`,
                }}
              ></div>

              {/* Max temperature dot */}
              <div
                className="absolute w-3 h-3 rounded-full bg-red-400 border-2 border-white dark:border-gray-800 shadow-sm group-hover:scale-110 transition-transform"
                style={{
                  bottom: `${getHeight(maxTemps[i])}%`,
                  transform: 'translateY(50%)',
                }}
              ></div>

              {/* Min temperature dot */}
              <div
                className="absolute w-3 h-3 rounded-full bg-blue-400 border-2 border-white dark:border-gray-800 shadow-sm group-hover:scale-110 transition-transform"
                style={{
                  bottom: `${getHeight(minTemps[i])}%`,
                  transform: 'translateY(50%)',
                }}
              ></div>
            </div>
            <div className="text-xs mt-6 font-medium">
              {new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-xs text-muted-foreground">{minTemps[i]}°</div>
          </div>
        ))
      ) : (
        <div className="w-full flex items-center justify-center">
          <p className="text-muted-foreground">No forecast data available</p>
        </div>
      )}
    </div>
  )
}

// Map preview component
const MapPreview = ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) => {
  return (
    <div className="aspect-video rounded-md overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.1}%2C${latitude - 0.1}%2C${longitude + 0.1}%2C${latitude + 0.1}&amp;layer=mapnik&amp;marker=${latitude}%2C${longitude}`}
        style={{ border: '1px solid #ddd' }}
      ></iframe>
    </div>
  )
}

export default function Summary() {
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
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast | null>(
    null,
  )
  const [dailyForecast, setDailyForecast] = useState<DailyForecast | null>(null)

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

  async function handleGetWeather(
    latitude: number,
    longitude: number,
    measurementUnits: MeasureMentUnits,
  ) {
    setIsLoading(true)
    try {
      const data = await getWeather(latitude, longitude, measurementUnits)

      setCurrentWeather(data.current_weather ?? null)
      setCurrentUnits(data.current_units ?? null)
      setHourlyForecast(data.hourly ?? null)
      setDailyForecast(data.daily ?? null)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <BeatLoader color="#000000" size={20} />
      </div>
    )
  }

  if (!currentLocation) {
    return (
      <div className="text-center p-8">
        <p className="text-lg">No location selected</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please select a location to view weather information
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Location and Current Weather Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {currentLocation.name}, {currentLocation.country}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {currentWeather && (
          <div className="text-right">
            <div className="text-4xl font-bold">
              {currentWeather.temperature_2m}
              {currentUnits?.temperature_2m}
            </div>
            <p className="text-muted-foreground">
              Feels like {currentWeather.apparent_temperature}
              {currentUnits?.temperature_2m}
            </p>
          </div>
        )}
      </div>

      {/* Weather Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Highlights */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Today&apos;s Highlights
          </h2>
          {currentWeather && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Humidity</span>
                <span className="font-medium">
                  {currentWeather.relative_humidity_2m}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wind Speed</span>
                <span className="font-medium">
                  {currentWeather.wind_speed_10m} {currentUnits?.wind_speed_10m}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Precipitation</span>
                <span className="font-medium">
                  {currentWeather.precipitation} {currentUnits?.precipitation}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hourly Preview */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Next Hours</h2>
          {hourlyForecast ? (
            <div className="space-y-2">
              {/* Display next 4 hours */}
              {hourlyForecast.time.slice(0, 4).map((time, index) => (
                <div key={time} className="flex justify-between items-center">
                  <span>
                    {new Date(time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="font-medium">
                    {hourlyForecast.temperature_2m[index]}°
                  </span>
                </div>
              ))}
              <div className="mt-4 text-sm text-right">
                <a href="#hourly" className="text-primary">
                  View full hourly forecast →
                </a>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Hourly data not available</p>
          )}
        </div>

        {/* 3-Day Preview */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">3-Day Forecast</h2>
          {dailyForecast ? (
            <div className="space-y-2">
              {/* Display next 3 days */}
              {dailyForecast.time.slice(0, 3).map((time, index) => (
                <div key={time} className="flex justify-between items-center">
                  <span>
                    {new Date(time).toLocaleDateString('en-US', {
                      weekday: 'short',
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {dailyForecast.temperature_2m_min[index]}°
                    </span>
                    <span className="font-medium">
                      {dailyForecast.temperature_2m_max[index]}°
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-sm text-right">
                <a href="#10day" className="text-primary">
                  View 10-day forecast →
                </a>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Daily data not available</p>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Map Preview */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Weather Map</h2>
          <MapPreview
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
          />
          <div className="mt-4 text-sm text-right">
            <a href="#radar" className="text-primary">
              View full radar →
            </a>
          </div>
        </div>

        {/* Monthly Outlook */}
        <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">Temperature Trend</h2>
          <p className="text-sm text-muted-foreground mb-4">
            7-day temperature forecast
          </p>
          {dailyForecast ? (
            <MonthlyTrendPreview dailyForecast={dailyForecast} />
          ) : (
            <div className="h-40 bg-muted rounded-md flex items-center justify-center">
              <BeatLoader color="#000000" size={20} />
            </div>
          )}
          <div className="mt-4 text-sm text-right">
            <a
              href="#monthly"
              className="text-primary hover:underline inline-flex items-center"
            >
              View monthly forecast
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
