// src/app/profiles/[type]/page.tsx
import prisma from "@/lib/prisma";
import { StoreCard } from "@/components/ui/StoreCard";

interface Props {
  params: { type: string };
}

export default async function ProfileList({ params }: Props) {
  const type = params.type;            // e.g. "suppliers"
  const role = type.slice(0, -1);      // "supplier"

  const items = await prisma.businessProfile.findMany({
    where: { user: { role } },
    select: {
      displayName: true,
      slug: true,
      logoUrl: true,
      galleryImages: true,
      description: true,
      phone: true,
      address: true,
    },
    take: 50,
  });

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((p) => (
        <StoreCard
          key={p.slug}
          slug={p.slug}
          name={p.displayName}
          // اولویت با لوگو، در غیر اینصورت اولین گالری
          imageUrl={p.logoUrl ?? p.galleryImages[0]}
          // تبدیل null به undefined
          description={p.description ?? undefined}
          phone={p.phone ?? undefined}
          address={p.address ?? undefined}
        />
      ))}
    </div>
  );
}
