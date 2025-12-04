-- CreateEnum
CREATE TYPE "ChatSender" AS ENUM ('USER', 'SYSTEM', 'ADMIN');

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sender" "ChatSender" NOT NULL,
    "text" TEXT NOT NULL,
    "jobAdId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_jobAdId_fkey" FOREIGN KEY ("jobAdId") REFERENCES "JobAd"("id") ON DELETE SET NULL ON UPDATE CASCADE;
