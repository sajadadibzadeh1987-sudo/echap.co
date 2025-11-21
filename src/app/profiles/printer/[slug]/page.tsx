import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface Props {
  params: {
    slug: string;
  };
}

export default async function PrinterProfilePage({ params }: Props) {
  const profile = await prisma.businessProfile.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!profile) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 bg-white shadow rounded-lg mt-8">
      <h1 className="text-3xl font-bold text-gray-800">{profile.displayName}</h1>
      <p className="text-gray-600">{profile.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="font-semibold text-gray-700">شماره تماس:</p>
          <p className="text-gray-600">{profile.phone}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">آدرس:</p>
          <p className="text-gray-600">{profile.address}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">ساعات کاری:</p>
          <p className="text-gray-600">{profile.openingHours}</p>
        </div>
      </div>
    </div>
  );
}
