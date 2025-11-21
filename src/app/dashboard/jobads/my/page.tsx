"use client";

import { useEffect, useState } from "react";
import JobAdModal from "@/components/dashboard/JobAdModal";
import { JobAd } from "@/types/jobAd";

export default function MyJobAdsPage() {
  const [jobAds, setJobAds] = useState<JobAd[]>([]);
  const [selectedAd, setSelectedAd] = useState<JobAd | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "delete" | "upgrade">("edit");

  useEffect(() => {
    fetch("/api/my/jobads")
      .then((res) => res.json())
      .then((data) => setJobAds(data));
  }, []);

  const handleAction = (ad: JobAd, action: typeof mode) => {
    setSelectedAd(ad);
    setMode(action);
    setModalOpen(true);
  };

  const handleUpdate = (updated: JobAd) => {
    setJobAds((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDelete = (id: string) => {
    setJobAds((prev) => prev.filter((item) => item.id !== id));
    fetch(`/api/jobads/${id}`, { method: "DELETE" });
  };

  const handleUpgrade = (id: string) => {
    alert(`🔝 آگهی ${id} ارتقا داده شد (به‌صورت نمایشی)`);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">📋 آگهی‌های من</h1>

      {jobAds.map((ad) => (
        <div
          key={ad.id}
          className="bg-white border rounded-lg p-4 shadow space-y-2"
        >
          <h3 className="text-lg font-bold">{ad.title}</h3>
          <p className="text-sm text-gray-700">{ad.description}</p>

          <div className="text-xs text-gray-400">
            ثبت شده در:{" "}
            {ad.createdAt
              ? new Date(ad.createdAt).toLocaleDateString("fa-IR")
              : "نامشخص"}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => handleAction(ad, "edit")}
            >
              ✏️ ویرایش
            </button>
            <button
              className="text-red-600 hover:underline text-sm"
              onClick={() => handleAction(ad, "delete")}
            >
              🗑️ حذف
            </button>
            <button
              className="text-yellow-600 hover:underline text-sm"
              onClick={() => handleAction(ad, "upgrade")}
            >
              🔝 ارتقا
            </button>
          </div>
        </div>
      ))}

      {selectedAd && (
        <JobAdModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          ad={selectedAd}
          mode={mode}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}
