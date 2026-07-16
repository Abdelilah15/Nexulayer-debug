-- CreateTable
CREATE TABLE "PortfolioSnapshot" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PortfolioSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "lastActive" TIMESTAMP(3),
    "history" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioSnapshot_address_timestamp_idx" ON "PortfolioSnapshot"("address", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioSnapshot_address_timestamp_key" ON "PortfolioSnapshot"("address", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_walletAddress_key" ON "Streak"("walletAddress");
