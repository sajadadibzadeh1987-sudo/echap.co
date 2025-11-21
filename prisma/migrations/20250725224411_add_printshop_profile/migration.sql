-- CreateTable
CREATE TABLE "PrintShopProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "galleryImages" TEXT[],
    "clients" TEXT[],
    "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintShopProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrintShopProfile_userId_key" ON "PrintShopProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrintShopProfile_slug_key" ON "PrintShopProfile"("slug");

-- AddForeignKey
ALTER TABLE "PrintShopProfile" ADD CONSTRAINT "PrintShopProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
