"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LoginWithOtpForm from "./LoginWithOtpForm";
import useModalStore from "@/hooks/use-modal-store";

export default function AuthModal() {
  const { isOpen, type, closeModal } = useModalStore();
  const [mounted, setMounted] = useState(false);

  const open = isOpen && type === "auth";

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
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
              onClick={closeModal}
            >
              <X size={24} />
            </button>

            <LoginWithOtpForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
