/*
  Warnings:

  - You are about to drop the column `farmId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users"."users" DROP COLUMN "farmId",
ADD COLUMN     "farmIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
