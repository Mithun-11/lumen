-- Migration: Add media_type column to movies table
-- Date: 2025-12-28
-- Description: Support for TV shows in addition to movies

-- Step 1: Add the media_type column with a default value
ALTER TABLE movies ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) NOT NULL DEFAULT 'movie';

-- Step 2: Drop the old unique constraint on tmdb_id (if it exists)
-- Note: The constraint name may vary. This handles the typical naming convention.
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'movies_tmdb_id_key' AND conrelid = 'movies'::regclass
    ) THEN
        ALTER TABLE movies DROP CONSTRAINT movies_tmdb_id_key;
    END IF;
END $$;

-- Step 3: Add the new composite unique constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'movies_tmdb_id_media_type_key' AND conrelid = 'movies'::regclass
    ) THEN
        ALTER TABLE movies ADD CONSTRAINT movies_tmdb_id_media_type_key UNIQUE(tmdb_id, media_type);
    END IF;
END $$;

-- Verify the changes
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'movies' AND column_name = 'media_type';
