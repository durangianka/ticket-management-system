-- CreateEnum
CREATE TYPE "Category" AS ENUM ('INCIDENT', 'BUG', 'FEATURE_REQUEST', 'ACCOUNT_BILLING', 'ACCESS', 'QUESTION');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('P1', 'P2', 'P3', 'P4');

-- CreateEnum
CREATE TYPE "Routing" AS ENUM ('ANSWER_DIRECTLY', 'PLATFORM_ENGINEERING');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category",
    "priority" "Priority",
    "routing" "Routing",
    "recommendedNextAction" TEXT,
    "classificationError" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
