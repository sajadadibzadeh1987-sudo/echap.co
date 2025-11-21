"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LoginWithOtpForm from "./LoginWithOtpForm"; // ✅ تغییر نام درست

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 relative text-right"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute left-4 top-4 text-gray-500 hover:text-red-500 transition"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            {/* فرم ورود با موبایل و کد تایید */}
            <LoginWithOtpForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
