# Placement Cell Portal

A full-stack placement management portal for students, companies, and admins. It uses React.js, Node.js, Express.js, MongoDB Community Server through Mongoose, JWT authentication, Tailwind CSS, Axios, and React Router.

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS, Vite
- Backend: Node.js, Express.js, Mongoose, JWT, bcrypt, express-validator
- Database: local MongoDB Community Server
- Auth: JWT with role-based authorization for `student`, `company`, and `admin`

## Folder Structure

```text
placement-cell-portal/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      utils/
      validators/
  frontend/
    src/
      api/
      components/
      context/
      layouts/
      pages/
      routes/
  docs/
```

## Local Setup

1. Install MongoDB Community Server. The backend dev/start scripts will automatically run MongoDB locally with project data stored in `.mongodb-data/`.

You can also start only MongoDB manually:

```bash
npm run db
```

Keep this command running in its own terminal if you start MongoDB manually. Logs are written to `.mongodb-log/`.

2. Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

3. Confirm the local database URI in `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/placement_portal
JWT_SECRET=replace_with_a_long_random_secret
```

4. Install dependencies:

```bash
npm run install:all
```

5. Seed sample users and records:

```bash
npm run seed
```

6. Start both apps:

```bash
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Sample Logins

After seeding, all sample accounts use password `Password123!`.

- Admin: `admin@placement.local`
- Student: `student@placement.local`
- Company: `hr@techspire.local`

## API Documentation

See [docs/API.md](docs/API.md).

## Deployment Notes

- Set production values for `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.
- Use a process manager such as PM2 for the backend.
- Build the frontend with `npm run build --prefix frontend`.
- Serve the frontend build from a static host or reverse proxy.
