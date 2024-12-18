/*
  Warnings:

  - You are about to drop the column `cratTotal` on the `order` table. All the data in the column will be lost.
  - Added the required column `cartTotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `cratTotal`,
    ADD COLUMN `cartTotal` DOUBLE NOT NULL;
