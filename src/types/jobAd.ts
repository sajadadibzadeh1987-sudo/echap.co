export interface JobAd {
  id: string;
  title: string;
  description: string;
  category: string;
  phone: string;
  createdAt?: string;
  images: string[]; // 👈 اضافه شد
}
