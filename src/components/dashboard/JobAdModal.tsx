"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobAd } from "@/types/jobAd";
import { showSuccess } from "@/lib/toast"; // ✅ اضافه شد

interface JobAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "edit" | "delete" | "upgrade";
  ad: JobAd;
  onUpdate?: (updated: JobAd) => void;
  onDelete?: (id: string) => void;
  onUpgrade?: (id: string) => void;
}

const JobAdModal: FC<JobAdModalProps> = ({
  isOpen,
  onClose,
  mode,
  ad,
  onUpdate,
  onDelete,
  onUpgrade,
}) => {
  const [form, setForm] = useState(ad);

  const handleSubmit = () => {
    if (mode === "edit") {
      onUpdate?.(form);
      showSuccess("آگهی با موفقیت ویرایش شد");
    } else if (mode === "delete") {
      onDelete?.(ad.id);
      showSuccess("🗑️ آگهی با موفقیت حذف شد");
    } else if (mode === "upgrade") {
      onUpgrade?.(ad.id);
      showSuccess("🔝 آگهی با موفقیت ارتقا یافت");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            dir="rtl"
          >
            <h2 className="text-xl font-bold mb-4 text-right">
              {mode === "edit"
                ? "✏️ ویرایش آگهی"
                : mode === "delete"
                ? "🗑️ حذف آگهی"
                : "🔝 ارتقا آگهی"}
            </h2>

            {mode === "edit" && (
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="عنوان آگهی"
                />
                <textarea
                  className="w-full border p-2 rounded"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="توضیحات آگهی"
                />
              </div>
            )}

            {mode === "delete" && (
              <p className="text-sm text-gray-700 text-right">
                آیا از حذف این آگهی مطمئن هستید؟
              </p>
            )}

            {mode === "upgrade" && (
              <p className="text-sm text-gray-700 text-right">
                آیا می‌خواهید این آگهی را به حالت ویژه ارتقا دهید؟
              </p>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                انصراف
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded text-white text-sm ${
                  mode === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : mode === "upgrade"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {mode === "edit"
                  ? "ذخیره تغییرات"
                  : mode === "delete"
                  ? "حذف"
                  : "ارتقا"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobAdModal;
