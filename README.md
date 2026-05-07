# Sharada Educational Trust - NGO Platform

A full-stack web application for the **Sharada Educational Trust** that provides a public-facing website, media-rich content, program/event promotion, and a secure admin dashboard for managing site content.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Content APIs](#content-apis)
  - [Uploads & Media](#uploads--media)
- [Data Models](#data-models)
- [Authentication & Authorization](#authentication--authorization)
- [File Uploads](#file-uploads)
- [CORS & Security Notes](#cors--security-notes)
- [Deployment Notes](#deployment-notes)

## Overview
The platform consists of:
- A **public website** showcasing programs, events, blogs, media, testimonials, and partner information.
- A **secure admin dashboard** for content updates, image uploads, and ordering of content.
- A **Node.js/Express API** backed by MongoDB to store and serve dynamic content.

## Features
### Public Website
- Program highlights with images and videos.
- Event listing with details and media.
- Blog system with rich content, featured images, and ordering.
- Media testimonials, video testimonials, and impact galleries.
- Sulabh initiative section with core modules and missions.
- Responsive UI with animations and carousels.

### Admin Dashboard
- JWT-based admin login with profile endpoint.
- CRUD management for blogs, events, programs, members, partners, testimonials, screenshots, and Sulabh content.
- Image uploads for content types with local storage.
- Reorder endpoints for curated content sequencing.

## Tech Stack
### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Routing**: React Router DOM
- **Forms/Validation**: React Hook Form, DOMPurify
- **UI Components**: React Icons, Lucide React, Swiper
- **HTTP**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Uploads**: Multer (local filesystem)
- **Email**: Nodemailer
- **Validation**: express-validator

## Architecture
- **Frontend** communicates with the backend via REST APIs.
- **Backend** exposes `/api/*` endpoints and serves uploaded files from `/uploads`.
- **MongoDB** stores all dynamic content (blogs, events, testimonials, etc.).

## Project Structure
```
NGO_Internship/
├── backend/                # Express.js API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth and access control
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST endpoints
│   ├── uploads/            # Uploaded assets (served statically)
│   ├── utils/              # Utility helpers (email, etc.)
│   ├── server.js           # API entrypoint
│   └── seeder.js           # Optional seeding logic
└── frontend/               # React + Vite application
    ├── public/             # Static assets
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── hooks/          # Custom hooks
    │   ├── pages/          # Route-level pages
    │   ├── services/       # API client modules
    │   ├── styles/         # Global and utility styles
    │   ├── utils/          # Constants/helpers
    │   ├── App.jsx         # Router/app shell
    │   └── Main.jsx        # Vite entrypoint
    └── vite.config.js
```

## Getting Started
### Prerequisites
- Node.js 16+ (Node 18+ recommended)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` in `backend/` (see [Environment Variables](#environment-variables)), then start the API:
```bash
npm run dev
```

The backend runs at: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` in `frontend/` if you want a custom API base URL, then start the frontend:
```bash
npm run dev
```

The frontend runs at: `http://localhost:5173`

## Environment Variables
### Backend (`backend/.env`)
| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used by the API server. |
| `JWT_SECRET` | Secret used to sign JWT tokens. |
| `JWT_EXPIRE` | Token expiration (e.g., `7d`, `30d`). |
| `SMTP_HOST` | SMTP host for sending emails (defaults to `smtp.gmail.com`). |
| `SMTP_PORT` | SMTP port (defaults to `587`). |
| `SMTP_EMAIL` | SMTP auth email/username. |
| `SMTP_PASSWORD` | SMTP auth password or app password. |
| `FROM_NAME` | Display name for outgoing emails. |
| `FROM_EMAIL` | Sender email address for outgoing emails. |

### Frontend (`frontend/.env`)
| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL for API requests (defaults to `http://localhost:5000`). |

## Scripts
### Backend (`backend/package.json`)
- `npm run dev` / `npm start`: Start API with nodemon.

### Frontend (`frontend/package.json`)
- `npm run dev`: Start Vite dev server.
- `npm run build`: Production build.
- `npm run preview`: Preview built app.
- `npm run lint`: Run ESLint.

## API Reference
Base URL: `http://localhost:5000` (configurable)

### Authentication
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Admin login, returns JWT. | Public |
| GET | `/api/auth/me` | Get current user profile. | Bearer token |
| POST | `/api/auth/forgotpassword` | Send password reset OTP to email. | Public |
| POST | `/api/auth/resetpassword` | Reset password using OTP. | Public |

### Content APIs
> Many create/update/delete endpoints require an admin JWT.

#### Members
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/members` | List members. | Public |
| POST | `/api/members` | Create member (multipart form with `image`). | Admin |
| PUT | `/api/members/:id` | Update member (multipart form with `image`). | Admin |
| DELETE | `/api/members/:id` | Delete member. | Admin |
| PUT | `/api/members/reorder` | Update order list. | Admin |

#### Blogs
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/blogs` | List blogs. | Public |
| POST | `/api/blogs` | Create blog (multipart form with `image`). | Admin |
| PUT | `/api/blogs/:id` | Update blog (multipart form with `image`). | Admin |
| DELETE | `/api/blogs/:id` | Delete blog. | Admin |
| POST | `/api/blogs/subscribe` | Subscribe email to blog updates. | Public |
| PUT | `/api/blogs/reorder` | Update order list. | Admin |

#### Education Images
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/education-images` | List education images. | Public |
| POST | `/api/education-images` | Upload images (array field: `images`). | Admin |
| DELETE | `/api/education-images/:id` | Delete image. | Admin |
| PUT | `/api/education-images/reorder` | Update order list. | Admin |

#### Events
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/events` | List events. | Public |
| GET | `/api/events/:id` | Fetch single event. | Public |
| POST | `/api/events` | Create event (multipart form with `image`). | Public* |
| PUT | `/api/events/:id` | Update event (multipart form with `image`). | Public* |
| DELETE | `/api/events/:id` | Delete event. | Public* |
| PUT | `/api/events/reorder` | Update order list. | Admin |

> *Note: Event create/update/delete routes do not currently enforce auth in code.

#### Media Testimonials
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/media` | List media testimonials. | Public |
| GET | `/api/media/:id` | Fetch single testimonial. | Public |
| POST | `/api/media` | Create testimonial (multipart form with `image`). | Public* |
| PUT | `/api/media/:id` | Update testimonial (multipart form with `image`). | Public* |
| DELETE | `/api/media/:id` | Delete testimonial. | Public* |
| PUT | `/api/media/reorder` | Update order list. | Public* |

#### Video Testimonials
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/videos` | List video testimonials. | Public |
| GET | `/api/videos/:id` | Fetch single video. | Public |
| POST | `/api/videos` | Create testimonial. | Public* |
| PUT | `/api/videos/:id` | Update testimonial. | Public* |
| DELETE | `/api/videos/:id` | Delete testimonial. | Public* |
| PUT | `/api/videos/reorder` | Update order list. | Public* |

#### Screenshots
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/screenshots` | List screenshots. | Public |
| POST | `/api/screenshots` | Create screenshot (multipart form with `image`). | Public* |
| PUT | `/api/screenshots/:id` | Update screenshot (multipart form with `image`). | Public* |
| DELETE | `/api/screenshots/:id` | Delete screenshot. | Public* |
| PUT | `/api/screenshots/reorder` | Update order list. | Public* |

#### Programs
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/programs` | List programs. | Public |
| POST | `/api/programs` | Create program (multipart form with `image`). | Admin |
| PUT | `/api/programs/:id` | Update program (multipart form with `image`). | Admin |
| DELETE | `/api/programs/:id` | Delete program. | Admin |
| PUT | `/api/programs/reorder` | Update order list. | Admin |

#### Partners
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/partners` | List partners. | Public |
| GET | `/api/partners/admin` | List partners for admin use. | Public* |
| POST | `/api/partners` | Create partner (multipart form with `image`). | Public* |
| PUT | `/api/partners/:id` | Update partner (multipart form with `image`). | Public* |
| DELETE | `/api/partners/:id` | Delete partner. | Public* |
| PUT | `/api/partners/reorder` | Update order list. | Public* |

#### Sulabh
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/sulabh` | List Sulabh entries. | Public |
| POST | `/api/sulabh` | Create entry (multipart form with `image`). | Admin |
| PUT | `/api/sulabh/:id` | Update entry (multipart form with `image`). | Admin |
| DELETE | `/api/sulabh/:id` | Delete entry. | Admin |
| PUT | `/api/sulabh/reorder` | Update order list. | Admin |

#### Hero Images
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/hero-images/:page` | Get hero image for page. | Public |
| POST | `/api/hero-images/:page` | Update hero image (multipart form with `image`). | Admin |

### Uploads & Media
Uploaded files are served at:
```
http://localhost:5000/uploads/<path>
```

## Data Models
Below is a summary of the main MongoDB collections (see `backend/models/` for full schema definitions).

- **User**: admin user with hashed password and OTP fields for reset.
- **Blog**: `title`, `description`, `content`, `image`, `author`, `slug`, `date`, `link`, `order`.
- **Event**: `title`, `description`, `venue`, `date`, `month`, `imageUrl`, `youtubeUrl`, `order`.
- **Program**: `title`, `description`, `type`, `category`, `slug`, `source`, `route`, `order`.
- **Member**: `name`, `category`, `role`, `image`, `description`, `linkedin`, `order`.
- **Partner**: `name`, `description`, `imageUrl`, `order`.
- **EducationImage**: `image`, `title`, `order`.
- **MediaTestimonial**: `title`, `source`, `description`, `image`, `date`, `link`, `order`.
- **VideoTestimonial**: `name`, `title`, `description`, `ytLink`, `date`, `order`.
- **Screenshot**: `image`, `alt`, `date`, `order`.
- **HeroImage**: `page`, `imageUrl`.
- **SulabhData**: `category`, `title`, `description`, `image`, `learnMoreLink`, `videoLink`, `order`.
- **Subscriber**: `email`.

## Authentication & Authorization
- Admin login uses `/api/auth/login`, returning a JWT token.
- Frontend stores the token in `sessionStorage` and attaches it as a `Bearer` token to API calls.
- Protected endpoints use the `protect` and `authorize("admin")` middleware.

## File Uploads
- Uploads are handled via Multer and stored in `backend/uploads/`.
- Image types accepted: `jpeg`, `jpg`, `png`, `webp`.
- Uploaded files are publicly accessible via `/uploads`.

## CORS & Security Notes
The backend enables CORS for:
- `https://sharadatrust.org`
- `https://www.sharadatrust.org`
- `https://sharadatrust.in`
- `https://www.sharadatrust.in`
- `http://localhost:5173`
- `https://ngo-internship.vercel.app`

## Deployment Notes
- For production, set environment variables on both frontend and backend.
- The frontend can be hosted on Vercel/Netlify; the backend can be hosted on any Node-compatible service.
- Ensure the backend has persistent storage for `uploads/` if you need file retention.

