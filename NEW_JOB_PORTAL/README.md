# JobPortalPro – Next-Generation Privacy-First Career & Employment Exchange Platform

A modern, enterprise-grade Job Portal built with **Spring Boot 3 (Java 20/21)** and **Angular 18+**. The platform links Job Seekers, Verified Employers, and Platform Administrators, with an integrated **Gujarat State Employment Exchange module (Anubandhan Model)**.

---

## 🌟 Key Highlights & Architectural Pillars

1. **Zero-Leakage Contact Privacy (FR-PV-01 – FR-PV-04)**:
   - Candidate cellular phone numbers and personal emails are encrypted at rest using AES-256 / SHA-256 hashing.
   - Real-time regex sanitization intercepts messages in chat streams to replace sensitive phone numbers (Indian & international formats) or email addresses with `[contact hidden]`.
   - APIs return strict `ParticipantDto` objects containing only public identifiers (`id`, `displayName`, `avatarUrl`, `headline`, `companyName`) — zero leakage to data scrapers.

2. **In-App Masked WebRTC Calling (FR-CL-01 – FR-CL-05)**:
   - Recruiter-to-candidate audio and video screening calls take place natively in the browser via WebRTC STOMP signaling.
   - Counterparts see only name and headline—no telephone line connection is required or disclosed.

3. **Recruiter ATS Kanban Pipeline**:
   - Visual candidate progression: `NEW` ➔ `SCREENED` ➔ `SHORTLISTED` ➔ `INTERVIEW_SCHEDULED` ➔ `OFFER_SENT` ➔ `HIRED` / `REJECTED`.
   - Review candidate screening answers, rate candidate (1–5 stars), leave internal interview notes, and launch 1-click masked voice/video calls or chats.

4. **Gujarat Employment Exchange (Anubandhan Model)**:
   - Digital Employment Card with simulated security QR and registration ID (`GJ-EXCH-2026-XXXXX`).
   - Integrated listings of upcoming government job camps (Rozgar Mela) and state welfare apprentice schemes (MYSY, Skill India Digital, NAPS).

---

## 🔑 Pre-Configured Test Accounts (Seed Data)

The system automatically initializes seed accounts on first startup. You can also use the **1-Click Demo Login** buttons on the `/login` page:

| Persona | Email | Password | Role & Details |
|---|---|---|---|
| **Platform SuperAdmin** | `admin@jobportal.com` | `password123` | System stats, KYC verification queue, job moderation |
| **TechCorp Recruiter** | `recruiter@techcorp.com` | `password123` | Verified employer (TechCorp Innovations), ATS Kanban access |
| **NextGen AI HR** | `hr@nextgenai.com` | `password123` | Generative AI employer with open requisitions |
| **Job Seeker 1** | `seeker@example.com` | `password123` | Alex Sharma (Full Stack Dev, Gujarat Exchange Registered) |
| **Job Seeker 2** | `priya@example.com` | `password123` | Priya Patel (DevOps & Cloud Solutions Architect) |

---

## 🚀 Quick Start: Running Locally (Zero-Friction Dev Mode)

The project includes an embedded H2 database and in-process WebSocket fallback, so you can run the entire application locally without Docker.

### 1. Backend (Spring Boot 3)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
- Server starts at: `http://localhost:8080`
- REST API Base: `http://localhost:8080/api`
- STOMP WebSocket Endpoint: `http://localhost:8080/ws-jobportal`
- H2 In-Memory DB Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:jobportal`)

### 2. Frontend (Angular 18+)
```powershell
cd frontend
npm start
```
- Web Application opens at: `http://localhost:4200`

---

## 🐳 Running with Docker Compose (Production Stack)

To launch the full production environment including PostgreSQL 16, Redis 7, Apache Kafka & Zookeeper, coturn STUN/TURN, Spring Boot backend, and Nginx Angular frontend:

```bash
docker compose up --build
```

Services exposed:
- Frontend Web App: `http://localhost:4200`
- Backend REST API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Kafka Event Broker: `localhost:9092`
- coturn STUN/TURN: `localhost:3478`

---

## 🧪 Verification & Automated Testing

### Backend Maven Tests
```powershell
cd backend
.\mvnw.cmd test
```
Runs the test suite, including:
- `ContactMaskingUtilTest`: Validates regex phone masking (`+91 9876543210`, `9876543210`, `9876-543-210`) and email masking.
- `PrivacyDtoTest`: Validates serialization safety ensuring `ParticipantDto` never exposes email or telephone fields.

### Frontend Production Build
```powershell
cd frontend
npm run build
```
Generates the optimized Angular bundle in `frontend/dist/jobportal-frontend/browser`.
