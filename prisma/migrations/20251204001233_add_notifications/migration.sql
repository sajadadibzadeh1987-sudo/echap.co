-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('AD_CREATED', 'AD_PENDING', 'AD_APPROVED', 'AD_REJECTED', 'AD_DELETED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "jobAdId" TEXT,
    "sender" TEXT NOT NULL DEFAULT 'ایچاپ',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_jobAdId_fkey" FOREIGN KEY ("jobAdId") REFERENCES "JobAd"("id") ON DELETE CASCADE ON UPDATE CASCADE;
