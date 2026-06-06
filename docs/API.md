# Placement Cell Portal API

Base URL: `http://localhost:5000/api`

All protected endpoints require:

```http
Authorization: Bearer <jwt>
```

Responses use a standard shape:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Authentication

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | public | Register a student or company |
| POST | `/auth/login` | public | Log in and receive a JWT |
| GET | `/auth/me` | authenticated | Return current user and profile |

### Register Body

```json
{
  "name": "Aarav Sharma",
  "email": "student@example.com",
  "password": "Password123!",
  "role": "student"
}
```

For company registration, use `"role": "company"` and optionally include `companyName`.

## Students

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/students/me` | student | Current student profile |
| PUT | `/students/me` | student | Update current student profile |
| GET | `/students` | admin | List students |
| GET | `/students/:id` | admin | Get student |
| PUT | `/students/:id` | admin | Update student |
| DELETE | `/students/:id` | admin | Delete student and applications |

## Companies

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/companies/me` | company | Current company profile |
| PUT | `/companies/me` | company | Update current company profile |
| GET | `/companies` | admin | List companies |
| GET | `/companies/:id` | admin | Get company |
| PUT | `/companies/:id` | admin | Update company |
| DELETE | `/companies/:id` | admin | Delete company, jobs, and applications |

## Jobs

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/jobs?status=open&q=react` | authenticated | List jobs |
| GET | `/jobs/mine` | company | List own jobs |
| GET | `/jobs/:id` | authenticated | Get job |
| POST | `/jobs` | company | Create job |
| PUT | `/jobs/:id` | company, admin | Update job |
| DELETE | `/jobs/:id` | company, admin | Delete job and applications |

### Job Body

```json
{
  "title": "Full Stack Developer",
  "description": "Build React and Node.js applications.",
  "roleType": "full_time",
  "location": "Bengaluru",
  "salaryPackage": "12 LPA",
  "deadline": "2026-07-30",
  "eligibility": {
    "minCgpa": 7,
    "departments": ["Computer Science"],
    "graduationYears": [2026]
  },
  "skillsRequired": ["React", "Node.js", "MongoDB"]
}
```

## Applications

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| POST | `/applications/jobs/:jobId` | student | Apply to job |
| GET | `/applications/mine` | student | Student application tracking |
| GET | `/applications/company` | company | Applications received |
| GET | `/applications` | admin | List all applications |
| PUT | `/applications/:id/status` | company, admin | Update application status |
| DELETE | `/applications/:id` | admin | Delete application |

### Application Body

```json
{
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am excited to apply."
}
```

### Status Body

```json
{
  "status": "shortlisted",
  "notes": "Strong profile"
}
```

## Admin

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/admin/stats` | admin | Dashboard analytics |
| GET | `/admin/users` | admin | List users |

## Collections

- `users`: auth identity, role, active flag
- `students`: student profile with `user` reference
- `companies`: company profile with `user` reference
- `jobs`: job posting with `company` reference
- `applications`: application with `student`, `company`, and `job` references
