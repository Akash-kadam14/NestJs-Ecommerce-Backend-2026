-- CreateIndex
CREATE INDEX "Category_id_isActive_idx" ON "Category"("id", "isActive");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_refreshTokenHash_idx" ON "UserSession"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");

-- CreateIndex
CREATE INDEX "UserSession_userId_refreshTokenHash_expiresAt_idx" ON "UserSession"("userId", "refreshTokenHash", "expiresAt");
