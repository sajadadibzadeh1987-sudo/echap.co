export type JobAdStatus = "PENDING" | "PUBLISHED" | "REJECTED";

export interface JobAd {
  id: string;
  title: string;
  description: string;
  category: string;
  phone: string;
  createdAt?: string;
  images: string[]; // 👈 اضافه شد

  status?: JobAdStatus; // 👈 optional برای سازگاری
  // سایر فیلدها مثل createdAt, userId و...
}
