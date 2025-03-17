'use client'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './_components/ui/tabs'
import Summary from './_components/summary/summary'
import Today from './_components/today/today'
import Hourly from './_components/hourly/hourly'
import TenDay from './_components/tenday/tenday'
import Weekend from './_components/weekend/weekend'
import Monthly from './_components/monthly/monthly'
import Radar from './_components/radar/radar'
import BeatLoader from 'react-spinners/BeatLoader'
export default function Home() {
  const [activeTab, setActiveTab] = useState('summary')
  const [isTabChanging, setIsTabChanging] = useState(false)

  const tabs = [
    {
      value: 'summary',
      label: 'Summary',
      content: <Summary />,
    },
    {
      value: 'today',
      label: 'Today',
      content: <Today />,
    },
    {
      value: 'hourly',
      label: 'Hourly',
      content: <Hourly />,
    },
    {
      value: '10day',
      label: '10 Day',
      content: <TenDay />,
    },
    {
      value: 'weekend',
      label: 'Weekend',
      content: <Weekend />,
    },
    {
      value: 'monthly',
      label: 'Monthly',
      content: <Monthly />,
    },
    {
      value: 'radar',
      label: 'Radar',
      content: <Radar />,
    },
  ]

  const handleTabChange = (value: string) => {
    setIsTabChanging(true)
    setActiveTab(value)

    // Simulate tab change delay
    setTimeout(() => {
      setIsTabChanging(false)
    }, 300)
  }

  return (
    <Tabs
      defaultValue="summary"
      className="w-full"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className="flex flex-row justify-center space-x-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-sm font-medium w-1/6 text-accent-foreground"
            id={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="pt-10 px-24 pb-20 min-h-[400px]">
            {isTabChanging ? (
              <div className="flex justify-center items-center h-[400px]">
                <BeatLoader color="#000000" size={20} />
              </div>
            ) : (
              tab.content
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
