-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'intersex');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('email', 'google');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "provider" "AuthType" NOT NULL DEFAULT 'email',
    "full_name" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "gender" "Gender",
    "description" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
