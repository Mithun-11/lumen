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

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure
- `app/globals.css`: Custom premium dark theme variables.
- `components/site-header.tsx`: The main navigation bar.
- `components/hero.tsx`: The hero section.
- `components/movie-card.tsx`: Reusable movie poster component.
- `components/popular-films.tsx`: Grid of trending movies.
- `components/recent-reviews.tsx`: Recent community activity.
- `public/images/`: Generated movie poster assets.
