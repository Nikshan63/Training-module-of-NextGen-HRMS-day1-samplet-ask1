# ProjectHub — Project Management & Configuration Module

> Training Batch 13–16 (2026) | Java Spring Boot + React + PostgreSQL

A full-stack project management system built as a training capstone project. Manage projects, tasks (Kanban board), team members, and project configurations.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS        |
| Backend    | Java Spring Boot 3, Spring Security |
| Auth       | JWT (JSON Web Token)                |
| Database   | PostgreSQL                          |
| Deployment | Docker Hub + Render                 |
| Version    | GitHub                              |

---

## Project Structure

```
project-management/
├── backend/                  # Spring Boot API
│   ├── src/main/java/com/projectmanagement/
│   │   ├── config/           # Security, CORS config
│   │   ├── controller/       # REST API endpoints
│   │   ├── dto/              # Request / Response DTOs
│   │   ├── entity/           # JPA Entities (DB tables)
│   │   ├── repository/       # Spring Data JPA repos
│   │   ├── security/         # JWT filter, UserDetails
│   │   └── service/          # Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                 # React Application
│   ├── src/
│   │   ├── api/              # Axios API client
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context (state mgmt)
│   │   └── pages/            # All page components
│   └── index.html
│
└── README.md
```

---

## Database Schema (ER Diagram)

Five core tables:

- **users** — stores registered users
- **projects** — projects owned by users
- **tasks** — tasks inside a project (Kanban items)
- **project_members** — many-to-many: users ↔ projects with roles
- **project_configs** — one-to-one config per project

---

## REST API Endpoints

| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | `/api/auth/register`                  | Register new user        |
| POST   | `/api/auth/login`                     | Login, returns JWT token |
| GET    | `/api/projects`                       | Get all user's projects  |
| POST   | `/api/projects`                       | Create a project         |
| PUT    | `/api/projects/{id}`                  | Update a project         |
| DELETE | `/api/projects/{id}`                  | Delete a project         |
| GET    | `/api/projects/{id}/tasks`            | Get tasks (Kanban)       |
| POST   | `/api/projects/{id}/tasks`            | Create a task            |
| PATCH  | `/api/projects/{id}/tasks/{tid}/status` | Move task on board     |
| GET    | `/api/projects/{id}/members`          | List members             |
| POST   | `/api/projects/{id}/members`          | Add a member             |
| GET    | `/api/projects/{id}/config`           | Get project config       |
| PUT    | `/api/projects/{id}/config`           | Update config            |

---

## React Forms (Task 5)

Forms built with React state management and validation:

- **Login form** — email/password with error handling
- **Register form** — name, email, password with validation
- **New Project form** — title, description, status
- **New Task form** — title, priority, due date, assignee
- **Add Member form** — email, role selection
- **Project Config form** — toggles, visibility, labels

---

## How to Run Locally

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL running locally

### 1. Set up the database

```sql
CREATE DATABASE projectdb;
```

### 2. Run the backend

```bash
cd backend
# Edit src/main/resources/application.properties if needed
./mvnw spring-boot:run
# API runs at http://localhost:8080
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### 4. Open in browser

Go to [http://localhost:5173](http://localhost:5173), register an account, and start using the app.

---

## Environment Variables (Backend)

| Variable        | Default                    | Description            |
|-----------------|----------------------------|------------------------|
| `DATABASE_URL`  | `jdbc:postgresql://localhost:5432/projectdb` | DB connection |
| `DB_USERNAME`   | `postgres`                 | DB username            |
| `DB_PASSWORD`   | `postgres`                 | DB password            |
| `JWT_SECRET`    | (set a long random string) | JWT signing key        |
| `JWT_EXPIRATION`| `86400000`                 | Token validity (ms)    |

---

## Features

- JWT-based authentication (login/register)
- Kanban board — drag tasks between TODO / IN PROGRESS / IN REVIEW / DONE
- Project CRUD with progress tracking
- Team member management with role-based access (Owner, Manager, Member, Viewer)
- Project configuration module (visibility, notifications, approvals)
- Responsive dark-themed UI

---

## Author

**Subhasis Das** | Training Batch 16 | 2026

