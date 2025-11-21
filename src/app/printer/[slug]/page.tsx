import { notFound } from 'next/navigation'
import Image from 'next/image'

interface Props {
  params: { slug: string }
}

export default async function PrinterPage({ params }: Props) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/printer-profile/${params.slug}`, {
    cache: 'no-store',
  })

  if (!res.ok) return notFound()

  const profile = await res.json()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">{profile.name}</h1>

      {profile.logoUrl && (
        <div className="w-32 h-32 relative">
          <Image
            src={profile.logoUrl}
            alt="لوگوی چاپخانه"
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="text-sm text-gray-700 space-y-1">
        {profile.address && <p>📍 آدرس: {profile.address}</p>}
        {profile.phone && <p>📞 تلفن: {profile.phone}</p>}
        {profile.website && (
          <p>
            🌐 سایت: <a href={profile.website} className="text-blue-600 underline" target="_blank">{profile.website}</a>
          </p>
        )}
      </div>

      {profile.lat && profile.lng && (
        <div>
          <iframe
            src={`https://maps.google.com/maps?q=${profile.lat},${profile.lng}&z=15&output=embed`}
            className="w-full h-64 rounded border"
            loading="lazy"
          ></iframe>
        </div>
      )}

      {profile.galleryImages?.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">گالری تصاویر چاپخانه</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profile.galleryImages.map((url: string) => (
              <div key={url} className="relative aspect-video border rounded overflow-hidden">
                <Image
                  src={url}
                  alt="gallery"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.clients?.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">برخی از مشتریان</h2>
          <div className="flex flex-wrap gap-4">
            {profile.clients.map((url: string) => (
              <div key={url} className="w-24 h-16 relative border rounded bg-white">
                <Image
                  src={url}
                  alt="client"
                  fill
                  className="object-contain p-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.capabilities?.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">ظرفیت‌های تولید</h2>
          <ul className="list-disc pr-6 space-y-1 text-sm text-gray-700">
            {profile.capabilities.map((cap: string) => (
              <li key={cap}>{cap}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
