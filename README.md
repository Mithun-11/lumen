
<div align="center">

  <h1 align="center">LUMEN</h1>

  <p align="center">
    <strong>A Premium Social Network for Film Lovers</strong>
    <br />
    <em>Track films, write reviews, and join the community.</em>
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>

  <p align="center">
    <!-- Next.js -->
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <!-- TypeScript -->
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <!-- Tailwind CSS -->
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <!-- PostgreSQL -->
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  </p>

</div>

---

## 🎬 About Lumen

**Lumen** is a modern, dark-themed social platform inspired by Letterboxd, built for **cinephiles** to log, rate, and review movies.
This project demonstrates a high-performance, full-stack application using **Next.js 16 (App Router)** and **Server Actions**, completely avoiding ORMs in favor of raw SQL for maximum control and efficiency.

## ✨ Features

- **🔎 Extensive Movie Database**: Powered by **TMDB API**, browse popular, trending, and searchable movie catalogs.
- **📝 Review System**: Rate films on a 5-star scale, write detailed reviews, and mark spoilers.
- **📅 Diary & Logging**: Keep a digital diary of everything you watch with dates and rewatch toggle.
- **👥 Social Interaction**: Follow friends, see their recent reviews, and inspect their profiles (WIP).
- **🎨 Premium UI/UX**: A dark, neon-accented interface using **Tailwind CSS v4** and **shadcn/ui** for a sleek experience.
- **🔐 Secure Auth**: Custom-built JWT authentication system with encrypted cookies.

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Raw SQL via `pg`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) |
| **API** | [The Movie Database (TMDB)](https://developer.themoviedb.org/docs) |

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   **Node.js** (v18+)
*   **PostgreSQL** (Running instance)

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/lumen.git
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up Environment Variables**
    Copy `.env.example` to `.env.local` and fill in your keys.
    ```sh
    cp .env.example .env.local
    ```
    *You need a TMDB API Key and a Postgres Connection String.*
    
4.  **Initialize Database**
    Run the included schema file to create tables.
    ```sh
    psql -d lumen -f db/schema.sql
    ```

5.  **Run the App**
    ```sh
    npm run dev
    ```

For a detailed walkthrough, check out [WALKTHROUGH.md](./WALKTHROUGH.md).

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

<p align="center">
  Built with ❤️ by Antigravity
</p>
