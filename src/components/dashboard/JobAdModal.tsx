"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobAd } from "@/types/jobAd";
import { showSuccess, showError } from "@/lib/toast";

interface JobAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "edit" | "delete" | "upgrade";
  ad: JobAd;
  /**
   * اگر تابع یکی از این‌ها مقدار false برگرداند،
   * یعنی عملیات موفق نبوده و نباید success و onClose صدا زده شود.
   * اگر چیزی برنگرداند (void)، موفق در نظر گرفته می‌شود.
   */
  onUpdate?: (updated: JobAd) => Promise<boolean | void> | boolean | void;
  onDelete?: (id: string) => Promise<boolean | void> | boolean | void;
  onUpgrade?: (id: string) => Promise<boolean | void> | boolean | void;
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
  const [form, setForm] = useState<JobAd>(ad);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // هر وقت آگهی ورودی عوض شد، فرم هم sync شود
  useEffect(() => {
    setForm(ad);
  }, [ad]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      let ok = true;

      if (mode === "edit" && onUpdate) {
        const result = await onUpdate(form);
        if (result === false) ok = false;
      } else if (mode === "delete" && onDelete) {
        const result = await onDelete(ad.id);
        if (result === false) ok = false;
      } else if (mode === "upgrade" && onUpgrade) {
        const result = await onUpgrade(ad.id);
        if (result === false) ok = false;
      }

      if (!ok) {
        // یعنی callback خودش تشخیص داده که عملیات موفق نبوده
        showError("عملیات انجام نشد. لطفاً دوباره تلاش کنید.");
        return;
      }

      // اگر به اینجا رسیدیم یعنی عملیات موفق بوده
      if (mode === "edit") {
        showSuccess("آگهی با موفقیت ویرایش شد");
      } else if (mode === "delete") {
        showSuccess("🗑️ آگهی با موفقیت حذف شد");
      } else if (mode === "upgrade") {
        showSuccess("🔝 آگهی با موفقیت ارتقا یافت");
      }

      onClose();
    } catch (error) {
      console.error("JobAdModal handleSubmit error:", error);
      showError("خطای غیرمنتظره در ارتباط با سرور. لطفاً بعداً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
              >
                انصراف
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded text-white text-sm ${
                  mode === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : mode === "upgrade"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting
                  ? "در حال انجام..."
                  : mode === "edit"
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
