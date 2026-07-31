# Pixl — Instagram Clone

A full-stack Instagram-inspired social media platform built with a **Node.js/Express** backend, a **Next.js** web frontend, and a **React Native (Expo)** mobile app.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running in Development](#running-in-development)
  - [Building for Production](#building-for-production)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Scripts Reference](#scripts-reference)

---

## Overview

Pixl is a monorepo containing three applications that share a single REST API:

| App | Technology | Purpose |
|-----|-----------|---------|
| `backend/` | Node.js, Express, MongoDB | REST API + file serving |
| `frontend/` | Next.js 16, Ant Design, TypeScript | Web client |
| `mobile/` | React Native, Expo SDK 54 | iOS & Android client |

---

## Tech Stack

### Backend
| Concern | Library / Service |
|---------|------------------|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB via Mongoose 7 |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` |
| File Uploads | Multer, `express-fileupload` |
| Cloud Storage | Cloudinary |
| Email | Nodemailer |
| Security | Helmet, CORS, cookie-parser |
| Dev tooling | Nodemon |

### Frontend (Web)
| Concern | Library |
|---------|---------|
| Framework | Next.js 16 (App Router) |
| UI Library | Ant Design 6 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |

### Mobile
| Concern | Library |
|---------|---------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router 6, React Navigation 7 |
| UI | React Native Paper 5 |
| Media | `expo-image-picker`, `expo-media-library` |
| Storage | `expo-secure-store` |

---

## Project Structure

```
instagram/
├── backend/                  # Express REST API
│   ├── configs/              # DB connection, credentials, env validation
│   ├── controllers/          # Route handler logic
│   ├── middlewares/          # Auth guards, error handlers
│   ├── models/               # Mongoose schemas (User, Post, Comment, …)
│   ├── routes/               # Express routers
│   ├── files/                # Local file upload storage
│   └── server.js             # Application entry point
│
├── frontend/                 # Next.js web app
│   ├── app/                  # App Router pages & layouts
│   ├── src/                  # Shared source (components, services, lib)
│   └── public/               # Static assets
│
├── mobile/                   # React Native / Expo app
│   ├── app/                  # Expo Router screens
│   ├── src/                  # Shared source (components, hooks, services)
│   └── assets/               # Images, fonts
│
├── Makefile                  # Convenience build targets
├── package.json              # Root workspace scripts (concurrently)
└── vercel.json               # Legacy Vercel config (superseded by Render)
```

---

## Features

- **Authentication** — Register, login, logout, JWT refresh tokens, password reset via email
- **Posts** — Create, edit, delete posts with image uploads (local or Cloudinary)
- **Feed** — Paginated home feed of posts from followed users
- **Likes** — Like and unlike posts
- **Comments** — Add, edit, and delete comments on posts
- **Follow System** — Follow / unfollow users, view followers and following lists
- **User Profiles** — View and edit profile details, upload profile picture
- **Search** — Search for users and posts
- **Suggestions** — Discover new accounts to follow
- **Friends** — Mutual-follow friends list

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account for media uploads
- **Expo CLI** (for mobile development): `npm install -g expo-cli`

### Environment Variables

#### Backend — `backend/.env`

```env
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>

# JWT
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Email (Nodemailer)
MAIL_USER=<your-email@example.com>
MAIL_PASS=<your-email-password>
```

#### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

#### Mobile — `mobile/.env`

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Installation

Install all dependencies for the root workspace, backend, and frontend in one command:

```bash
make install
```

Or manually:

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Mobile
cd mobile && npm install
```

### Running in Development

**Run backend and frontend concurrently (from repo root):**

```bash
npm run dev
```

**Or run each service individually:**

```bash
# Backend only (with hot-reload via nodemon)
npm run dev:backend

# Frontend only
npm run dev:frontend

# Mobile (Expo)
cd mobile && npm start
```

| Service | URL |
|---------|-----|
| Backend API | http://localhost:5000 |
| Frontend | http://localhost:3000 |
| Expo Dev Tools | http://localhost:8081 |

### Building for Production

```bash
# Build frontend
make build

# Or via npm
npm run build
```

The frontend build output lands in `frontend/.next`. The backend can serve a static export from `backend/dist` if configured.

---

## API Reference

All API routes are prefixed with `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Login and receive tokens |
| `POST` | `/api/logout` | Invalidate session |
| `GET` | `/api/token` | Refresh access token |
| `GET` | `/api/feed` | Get paginated feed |
| `GET/POST` | `/api/posts` | List all posts / create a post |
| `GET/PUT/DELETE` | `/api/posts/:id` | Get, update, or delete a post |
| `POST/DELETE` | `/api/likes` | Like or unlike a post |
| `GET/POST/DELETE` | `/api/comments` | Manage comments |
| `GET/POST/DELETE` | `/api/follow` | Follow / unfollow users |
| `GET` | `/api/friends` | Get mutual-follow friends |
| `GET` | `/api/users` | Get user profiles |
| `GET/PUT` | `/api/users/me` | Get or update own profile |
| `GET` | `/api/search` | Search users and posts |
| `GET` | `/api/suggestions` | Get suggested accounts |
| `POST` | `/api/reset-password` | Trigger password reset email |

Static uploads are served from `/files/*`.

---

## Deployment

### Backend & Frontend — Render

Both the backend and frontend are deployed on [Render](https://render.com). Configure the required environment variables in the Render dashboard for each service before deploying.

### Mobile — Expo Application Services (EAS)

```bash
cd mobile && eas build --platform all
```

Refer to `mobile/eas.json` for build profile configuration.

---

## Scripts Reference

### Root (`package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Run backend + frontend concurrently |
| `npm run dev:backend` | Run backend with Nodemon |
| `npm run dev:frontend` | Run Next.js dev server |
| `npm run build` | Build backend deps + frontend |
| `npm run start:backend` | Start backend with Node |
| `npm run start:frontend` | Start Next.js production server |

### Makefile

| Target | Description |
|--------|-------------|
| `make install` | Install all dependencies |
| `make build` | Build the frontend |
| `make start` | Start the backend server |
| `make deploy` | Build then start |
| `make clean` | Remove all `node_modules` and build artifacts |

