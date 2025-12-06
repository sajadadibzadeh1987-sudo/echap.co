-- CreateEnum
CREATE TYPE "CategoryGroup" AS ENUM ('MACHINERY', 'SUPPLIER', 'PRINT_SERVICE', 'SERVICE', 'FREELANCER', 'EMPLOYMENT', 'READY_TO_WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'PROJECT', 'REMOTE');

-- AlterTable
ALTER TABLE "JobAd" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "imagesJson" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "salary" TEXT;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER,
    "slug" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT,
    "group" "CategoryGroup" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "iconKey" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "JobAd" ADD CONSTRAINT "JobAd_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
