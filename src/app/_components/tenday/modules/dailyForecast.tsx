import { weatherCode } from '@/app/_constants/weatherCodes'
import { DailyForecast } from '@/types/weatherType'
import { format } from 'date-fns'

const DailyForecastSection = ({
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
  // Get the next 10 days of data
  const next10Days = dailyForecast.time.slice(0, 10).map((time, index) => ({
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

  return (
    <div className="py-6 px-9 bg-gray-400 h-full w-full rounded-[20px] flex flex-col gap-6 text-white">
      <div className="flex flex-col">
        <p className="text-xl font-[700]">10-Day Forecast</p>
        <p className="text-sm">
          {location.name}, {location.country}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {next10Days.map((day, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-500/30 p-4 rounded-lg"
          >
            <div className="w-1/6">
              <p className="font-medium">{format(new Date(day.time), 'EEE')}</p>
              <p className="text-sm">{format(new Date(day.time), 'MMM d')}</p>
            </div>

            <div className="w-1/6 text-center">
              <p className="text-sm">
                {weatherCode[day.weatherCode as keyof typeof weatherCode]}
              </p>
            </div>

            <div className="w-1/6 text-center">
              <p className="text-sm">{day.precipitationProbability}%</p>
              <p className="text-xs">
                {day.precipitationSum} {dailyUnits.precipitation_sum}
              </p>
            </div>

            <div className="w-1/6 text-center">
              <p className="text-sm">
                {day.windSpeed} {dailyUnits.wind_speed_10m_max}
              </p>
            </div>

            <div className="w-2/6 flex justify-between items-center">
              <p className="text-sm text-blue-200">
                {day.minTemp}
                {dailyUnits.temperature_2m_min}
              </p>
              <div className="w-full mx-2 h-1 bg-gray-600 rounded-full">
                <div
                  className="h-1 bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                  style={{
                    width: '100%',
                  }}
                ></div>
              </div>
              <p className="text-sm text-red-200">
                {day.maxTemp}
                {dailyUnits.temperature_2m_max}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DailyForecastSection
