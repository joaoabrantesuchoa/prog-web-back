/*
  Warnings:

  - A unique constraint covering the columns `[password]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "password" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_password_key" ON "Usuario"("password");
