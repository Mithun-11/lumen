# Lumen - Letterboxd Clone

Lumen is a premium social network for film lovers, built with Next.js, Tailwind CSS, and shadcn/ui.

## Features implemented
- **Modern Dark UI**: A sleek, dark interface with vibrant green accents inspired by Letterboxd.
- **Responsive Navigation**: A fully functional navbar with search, mobile menu, and navigation links.
- **Hero Section**: A bold welcome area with generated sci-fi atmospheric background art.
- **Popular Films**: A responsive grid of movie posters with hover effects.
- **Just Reviewed**: A "Recent Activity" feed showing user reviews and ratings.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Button, Card, Input, Avatar, DropdownMenu)
- **Icons**: Lucide React
- **Fonts**: Inter (Body), Outfit (Headings)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL installed and running

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd lumen
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and fill in your details:
    - `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/lumen`)
    - `TMDB_API_KEY`: Get a free key from [The Movie Database](https://www.themoviedb.org/)
    - `JWT_SECRET`: Any random string for security

4.  **Database Setup**:
    Create a database named `lumen` (or whatever matches your `DATABASE_URL`).
    
    Then initialize the database schema:
    ```bash
    # If you have psql installed
    psql -d lumen -f db/schema.sql
    ```
    
    *Alternatively, you can copy the contents of `db/schema.sql` and run them in your preferred SQL client (like pgAdmin or DBeaver).*

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

6.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure
- `app/`: Next.js App Router pages and layouts.
  - `(home)/_components/`: Components specific to the home page (Hero, PopularFilms, etc.).
  - `film/[id]/`: Movie details page.
- `components/`: Global shared components (Header, Search, MovieCard).
- `lib/`: Utilities and configuration.
  - `env.ts`: Centralized environment variable validation (Zod).
  - `db.ts`: Strict raw SQL database connection.
  - `tmdb.ts`: Type-safe TMDB API client.
  - `types/`: Shared TypeScript definitions.
- `db/schema.sql`: Database schema definition.
- `public/`: Static assets.
