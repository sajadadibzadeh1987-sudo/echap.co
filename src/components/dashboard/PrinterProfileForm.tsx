"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

interface PrinterProfileData {
  name: string;
  slug: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  logoUrl?: string;
  galleryImages: string[];
  clients: string[];
  capabilities: string[];
}

export default function PrinterProfileForm() {
  const router = useRouter();
  const [data, setData] = useState<PrinterProfileData>({
    name: "",
    slug: "",
    address: "",
    phone: "",
    website: "",
    description: "",
    logoUrl: undefined,
    galleryImages: [],
    clients: [],
    capabilities: [],
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newClient, setNewClient] = useState("");
  const [newCapability, setNewCapability] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/printer-profile").then((res) => {
      if (res.data) {
        setData(res.data);
        setLogoPreview(res.data.logoUrl ?? null);
      }
    });
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const addClient = () => {
    const client = newClient.trim();
    if (client && !data.clients.includes(client)) {
      setData((d) => ({ ...d, clients: [...d.clients, client] }));
      setNewClient("");
    }
  };

  const removeClient = (c: string) => {
    setData((d) => ({ ...d, clients: d.clients.filter((x) => x !== c) }));
  };

  const addCapability = () => {
    const cap = newCapability.trim();
    if (cap && !data.capabilities.includes(cap)) {
      setData((d) => ({ ...d, capabilities: [...d.capabilities, cap] }));
      setNewCapability("");
    }
  };

  const removeCapability = (cap: string) => {
    setData((d) => ({ ...d, capabilities: d.capabilities.filter((x) => x !== cap) }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let logoUrl = data.logoUrl;
      if (logoFile) {
        const form = new FormData();
        form.append("file", logoFile);
        const upload = await axios.post<{ url: string }>("/api/upload-logo", form);
        logoUrl = upload.data.url;
      }

      await axios.post("/api/printer-profile", {
        ...data,
        logoUrl,
      });

      toast.success("پروفایل ذخیره شد");
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ خطا در ذخیره پروفایل چاپخانه:", err);
      toast.error("خطا در ذخیره پروفایل چاپخانه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">پروفایل چاپخانه</h1>

      <div>
        <Label htmlFor="logo">لوگو چاپخانه</Label>
        <Input type="file" id="logo" name="file" accept="image/*" onChange={handleLogoChange} />
        {logoPreview && (
          <div className="mt-2 w-32 h-32 relative rounded-full overflow-hidden">
            <Image src={logoPreview} alt="لوگو" fill unoptimized className="object-cover" />
          </div>
        )}
      </div>

      <div>
        <Label>نام چاپخانه</Label>
        <Input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} />
      </div>

      <div>
        <Label>نام انگلیسی (slug)</Label>
        <Input value={data.slug} onChange={(e) => setData((d) => ({ ...d, slug: e.target.value }))} />
      </div>

      <div>
        <Label>آدرس</Label>
        <Textarea value={data.address} onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))} />
      </div>

      <div>
        <Label>توضیحات تکمیلی</Label>
        <Textarea value={data.description} onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))} />
      </div>

      <div>
        <Label>تلفن</Label>
        <Input value={data.phone} onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))} />
      </div>

      <div>
        <Label>وب‌سایت</Label>
        <Input value={data.website} onChange={(e) => setData((d) => ({ ...d, website: e.target.value }))} />
      </div>

      <div>
        <Label>مشتریان ما</Label>
        <div className="flex gap-2">
          <Input placeholder="نام مشتری یا لوگو URL" value={newClient} onChange={(e) => setNewClient(e.target.value)} />
          <Button onClick={addClient}>افزودن</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.clients.map((c) => (
            <span key={c} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
              {c}
              <button onClick={() => removeClient(c)} className="text-red-600">×</button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <Label>ظرفیت‌های تولید</Label>
        <div className="flex gap-2">
          <Input placeholder="مثلاً لترپرس UV" value={newCapability} onChange={(e) => setNewCapability(e.target.value)} />
          <Button onClick={addCapability}>افزودن</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.capabilities.map((cap) => (
            <span key={cap} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
              {cap}
              <button onClick={() => removeCapability(cap)} className="text-red-600">×</button>
            </span>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "در حال ذخیره..." : "ذخیره پروفایل"}
      </Button>
    </div>
  );
}
