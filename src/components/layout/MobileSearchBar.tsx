// src/components/layout/MobileSearchBar.tsx
"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface MobileSearchBarProps {
  onFilterClick?: () => void;
  placeholder?: string;
}

export default function MobileSearchBar({
  onFilterClick,
  placeholder = "جستجو در آگهی‌های ایچاپ...",
}: MobileSearchBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // اگر از بالای صفحه ~50px اسکرول شد، حالت نیمه شفاف فعال می‌شود
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        flex md:hidden items-center gap-2
        px-4 py-3
        sticky top-0 z-40
        border-b border-gray-200
        backdrop-blur-md
        transition-all duration-300
        ${isScrolled ? "bg-white/80 shadow-sm" : "bg-white"}
      `}
      dir="rtl"
    >
      {/* کادر جستجو */}
      <div
        className="
          flex items-center gap-2
          flex-1
          rounded-full
          bg-gray-100/90
          px-3 py-2
          transition
        "
      >
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          className="
            w-full bg-transparent border-none outline-none
            text-sm text-gray-800 placeholder:text-gray-400
          "
        />
      </div>

      {/* دکمه فیلتر */}
      <button
        type="button"
        onClick={onFilterClick}
        className="
          flex items-center justify-center
          w-10 h-10
          rounded-full
          bg-gray-100/90
          border border-gray-200
          text-gray-700
          hover:bg-gray-200
          active:bg-gray-300
          transition
        "
        aria-label="فیلتر"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
