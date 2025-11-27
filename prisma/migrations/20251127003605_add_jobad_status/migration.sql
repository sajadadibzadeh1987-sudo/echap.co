/*
  Warnings:

  - You are about to drop the column `lat` on the `PrintShopProfile` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `PrintShopProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "JobAdStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "JobAd" ADD COLUMN     "status" "JobAdStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "PrintShopProfile" DROP COLUMN "lat",
DROP COLUMN "lng",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION,
ADD COLUMN     "openingHours" TEXT;

-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OTP_phone_key" ON "OTP"("phone");
