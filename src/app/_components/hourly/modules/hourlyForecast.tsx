import { weatherCode } from '@/app/_constants/weatherCodes'
import { HourlyForecast } from '@/types/weatherType'
import { format } from 'date-fns'

const HourlyForecastSection = ({
  hourlyForecast,
  hourlyUnits,
  location,
}: {
  hourlyForecast: HourlyForecast
  hourlyUnits: any
  location: {
    name: string
    country: string
    latitude: number
    longitude: number
  }
}) => {
  // Get the next 24 hours of data
  const next24Hours = hourlyForecast.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: hourlyForecast.temperature_2m[index],
    apparentTemperature: hourlyForecast.apparent_temperature[index],
    precipitationProbability: hourlyForecast.precipitation_probability[index],
    precipitation: hourlyForecast.precipitation[index],
    weatherCode: hourlyForecast.weather_code[index],
    windSpeed: hourlyForecast.wind_speed_10m[index],
  }))

  return (
    <div className="py-6 px-9 bg-gray-400 h-full w-full rounded-[20px] flex flex-col gap-6 text-white">
      <div className="flex flex-col">
        <p className="text-xl font-[700]">Hourly Forecast</p>
        <p className="text-sm">
          {location.name}, {location.country}
        </p>
      </div>

      <div className="grid grid-cols-8 gap-4">
        {next24Hours.map((hour, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-500/30 p-3 rounded-lg"
          >
            <p className="text-sm font-medium">
              {format(new Date(hour.time), 'h a')}
            </p>
            <p className="text-2xl font-bold mt-2">
              {hour.temperature}
              {hourlyUnits.temperature_2m}
            </p>
            <p className="text-xs mt-1">
              {weatherCode[hour.weatherCode as keyof typeof weatherCode]}
            </p>
            <p className="text-xs mt-2">
              {hour.precipitationProbability}% chance
            </p>
            <p className="text-xs">
              {hour.windSpeed} {hourlyUnits.wind_speed_10m}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HourlyForecastSection
