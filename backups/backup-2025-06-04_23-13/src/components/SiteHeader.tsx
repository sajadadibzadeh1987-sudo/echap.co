'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { mainMenu, MenuItem, MegaMenuSection } from '@/data/menu'

export default function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(title)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between relative">
        {/* لوگو */}
        <div className="text-2xl font-bold text-gray-900">چاپا</div>

        {/* منو وسط‌چین */}
        <nav className="hidden md:flex gap-6 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          {mainMenu.map((item: MenuItem) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-gray-700 hover:text-black transition">{item.title}</button>

              {/* منوی جمع‌وجور با موقعیت دقیق */}
              {item.megaMenu && activeMenu === item.title && (
                <div className="absolute top-full right-0 bg-white border border-gray-200 shadow-xl rounded-xl animate-fadeIn py-4 min-w-[320px] z-50">
                  <div className="px-6 text-right">
                    {item.megaMenu.map((section: MegaMenuSection) => (
                      <div key={section.heading} className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">{section.heading}</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {section.items.map((sub, i) => (
                            <li key={i}>
                              <Link href={sub.link} className="hover:text-black transition">
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  )
}
