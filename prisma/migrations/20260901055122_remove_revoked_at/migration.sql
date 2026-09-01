/*
  Warnings:

  - You are about to drop the column `revokedAt` on the `UserSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "revokedAt";
