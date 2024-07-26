'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { getLocation } from '@/actions/geolocation'
import { GeoLocateData } from '@/types/locationType'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './table'
import Image from 'next/image'
import React from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState<GeoLocateData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    try {
      const results = await getLocation(searchTerm)
      setSearchResults(results)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (location: GeoLocateData) => {
    const locationInfo = {
      name: location.locations[0].name,
      country: location.locations[0].country,
      latitude: location.locations[0].latitude,
      longitude: location.locations[0].longitude,
    }

    localStorage.setItem('selectedLocation', JSON.stringify(locationInfo))
    window.location.reload()
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-blue-500"
            readOnly
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Enter Location Name</DialogTitle>
        <DialogDescription>
          Please enter the name of the location you want to track
        </DialogDescription>
        <input
          type="text"
          placeholder="Search location..."
          className="w-full py-2 px-4 text-gray-700 bg-white border rounded-md focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <BeatLoader />
          </div>
        ) : (
          searchResults &&
          Object.keys(searchResults).length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Population</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(searchResults.locations).map(([key, value]) => (
                  <DialogClose key={key} asChild>
                    <TableRow
                      onClick={() =>
                        handleLocationSelect({ locations: [value] })
                      }
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <Image
                          src={`https://open-meteo.com/images/country-flags/${value.country_code}.svg`}
                          alt="flag"
                          width={24}
                          height={24}
                        />
                      </TableCell>
                      <TableCell>{value.name}</TableCell>
                      <TableCell>{value.latitude}</TableCell>
                      <TableCell>{value.longitude}</TableCell>
                      <TableCell>{value.country}</TableCell>
                      <TableCell>{value.population}</TableCell>
                    </TableRow>
                  </DialogClose>
                ))}
              </TableBody>
            </Table>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SearchBar
