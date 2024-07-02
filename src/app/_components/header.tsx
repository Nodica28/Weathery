import weathery_icon from '@/app/_assets/weathery-logo.png'
import Image from 'next/image'
import { NavigationMenu } from './ui/navigation-menu'

export default function Header() {
  return (
    <div className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
              src={weathery_icon}
              alt="Your Company"
              height={150}
              width={150}
            />
          </a>
        </div>
        <div className="flex lg:flex-1">
          <NavigationMenu />
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">→</span>
          </a>
        </div>
      </nav>
    </div>
  )
}
