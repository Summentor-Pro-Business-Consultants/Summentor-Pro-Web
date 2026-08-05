-- CreateTable
CREATE TABLE "tracked_events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'engagement',
    "path" TEXT NOT NULL,
    "label" TEXT,
    "value" INTEGER,
    "properties" JSONB,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "city" TEXT,
    "country" TEXT,
    "session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracked_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tracked_events_name_created_at_idx" ON "tracked_events"("name", "created_at");

-- CreateIndex
CREATE INDEX "tracked_events_session_id_idx" ON "tracked_events"("session_id");

-- CreateIndex
CREATE INDEX "tracked_events_path_idx" ON "tracked_events"("path");
