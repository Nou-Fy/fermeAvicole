-- DropIndex
DROP INDEX "users"."users_farmId_key";

-- AlterTable
ALTER TABLE "users"."users" ALTER COLUMN "farmId" DROP NOT NULL;
