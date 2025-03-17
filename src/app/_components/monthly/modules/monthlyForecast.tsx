import { weatherCode } from '@/app/_constants/weatherCodes'
import { DailyForecast } from '@/types/weatherType'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns'

const MonthlyForecastSection = ({
  dailyForecast,
  location,
}: {
  dailyForecast: DailyForecast
  location: {
    name: string
    country: string
    latitude: number
    longitude: number
  }
}) => {
  // Get all days in the current month
  const today = new Date()
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  })

  // Map forecast data to days in month
  const monthData = daysInMonth.map((day) => {
    const forecastIndex = dailyForecast.time.findIndex((time) =>
      isSameDay(new Date(time), day),
    )

    if (forecastIndex !== -1) {
      return {
        date: day,
        maxTemp: dailyForecast.temperature_2m_max[forecastIndex],
        minTemp: dailyForecast.temperature_2m_min[forecastIndex],
        weatherCode: dailyForecast.weather_code[forecastIndex],
        precipitationProbability:
          dailyForecast.precipitation_probability_max[forecastIndex],
        hasData: true,
      }
    } else {
      return {
        date: day,
        hasData: false,
      }
    }
  })

  // Group by weeks
  const weeks: any[][] = []
  let currentWeek: any[] = []

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = daysInMonth[0].getDay()

  // Add empty slots for days before the first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null)
  }

  monthData.forEach((day) => {
    currentWeek.push(day)

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  // Add the last week if it's not complete
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  return (
    <div className="py-6 px-9 bg-gray-400 h-full w-full rounded-[20px] flex flex-col gap-6 text-white">
      <div className="flex flex-col">
        <p className="text-xl font-[700]">Monthly Forecast</p>
        <p className="text-sm">
          {location.name}, {location.country}
        </p>
        <p className="text-lg font-medium mt-2">{format(today, 'MMMM yyyy')}</p>
      </div>

      <div className="bg-gray-500/30 p-4 rounded-lg">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium">
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`aspect-square p-1 rounded-md ${
                  day
                    ? isSameDay(day.date, today)
                      ? 'bg-blue-500/50'
                      : 'bg-gray-600/30'
                    : 'bg-transparent'
                }`}
              >
                {day && (
                  <div className="h-full flex flex-col justify-between">
                    <div className="text-xs text-right">
                      {format(day.date, 'd')}
                    </div>

                    {day.hasData && (
                      <>
                        <div className="text-center text-xs">
                          {weatherCode[
                            day.weatherCode as keyof typeof weatherCode
                          ]?.slice(0, 3)}
                        </div>

                        <div className="flex justify-between text-xs">
                          <span className="text-blue-200">{day.minTemp}</span>
                          <span className="text-red-200">{day.maxTemp}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthlyForecastSection
