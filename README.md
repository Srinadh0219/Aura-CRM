# ✨ Aura CRM — Enterprise Low-Code CRM & Application Engine

<div align="center">

![Aura CRM Banner](https://img.shields.io/badge/Aura%20CRM-v2.0-0ea5e9?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS_10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**A modern, full-stack, enterprise-grade Low-Code CRM and dynamic data platform built with React 18, TypeScript, NestJS 10, Prisma ORM, and PostgreSQL.**

[Key Features](#-key-features) • [Architecture](#-role-based-access-control-rbac) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [Author](#-author)

</div>

---

## 🚀 Overview

**Aura CRM** enables organizations to build custom data models, dynamic form controls, and automated business workflows visually without writing repetitive SQL queries or boilerplate frontend code.

Featuring a futuristic **3D animated interface**, strict **Role-Based Access Control (RBAC)**, and a **dynamic JSONB schema engine**, Aura CRM gives teams the speed of low-code tools combined with the robustness of modern enterprise architecture.

---

## 🌟 Key Features

### 1. 🧩 Dynamic Low-Code Schema Engine
- **Namespaces (Applications)**: Group CRM functions by business unit (e.g., *Sales CRM*, *HR Portal*, *Support Desk*).
- **Custom Modules (Tables)**: Create custom data entities on the fly (e.g., *Leads*, *Deals*, *Contacts*, *Tickets*).
- **Dynamic Field Builder**: Configure text, numeric, email, select dropdowns, and date fields with real-time validation.
- **Auto-Generated Grids & Forms**: Forms and interactive tables adapt automatically as fields are added or modified.

### 2. 🛡️ 4-Tier Role Architecture (RBAC)
- **Superadmin**: Full platform authority, database oversight, role promotion/demotion, and user status management.
- **Admin**: Schema design, module creation, field configuration, and application management.
- **Member**: Standard operational access to create, edit, filter, and manage CRM records.
- **Viewer**: Read-only stakeholder access for inspections, reports, and data auditing.

### 3. 🎨 Futuristic 3D Animated UI / UX
- **Interactive 3D Landing Page**: High-performance hero canvas, feature matrix, and role tier cards.
- **3D Biometric Vault Login**: Custom 3D holographic diamond prism with dynamic laser scanning bars.
- **Symmetrical 3D Register Hub**: Dual-card layout with animated orbital gyro rings and floating satellites.
- **Dark Glassmorphic Theme**: Tailwind CSS glassmorphism with subtle glow backdrops and responsive mobile views.

### 4. ⚡ High-Performance Backend & OpenAPI Docs
- **NestJS 10 Architecture**: Modular controller-service-repository pattern with clean dependency injection.
- **Interactive Swagger Docs**: Full interactive OpenAPI 3.0 explorer at `/api/docs`.
- **JWT & Password Security**: Encrypted session tokens with bcrypt password hashing and Guard decorators.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Hierarchy | Permissions & Capabilities |
| :--- | :--- | :--- |
| **Superadmin** | Tier 1 (Master) | Global platform governance, assign/promote roles, toggle user status, full CRUD on all data. |
| **Admin** | Tier 2 (Architect) | Create namespaces, design modules, add custom fields, configure table schemas. |
| **Member** | Tier 3 (Operator) | Create, update, view, and search CRM records; manage personal profile & password. |
| **Viewer** | Tier 4 (Auditor) | Read-only inspection and search across records and directories. |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom 3D Keyframe Animations
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT Interceptors

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database & ORM**: Prisma ORM with PostgreSQL / SQLite support
- **Authentication**: Passport-JWT + Bcrypt
- **API Documentation**: Swagger / OpenAPI 3.0
- **Validation**: Class-Validator & Class-Transformer

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** or **yarn** / **pnpm**

---

### 1. Clone the Repository
```bash
git clone https://github.com/Srinadh0219/Aura-CRM.git
cd Aura-CRM
```

---

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup Prisma Database
npx prisma generate
npx prisma db push

# Start NestJS backend server
npm run start:dev
```
> 🚀 **Backend runs at**: `http://localhost:3000/api`  
> 📚 **Swagger Docs at**: `http://localhost:3000/api/docs`

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
> 🌐 **Frontend runs at**: `http://localhost:5173/`

---

## 📚 API Documentation

Once the backend is running, explore the interactive **Swagger REST API Docs** at:
👉 **`http://localhost:3000/api/docs`**

### Core API Endpoints:
- `POST /api/auth/register` — Register a new account *(First user automatically becomes SUPERADMIN)*.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/profile` — Fetch current user details.
- `PATCH /api/auth/profile` — Update user name.
- `POST /api/auth/change-password` — Secure password update.
- `GET /api/users` — Superadmin user list & RBAC management.
- `PATCH /api/users/:id/role` — Update user role tier.
- `GET /api/compose/namespaces` — List all dynamic applications.
- `POST /api/compose/namespaces` — Create new application namespace.
- `GET /api/compose/namespaces/:id/modules` — List modules in namespace.
- `POST /api/compose/modules/:id/records` — Create dynamic JSONB CRM record.

---

## 👨‍💻 Author

**SRINADH THATIKRINDHI**

- 🐙 **GitHub**: [@Srinadh0219](https://github.com/Srinadh0219)
- 💼 **LinkedIn**: [Srinadh Thatikrindhi](https://www.linkedin.com/in/srinadh-thatikrindhi-b0b844323/)
- ✉️ **Email**: [srinadhthatikrindhi@gmail.com](mailto:srinadhthatikrindhi@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and customize for your own applications!
