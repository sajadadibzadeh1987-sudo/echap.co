'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import axios from 'axios'

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'user' | 'freelancer' | 'supplier'>('user') // ⬅️ نوع نقش محدودتر شد
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('رمز عبور با تکرار آن یکسان نیست')
      return
    }

    try {
      const res = await axios.post('/api/register', {
        name,
        email,
        password,
        role,
      })

      if (res.status === 200) {
        router.push('/login')
      } else {
        setError('ثبت‌نام با مشکل مواجه شد')
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'خطای ناشناخته')
      } else {
        setError('خطای غیرمنتظره')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">ثبت‌نام</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input placeholder="نام کامل" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="ایمیل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input placeholder="تکرار رمز عبور" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <div>
          <Label className="mb-2 block">نقش خود را انتخاب کنید</Label>
          <RadioGroup value={role} onValueChange={(val: 'user' | 'freelancer' | 'supplier') => setRole(val)} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">کاربر عمومی</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="freelancer" id="freelancer" />
              <Label htmlFor="freelancer">فریلنسر</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="supplier" id="supplier" />
              <Label htmlFor="supplier">تأمین‌کننده</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full">ثبت‌نام</Button>
      </form>
    </div>
  )
}
