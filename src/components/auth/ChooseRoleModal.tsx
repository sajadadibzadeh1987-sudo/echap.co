"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { toast } from "react-hot-toast"
import DialogWrapper from "@/components/common/DialogWrapper"
import { Button } from "@/components/ui/button"

interface ChooseRoleModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChooseRoleModal({ isOpen, onClose }: ChooseRoleModalProps) {
  const { data: session, update } = useSession()
  const userId = session?.user?.id
  const [loading, setLoading] = useState(false)

  const handleSelect = async (role: "user" | "freelancer" | "supplier") => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await axios.post("/api/update-role", { userId, role })
      if (res.data.success) {
        toast.success("نقش با موفقیت ثبت شد ✅")
        await update()
        onClose()
      } else {
        toast.error("ثبت نقش ناموفق بود ❌")
      }
    } catch {
      toast.error("خطای ارتباط با سرور ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogWrapper isOpen={isOpen} onClose={onClose} title="انتخاب نقش">
      <div className="space-y-4 px-1 text-center">
        <p className="text-sm text-gray-600">
          لطفاً مشخص کنید در این سامانه به چه عنوان فعالیت می‌کنید:
        </p>
        <div className="grid gap-3">
          <Button disabled={loading} onClick={() => handleSelect("user")}>
            کاربر عمومی
          </Button>
          <Button disabled={loading} onClick={() => handleSelect("freelancer")}>
            فریلنسر
          </Button>
          <Button disabled={loading} onClick={() => handleSelect("supplier")}>
            تأمین‌کننده
          </Button>
        </div>
      </div>
    </DialogWrapper>
  )
}
