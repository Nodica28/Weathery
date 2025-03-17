import { weatherCode } from '@/app/_constants/weatherCodes'

const CurrentWeatherSection = ({
  currentUnits,
  currentWeather,
  location,
}: {
  currentUnits: {
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
  currentWeather: {
    apparent_temperature: number
    precipitation: number
    relative_humidity_2m: number
    temperature_2m: number
    time: string
    weather_code: number
    wind_direction_10m: number
    wind_gusts_10m: number
    wind_speed_10m: number
  }
  location: { name: string; country: string }
}) => {
  return (
    <div className="py-6 px-9 bg-gray-400 h-full w-full rounded-[20px] flex justify-between text-white">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <p className="text-xl font-[700]">Current Weather</p>
          <p className="text-sm">
            {location.name}, {location.country}
          </p>
          <p className="text-sm">
            {new Date(currentWeather.time)
              .toLocaleString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'UTC',
              })
              .replace(',', '')
              .replace(/:00/, '')
              .replace(' at', ' |')}{' '}
            UST
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-8xl font-bold">
            {currentWeather.temperature_2m}
            {currentUnits.temperature_2m}
          </p>
          <div className="flex gap-32">
            <div className="">
              <p className="text-sm">Weather Forecast</p>
              <p className="text-xl">
                {
                  weatherCode[
                    currentWeather.weather_code as keyof typeof weatherCode
                  ]
                }
              </p>
              <p className="text-sm">
                Feels like {currentWeather.apparent_temperature}
                {currentUnits.apparent_temperature}
              </p>
            </div>
            <div className="">
              <p className="text-sm">Precipitation</p>
              <p className="text-xl">
                {currentWeather.precipitation}
                {currentUnits.precipitation}
              </p>
            </div>
            <div className="">
              <p className="text-sm">Humidity</p>
              <p className="text-xl">
                {currentWeather.relative_humidity_2m}
                {currentUnits.relative_humidity_2m}
              </p>
            </div>
            <div className="">
              <p className="text-sm">Wind</p>
              <p className="text-xl">
                {currentWeather.wind_speed_10m}
                {currentUnits.wind_speed_10m} |{' '}
                {currentWeather.wind_direction_10m}
                {currentUnits.wind_direction_10m}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeatherSection
