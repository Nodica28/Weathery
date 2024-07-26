import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './_components/ui/tabs'
import Today from './_components/today'

export default function Home() {
  const tabs = [
    {
      value: 'today',
      label: 'Today',
      content: <Today />,
    },
    {
      value: 'hourly',
      label: 'Hourly',
      content: 'Hourly View',
    },
    {
      value: '10day',
      label: '10 Day',
      content: '10 Day View',
    },
    {
      value: 'weekend',
      label: 'Weekend',
      content: 'Weekend View',
    },
    {
      value: 'monthly',
      label: 'Monthly',
      content: 'Monthly View',
    },
    {
      value: 'radar',
      label: 'Radar',
      content: 'Radar View',
    },
  ]

  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="flex flex-row justify-center space-x-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-sm font-medium w-1/6 text-accent-foreground"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
