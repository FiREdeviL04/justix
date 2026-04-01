# Justix

Justix is a full-stack platform that connects middle-class customers with affordable lawyers, while giving beginner to mid-level lawyers a practical way to showcase experience and get discovered.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB (Atlas-ready)
- Auth: JWT + bcrypt
- Deployment: Vercel (frontend) + Render/Railway (backend)

## Project Structure

```text
Justix/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    .env.example
    package.json
    render.yaml
  frontend/
    src/
      api/
      components/
      context/
      pages/
    .env.example
    package.json
    tailwind.config.js
    vercel.json
  README.md
```

## Core Features

### Roles

- Admin
  - Login only (created from environment variables)
  - Approve/reject lawyer profiles
  - Manage users
  - Dashboard analytics
- Lawyer
  - Register/login
  - Create/edit profile
  - Add case studies
  - Set pricing and availability
  - View/respond to inquiries
- Customer
  - Register/login
  - Search/filter lawyers
  - Save favorites
  - Contact lawyers and schedule call/meeting

### Lawyer Categorization

- Experience levels:
  - Beginner (0-2 years)
  - Intermediate (2-5 years)
  - Experienced (5+ years)
- Practice areas:
  - Criminal Law
  - Civil Law
  - Family Law
  - Corporate Law
  - Property Law
  - Cyber Law
- Budget:
  - Low Cost
  - Medium
  - Premium

## Backend Setup

1. Open terminal in `backend`.
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example` and fill values.
4. Start dev server:
   - `npm run dev`

Backend runs on `http://localhost:5000` by default.

### Required Backend Env

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Frontend Setup

1. Open terminal in `frontend`.
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example`.
4. Start dev server:
   - `npm run dev`

Frontend runs on `http://localhost:5173` by default.

### Required Frontend Env

- `VITE_API_URL` (example: `http://localhost:5000/api`)

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Lawyer

- `GET /api/lawyers`
- `GET /api/lawyers/:id`
- `GET /api/lawyers/me`
- `PUT /api/lawyers/profile`
- `POST /api/lawyers/case-study`
- `GET /api/lawyers/inquiries/all`
- `PUT /api/lawyers/inquiries/:inquiryId/respond`

### Customer

- `GET /api/search`
- `POST /api/inquiry`
- `GET /api/customer/bookings`
- `GET /api/customer/favorites`
- `POST /api/customer/favorites`
- `DELETE /api/customer/favorites/:lawyerId`

### Admin

- `GET /api/admin/users`
- `GET /api/admin/stats`
- `PUT /api/admin/approve-lawyer`

## Security

- JWT authentication with role checks
- Password hashing via bcrypt
- Protected routes for lawyer, customer, and admin actions
- Helmet + CORS enabled

## Deployment

### Frontend (Vercel)

1. Import `frontend` folder to Vercel.
2. Add env `VITE_API_URL` with deployed backend URL.
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Render)

1. Import repo and set root directory to `backend`.
2. Render can use `render.yaml`.
3. Add all backend env variables from `.env.example`.
4. Build command: `npm install`
5. Start command: `npm start`

### Railway (Alternative)

- Point service to `backend` folder.
- Add the same environment variables.
- Start command: `npm start`

## Optional Future Enhancements

- Ratings and reviews submissions
- AI recommendation engine
- Real-time chat
- Booking payment integration

## Notes

- Lawyers are marked `pending` after profile edits/case updates and require admin approval.
- The admin account is auto-seeded at startup using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
