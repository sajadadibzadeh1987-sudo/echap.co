"use client"

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface DialogWrapperProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export default function DialogWrapper({
  isOpen,
  onClose,
  title,
  description,
  children,
}: DialogWrapperProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white text-black rounded-xl shadow-2xl p-6 w-full max-w-md rtl:text-right"
            >
              {/* دکمه بستن بالا راست */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>

              <DialogHeader>
                <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-sm text-muted-foreground mt-1">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="mt-4 space-y-4">{children}</div>
            </motion.div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
