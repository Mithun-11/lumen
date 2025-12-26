-- Enable UUID extension (usually enabled by default in Supabase, but good to have)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Stores user account information and profile details
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Will store hashed passwords
  bio TEXT,
  avatar_url VARCHAR(255),
  location VARCHAR(100),
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MOVIES TABLE
-- Acts as a local cache for TMDB data. 
-- We only insert movies here when a user interacts with them (e.g. reviews or likes).
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tmdb_id INTEGER UNIQUE NOT NULL, -- The External ID from The Movie Database
  title VARCHAR(255) NOT NULL,
  original_title VARCHAR(255),
  release_date DATE,
  poster_path VARCHAR(255),
  backdrop_path VARCHAR(255),
  overview TEXT,
  runtime INTEGER, -- In minutes
  vote_average DECIMAL(3, 1), -- TMDB average rating, optional to cache
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REVIEWS TABLE
-- The core of the application: users rating and reviewing movies.
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  rating DECIMAL(2, 1), -- 0.5 to 5.0
  content TEXT, -- The review text. Can be null for just a rating.
  watched_date DATE DEFAULT CURRENT_DATE,
  has_spoilers BOOLEAN DEFAULT FALSE,
  is_rewatch BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can't review the exact same movie multiple times on the exact same date (optional logic)
  -- For Letterboxd style, multiple reviews are allowed, so we generally don't add a unique constraint here.
  CONSTRAINT rating_range CHECK (rating >= 0.5 AND rating <= 5.0)
);

-- 4. LISTS TABLE
-- Custom collections made by users (e.g., "Top 10 Horror Movies")
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LIST_ITEMS TABLE
-- The movies inside a list
CREATE TABLE list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  item_order INTEGER NOT NULL, -- To maintain the order in the list
  notes TEXT, -- Optional notes for why this movie is in the list
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(list_id, movie_id) -- Prevent duplicate movies in the same list
);

-- 6. WATCHLIST TABLE
-- Simple "Plan to Watch" list
CREATE TABLE watchlist (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (user_id, movie_id)
);

-- 7. FOLLOWS TABLE
-- Social network connections
CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT distinct_users CHECK (follower_id != following_id)
);

-- 8. REVIEW_LIKES TABLE
-- Users liking other users' reviews
CREATE TABLE review_likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (user_id, review_id)
);

-- 9. COMMENTS TABLE
-- Comments on reviews
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX idx_movies_tmdb_id ON movies(tmdb_id);
CREATE INDEX idx_lists_user_id ON lists(user_id);
