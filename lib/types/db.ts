export interface User {
    id: string; // UUID
    username: string;
    email: string;
    password_hash: string;
    bio: string | null;
    avatar_url: string | null;
    location: string | null;
    website: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Movie {
    id: string; // UUID
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    original_title: string | null;
    release_date: Date | null;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string | null;
    runtime: number | null;
    vote_average: number | null; // Decimal(3, 1) -> number
    created_at: Date;
    updated_at: Date;
}

export interface Review {
    id: string; // UUID
    user_id: string;
    movie_id: string;
    rating: number | null; // Decimal(2, 1) -> number
    content: string | null;
    watched_date: Date | null;
    has_spoilers: boolean;
    is_rewatch: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface List {
    id: string; // UUID
    user_id: string;
    name: string;
    description: string | null;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ListItem {
    id: string; // UUID
    list_id: string;
    movie_id: string;
    item_order: number;
    notes: string | null;
    created_at: Date;
}

export interface Watchlist {
    user_id: string;
    movie_id: string;
    added_at: Date;
}

export interface Follow {
    follower_id: string;
    following_id: string;
    created_at: Date;
}

export interface ReviewLike {
    user_id: string;
    review_id: string;
    created_at: Date;
}

export interface Comment {
    id: string; // UUID
    user_id: string;
    review_id: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}
