"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JobAd } from "@/types/jobAd";
import JobAdModal from "@/components/dashboard/JobAdModal";
import AdCard from "@/components/AdCard";
import { showError } from "@/lib/toast";

export default function MyJobAdsPage() {
  const router = useRouter();

  const [ads, setAds] = useState<JobAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<JobAd | null>(null);
  const [modalMode, setModalMode] =
    useState<"edit" | "delete" | "upgrade">("edit");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user's job ads
  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const res = await fetch("/api/my/jobads");
        if (!res.ok) throw new Error("خطا در دریافت آگهی‌ها");
        const data = await res.json();
        setAds(data);
      } catch (err) {
        console.error(err);
        showError("❌ خطا در دریافت آگهی‌های شما");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();
  }, []);

  const openModal = (ad: JobAd, mode: "edit" | "delete" | "upgrade") => {
    setSelectedAd(ad);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  // حذف آگهی
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/jobads/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        showError(data?.error || "❌ خطا در حذف آگهی");
        return;
      }

      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (error) {
      console.error("❌ خطا:", error);
      showError("❌ خطای غیرمنتظره");
    }
  };

  if (loading)
    return <div className="p-6">در حال بارگذاری آگهی‌های شما...</div>;

  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">آگهی‌های من</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <AdCard
            key={ad.id}
            ad={{
              id: ad.id,
              title: ad.title,
              description: ad.description,
              category: ad.category,
              createdAt: ad.createdAt || "",
              postedAt: "",
              link: `/ads/${ad.id}`,
              images: ad.images || [],
            }}
            onEdit={() => openModal(ad, "edit")}
            onImages={() =>
              router.push(`/dashboard/jobads/edit-images/${ad.id}`)
            }
            onDelete={() => openModal(ad, "delete")}
          />
        ))}
      </div>

      {selectedAd && (
        <JobAdModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mode={modalMode}
          ad={selectedAd}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
