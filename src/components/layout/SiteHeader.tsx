// src/components/header/SiteHeader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  User,
  Home,
  LogOut,
  MapPin,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import useModalStore from "@/hooks/use-modal-store";

interface MegaMenuLink {
  label: string;
  href: string;
  description?: string;
}

interface MegaMenuSection {
  title: string;
  links: MegaMenuLink[];
}

interface MegaMenuItem {
  id: string;
  label: string;
  href?: string;
  sections: MegaMenuSection[];
}

// نوع هوک مودال بر اساس ساختار فعلی پروژه
interface AuthModalStore {
  isOpen: boolean;
  type: string | null;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
}

const megaMenuItems: MegaMenuItem[] = [
  {
    id: "services",
    label: "خدمات چاپ",
    href: "/services",
    sections: [
      {
        title: "چاپ افست و دیجیتال",
        links: [
          {
            label: "چاپ افست شیت",
            href: "/services/offset",
            description: "کارتن، جعبه، لیبل، بروشور و کاتالوگ",
          },
          {
            label: "چاپ دیجیتال",
            href: "/services/digital",
            description: "تیراژ پایین، تحویل فوری، پرینت رنگی",
          },
          {
            label: "بسته‌بندی اختصاصی",
            href: "/services/packaging",
            description: "بسته‌بندی محصولات لوکس و صنعتی",
          },
        ],
      },
      {
        title: "خدمات تکمیلی",
        links: [
          {
            label: "صحافی و تا",
            href: "/services/bindery",
            description: "تا، صحافی، برش، شماره‌زنی و…",
          },
          {
            label: "UV، سلفون، طلاکوب",
            href: "/services/finishing",
            description: "خدمات تکمیلی ویژه و لوکس",
          },
          {
            label: "مشاوره چاپ",
            href: "/services/consulting",
            description: "انتخاب متریال، بهینه‌سازی هزینه، اجرای پروژه",
          },
        ],
      },
    ],
  },
  {
    id: "market",
    label: "بازار ایچاپ",
    href: "/market",
    sections: [
      {
        title: "نیازمندی‌ها و آگهی‌ها",
        links: [
          {
            label: "آگهی‌های استخدام",
            href: "/ads?group=JOB",
            description: "فرصت‌های شغلی صنعت چاپ و بسته‌بندی",
          },
          {
            label: "خرید و فروش ماشین‌آلات",
            href: "/ads?group=MACHINE",
            description: "ماشین‌آلات نو و دست‌دوم چاپ و بسته‌بندی",
          },
          {
            label: "سایر آگهی‌ها",
            href: "/ads",
            description: "مواد مصرفی، قطعات یدکی، خدمات متفرقه",
          },
        ],
      },
      {
        title: "شبکه متخصصان",
        links: [
          {
            label: "فریلنسرها",
            href: "/freelancers",
            description: "طراحان، ناظران چاپ، اپراتورهای مجرب",
          },
          {
            label: "چاپخانه‌ها",
            href: "/printers",
            description: "معرفی چاپخانه‌ها بر اساس خدمات و ظرفیت",
          },
          {
            label: "تأمین‌کنندگان",
            href: "/suppliers",
            description: "کاغذ، مرکب، مقوا، زینک و ملزومات چاپ",
          },
        ],
      },
    ],
  },
  {
    id: "tools",
    label: "ابزارها و سامانه‌ها",
    href: "/tools",
    sections: [
      {
        title: "ابزارهای محاسبه",
        links: [
          {
            label: "محاسبه تیراژ و مصرف",
            href: "/tools/calculators/consumption",
            description: "تخمین مصرف کاغذ، مقوا و مرکب",
          },
          {
            label: "محاسبه قیمت سفارش",
            href: "/tools/calculators/pricing",
            description: "برآورد قیمت تمام‌شده سفارش",
          },
        ],
      },
      {
        title: "سامانه‌های مدیریتی",
        links: [
          {
            label: "داشبورد چاپخانه",
            href: "/dashboard/printer",
            description: "مدیریت سفارش‌ها، ایستگاه‌ها و ظرفیت تولید",
          },
          {
            label: "پروفایل کسب‌وکار",
            href: "/dashboard/business-profile",
            description: "معرفی برند، مشتریان و نمونه‌کارها",
          },
        ],
      },
    ],
  },
];

// شهرها (مشابه CITIES در AdsMobileFilters)
const CITY_OPTIONS = ["تهران", "کرج", "اصفهان", "شیراز", "تبریز", "مشهد"];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isHoveringPanel, setIsHoveringPanel] = useState(false);

  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [city, setCity] = useState("تهران");
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const { openModal } = useModalStore() as unknown as AuthModalStore;

  const handleAuthClick = () => {
    openModal("auth");
  };

  const handleLogoutClick = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // انتخاب شهر → ست شدن روی /ads?city=...
  const handleCitySelect = (selected: string) => {
    setCity(selected);
    setIsCityMenuOpen(false);

    const params = new URLSearchParams(searchParams?.toString());
    params.set("city", selected);

    router.push(`/ads?${params.toString()}`);
  };

  // اسکرول شفاف/سایه هدر
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // جستجوی خودکار → /ads?q=...
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchTerm.trim();
      const params = new URLSearchParams(searchParams?.toString());

      if (!trimmed) {
        // حذف q
        params.delete("q");

        if (pathname.startsWith("/ads")) {
          const qs = params.toString();
          router.push(qs ? `/ads?${qs}` : "/ads");
        }
        return;
      }

      params.set("q", trimmed);
      router.push(`/ads?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, pathname, router, searchParams]);

  const clearHoverTimeout = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const openMenu = (id: string) => {
    clearHoverTimeout();
    setActiveMenuId(id);
    setIsHoveringPanel(true);
  };

  const scheduleCloseMenu = () => {
    clearHoverTimeout();
    hoverTimeout.current = setTimeout(() => {
      setIsHoveringPanel(false);
      setActiveMenuId(null);
    }, 180);
  };

  const activeItem = megaMenuItems.find((item) => item.id === activeMenuId);

  // کامپوننت کوچک انتخاب شهر (در دسکتاپ و موبایل استفاده می‌شود)
  const CitySelector = ({ compact = false }: { compact?: boolean }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsCityMenuOpen((prev) => !prev)}
        className={`
          inline-flex items-center gap-1 rounded-full border border-gray-200
          bg-white px-3 py-1.5 text-xs font-medium text-gray-700
          hover:bg-gray-50 transition
          ${compact ? "min-w-[78px] justify-center" : "min-w-[100px]"}
        `}
      >
        <MapPin className="w-3.5 h-3.5 text-gray-500" />
        <span className="truncate">{city}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isCityMenuOpen && (
        <div
          className="absolute right-0 mt-1 w-40 rounded-2xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden"
          dir="rtl"
        >
          {CITY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCitySelect(c)}
              className={`w-full px-3 py-2 text-right text-xs ${
                c === city
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header
      className={`
        sticky top-0 z-50
        backdrop-blur-md border-b border-gray-200
        transition-all duration-300
        ${isScrolled ? "bg-white/90 shadow-sm" : "bg-white/70"}
      `}
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* هدر دسکتاپ (مگا منو) */}
        <div className="hidden md:flex h-16 items-center justify-between gap-6">
          {/* لوگو / برند */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="ایچاپ - صفحه اصلی"
            >
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-gray-900 text-sm">
                  ECHAP
                </span>
                <span className="text-[11px] text-gray-500">
                  اکوسیستم صنعت چاپ و مشاغل وابسته
                </span>
              </div>
            </Link>
          </div>

          {/* منوی وسط (مگا منو) */}
          <nav className="flex-1 flex items-center justify-center">
            <ul className="flex items-center gap-6 text-sm font-medium text-gray-800">
              {megaMenuItems.map((item) => {
                const isActive =
                  pathname.startsWith(item.href || "") ||
                  activeMenuId === item.id;
                return (
                  <li key={item.id} className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => openMenu(item.id)}
                      onMouseLeave={scheduleCloseMenu}
                      className={`
                        inline-flex items-center gap-1 py-1
                        transition-colors
                        ${
                          isActive
                            ? "text-black"
                            : "text-gray-700 hover:text-black"
                        }
                      `}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`
                          w-4 h-4 transition-transform duration-200
                          ${activeMenuId === item.id ? "rotate-180" : ""}
                        `}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* سمت چپ: خانه، جستجو، خروج، ورود/پروفایل */}
          <div className="flex items-center gap-3">
            {/* خانه */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label="صفحه اصلی"
            >
              <Home className="w-4 h-4 text-gray-700" />
            </button>

            {/* جستجو دسکتاپ (باز/بسته شدن کادر) */}
            <button
              type="button"
              onClick={() => setShowDesktopSearch((prev) => !prev)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label="جستجو در ایچاپ"
            >
              <Search className="w-4 h-4 text-gray-700" />
            </button>

            {/* خروج در صورت لاگین بودن */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 transition"
                aria-label="خروج"
              >
                <LogOut className="w-4 h-4 text-gray-700" />
              </button>
            )}

            {/* ورود / ثبت‌نام یا پروفایل من */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-sm text-gray-800 hover:bg-gray-50 transition"
              >
                <User className="w-4 h-4" />
                <span>پروفایل من</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAuthClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-sm text-gray-800 hover:bg-gray-50 transition"
              >
                <User className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}
          </div>
        </div>

        {/* کادر جستجوی دسکتاپ (زیر هدر، وقتی آیکون جستجو فعال است) */}
        {showDesktopSearch && (
          <div className="hidden md:flex items-center justify-end pb-3">
            <div className="w-full max-w-xl flex gap-2">
              {/* انتخاب شهر */}
              <CitySelector />

              {/* سرچ با هوشمند سازی q روی /ads */}
              <div className="flex items-center gap-2 flex-1 rounded-full bg-gray-100 px-3 py-2 shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در آگهی‌های ایچاپ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* نوار جستجو و انتخاب شهر موبایل (بدون آیکون فیلتر، تمام عرض) */}
        <div
          className={`
            flex md:hidden items-center
            px-4 py-3
            border-b border-gray-200
            sticky top-0 z-40 backdrop-blur-md
            transition-all duration-300
            ${isScrolled ? "bg-white/80 shadow-sm" : "bg-white/100 shadow-none"}
          `}
        >
          <div className="flex w-full items-center gap-2">
            {/* انتخاب شهر موبایل */}
            <CitySelector compact />

            {/* سرچ موبایل تمام عرض باقی‌مانده */}
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
                placeholder="جستجو در آگهی‌های ایچاپ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full bg-transparent border-none outline-none
                  text-sm text-gray-800 placeholder:text-gray-400
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* پنل مگا منو (فقط دسکتاپ) */}
      <AnimatePresence>
        {activeItem && isHoveringPanel && (
          <motion.div
            className="hidden md:block absolute left-0 right-0 top-16 border-t border-gray-200 bg-white/95 backdrop-blur-md z-40"
            onMouseEnter={() => {
              clearHoverTimeout();
              setIsHoveringPanel(true);
            }}
            onMouseLeave={scheduleCloseMenu}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mx-auto max-w-7xl px-6 py-5">
              <div className="grid grid-cols-2 gap-8">
                {activeItem.sections.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.links.map((link) => {
                        const isLinkActive = pathname.startsWith(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`
                              flex flex-col rounded-xl p-3
                              transition
                              ${
                                isLinkActive
                                  ? "bg-gray-100 border border-gray-200"
                                  : "hover:bg-gray-50"
                              }
                            `}
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {link.label}
                            </span>
                            {link.description && (
                              <span className="text-xs text-gray-500 mt-0.5">
                                {link.description}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
