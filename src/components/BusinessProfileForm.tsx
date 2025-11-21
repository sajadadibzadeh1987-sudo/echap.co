// src/components/BusinessProfileForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "react-hot-toast";

interface BusinessProfileData {
  displayName: string;
  slug: string;
  description: string;
  services: string[];
  phone: string;
  address: string;
  galleryImages: string[];
  openingHours: string;
  website: string;
  logoUrl?: string;
}

export default function BusinessProfileForm() {
  const router = useRouter();

  const [data, setData] = useState<BusinessProfileData>({
    displayName: "",
    slug: "",
    description: "",
    services: [],
    phone: "",
    address: "",
    galleryImages: [],
    openingHours: "",
    website: "",
    logoUrl: undefined,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newService, setNewService] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        const res = await axios.get<BusinessProfileData | null>(
          "/api/business-profile"
        );
        if (!mounted) return;
        if (res.data) {
          setData({
            ...res.data,
            logoUrl: res.data.logoUrl ?? undefined,
          });
          setLogoPreview(res.data.logoUrl ?? null);
        }
      } catch (err) {
        console.error("❌ Error fetching business profile:", err);
      }
    }
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const addService = () => {
    const svc = newService.trim();
    if (svc && !data.services.includes(svc)) {
      setData((d) => ({ ...d, services: [...d.services, svc] }));
      setNewService("");
    }
  };

  const removeService = (svc: string) => {
    setData((d) => ({
      ...d,
      services: d.services.filter((s) => s !== svc),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let logoUrl = data.logoUrl;

      if (logoFile) {
        const form = new FormData();
        form.append("file", logoFile);
        const upload = await axios.post<{ url: string }>(
          "/api/upload-logo",
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        logoUrl = upload.data.url;
      }

      await axios.post("/api/business-profile", {
        ...data,
        logoUrl,
      });

      toast.success("✅ پروفایل ذخیره شد");
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Error saving business profile:", err);
      toast.error("❌ خطا در ذخیره پروفایل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">پروفایل کسب‌و‌کار شما</h1>

      {/* لوگوی فروشگاه */}
      <div>
        <Label htmlFor="logo">لوگو فروشگاه</Label>
        <Input
          type="file"
          id="logo"
          name="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {logoPreview && (
          <div className="mt-2 w-32 h-32 relative rounded-full overflow-hidden">
            <Image
              src={logoPreview}
              alt="پیش‌نمایش لوگو"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* نام کسب‌وکار */}
      <div>
        <Label htmlFor="displayName">نام کسب‌وکار</Label>
        <Input
          id="displayName"
          value={data.displayName}
          onChange={(e) =>
            setData((d) => ({ ...d, displayName: e.target.value }))
          }
        />
      </div>

      {/* نام فروشگاه به انگلیسی */}
      <div>
        <Label htmlFor="slug">نام فروشگاه به انگلیسی</Label>
        <Input
          id="slug"
          value={data.slug}
          onChange={(e) => setData((d) => ({ ...d, slug: e.target.value }))}
        />
      </div>

      {/* توضیحات */}
      <div>
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) =>
            setData((d) => ({ ...d, description: e.target.value }))
          }
        />
      </div>

      {/* خدمات */}
      <div>
        <Label>خدمات</Label>
        <div className="flex gap-2">
          <Input
            placeholder="افزودن خدمت"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
          />
          <Button onClick={addService}>افزودن</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.services.map((svc) => (
            <span
              key={svc}
              className="flex items-center bg-gray-200 px-2 py-1 rounded"
            >
              {svc}
              <button
                onClick={() => removeService(svc)}
                className="mr-1 text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* شماره تماس */}
      <div>
        <Label htmlFor="phone">شماره تماس</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) =>
            setData((d) => ({ ...d, phone: e.target.value }))
          }
        />
      </div>

      {/* آدرس */}
      <div>
        <Label htmlFor="address">آدرس</Label>
        <Textarea
          id="address"
          value={data.address}
          onChange={(e) =>
            setData((d) => ({ ...d, address: e.target.value }))
          }
        />
      </div>

      {/* ساعات کاری */}
      <div>
        <Label htmlFor="openingHours">ساعات کاری</Label>
        <Input
          id="openingHours"
          value={data.openingHours}
          onChange={(e) =>
            setData((d) => ({ ...d, openingHours: e.target.value }))
          }
        />
      </div>

      {/* وب‌سایت */}
      <div>
        <Label htmlFor="website">وب‌سایت</Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) =>
            setData((d) => ({ ...d, website: e.target.value }))
          }
        />
      </div>

      {/* دکمه ذخیره */}
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "در حال ذخیره..." : "ذخیره پروفایل"}
      </Button>
    </div>
  );
}
