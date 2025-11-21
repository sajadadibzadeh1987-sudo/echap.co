-- CreateTable
CREATE TABLE "JobAd" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "JobAd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobAd" ADD CONSTRAINT "JobAd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
