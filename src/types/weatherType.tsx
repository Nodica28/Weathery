export interface WeatherData {
  current_weather: string[]
}

export interface MeasureMentUnits {
  temperature: string
  wind_speed: string
  precipitation: string
}

export interface CurrentUnits {
  apparent_temperature: string
  interval: string
  is_day: string
  precipitation: string
  rain: string
  relative_humidity_2m: string
  temperature_2m: string
  time: string
  weather_code: string
  wind_direction_10m: string
  wind_gusts_10m: string
  wind_speed_10m: string
}

export interface CurrentWeather {
  apparent_temperature: number
  is_day: boolean
  precipitation: number
  rain: number
  relative_humidity_2m: number
  temperature_2m: number
  time: string
  wind_direction_10m: number
  wind_gusts_10m: number
  wind_speed_10m: number
  weather_code: number
}

export interface HourlyForecast {
  time: string[]
  temperature_2m: number[]
  apparent_temperature: number[]
  precipitation_probability: number[]
  precipitation: number[]
  weather_code: number[]
  wind_speed_10m: number[]
}

export interface DailyForecast {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  apparent_temperature_max: number[]
  apparent_temperature_min: number[]
  precipitation_sum: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
}
