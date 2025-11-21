export interface MegaMenuSection {
  heading: string
  items: { title: string; link: string }[]
}

export interface MenuItem {
  title: string
  link?: string
  megaMenu?: MegaMenuSection[]
}

export const mainMenu: MenuItem[] = [
  {
    title: "درباره ما",
    megaMenu: [
      {
        heading: "درباره ما",
        items: [
          { title: "تاریخچه", link: "#" },
          { title: "تیم ما", link: "#" },
          { title: "تماس با ما", link: "#" },
        ]
      }
    ]
  },
  {
    title: "فروشگاه",
    megaMenu: [
      {
        heading: "محصولات",
        items: [
          { title: "جعبه‌سازی", link: "#" },
          { title: "لیبل", link: "#" },
          { title: "بروشور", link: "#" },
        ]
      }
    ]
  },
  {
    title: "آگهی‌ها",
    megaMenu: [
      {
        heading: "درج آگهی",
        items: [
          { title: "استخدام", link: "#" },
          { title: "ماشین‌آلات", link: "#" },
          { title: "نیازمندی‌ها", link: "#" },
        ]
      }
    ]
  },
]
