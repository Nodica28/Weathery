'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'

const RadarMapSection = ({
  location,
}: {
  location: {
    name: string
    country: string
    latitude: number
    longitude: number
  }
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Set mounted state to true
    setIsMounted(true)

    // Cleanup function
    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    // Only run this effect when the component is mounted and mapRef is available
    if (!isMounted || !mapRef.current) return

    // Dynamic import to avoid SSR issues
    let map: any = null

    const initializeMap = async () => {
      try {
        // Import Leaflet dynamically
        const L = await import('leaflet')

        // Fix Leaflet's default icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl

        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        })

        // Initialize map
        map = L.map(mapRef.current as HTMLElement).setView(
          [location.latitude, location.longitude],
          8,
        )

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Add marker for current location
        L.marker([location.latitude, location.longitude])
          .addTo(map)
          .bindPopup(`${location.name}, ${location.country}`)
          .openPopup()

        // Try to add Rain Viewer radar layer
        try {
          const response = await fetch(
            'https://api.rainviewer.com/public/weather-maps.json',
          )
          const apiData = await response.json()

          // Log the API data for debugging
          console.log('RainViewer API data:', apiData)

          // Check if we have the host and radar data
          if (apiData && apiData.host && apiData.radar) {
            const host = apiData.host

            // Get the most recent past radar frame
            if (apiData.radar.past && apiData.radar.past.length > 0) {
              const mostRecentPast =
                apiData.radar.past[apiData.radar.past.length - 1]

              // Construct the radar URL using the new format
              const radarUrl = `${host}/v2/radar/${mostRecentPast.time}/256/{z}/{x}/{y}/2/1_1.png`
              console.log('Using radar URL:', radarUrl)

              // Add the radar layer
              L.tileLayer(radarUrl, {
                opacity: 0.6,
              }).addTo(map)
            }
            // If no past data, try nowcast
            else if (
              apiData.radar.nowcast &&
              apiData.radar.nowcast.length > 0
            ) {
              const firstNowcast = apiData.radar.nowcast[0]

              // Construct the radar URL using the nowcast data
              const radarUrl = `${host}/v2/radar/${firstNowcast.time}/256/{z}/{x}/{y}/2/1_1.png`
              console.log('Using nowcast URL:', radarUrl)

              // Add the radar layer
              L.tileLayer(radarUrl, {
                opacity: 0.6,
              }).addTo(map)
            } else {
              console.error('No radar frames available')
            }
          } else {
            console.error('Incomplete radar data:', apiData)
          }
        } catch (err) {
          console.error('Error loading radar data:', err)
          // Continue with the map even if radar fails
        }
      } catch (err) {
        console.error('Error initializing map:', err)
      }
    }

    // Initialize the map
    initializeMap()

    // Cleanup function
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [isMounted, location]) // Re-run when isMounted or location changes

  return (
    <div className="py-6 px-9 bg-gray-400 h-full w-full rounded-[20px] flex flex-col gap-6 text-white">
      <div className="flex flex-col">
        <p className="text-xl font-[700]">Weather Radar</p>
        <p className="text-sm">
          {location.name}, {location.country}
        </p>
      </div>

      <div
        ref={mapRef}
        className="h-[600px] w-full rounded-lg overflow-hidden"
        style={{ display: isMounted ? 'block' : 'none' }}
      ></div>

      {!isMounted && (
        <div className="h-[600px] w-full rounded-lg flex items-center justify-center bg-gray-500/30">
          <p>Loading map...</p>
        </div>
      )}

      <div className="flex justify-between items-center bg-gray-500/30 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
          <span>Light Rain</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Moderate Rain</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
          <span>Heavy Rain</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span>Sleet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <span>Snow</span>
        </div>
      </div>
    </div>
  )
}

export default RadarMapSection
