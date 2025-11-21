/*
  Warnings:

  - Added the required column `phone` to the `JobAd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobAd" ADD COLUMN     "phone" TEXT NOT NULL;
