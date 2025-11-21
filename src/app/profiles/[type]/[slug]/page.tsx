// app/profiles/[type]/[slug]/page.tsx
import prisma from "@/lib/prisma";
import Image from "next/image";

interface Props { params: { type: string; slug: string } }

export default async function ProfileDetail({ params }: Props) {
  const profile = await prisma.businessProfile.findUnique({
    where: { slug: params.slug },
    include: { user: true },  // اگر نیاز به نقش یا ایمیل دارید
  });
  if (!profile) return <p>پروفایل پیدا نشد.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{profile.displayName}</h2>
      <p>{profile.description}</p>
      {profile.galleryImages[0] && (
        <Image
          src={profile.galleryImages[0]}
          alt={profile.displayName}
          width={600}
          height={400}
          className="rounded"
        />
      )}
      <ul className="list-disc list-inside">
        {profile.services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p>تلفن: {profile.phone}</p>
      <p>آدرس: {profile.address}</p>
      {/* سایر فیلدها */}
    </div>
  );
}
