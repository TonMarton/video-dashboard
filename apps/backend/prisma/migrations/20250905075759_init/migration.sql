-- CreateTable
CREATE TABLE "public"."videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thumbnail_url" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."video_tags" (
    "video_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "video_tags_pkey" PRIMARY KEY ("video_id","tag_id")
);

-- CreateIndex
CREATE INDEX "videos_created_at_idx" ON "public"."videos"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- AddForeignKey
ALTER TABLE "public"."video_tags" ADD CONSTRAINT "video_tags_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."video_tags" ADD CONSTRAINT "video_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
