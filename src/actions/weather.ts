'use server'

import {
  CurrentUnits,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from '@/types/weatherType'

export async function getWeather(
  latitude: number,
  longitude: number,
  measurementUnits: {
    temperature: string
    wind_speed: string
    precipitation: string
  } | null = null,
): Promise<{
  current_weather: CurrentWeather
  current_units: CurrentUnits
  hourly?: HourlyForecast
  hourly_units?: any
  daily?: DailyForecast
  daily_units?: any
}> {
  // Set default measurement units if none are provided
  const units = measurementUnits || {
    temperature: 'celsius',
    wind_speed: 'kmh',
    precipitation: 'mm',
  }

  // Ensure wind_speed is in the correct format (kmh instead of kph)
  const windSpeedUnit = units.wind_speed === 'kph' ? 'kmh' : units.wind_speed

  // Log the full URL for debugging
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,rain,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&temperature_unit=${units.temperature}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${units.precipitation}&forecast_days=14`

  console.log('API URL:', apiUrl)

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Log the response status for debugging
    console.log('API Response Status:', response.status)

    if (!response.ok) {
      // Get more details about the error
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(
        `Failed to fetch weather data: ${response.status} ${errorText}`,
      )
    }

    const data = await response.json()
    console.log('API Data received successfully')

    return {
      current_weather: data.current,
      current_units: data.current_units,
      hourly: data.hourly,
      hourly_units: data.hourly_units,
      daily: data.daily,
      daily_units: data.daily_units,
    }
  } catch (error) {
    console.error('Error in getWeather:', error)
    throw error
  }
}
