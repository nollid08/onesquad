-- CreateTable
CREATE TABLE "ManagerSession" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagerSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManagerSession" ADD CONSTRAINT "ManagerSession_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
