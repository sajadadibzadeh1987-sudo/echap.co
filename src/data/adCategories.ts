// src/data/adCategories.ts

// شناسه‌ی گروه‌های اصلی آگهی
export type AdCategoryGroupId =
  | "JOB"
  | "MACHINE"
  | "MATERIAL"
  | "FREELANCER"
  | "PRINT_SERVICE"
  | "OTHER";

// یک دسته‌ی تکی
export interface AdCategory {
  id: string;
  label: string;
  groupId: AdCategoryGroupId;
}

// گروه دسته‌ها
export interface AdCategoryGroup {
  id: AdCategoryGroupId;
  label: string;
  description?: string;
  categories: AdCategory[];
}

// لیست گروه‌ها و دسته‌ها
export const adCategoryGroups: AdCategoryGroup[] = [
  {
    id: "JOB",
    label: "استخدام و همکاری",
    description: "فرصت‌های شغلی و جذب نیرو در صنعت چاپ",
    categories: [
      { id: "JOB_OPERATOR", label: "اپراتور ماشین چاپ", groupId: "JOB" },
      { id: "JOB_DESIGNER", label: "طراح گرافیک / بسته‌بندی", groupId: "JOB" },
      { id: "JOB_SUPERVISOR", label: "ناظر چاپ / سوپروایزر", groupId: "JOB" },
      { id: "JOB_SALES", label: "کارشناس فروش و بازاریابی", groupId: "JOB" },
      { id: "JOB_OTHER", label: "سایر موقعیت‌های شغلی", groupId: "JOB" },
    ],
  },
  {
    id: "MACHINE",
    label: "ماشین‌آلات و تجهیزات",
    description: "خرید و فروش ماشین‌آلات چاپ و بسته‌بندی",
    categories: [
      { id: "MACHINE_OFFSET", label: "ماشین چاپ افست", groupId: "MACHINE" },
      {
        id: "MACHINE_DIGITAL",
        label: "ماشین چاپ دیجیتال",
        groupId: "MACHINE",
      },
      { id: "MACHINE_FLEXO", label: "ماشین فلکسو / لیبل", groupId: "MACHINE" },
      {
        id: "MACHINE_BINDERY",
        label: "صحافی، تا، برش و تکمیلی",
        groupId: "MACHINE",
      },
      {
        id: "MACHINE_OTHER",
        label: "سایر ماشین‌آلات و تجهیزات",
        groupId: "MACHINE",
      },
    ],
  },
  {
    id: "MATERIAL",
    label: "مواد مصرفی و ملزومات",
    description: "کاغذ، مقوا، مرکب و سایر ملزومات چاپ",
    categories: [
      { id: "MAT_PAPER", label: "کاغذ و مقوا", groupId: "MATERIAL" },
      { id: "MAT_INK", label: "مرکب و حلال‌ها", groupId: "MATERIAL" },
      { id: "MAT_PLATE", label: "زینک و پلیت", groupId: "MATERIAL" },
      {
        id: "MAT_PACK",
        label: "ملزومات بسته‌بندی و لیبل",
        groupId: "MATERIAL",
      },
      { id: "MAT_OTHER", label: "سایر مواد مصرفی", groupId: "MATERIAL" },
    ],
  },
  {
    id: "FREELANCER",
    label: "فریلنسر و خدمات تخصصی",
    description: "طراحان، ناظران، عکاسان و مشاوران",
    categories: [
      { id: "FREE_DESIGN", label: "طراحی گرافیک و بسته‌بندی", groupId: "FREELANCER" },
      { id: "FREE_SUPERVISOR", label: "ناظر چاپ", groupId: "FREELANCER" },
      { id: "FREE_PHOTO", label: "عکاسی صنعتی / محصول", groupId: "FREELANCER" },
      { id: "FREE_CONSULT", label: "مشاوره تخصصی چاپ", groupId: "FREELANCER" },
      { id: "FREE_OTHER", label: "سایر خدمات فریلنسری", groupId: "FREELANCER" },
    ],
  },
  {
    id: "PRINT_SERVICE",
    label: "خدمات چاپ و تولید",
    description: "چاپخانه‌ها و واحدهای تولیدی",
    categories: [
      { id: "PS_OFFSET", label: "خدمات چاپ افست شیت", groupId: "PRINT_SERVICE" },
      {
        id: "PS_DIGITAL",
        label: "خدمات چاپ دیجیتال",
        groupId: "PRINT_SERVICE",
      },
      {
        id: "PS_PACKAGING",
        label: "تولید بسته‌بندی",
        groupId: "PRINT_SERVICE",
      },
      { id: "PS_LABEL", label: "چاپ لیبل و رول", groupId: "PRINT_SERVICE" },
      { id: "PS_OTHER", label: "سایر خدمات چاپی", groupId: "PRINT_SERVICE" },
    ],
  },
  {
    id: "OTHER",
    label: "سایر نیازمندی‌ها",
    description: "هر نوع آگهی دیگر مرتبط با صنعت چاپ",
    categories: [
      { id: "OTHER_RENT", label: "رهن و اجاره فضا / سوله", groupId: "OTHER" },
      { id: "OTHER_PARTS", label: "قطعات یدکی و سرویس", groupId: "OTHER" },
      { id: "OTHER_TRAIN", label: "آموزش و دوره‌ها", groupId: "OTHER" },
      { id: "OTHER_MISC", label: "سایر آگهی‌های متفرقه", groupId: "OTHER" },
    ],
  },
];

// یک لیست تخت از همه‌ی دسته‌ها (اگر جایی لازم شد)
export const flatAdCategories: AdCategory[] = adCategoryGroups.flatMap(
  (group: AdCategoryGroup) => group.categories
);
