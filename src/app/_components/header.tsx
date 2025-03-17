'use client'
import weathery_logo from '@/app/_assets/weathery_logo.png'
import weathery_icon_only from '@/app/_assets/weathery_icon_only.svg'
import Image from 'next/image'
import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import SearchBar from './ui/search-bar'
import Link from 'next/link'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isCelsius, setIsCelsius] = useState(true)

  useEffect(() => {
    const storedUnit = localStorage.getItem('temperatureUnit')
    setIsCelsius(storedUnit !== 'fahrenheit')
  }, [])
  const features = [
    {
      title: 'Real-Time Alerts',
      href: '/docs/features/real-time-alerts',
      description:
        'Get instant notifications about severe weather conditions in your area.',
    },
    {
      title: 'Interactive Radar',
      href: '/docs/features/interactive-radar',
      description:
        'Visualize weather patterns and track storms with our interactive radar maps.',
    },
    {
      title: 'Customizable Widgets',
      href: '/docs/features/customizable-widgets',
      description:
        'Add weather widgets to your home screen and customize them to show the information you need.',
    },
    {
      title: 'Detailed Forecasts',
      href: '/docs/features/detailed-forecasts',
      description:
        'Access detailed weather forecasts for the next hours, days, and weeks.',
    },
    {
      title: 'Weather News',
      href: '/docs/features/weather-news',
      description:
        'Stay updated with the latest weather news and articles from our experts.',
    },
    {
      title: 'Personalized Experience',
      href: '/docs/features/personalized-experience',
      description:
        'Customize your weather app experience based on your preferences and location.',
    },
  ]

  const changeUnits = (checked: boolean) => {
    const unit = checked
      ? {
          temperature: 'fahrenheit',
          wind_speed: 'mph',
          precipitation: 'inch',
        }
      : {
          temperature: 'celsius',
          wind_speed: 'kph',
          precipitation: 'mm',
        }
    localStorage.setItem('measurementUnits', JSON.stringify(unit))
    setIsCelsius(!checked)
  }

  return (
    <div className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 list-none"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <Image
              src={weathery_logo}
              alt="Weathery"
              height={150}
              width={150}
            />
          </a>
        </div>
        <div className="flex lg:flex-1">
          <NavigationMenu>
            <NavigationMenuItem>
              <SearchBar />
            </NavigationMenuItem>
          </NavigationMenu>
        </div>
        <div className="flex">
          <NavigationMenu>
            <NavigationMenuItem className="flex items-center gap-2">
              <Label
                htmlFor="unit-switch"
                className={isCelsius ? 'font-bold' : ''}
              >
                °C
              </Label>
              <Switch
                id="unit-switch"
                checked={!isCelsius}
                onCheckedChange={changeUnits}
              />
              <Label
                htmlFor="unit-switch"
                className={!isCelsius ? 'font-bold' : ''}
              >
                °F
              </Label>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-start">
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[500px] ">
                  {features.map((feature) => (
                    <TooltipProvider key={feature.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ListItem
                            key={feature.title}
                            title={feature.title}
                            href={feature.href}
                          >
                            {feature.description}
                          </ListItem>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <div className="p-2 text-sm text-black bg-white rounded-md shadow-lg">
                            {feature.description}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Privacy</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Image
                          src={weathery_icon_only}
                          alt="Weathery Icon"
                          height={150}
                          width={150}
                          className="h-6 w-6"
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Privacy Policy
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Your privacy is important to us. Learn how we handle
                          your data and protect your information.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem title="Data Collection">
                    We collect minimal data necessary to provide accurate
                    weather information and improve your experience.
                  </ListItem>
                  <ListItem title="Data Usage">
                    Your data is used to personalize weather updates and enhance
                    app functionality. We never sell your data.
                  </ListItem>
                  <ListItem title="Your Rights">
                    Understand your rights regarding data privacy and how you
                    can manage your information with us.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>
      </nav>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <li>
            <NavigationMenuLink asChild>
              <a
                ref={ref}
                className={cn(
                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  className,
                )}
                {...props}
              >
                <div className="text-sm font-medium leading-none">{title}</div>

                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground cursor-pointer">
                  {children}
                </p>
              </a>
            </NavigationMenuLink>
          </li>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="p-2 text-sm text-black bg-white rounded-md shadow-lg">
            {children}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
ListItem.displayName = 'ListItem'
