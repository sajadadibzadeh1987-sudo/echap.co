/* eslint-disable @typescript-eslint/no-explicit-any */

// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

// برای اینکه TypeScript روی category غر نزند:
const prisma = new PrismaClient() as any;

type SeedCategory = {
  slug: string;
  titleFa: string;
  group: string; // باید با enum CategoryGroup در schema یکی باشد
  parentSlug?: string;
  sortOrder?: number;
};

const categories: SeedCategory[] = [
  // ========================
  // MACHINERY - ماشین‌آلات
  // ========================
  {
    slug: "machinery",
    titleFa: "ماشین‌آلات و تجهیزات چاپ",
    group: "MACHINERY",
    sortOrder: 1,
  },
  {
    slug: "machinery-printing",
    titleFa: "ماشین‌آلات چاپ",
    group: "MACHINERY",
    parentSlug: "machinery",
  },
  {
    slug: "machinery-offset",
    titleFa: "ماشین چاپ افست شیت",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-web-offset",
    titleFa: "ماشین چاپ افست رول (وب)",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-flexo",
    titleFa: "ماشین چاپ فلکسو",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-gravure",
    titleFa: "ماشین چاپ هلیو / روتوگراور",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-screen",
    titleFa: "ماشین چاپ سیلک",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-pad",
    titleFa: "ماشین چاپ تامپو",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-uv-flatbed",
    titleFa: "ماشین چاپ UV فلت‌بد",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-label-press",
    titleFa: "ماشین چاپ لیبل / رول لیبل",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },
  {
    slug: "machinery-metal-print",
    titleFa: "ماشین چاپ فلزات",
    group: "MACHINERY",
    parentSlug: "machinery-printing",
  },

  {
    slug: "machinery-digital",
    titleFa: "ماشین‌آلات چاپ دیجیتال",
    group: "MACHINERY",
    parentSlug: "machinery",
  },
  {
    slug: "digital-production-printer",
    titleFa: "پرینتر دیجیتال تولیدی (Production)",
    group: "MACHINERY",
    parentSlug: "machinery-digital",
  },
  {
    slug: "digital-photo-printer",
    titleFa: "پرینتر دیجیتال عکاسی",
    group: "MACHINERY",
    parentSlug: "machinery-digital",
  },
  {
    slug: "digital-wide-format",
    titleFa: "چاپ عریض (واید فرمت)",
    group: "MACHINERY",
    parentSlug: "machinery-digital",
  },
  {
    slug: "digital-label-printer",
    titleFa: "پرینتر دیجیتال لیبل",
    group: "MACHINERY",
    parentSlug: "machinery-digital",
  },

  {
    slug: "machinery-postpress",
    titleFa: "ماشین‌آلات صحافی و پس از چاپ",
    group: "MACHINERY",
    parentSlug: "machinery",
  },
  {
    slug: "machinery-guillotine",
    titleFa: "گیوتین برش کاغذ",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-folding",
    titleFa: "ماشین تا‌کن / فولدر",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-stitching",
    titleFa: "ماشین دوخت / منگنه (Stitching)",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-perfect-binding",
    titleFa: "دستگاه صحافی گرم / چسب گرم",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-three-knife",
    titleFa: "سه‌تیغ / تری نایف",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-die-cut",
    titleFa: "ماشین دایکات (فلت‌بد، روتاری، لترپرس)",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-hot-foil",
    titleFa: "ماشین طلاکوب / هات فویل",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-laminating",
    titleFa: "ماشین لمینیت / سلفون‌کشی",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-box-gluing",
    titleFa: "ماشین جعبه‌چسبانی",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },
  {
    slug: "machinery-bag-making",
    titleFa: "ماشین ساخت ساک دستی و کیسه",
    group: "MACHINERY",
    parentSlug: "machinery-postpress",
  },

  {
    slug: "machinery-prepress",
    titleFa: "ماشین‌آلات پیش از چاپ",
    group: "MACHINERY",
    parentSlug: "machinery",
  },
  {
    slug: "machinery-ctp",
    titleFa: "سیستم CTP / زینک‌ساز",
    group: "MACHINERY",
    parentSlug: "machinery-prepress",
  },
  {
    slug: "machinery-imagesetter",
    titleFa: "ایمیج‌ستر / فیلم‌ساز",
    group: "MACHINERY",
    parentSlug: "machinery-prepress",
  },
  {
    slug: "machinery-plate-processor",
    titleFa: "پروسسور زینک / پلیت پروسسور",
    group: "MACHINERY",
    parentSlug: "machinery-prepress",
  },

  // ========================
  // SUPPLIER - تأمین‌کننده
  // ========================
  {
    slug: "supplier",
    titleFa: "تأمین‌کنندگان و مواد مصرفی",
    group: "SUPPLIER",
    sortOrder: 2,
  },
  {
    slug: "supplier-paper-board",
    titleFa: "کاغذ و مقوا",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-paper-printing",
    titleFa: "کاغذ تحریر، گلاسه، تحریر گرم بالا",
    group: "SUPPLIER",
    parentSlug: "supplier-paper-board",
  },
  {
    slug: "supplier-board-folding-carton",
    titleFa: "مقوای ایندربرد و Folding Carton",
    group: "SUPPLIER",
    parentSlug: "supplier-paper-board",
  },
  {
    slug: "supplier-corrugated",
    titleFa: "کارتن فلوت و سینگل فیس",
    group: "SUPPLIER",
    parentSlug: "supplier-paper-board",
  },
  {
    slug: "supplier-film-plastic",
    titleFa: "فیلم‌های پلاستیکی (BOPP / PVC / PET / IML)",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-label-stock",
    titleFa: "لیبل و استیکر (پشت چسب‌دار)",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-ink",
    titleFa: "مرکب و جوهر چاپ",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-coating",
    titleFa: "وارنیش، لاک و کوتینگ",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-hot-foil",
    titleFa: "انواع هات فویل و فویل سرد",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-chemicals",
    titleFa: "مواد شیمیایی و شوینده‌های چاپ",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-ctp-plate",
    titleFa: "زینک، پلیت، فیلم و مواد لیتوگرافی",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-spare-parts",
    titleFa: "قطعات و لوازم یدکی ماشین‌آلات",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-consumables",
    titleFa:
      "لوازم مصرفی ماشین چاپ (بلانکت، رول آب، لاستیک و...)",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-packaging-material",
    titleFa:
      "مواد اولیه بسته‌بندی (گونی، فیلم، لفاف، کارتن خام و...)",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },
  {
    slug: "supplier-adhesives",
    titleFa: "چسب‌ها (سفید، هات‌ملت، سرد و...)",
    group: "SUPPLIER",
    parentSlug: "supplier",
  },

  // ========================
  // PRINT_SERVICE - خدمات چاپ
  // ========================
  {
    slug: "print-service",
    titleFa: "خدمات چاپ",
    group: "PRINT_SERVICE",
    sortOrder: 3,
  },
  {
    slug: "print-offset",
    titleFa: "چاپ افست شیت",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-web-offset",
    titleFa: "چاپ افست رول / نشریه",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-digital",
    titleFa: "چاپ دیجیتال (کارت ویزیت، تراکت، بروشور...)",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-large-format",
    titleFa: "چاپ لارج فرمت (بنر، فلکس، مش، استیکر)",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-flexo",
    titleFa: "چاپ فلکسو روی رول بسته‌بندی",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-gravure",
    titleFa: "چاپ هلیو / روتوگراور",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-screen",
    titleFa: "چاپ سیلک (پارچه، شیت، شیشه و...)",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-pad",
    titleFa: "چاپ تامپو روی قطعات و هدایای تبلیغاتی",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-uv-flatbed",
    titleFa: "چاپ UV فلت‌بد روی متریال سخت",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-label",
    titleFa: "چاپ لیبل رول و شیت",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-metal",
    titleFa: "چاپ روی فلزات (قوطی، درب، بشکه و...)",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },
  {
    slug: "print-promotional",
    titleFa: "چاپ هدایای تبلیغاتی (خودکار، لیوان، دفترچه و...)",
    group: "PRINT_SERVICE",
    parentSlug: "print-service",
  },

  // ========================
  // SERVICE - خدمات تکمیلی
  // ========================
  {
    slug: "service-postpress",
    titleFa: "خدمات پس از چاپ و تکمیلی",
    group: "SERVICE",
    sortOrder: 4,
  },
  {
    slug: "service-diecut",
    titleFa: "خدمات دایکات و لترپرس",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-laminating",
    titleFa: "خدمات سلفون‌کشی و لمینیت",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-uv",
    titleFa: "خدمات UV موضعی و برجسته",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-hybrid",
    titleFa: "خدمات چاپ هایبرید (ترکیبی افست + دیجیتال / UV)",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-hot-foil",
    titleFa: "خدمات طلاکوب / هات فویل",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-box-gluing",
    titleFa: "خدمات جعبه‌چسبانی و چسب گرم",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-hand-made",
    titleFa: "خدمات ساخت دستی جعبه و بسته‌بندی",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-bag-making",
    titleFa: "خدمات ساخت ساک دستی",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-binding",
    titleFa:
      "خدمات صحافی (چسب گرم، منگنه، دوخت، سیمی و...)",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },
  {
    slug: "service-label-sticker",
    titleFa: "خدمات لیبل و استیکر (برش، دایکات، طلاکوب)",
    group: "SERVICE",
    parentSlug: "service-postpress",
  },

  // ========================
  // FREELANCER
  // ========================
  {
    slug: "freelancer",
    titleFa: "فریلنسر و نیروهای پروژه‌ای",
    group: "FREELANCER",
    sortOrder: 5,
  },
  {
    slug: "freelancer-graphic-designer",
    titleFa: "طراح گرافیک",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-packaging-designer",
    titleFa: "طراح بسته‌بندی و جعبه",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-logo-designer",
    titleFa: "طراح لوگو و هویت بصری",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-label-designer",
    titleFa: "طراح لیبل و لیبل مواد غذایی / شوینده",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-layout-designer",
    titleFa: "طراح کاتالوگ، بروشور و مجله",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-prepress",
    titleFa:
      "متخصص پیش از چاپ (Prepress / CTP / فرم‌بندی)",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-print-consultant",
    titleFa: "مشاور چاپ و بسته‌بندی",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-social-media-design",
    titleFa: "طراح شبکه‌های اجتماعی و کمپین تبلیغاتی",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },
  {
    slug: "freelancer-product-photographer",
    titleFa: "عکاس صنعتی / عکاس محصول",
    group: "FREELANCER",
    parentSlug: "freelancer",
  },

  // ========================
  // EMPLOYMENT - استخدام
  // ========================
  {
    slug: "employment",
    titleFa: "آگهی‌های استخدام",
    group: "EMPLOYMENT",
    sortOrder: 6,
  },
  {
    slug: "employment-press-operator",
    titleFa: "اپراتور چاپ (افست، فلکسو، دیجیتال و...)",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-assistant-press",
    titleFa: "کمک‌چاپ",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-prepress",
    titleFa: "نیروی پیش از چاپ (لیتوگراف، فرم‌بند، CTP)",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-postpress",
    titleFa:
      "نیروی پس از چاپ (دایکات، جعبه‌چسبانی، صحافی، بسته‌بندی)",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-designer",
    titleFa: "گرافیست و طراح بسته‌بندی",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-qc",
    titleFa: "کنترل کیفیت (QC) چاپ و بسته‌بندی",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-production-manager",
    titleFa: "مدیر تولید و برنامه‌ریزی چاپخانه",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-sales",
    titleFa: "کارشناس فروش و بازاریابی چاپ",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },
  {
    slug: "employment-packaging-operator",
    titleFa: "اپراتور ماشین‌آلات بسته‌بندی",
    group: "EMPLOYMENT",
    parentSlug: "employment",
  },

  // ========================
  // READY_TO_WORK - آماده به کار
  // ========================
  {
    slug: "ready-to-work",
    titleFa: "آماده به کار در صنعت چاپ",
    group: "READY_TO_WORK",
    sortOrder: 7,
  },
  {
    slug: "ready-press-operator",
    titleFa: "اپراتور چاپ آماده به کار",
    group: "READY_TO_WORK",
    parentSlug: "ready-to-work",
  },
  {
    slug: "ready-prepress",
    titleFa: "متخصص پیش از چاپ آماده به کار",
    group: "READY_TO_WORK",
    parentSlug: "ready-to-work",
  },
  {
    slug: "ready-postpress",
    titleFa:
      "نیروی پس از چاپ و بسته‌بندی آماده به کار",
    group: "READY_TO_WORK",
    parentSlug: "ready-to-work",
  },
  {
    slug: "ready-designer",
    titleFa:
      "طراح گرافیک / بسته‌بندی آماده به کار",
    group: "READY_TO_WORK",
    parentSlug: "ready-to-work",
  },
  {
    slug: "ready-production-manager",
    titleFa: "مدیر تولید / سرپرست آماده به کار",
    group: "READY_TO_WORK",
    parentSlug: "ready-to-work",
  },

  // ========================
  // OTHER - سایر
  // ========================
  {
    slug: "other",
    titleFa: "سایر آگهی‌ها",
    group: "OTHER",
    sortOrder: 8,
  },
  {
    slug: "other-print-related",
    titleFa: "سایر آگهی‌های مرتبط با چاپ و بسته‌بندی",
    group: "OTHER",
    parentSlug: "other",
  },
];

async function main() {
  console.log("🚀 Seeding categories...");

  const slugToId = new Map<string, number>();

  // مرحله ۱: ریشه‌ها
  const roots = categories.filter((c) => !c.parentSlug);
  for (const cat of roots) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        titleFa: cat.titleFa,
        group: cat.group,
        sortOrder: cat.sortOrder ?? 0,
        isActive: true,
      },
      create: {
        slug: cat.slug,
        titleFa: cat.titleFa,
        group: cat.group,
        sortOrder: cat.sortOrder ?? 0,
        isActive: true,
      },
    });

    slugToId.set(created.slug, created.id);
  }

  // مرحله ۲: بقیه (دارای parentSlug)
  let queue = categories.filter((c) => c.parentSlug);
  let safety = 0;

  while (queue.length > 0 && safety < 20) {
    const nextQueue: SeedCategory[] = [];

    for (const cat of queue) {
      if (!cat.parentSlug) continue;
      const parentId = slugToId.get(cat.parentSlug);

      if (!parentId) {
        nextQueue.push(cat);
        continue;
      }

      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          titleFa: cat.titleFa,
          group: cat.group,
          sortOrder: cat.sortOrder ?? 0,
          isActive: true,
          parentId,
        },
        create: {
          slug: cat.slug,
          titleFa: cat.titleFa,
          group: cat.group,
          sortOrder: cat.sortOrder ?? 0,
          isActive: true,
          parentId,
        },
      });

      slugToId.set(created.slug, created.id);
    }

    if (nextQueue.length === queue.length) {
      console.warn(
        "⚠️ برخی دسته‌ها به دلیل پیدا نکردن parent ساخته نشدند:",
        nextQueue.map((c) => c.slug)
      );
      break;
    }

    queue = nextQueue;
    safety += 1;
  }

  console.log("✅ Categories seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
