/*
  Warnings:

  - You are about to drop the column `emailValidationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailValidationToken",
DROP COLUMN "emailVerified",
DROP COLUMN "name",
ADD COLUMN     "validationToken" TEXT,
ADD COLUMN     "validationTokenExpiration" TIMESTAMP(3),
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
