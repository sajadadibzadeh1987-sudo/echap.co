// src/config/adCategories.ts

// گروه‌های اصلی آگهی‌ها
export type AdGroup =
  | "JOB"
  | "FREELANCER"
  | "PRINT_SERVICE"
  | "MACHINE"
  | "MATERIAL"
  | "OTHER";

export interface AdCategoryConfig {
  slug: string;     // برای فیلتر و URL
  titleFa: string;  // عنوان قابل نمایش به کاربر
  group: AdGroup;
}

// لیبل فارسی گروه‌ها
export const AD_GROUP_LABELS: Record<AdGroup, string> = {
  JOB: "استخدام و همکاری",
  FREELANCER: "فریلنسر و پروژه‌ای",
  PRINT_SERVICE: "خدمات چاپ و بسته‌بندی",
  MACHINE: "ماشین‌آلات و تجهیزات",
  MATERIAL: "مواد مصرفی و ملزومات",
  OTHER: "سایر نیازمندی‌ها",
};

// دسته‌بندی‌های فعلی (می‌تونیم بعداً از پنل ادمین داینامیکش کنیم)
export const AD_CATEGORIES: AdCategoryConfig[] = [
  // --- استخدام و همکاری (JOB) ---
  { slug: "job-operator-offset", titleFa: "اپراتور چاپ افست", group: "JOB" },
  { slug: "job-operator-digital", titleFa: "اپراتور چاپ دیجیتال", group: "JOB" },
  { slug: "job-operator-flexo", titleFa: "اپراتور چاپ فلکسو / لیبل", group: "JOB" },
  { slug: "job-production-manager", titleFa: "ناظر چاپ / مسئول تولید", group: "JOB" },
  { slug: "job-sales-print", titleFa: "کارشناس فروش و بازاریابی چاپ", group: "JOB" },
  { slug: "job-graphic-designer", titleFa: "گرافیست و طراح بسته‌بندی", group: "JOB" },
  { slug: "job-bindery", titleFa: "نیروی صحافی و خدمات پس از چاپ", group: "JOB" },

  // --- فریلنسر (FREELANCER) ---
  { slug: "freelancer-graphic", titleFa: "طراح گرافیک چاپی (فریلنسر)", group: "FREELANCER" },
  { slug: "freelancer-packaging", titleFa: "طراح بسته‌بندی (فریلنسر)", group: "FREELANCER" },
  { slug: "freelancer-label", titleFa: "طراح لیبل و استیکر", group: "FREELANCER" },
  { slug: "freelancer-branding", titleFa: "لوگو و برندینگ", group: "FREELANCER" },

  // --- خدمات چاپ (PRINT_SERVICE) ---
  { slug: "service-offset", titleFa: "خدمات چاپ افست", group: "PRINT_SERVICE" },
  { slug: "service-digital", titleFa: "چاپ دیجیتال", group: "PRINT_SERVICE" },
  { slug: "service-flexo", titleFa: "چاپ لیبل و فلکسو", group: "PRINT_SERVICE" },
  { slug: "service-packaging-carton", titleFa: "بسته‌بندی مقوایی و کارتن", group: "PRINT_SERVICE" },
  { slug: "service-packaging-flexible", titleFa: "بسته‌بندی انعطاف‌پذیر (رول، لمینیت)", group: "PRINT_SERVICE" },
  { slug: "service-finishing", titleFa: "خدمات تکمیلی (سلفون، UV، طلاکوب...)", group: "PRINT_SERVICE" },

  // --- ماشین‌آلات (MACHINE) ---
  { slug: "machine-offset", titleFa: "دستگاه چاپ افست", group: "MACHINE" },
  { slug: "machine-digital", titleFa: "ماشین چاپ دیجیتال", group: "MACHINE" },
  { slug: "machine-flexo", titleFa: "دستگاه فلکسو / لیبل", group: "MACHINE" },
  { slug: "machine-diecut", titleFa: "دستگاه دایکات / برش", group: "MACHINE" },
  { slug: "machine-laminate", titleFa: "دستگاه لمینیت / سلفون", group: "MACHINE" },
  { slug: "machine-bindery", titleFa: "ماشین‌آلات صحافی", group: "MACHINE" },

  // --- مواد مصرفی (MATERIAL) ---
  { slug: "material-board", titleFa: "مقوا و کاغذ چاپ", group: "MATERIAL" },
  { slug: "material-ink", titleFa: "مرکب و حلال", group: "MATERIAL" },
  { slug: "material-plate", titleFa: "زینک، کلیشه، سیلندر", group: "MATERIAL" },
  { slug: "material-films", titleFa: "فیلم، سلفون، BOPP و ...", group: "MATERIAL" },
  { slug: "material-adhesives", titleFa: "چسب‌ها و لاک‌ها", group: "MATERIAL" },

  // --- سایر نیازمندی‌ها (OTHER) ---
  { slug: "other-partnership", titleFa: "مشارکت و سرمایه‌گذاری در چاپخانه", group: "OTHER" },
  { slug: "other-rent-space", titleFa: "اجاره فضا / سوله چاپخانه", group: "OTHER" },
  { slug: "other-general", titleFa: "سایر نیازمندی‌های صنعت چاپ", group: "OTHER" },
];
