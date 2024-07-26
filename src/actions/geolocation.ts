'use server'

import { GeoLocateData } from '@/types/locationType'

export async function getLocation(name: string): Promise<GeoLocateData> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=10&language=en&format=json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const data = await response.json()

  console.log(data)

  return {
    locations: data.results,
  }
}
