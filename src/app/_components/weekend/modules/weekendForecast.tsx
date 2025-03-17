import { weatherCode } from '@/app/_constants/weatherCodes'
import { DailyForecast } from '@/types/weatherType'
import { format, isWeekend } from 'date-fns'

const WeekendForecastSection = ({
  dailyForecast,
  dailyUnits,
  location,
}: {
  dailyForecast: DailyForecast
  dailyUnits: any
  location: {
    name: string
    country: string
    latitude: number
    longitude: number
  }
}) => {
  // Filter for weekend days only (Saturday and Sunday)
  const weekendDays = dailyForecast.time
    .map((time, index) => ({
      time,
      maxTemp: dailyForecast.temperature_2m_max[index],
      minTemp: dailyForecast.temperature_2m_min[index],
      maxApparentTemp: dailyForecast.apparent_temperature_max[index],
      minApparentTemp: dailyForecast.apparent_temperature_min[index],
      precipitationSum: dailyForecast.precipitation_sum[index],
      precipitationProbability:
        dailyForecast.precipitation_probability_max[index],
      weatherCode: dailyForecast.weather_code[index],
      windSpeed: dailyForecast.wind_speed_10m_max[index],
    }))
    .filter((day) => isWeekend(new Date(day.time)))
    .slice(0, 4) // Get the next 2 weekends (4 days)

  return (
    <div className="py-6 px-9 bg-gray-400 h-full w-full rounded-[20px] flex flex-col gap-6 text-white">
      <div className="flex flex-col">
        <p className="text-xl font-[700]">Weekend Forecast</p>
        <p className="text-sm">
          {location.name}, {location.country}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {weekendDays.map((day, index) => (
          <div
            key={index}
            className="bg-gray-500/30 p-6 rounded-lg flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-bold">
                  {format(new Date(day.time), 'EEEE')}
                </p>
                <p className="text-sm">
                  {format(new Date(day.time), 'MMMM d')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {day.maxTemp}
                  {dailyUnits.temperature_2m_max}
                </p>
                <p className="text-lg">
                  {day.minTemp}
                  {dailyUnits.temperature_2m_min}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="text-center">
                <p className="text-sm font-medium">Weather</p>
                <p className="text-base">
                  {weatherCode[day.weatherCode as keyof typeof weatherCode]}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">Precipitation</p>
                <p className="text-base">{day.precipitationProbability}%</p>
                <p className="text-xs">
                  {day.precipitationSum} {dailyUnits.precipitation_sum}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">Wind</p>
                <p className="text-base">
                  {day.windSpeed} {dailyUnits.wind_speed_10m_max}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeekendForecastSection
