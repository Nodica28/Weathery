export interface GeoLocateData {
  locations: Location[]
}

interface Location {
  name: string
  latitude: number
  longitude: number
  country: string
  population: number
  country_code: string
}
