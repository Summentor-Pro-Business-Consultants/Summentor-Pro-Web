/*
  Warnings:

  - You are about to drop the column `company` on the `contact_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `contact_submissions` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry_sector` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact_submissions" DROP COLUMN "company",
DROP COLUMN "name",
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "industry_sector" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "organisation" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "referral_source" TEXT,
ALTER COLUMN "message" DROP NOT NULL;
