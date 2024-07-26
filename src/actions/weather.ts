'use server'

import { WeatherData } from '@/types/weatherType'

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data = await response.json()

  // Process and return the weather data
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    time: data.hourly.time,
  }
}
