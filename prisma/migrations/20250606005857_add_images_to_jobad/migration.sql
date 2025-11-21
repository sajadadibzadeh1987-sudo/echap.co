-- AlterTable
ALTER TABLE "JobAd" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
