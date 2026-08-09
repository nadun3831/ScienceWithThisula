# Implementation Plan
## Modern Learning Management System (LMS)

**Version:** 1.0
**Companion Document:** `PRD.md`
**Audience:** Developer(s) implementing phase-by-phase without needing to redesign architecture.

---

## Table of Contents

1. Technical Architecture & Stack
2. System Architecture
3. Database Architecture (Schema + ERD)
4. API Architecture & Endpoint Specification
5. Authentication & Authorization Architecture
6. Frontend Architecture & Folder Structure
7. Backend Folder Structure
8. Implementation Phases (1–16)
9. Development Order & Dependency Graph
10. Testing Strategy
11. Security Strategy
12. Git Strategy
13. Deployment Strategy
14. Environment Variables
15. Definition of Done (Global) & Development Checklist
16. Architecture Review — Risks Identified & Mitigations

---

## 1. Technical Architecture & Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite, JavaScript, Tailwind CSS, React Router v6, Axios, React Hook Form |
| Backend | Laravel (latest LTS-compatible version), PHP 8.2+ |
| Auth | Laravel Sanctum (SPA token-based) |
| Authorization | Laravel Policies + Gates |
| Validation | Laravel Form Requests |
| API Shaping | Laravel API Resources / Resource Collections |
| Async Work | Laravel Jobs + Queues (database or Redis driver) |
| Database | MySQL 8.x, Eloquent ORM |
| File Storage | Laravel Filesystem — `local` disk in dev, S3-compatible driver in production |
| Tooling | Git/GitHub, Postman/Insomnia, VS Code |

The system is a **decoupled SPA + API**: Laravel never renders Blade views for the app itself (only for system emails / certificate PDF templates). React owns 100% of the UI.

---

## 2. System Architecture

```
┌────────────────────┐        HTTPS / JSON         ┌─────────────────────────┐
│   React SPA (Vite)  │ ───────────────────────────▶ │  Laravel API (Sanctum)  │
│  - Pages/Features   │ ◀─────────────────────────── │  - Controllers          │
│  - Axios service     │        Bearer Token         │  - Form Requests        │
│    layer             │                              │  - Policies/Gates       │
└────────────────────┘                              │  - Services (business    │
                                                       │    logic)               │
                                                       │  - Jobs/Queues          │
                                                       └────────────┬────────────┘
                                                                    │ Eloquent
                                                       ┌────────────▼────────────┐
                                                       │        MySQL 8          │
                                                       └──────────────────────────┘
                                                                    │
                                                       ┌────────────▼────────────┐
                                                       │  Filesystem (local/S3)  │
                                                       │  videos, pdfs, images,  │
                                                       │  certificate PDFs        │
                                                       └──────────────────────────┘
```

**Key architectural rules (binding for all phases):**
- Controllers stay thin: validate (via Form Requests) → authorize (via Policies) → delegate to a Service → return a Resource.
- Business logic (progress calculation, quiz scoring, certificate generation, course-state transitions) lives in `app/Services/*`, never in controllers or React components.
- Large binary files (video, PDF, images, generated certificates) are never stored as MySQL BLOBs — only paths/URLs are stored; actual bytes go to the filesystem disk (local dev, S3-compatible in prod) behind a `FileStorageService` abstraction so swapping disks requires only config changes.
- All multi-step writes (e.g., quiz submission → score → progress update → possible certificate issuance) run inside a DB transaction.
- Frequently filtered/joined columns are indexed (see Section 3).
- Frontend never trusts computed values (score, progress %, correctness) that should come from the server — these are always re-fetched/returned by the API, not computed client-side, except for optimistic UI that is later reconciled.

---

## 3. Database Architecture

### 3.1 ERD (textual)

```
users (1) ───< enrollments >─── (1) courses
users (1) ───< courses (as instructor)
users (1) ───< reviews >─── (1) courses
users (1) ───< notifications
users (1) ───< quiz_attempts

categories (1) ───< courses

courses (1) ───< course_sections (1) ───< lessons (1) ───< lesson_resources
course_sections (1) ───< quizzes (1) ───< quiz_questions (1) ───< quiz_options

enrollments (1) ───< lesson_progress >─── (1) lessons
enrollments (1) ───< certificates  (1:0..1, unique per enrollment)

quizzes (1) ───< quiz_attempts (1) ───< quiz_attempt_answers >─── (1) quiz_options

courses (1) ───< reports  (polymorphic target, also reviews (1) ───< reports)
```

### 3.2 Table Specifications

> Convention: all tables use `id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`, `created_at`/`updated_at` timestamps unless noted, and `utf8mb4` charset. Soft deletes (`deleted_at`) are used where "undo" or audit matters (users, courses, reviews).

#### `users`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| name | VARCHAR(150) | NOT NULL |
| email | VARCHAR(191) | NOT NULL, UNIQUE |
| email_verified_at | TIMESTAMP | NULLABLE |
| password | VARCHAR(255) | NOT NULL (hashed) |
| role | ENUM('student','instructor','admin') | NOT NULL, DEFAULT 'student', INDEX |
| avatar_path | VARCHAR(255) | NULLABLE |
| bio | TEXT | NULLABLE |
| is_active | BOOLEAN | NOT NULL, DEFAULT true |
| remember_token | VARCHAR(100) | NULLABLE |
| deleted_at | TIMESTAMP | NULLABLE (soft delete) |
| created_at, updated_at | TIMESTAMP | |

Indexes: `role`, `email` (unique). Note: no separate `roles` table for MVP — a single-role ENUM is sufficient and simpler than a full RBAC join-table system; documented as a deliberate simplification (see Section 16, Risk R-4) with a migration path to a `roles`/`permissions` pivot if multi-role-per-user is ever needed.

#### `categories`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| name | VARCHAR(100) | NOT NULL |
| slug | VARCHAR(120) | NOT NULL, UNIQUE |
| description | TEXT | NULLABLE |
| created_at, updated_at | TIMESTAMP | |

#### `courses`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| instructor_id | BIGINT UNSIGNED | FK → users.id, NOT NULL, INDEX |
| category_id | BIGINT UNSIGNED | FK → categories.id, NOT NULL, INDEX |
| title | VARCHAR(200) | NOT NULL |
| slug | VARCHAR(220) | NOT NULL, UNIQUE |
| description | TEXT | NOT NULL |
| thumbnail_path | VARCHAR(255) | NULLABLE |
| difficulty | ENUM('beginner','intermediate','advanced') | NOT NULL, DEFAULT 'beginner' |
| price | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 |
| is_free | BOOLEAN | NOT NULL, DEFAULT true |
| duration_minutes | INT UNSIGNED | NULLABLE (derived/estimated) |
| objectives | JSON | NULLABLE (array of strings) |
| requirements | JSON | NULLABLE (array of strings) |
| status | ENUM('draft','pending_approval','approved','rejected','published') | NOT NULL, DEFAULT 'draft', INDEX |
| rejection_reason | TEXT | NULLABLE |
| requires_quiz_pass | BOOLEAN | NOT NULL, DEFAULT true (whether section quizzes are mandatory for completion) |
| average_rating | DECIMAL(3,2) | NOT NULL, DEFAULT 0.00 (denormalized cache) |
| ratings_count | INT UNSIGNED | NOT NULL, DEFAULT 0 (denormalized cache) |
| enrollments_count | INT UNSIGNED | NOT NULL, DEFAULT 0 (denormalized cache for popularity sort) |
| published_at | TIMESTAMP | NULLABLE |
| deleted_at | TIMESTAMP | NULLABLE |
| created_at, updated_at | TIMESTAMP | |

Indexes: `status`, `category_id`, `instructor_id`, composite `(status, category_id)` for filtered listing; FULLTEXT on `(title, description)` for search.

#### `course_sections`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| course_id | BIGINT UNSIGNED | FK → courses.id, NOT NULL, INDEX, ON DELETE CASCADE |
| title | VARCHAR(200) | NOT NULL |
| order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 |
| created_at, updated_at | TIMESTAMP | |

Unique constraint: `(course_id, order)`.

#### `lessons`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| course_section_id | BIGINT UNSIGNED | FK → course_sections.id, NOT NULL, INDEX, ON DELETE CASCADE |
| title | VARCHAR(200) | NOT NULL |
| type | ENUM('video','text','pdf','external_link') | NOT NULL |
| content | JSON | NOT NULL — shape depends on `type`: `{video_path, duration_seconds}` / `{body_html}` / `{file_path}` / `{url}` |
| order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 |
| is_previewable | BOOLEAN | NOT NULL, DEFAULT false (free preview before enrollment) |
| created_at, updated_at | TIMESTAMP | |

Unique constraint: `(course_section_id, order)`. The `content` JSON column is the key extensibility point — new lesson types add a new `type` enum value and a new JSON shape, with no new table/migration required for the common case, satisfying the PRD's "additional lesson types added later" requirement.

#### `lesson_resources`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| lesson_id | BIGINT UNSIGNED | FK → lessons.id, NOT NULL, INDEX, ON DELETE CASCADE |
| title | VARCHAR(200) | NOT NULL |
| file_path | VARCHAR(255) | NOT NULL |
| file_type | VARCHAR(50) | NOT NULL (mime type) |
| file_size_bytes | BIGINT UNSIGNED | NOT NULL |
| created_at, updated_at | TIMESTAMP | |

#### `enrollments`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| student_id | BIGINT UNSIGNED | FK → users.id, NOT NULL, INDEX |
| course_id | BIGINT UNSIGNED | FK → courses.id, NOT NULL, INDEX |
| status | ENUM('in_progress','completed') | NOT NULL, DEFAULT 'in_progress', INDEX |
| progress_percent | DECIMAL(5,2) | NOT NULL, DEFAULT 0.00 |
| current_lesson_id | BIGINT UNSIGNED | FK → lessons.id, NULLABLE |
| enrolled_at | TIMESTAMP | NOT NULL |
| completed_at | TIMESTAMP | NULLABLE |
| created_at, updated_at | TIMESTAMP | |

Unique constraint: `(student_id, course_id)` — prevents duplicate enrollment (FR-ENROLL-1 enforced at DB level, not just app level).

#### `lesson_progress`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| enrollment_id | BIGINT UNSIGNED | FK → enrollments.id, NOT NULL, INDEX, ON DELETE CASCADE |
| lesson_id | BIGINT UNSIGNED | FK → lessons.id, NOT NULL, INDEX |
| completed_at | TIMESTAMP | NULLABLE |
| created_at, updated_at | TIMESTAMP | |

Unique constraint: `(enrollment_id, lesson_id)` — this single constraint is what makes FR-PROGRESS-4 (idempotent completion) enforceable at the database level: a second "mark complete" call is an upsert, not a new row.

#### `quizzes`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| course_section_id | BIGINT UNSIGNED | FK → course_sections.id, NOT NULL, UNIQUE, ON DELETE CASCADE |
| title | VARCHAR(200) | NOT NULL |
| passing_score_percent | TINYINT UNSIGNED | NOT NULL, DEFAULT 70 |
| time_limit_minutes | SMALLINT UNSIGNED | NULLABLE (null = untimed) |
| max_attempts | SMALLINT UNSIGNED | NULLABLE (null = unlimited) |
| created_at, updated_at | TIMESTAMP | |

`UNIQUE` on `course_section_id` reflects the PRD's "one quiz per module" structure; if multiple quizzes per section are later needed, this is a single constraint drop, not a redesign.

#### `quiz_questions`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| quiz_id | BIGINT UNSIGNED | FK → quizzes.id, NOT NULL, INDEX, ON DELETE CASCADE |
| question_text | TEXT | NOT NULL |
| type | ENUM('single_choice','multiple_choice') | NOT NULL, DEFAULT 'single_choice' |
| marks | SMALLINT UNSIGNED | NOT NULL, DEFAULT 1 |
| order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 |
| created_at, updated_at | TIMESTAMP | |

#### `quiz_options`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| quiz_question_id | BIGINT UNSIGNED | FK → quiz_questions.id, NOT NULL, INDEX, ON DELETE CASCADE |
| option_text | VARCHAR(500) | NOT NULL |
| is_correct | BOOLEAN | NOT NULL, DEFAULT false |
| order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 |
| created_at, updated_at | TIMESTAMP | |

`is_correct` is **never serialized to the client** for a question the student is actively attempting (enforced at the Resource layer, not just by convention).

#### `quiz_attempts`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| quiz_id | BIGINT UNSIGNED | FK → quizzes.id, NOT NULL, INDEX |
| student_id | BIGINT UNSIGNED | FK → users.id, NOT NULL, INDEX |
| enrollment_id | BIGINT UNSIGNED | FK → enrollments.id, NOT NULL, INDEX |
| started_at | TIMESTAMP | NOT NULL |
| submitted_at | TIMESTAMP | NULLABLE |
| score_percent | DECIMAL(5,2) | NULLABLE |
| passed | BOOLEAN | NULLABLE |
| created_at, updated_at | TIMESTAMP | |

Composite index `(quiz_id, student_id)` for attempt-count checks against `max_attempts`.

#### `quiz_attempt_answers`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| quiz_attempt_id | BIGINT UNSIGNED | FK → quiz_attempts.id, NOT NULL, INDEX, ON DELETE CASCADE |
| quiz_question_id | BIGINT UNSIGNED | FK → quiz_questions.id, NOT NULL |
| quiz_option_id | BIGINT UNSIGNED | FK → quiz_options.id, NOT NULL |
| created_at, updated_at | TIMESTAMP | |

One row per (attempt, question, selected option) — supports `multiple_choice` questions naturally (multiple rows for the same question).

#### `certificates`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| enrollment_id | BIGINT UNSIGNED | FK → enrollments.id, NOT NULL, UNIQUE, ON DELETE CASCADE |
| student_id | BIGINT UNSIGNED | FK → users.id, NOT NULL, INDEX |
| course_id | BIGINT UNSIGNED | FK → courses.id, NOT NULL, INDEX |
| certificate_code | VARCHAR(40) | NOT NULL, UNIQUE, INDEX |
| status | ENUM('active','revoked') | NOT NULL, DEFAULT 'active' |
| pdf_path | VARCHAR(255) | NULLABLE |
| issued_at | TIMESTAMP | NOT NULL |
| revoked_at | TIMESTAMP | NULLABLE |
| created_at, updated_at | TIMESTAMP | |

`UNIQUE` on `enrollment_id` guarantees exactly one certificate per completed enrollment (satisfies PRD Section 17 assumption). `certificate_code` is a non-guessable public identifier (UUID v4 or a high-entropy short code), never the auto-increment `id`.

#### `reviews`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| student_id | BIGINT UNSIGNED | FK → users.id, NOT NULL, INDEX |
| course_id | BIGINT UNSIGNED | FK → courses.id, NOT NULL, INDEX |
| rating | TINYINT UNSIGNED | NOT NULL (1–5, app-level + DB CHECK constraint) |
| comment | TEXT | NULLABLE |
| deleted_at | TIMESTAMP | NULLABLE (soft delete) |
| created_at, updated_at | TIMESTAMP | |

Unique constraint: `(student_id, course_id)` — enforces FR-REVIEW-1's "one review per student per course."

#### `notifications`
Uses Laravel's built-in notifications table shape (polymorphic `notifiable`), extended as needed:
| Column | Type | Constraints |
|---|---|---|
| id | CHAR(36) UUID | PK |
| type | VARCHAR(255) | NOT NULL (notification class name) |
| notifiable_type | VARCHAR(255) | NOT NULL |
| notifiable_id | BIGINT UNSIGNED | NOT NULL |
| data | JSON | NOT NULL |
| read_at | TIMESTAMP | NULLABLE, INDEX |
| created_at, updated_at | TIMESTAMP | |

Composite index `(notifiable_type, notifiable_id)`.

#### `reports` (moderation queue — covers both reported courses and reported reviews via polymorphism)
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| reporter_id | BIGINT UNSIGNED | FK → users.id, NOT NULL |
| reportable_type | VARCHAR(255) | NOT NULL |
| reportable_id | BIGINT UNSIGNED | NOT NULL |
| reason | VARCHAR(500) | NOT NULL |
| status | ENUM('open','resolved','dismissed') | NOT NULL, DEFAULT 'open', INDEX |
| resolved_by | BIGINT UNSIGNED | FK → users.id, NULLABLE |
| resolved_at | TIMESTAMP | NULLABLE |
| created_at, updated_at | TIMESTAMP | |

Index: `(reportable_type, reportable_id)`.

#### `personal_access_tokens` (Sanctum default) and `password_reset_tokens`, `sessions`, `jobs`, `failed_jobs` use Laravel's standard migrations — not redefined here.

### 3.3 Design Notes / Deviations from the PRD's Suggested List
- No standalone `roles` table in MVP — a `role` ENUM on `users` is simpler and sufficient; documented as a scoped simplification with a clear upgrade path (Section 16, R-4).
- Added `reports` (not in the PRD's suggested list) to cleanly support "manage reported content" (Admin requirement) without overloading `reviews`/`courses` with moderation flags.
- Added denormalized counters (`average_rating`, `ratings_count`, `enrollments_count` on `courses`) to keep listing/search/sort performant without aggregate queries on every request; these are recalculated transactionally whenever their source rows change (new review, new enrollment).
- `lesson.content` uses JSON rather than per-type columns to satisfy the PRD's explicit requirement that new lesson types be addable without breaking schema changes.

---

## 4. API Architecture & Endpoint Specification

**Base path:** `/api/v1` (versioned from day one). **Format:** JSON in/out. **Auth:** `Authorization: Bearer <token>` (Sanctum personal access token issued at login).

**Conventions:**
- Public/student-facing course routes are prefixed by domain, not role, where they're truly public (`/api/v1/courses`).
- Role-scoped write routes are prefixed `/api/v1/instructor/...` and `/api/v1/admin/...` and protected by `auth:sanctum` + a role middleware (`role:instructor`, `role:admin`).
- All list endpoints support `page` and `per_page` (default 15, max 50) and return Laravel's standard paginated shape (`data`, `links`, `meta`).
- All error responses follow `{ "message": string, "errors": {field: [msg]} }` (Laravel's default validation shape) with correct HTTP status codes (401 unauthenticated, 403 unauthorized, 404 not found, 422 validation, 429 rate-limited).

### 4.1 Authentication
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | No | — | Register as student or instructor. Body: `name, email, password, password_confirmation, role(student|instructor)`. |
| POST | `/api/v1/auth/login` | No | — | Login. Body: `email, password`. Returns user + token. |
| POST | `/api/v1/auth/logout` | Yes | Any | Revoke current token. |
| POST | `/api/v1/auth/forgot-password` | No | — | Send reset link. Body: `email`. |
| POST | `/api/v1/auth/reset-password` | No | — | Reset password. Body: `token, email, password, password_confirmation`. |
| POST | `/api/v1/auth/email/verify/{id}/{hash}` | Signed URL | Any | Verify email (signed route, Laravel default pattern). |
| POST | `/api/v1/auth/email/resend` | Yes | Any | Resend verification email. |
| GET | `/api/v1/auth/me` | Yes | Any | Return current authenticated user profile. |

### 4.2 Users / Profile
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| PUT | `/api/v1/profile` | Yes | Any | Update own name/bio/avatar. |
| PUT | `/api/v1/profile/password` | Yes | Any | Change own password (requires current password). |

### 4.3 Categories
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/categories` | No | — | List all categories (public, for filters). |
| POST | `/api/v1/admin/categories` | Yes | admin | Create category. |
| PUT | `/api/v1/admin/categories/{category}` | Yes | admin | Update category. |
| DELETE | `/api/v1/admin/categories/{category}` | Yes | admin | Delete category (blocked if courses reference it). |

### 4.4 Courses (Public Discovery)
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/courses` | No | — | List `published` courses. Query: `search, category_id, difficulty, price(free|paid), min_rating, sort(newest|popular|rating), page, per_page`. |
| GET | `/api/v1/courses/{course:slug}` | No | — | Course detail (curriculum outline, instructor, rating summary, reviews page 1). Lessons' full `content` is withheld for non-enrolled students except `is_previewable` lessons. |

### 4.5 Courses (Instructor Authoring)
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/instructor/courses` | Yes | instructor | List own courses (any status). |
| POST | `/api/v1/instructor/courses` | Yes | instructor | Create course (`draft`). |
| GET | `/api/v1/instructor/courses/{course}` | Yes | instructor (owner) | Full course detail incl. all sections/lessons/quizzes. |
| PUT | `/api/v1/instructor/courses/{course}` | Yes | instructor (owner) | Update metadata. |
| DELETE | `/api/v1/instructor/courses/{course}` | Yes | instructor (owner) | Delete/archive (blocked if active enrollments — becomes archive). |
| POST | `/api/v1/instructor/courses/{course}/submit` | Yes | instructor (owner) | `draft`/`rejected` → `pending_approval`. |
| POST | `/api/v1/instructor/courses/{course}/publish` | Yes | instructor (owner) | `approved` → `published`. |
| POST | `/api/v1/instructor/courses/{course}/unpublish` | Yes | instructor (owner) | `published` → `approved`. |

### 4.6 Sections & Lessons (Instructor)
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| POST | `/api/v1/instructor/courses/{course}/sections` | Yes | instructor (owner) | Create section. |
| PUT | `/api/v1/instructor/sections/{section}` | Yes | instructor (owner via course) | Update section (title/order). |
| DELETE | `/api/v1/instructor/sections/{section}` | Yes | instructor (owner) | Delete section (cascades lessons/quiz). |
| POST | `/api/v1/instructor/sections/{section}/lessons` | Yes | instructor (owner) | Create lesson (`type`, `content`, `order`). |
| PUT | `/api/v1/instructor/lessons/{lesson}` | Yes | instructor (owner) | Update lesson. |
| DELETE | `/api/v1/instructor/lessons/{lesson}` | Yes | instructor (owner) | Delete lesson. |
| POST | `/api/v1/instructor/lessons/{lesson}/media` | Yes | instructor (owner) | Upload video/pdf file for this lesson (multipart). |
| POST | `/api/v1/instructor/lessons/{lesson}/resources` | Yes | instructor (owner) | Attach downloadable resource file. |
| DELETE | `/api/v1/instructor/lesson-resources/{resource}` | Yes | instructor (owner) | Remove a resource. |

### 4.7 Lessons & Content (Student Consumption)
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/lessons/{lesson}` | Yes | student (enrolled) or preview | Full lesson content (gated by enrollment unless `is_previewable`). |
| POST | `/api/v1/lessons/{lesson}/complete` | Yes | student (enrolled) | Mark lesson complete (idempotent upsert). Triggers progress recalculation. |

### 4.8 Enrollments & Progress
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| POST | `/api/v1/courses/{course}/enroll` | Yes | student, verified | Create enrollment (409 if already enrolled, 422 if course not published). |
| GET | `/api/v1/student/enrollments` | Yes | student | List own enrollments. Query: `status(in_progress|completed)`. |
| GET | `/api/v1/student/enrollments/{enrollment}/progress` | Yes | student (owner) | Detailed per-section/per-lesson progress breakdown. |
| GET | `/api/v1/student/enrollments/{enrollment}/continue` | Yes | student (owner) | Resolve the "current lesson" to resume at. |

### 4.9 Quizzes
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| POST | `/api/v1/instructor/sections/{section}/quiz` | Yes | instructor (owner) | Create quiz for section (title, passing_score, time_limit, max_attempts). |
| PUT | `/api/v1/instructor/quizzes/{quiz}` | Yes | instructor (owner) | Update quiz settings. |
| POST | `/api/v1/instructor/quizzes/{quiz}/questions` | Yes | instructor (owner) | Add question with options (correct flags included, since this is the authoring context). |
| PUT | `/api/v1/instructor/questions/{question}` | Yes | instructor (owner) | Update question/options. |
| DELETE | `/api/v1/instructor/questions/{question}` | Yes | instructor (owner) | Delete question. |
| GET | `/api/v1/quizzes/{quiz}` | Yes | student (enrolled) | Quiz + questions + options **without** `is_correct`. |
| POST | `/api/v1/quizzes/{quiz}/attempts` | Yes | student (enrolled) | Start a new attempt (validates `max_attempts`). |
| POST | `/api/v1/quiz-attempts/{attempt}/submit` | Yes | student (owner) | Submit answers `{answers: [{question_id, option_ids: []}]}`; server scores, validates timing, returns result. |
| GET | `/api/v1/student/quizzes/{quiz}/attempts` | Yes | student (owner) | Own attempt history for a quiz. |

### 4.10 Certificates
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/student/certificates` | Yes | student | List own certificates. |
| GET | `/api/v1/student/certificates/{certificate}/download` | Yes | student (owner) | Download certificate PDF. |
| GET | `/api/v1/verify-certificate/{code}` | No | — | Public verification: status, student display name, course title, issued_at. |
| POST | `/api/v1/admin/certificates/{certificate}/revoke` | Yes | admin | Revoke a certificate. |

### 4.11 Reviews
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/courses/{course}/reviews` | No | — | Paginated list of reviews for a course. |
| POST | `/api/v1/courses/{course}/reviews` | Yes | student (enrolled) | Create own review (409 if one already exists — use PUT instead). |
| PUT | `/api/v1/reviews/{review}` | Yes | student (owner) | Update own review. |
| DELETE | `/api/v1/reviews/{review}` | Yes | student (owner) | Delete own review. |
| POST | `/api/v1/reviews/{review}/report` | Yes | student | Report a review for moderation. |

### 4.12 Notifications
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/notifications` | Yes | Any | List own notifications (paginated), `unread_count` in meta. |
| POST | `/api/v1/notifications/{notification}/read` | Yes | Any (owner) | Mark one as read. |
| POST | `/api/v1/notifications/read-all` | Yes | Any | Mark all as read. |

### 4.13 Dashboards
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/student/dashboard` | Yes | student | Aggregated dashboard payload (Section 8.11 metrics). |
| GET | `/api/v1/instructor/dashboard` | Yes | instructor | Aggregated dashboard payload, scoped to own courses. |
| GET | `/api/v1/admin/dashboard` | Yes | admin | Platform-wide aggregated stats. |

### 4.14 Admin
| Method | URL | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/api/v1/admin/users` | Yes | admin | List/search/filter users. |
| PUT | `/api/v1/admin/users/{user}` | Yes | admin | Update role/active status. |
| GET | `/api/v1/admin/courses` | Yes | admin | List all courses (any status), filter by `status`. |
| POST | `/api/v1/admin/courses/{course}/approve` | Yes | admin | `pending_approval` → `approved`. |
| POST | `/api/v1/admin/courses/{course}/reject` | Yes | admin | `pending_approval` → `rejected` (body: `reason`). |
| GET | `/api/v1/admin/reports` | Yes | admin | List moderation queue, filter `status`. |
| POST | `/api/v1/admin/reports/{report}/resolve` | Yes | admin | Resolve/dismiss a report. |

Every write endpoint above validates via a dedicated Form Request (e.g., `StoreCourseRequest`, `SubmitQuizAttemptRequest`) and authorizes via a matching Policy method (e.g., `CoursePolicy::update`, `QuizAttemptPolicy::submit`) before delegating to a Service class.

---

## 5. Authentication & Authorization Architecture

- **Auth mechanism:** Laravel Sanctum, token-based (personal access tokens), suitable for a SPA served from a different origin/build pipeline than the API without needing shared-cookie domain configuration. Tokens are stored client-side (memory + secure storage strategy documented in Frontend Architecture) and sent as `Authorization: Bearer`.
- **Middleware stack (typical protected route group):** `auth:sanctum` → `verified` (where email verification is required, e.g., enroll/submit-course) → `role:<role>` (custom middleware checking `$request->user()->role`).
- **Policies (one per model needing ownership checks):** `CoursePolicy` (update/delete/submit/publish restricted to owning instructor or admin), `SectionPolicy`/`LessonPolicy` (derive ownership via parent course), `QuizPolicy`/`QuestionPolicy` (derive via section→course), `EnrollmentPolicy` (view/progress restricted to the enrolled student), `QuizAttemptPolicy` (start/submit/view restricted to the attempt's student), `ReviewPolicy` (update/delete restricted to the review's author), `CertificatePolicy` (view/download restricted to the certificate's student; revoke restricted to admin).
- **Gates:** simple boolean checks not tied to a specific model instance, e.g., `Gate::define('access-admin-panel', fn($user) => $user->role === 'admin')`.
- **Ownership-check pattern:** every Policy method that receives a model re-derives the "owner" from the database relationship (e.g., `$course->instructor_id === $user->id`), never from a client-supplied field — this is the core defense against the "instructor accessing another instructor's data" risk called out in the PRD.

---

## 6. Frontend Architecture & Folder Structure

```
src/
├── app/                 # App shell: router setup, providers composition
├── assets/              # Static images, fonts
├── components/          # Generic, reusable, presentation-only UI (Button, Card, Modal, Table, ProgressBar, Toast)
├── layouts/             # PublicLayout, StudentLayout, InstructorLayout, AdminLayout
├── features/            # Domain-driven modules, each self-contained:
│   ├── auth/            #   components, hooks (useAuth), api calls
│   ├── courses/
│   ├── enrollment/
│   ├── progress/
│   ├── quizzes/
│   ├── certificates/
│   ├── reviews/
│   ├── notifications/
│   ├── dashboard-student/
│   ├── dashboard-instructor/
│   └── admin/
├── pages/                # Route-level components composing features + layout
├── hooks/                 # Cross-cutting hooks (usePagination, useDebounce, useToast)
├── services/               # api.js (axios instance + interceptors), per-domain api wrappers re-exported by features
├── contexts/                # AuthContext, NotificationContext
├── routes/                    # route definitions, ProtectedRoute, RoleRoute
├── utils/                       # formatters, validators, constants
└── main.jsx / App.jsx
```

**Key decisions:**
- `services/api.js` holds a single Axios instance with a request interceptor (attach bearer token) and a response interceptor (handle 401 → logout/redirect, surface validation errors uniformly).
- `contexts/AuthContext` wraps the app, exposing `user`, `login`, `logout`, `hasRole`.
- `routes/ProtectedRoute` (must be authenticated) and `routes/RoleRoute` (must be authenticated + specific role) wrap route elements; unauthorized access redirects rather than rendering role-specific UI conditionally deep in a page (defense in depth alongside the backend's own enforcement — the frontend check is UX only, never the security boundary).
- Business logic (e.g., "is this course completable," "format progress %") lives in feature-level hooks/services, not inline in page components, per the PRD's architecture rules.
- Loading/empty/error states are handled via small reusable primitives (`<AsyncBoundary>` or per-feature loading/error components) rather than ad hoc per page.

---

## 7. Backend Folder Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/V1/
│   │   │   ├── Auth/
│   │   │   ├── Student/
│   │   │   ├── Instructor/
│   │   │   ├── Admin/
│   │   │   └── Public/         # courses listing/detail, categories, verify-certificate
│   ├── Requests/                 # one Form Request per validated action
│   ├── Resources/                 # one Resource per API-facing model shape
│   └── Middleware/                  # RoleMiddleware, etc.
├── Models/
├── Policies/
├── Services/                          # CourseLifecycleService, ProgressService, QuizGradingService,
│                                        CertificateService, EnrollmentService, FileStorageService,
│                                        NotificationService
├── Jobs/                                # GenerateCertificateJob, SendNotificationJob
├── Notifications/                        # CourseApprovedNotification, CourseRejectedNotification, etc.
├── Events/ & Listeners/                    # CourseCompleted -> triggers GenerateCertificateJob + notifications
└── Providers/
database/
├── migrations/
├── seeders/                                  # DemoDataSeeder (categories, sample courses, users per role)
└── factories/
tests/
├── Feature/
└── Unit/
```

**Business-logic placement example:** `EnrollmentController@complete` (marking a lesson complete) → authorizes via `LessonPolicy` → calls `ProgressService::markLessonComplete($enrollment, $lesson)` → which, inside a DB transaction, upserts `lesson_progress`, recalculates `enrollments.progress_percent`, checks completion criteria, and — if newly completed — fires a `CourseCompleted` event that a listener turns into `GenerateCertificateJob::dispatch(...)`.

---

## 8. Implementation Phases

Each phase lists Objective, Tasks, Database changes, Backend changes, API endpoints delivered, Frontend deliverables, Dependencies, Testing requirements, and Definition of Done (DoD).

### Phase 1 — Project Setup
- **Objective:** Establish a working, connected full-stack skeleton.
- **Tasks:** Initialize Git repo + `.gitignore`; scaffold Laravel project; scaffold React (Vite) project; configure Tailwind; set up MySQL database + `.env`; configure CORS (`config/cors.php`) to allow the Vite dev origin; install Sanctum; set up Axios base instance pointing at `VITE_API_URL`; configure ESLint/Prettier (frontend) and Pint/PHPStan (backend, optional but recommended); set up base React Router with a placeholder home route calling a Laravel `/api/v1/ping` health route.
- **Database changes:** Run Laravel's default migrations (`users`, `password_reset_tokens`, `sessions`, `jobs`, `failed_jobs`) + Sanctum's `personal_access_tokens` migration.
- **Backend changes:** Base API route file `routes/api.php` with `/v1` prefix group; health check controller.
- **API endpoints:** `GET /api/v1/ping`.
- **Frontend pages/components:** App shell, base layout, a page that calls `/ping` to prove connectivity.
- **Dependencies:** None (first phase).
- **Testing:** One Feature test asserting `/api/v1/ping` returns 200.
- **DoD:** Fresh clone + documented setup steps → app boots, frontend successfully calls backend, migrations run cleanly.

### Phase 2 — Authentication
- **Objective:** Full auth lifecycle for students and instructors.
- **Tasks:** Add `role`, `avatar_path`, `bio`, `is_active` to `users` migration; implement register/login/logout; implement Sanctum token issuance; implement email verification (Laravel's `MustVerifyEmail`) with a queued verification email; implement password reset flow; write `RoleMiddleware`; build React auth pages (Login, Register with role selection, Forgot/Reset Password) using React Hook Form; build `AuthContext` + `services/api.js` interceptors; build `ProtectedRoute`/`RoleRoute`.
- **Database changes:** Extend `users` table as above.
- **Backend changes:** `AuthController` (register/login/logout/me), `ForgotPasswordController`, `ResetPasswordController`, `VerifyEmailController`; `RegisterRequest`, `LoginRequest`; `UserResource`.
- **API endpoints:** All of Section 4.1.
- **Frontend pages/components:** Login, Register, Forgot Password, Reset Password, Verify-Email notice screen; `AuthContext`, `useAuth` hook.
- **Dependencies:** Phase 1.
- **Testing:** Feature tests for register/login/logout/password reset/email verification happy paths + invalid-credential and validation failure cases; test that protected routes reject unauthenticated requests (401).
- **DoD:** A user can register as student or instructor, verify email, log in, access a protected `/me` route, log out (token revoked), and reset a forgotten password end-to-end through the UI.

### Phase 3 — User & Role Management
- **Objective:** Profile self-management + admin user oversight.
- **Tasks:** Profile update endpoint (name/bio/avatar) with file upload validation; change-password endpoint; admin user list/search/filter + update role/active-status endpoints; seed an initial admin user via seeder (not self-registerable).
- **Database changes:** None beyond Phase 2 (already covers needed columns).
- **Backend changes:** `ProfileController`, `Admin\UserController`; `UpdateProfileRequest`; `UserPolicy` (admin-only for cross-user management); `FileStorageService` introduced here for avatar uploads (reused later for all media).
- **API endpoints:** `PUT /profile`, `PUT /profile/password`, `GET /admin/users`, `PUT /admin/users/{user}`.
- **Frontend pages/components:** Profile page (all roles), Admin User Management page (table + filters + role/status edit modal).
- **Dependencies:** Phase 2.
- **Testing:** Feature tests for profile update/password change ownership (a user cannot update another user's profile); admin-only enforcement on user management endpoints (403 for non-admins).
- **DoD:** Any user can edit their own profile; only admins can list/edit other users; role changes take effect on next token-authenticated request.

### Phase 4 — Course Management (Metadata & Lifecycle)
- **Objective:** Instructors can create/manage course shells and move them through the approval lifecycle; admins can approve/reject.
- **Tasks:** `courses` + `categories` migrations; `CourseLifecycleService` implementing the state machine from PRD Section 10.1; instructor CRUD for course metadata; submit/publish/unpublish endpoints; admin approve/reject endpoints; category CRUD (admin) + public listing; public course listing/detail (limited to `published` for anonymous/student view, full detail for owning instructor/admin).
- **Database changes:** `categories`, `courses` tables (Section 3.2).
- **Backend changes:** `CourseController` (public + instructor variants), `Admin\CourseController`, `Admin\CategoryController`; `StoreCourseRequest`, `UpdateCourseRequest`, `RejectCourseRequest`; `CoursePolicy`; `CourseResource`/`CourseDetailResource`.
- **API endpoints:** Sections 4.3–4.5.
- **Frontend pages/components:** Instructor "My Courses" list + Course Editor (metadata form with thumbnail upload); Admin Course Management list + approval queue + approve/reject actions; public Course Listing page (search/filter/sort placeholders wired to real API) + Course Details page (metadata only for now — curriculum comes in Phase 5).
- **Dependencies:** Phases 2–3 (auth + roles).
- **Testing:** Feature tests for full lifecycle transitions (valid and invalid transitions rejected with 422); ownership tests (instructor B cannot edit instructor A's course); public listing only returns `published` courses; admin-only approve/reject.
- **DoD:** An instructor can create a course, submit it, an admin can approve/reject it, and only approved+published courses appear publicly. Invalid state transitions are rejected.

### Phase 5 — Course Content (Sections, Lessons, Media)
- **Objective:** Full curriculum authoring and student-facing content consumption (pre-enrollment gating).
- **Tasks:** `course_sections`, `lessons`, `lesson_resources` migrations; section/lesson CRUD with ordering; media upload endpoints (video/pdf) using `FileStorageService` (local disk, S3-ready config); lesson detail endpoint with enrollment-gating logic (full content only if enrolled or `is_previewable`); resource upload/delete.
- **Database changes:** `course_sections`, `lessons`, `lesson_resources`.
- **Backend changes:** `SectionController`, `LessonController` (instructor), `LessonController` (student-facing content endpoint), `LessonResourceController`; `StoreSectionRequest`, `StoreLessonRequest` (type-conditional validation on `content` shape); `SectionPolicy`, `LessonPolicy` (derive ownership via course); `LessonResource` (content-shape aware, strips sensitive fields for non-enrolled/non-preview access).
- **API endpoints:** Section 4.6, plus `GET /lessons/{lesson}` from 4.7.
- **Frontend pages/components:** Course Editor's curriculum builder (drag-orderable sections/lessons), Lesson Editor forms per type (video upload w/ progress bar, rich text editor for `text`, PDF upload, external URL field); public Course Details page now renders full curriculum outline (locked icons for non-enrolled non-preview lessons).
- **Dependencies:** Phase 4.
- **Testing:** Feature tests per lesson type's validation rules; ownership tests on section/lesson mutation; test that a non-enrolled student gets a gated/locked response for non-preview lesson content, and full content for `is_previewable` lessons; file upload MIME/size validation tests.
- **DoD:** An instructor can fully build a multi-section, multi-lesson course with mixed content types and resources; a student can see the curriculum outline and preview lessons before enrolling, but not full content of locked lessons.

### Phase 6 — Enrollment
- **Objective:** Students can enroll in published courses.
- **Tasks:** `enrollments` migration (unique constraint enforced); `EnrollmentService::enroll()` (idempotency-safe via unique constraint + friendly 409 on duplicate, verified-email requirement enforced via `verified` middleware); enrollment listing for student; instructor "enrolled students" list per course.
- **Database changes:** `enrollments`.
- **Backend changes:** `EnrollmentController`; `EnrollmentPolicy`; `EnrollmentResource`; increment `courses.enrollments_count` transactionally on enroll (supports popularity sort from Phase 4's listing).
- **API endpoints:** `POST /courses/{course}/enroll`, `GET /student/enrollments`; instructor-side "students" endpoint added to Instructor Course detail.
- **Frontend pages/components:** Enroll button + state on Course Details; Student "My Courses" list (in-progress / completed tabs); Instructor "Enrolled Students" tab on course management.
- **Dependencies:** Phases 4–5.
- **Testing:** Feature tests: duplicate enrollment rejected (409, and only one DB row exists even under concurrent requests — test via transaction/unique constraint); enrollment blocked for non-published courses and unverified students.
- **DoD:** A verified student can enroll exactly once per course; instructors can see their own courses' enrolled students; `enrollments_count` stays accurate.

### Phase 7 — Progress Tracking
- **Objective:** Accurate, race-safe lesson/course progress with "continue learning."
- **Tasks:** `lesson_progress` migration (unique constraint); `ProgressService::markLessonComplete()` (transactional upsert + recompute `enrollments.progress_percent` + update `current_lesson_id`); progress breakdown endpoint (per-section percentages as in the PRD's example bar-chart); "continue" resolution endpoint (first incomplete lesson in order).
- **Database changes:** `lesson_progress`; add `progress_percent`, `current_lesson_id`, `status`, `completed_at` to `enrollments` (may be included in Phase 6's migration or added here — documented explicitly either way).
- **Backend changes:** `ProgressController`; `ProgressService`; `LessonProgressResource`; course-completion check deferred to also require quizzes (wired fully in Phase 8, but the percentage/lesson-only path is functional here for courses without quizzes).
- **API endpoints:** `POST /lessons/{lesson}/complete`, `GET /student/enrollments/{enrollment}/progress`, `GET /student/enrollments/{enrollment}/continue`.
- **Frontend pages/components:** Course Player shell (sidebar curriculum + content pane), "Mark Complete" action, per-section progress bars, "Continue Learning" CTA on Student Dashboard/My Courses.
- **Dependencies:** Phase 6.
- **Testing:** Feature tests: marking the same lesson complete twice does not change percentage or create duplicate rows (concurrency test with parallel requests where feasible); percentage math correctness across multiple sections with uneven lesson counts; "continue" resolves correctly after partial completion.
- **DoD:** Progress percentages are always mathematically correct and stable under repeated/concurrent completion calls; students can resume where they left off.

### Phase 8 — Quiz System
- **Objective:** Full quiz authoring + timed/untimed attempts + server-side scoring.
- **Tasks:** `quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_attempt_answers` migrations; instructor quiz/question/option CRUD; student-facing quiz fetch (options without `is_correct`); `QuizGradingService::startAttempt()` (enforces `max_attempts`) and `::submitAttempt()` (validates timing server-side, computes score from stored correct options inside a transaction, sets `passed`); wire quiz completion into `ProgressService` so a section (and thus course) isn't "complete" until its quiz is passed, when `courses.requires_quiz_pass` is true.
- **Database changes:** `quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_attempt_answers`.
- **Backend changes:** `QuizController`, `QuestionController` (instructor); `QuizController`, `QuizAttemptController` (student); `StoreQuizRequest`, `StoreQuestionRequest`, `SubmitAttemptRequest`; `QuizPolicy`, `QuizAttemptPolicy`; `QuizResource` (student variant strips correctness), `QuizAttemptResultResource`.
- **API endpoints:** Section 4.9 in full.
- **Frontend pages/components:** Instructor Quiz Builder (questions/options CRUD, drag order, correct-answer toggles); Student Quiz-taking UI (question flow, optional countdown timer synced against server-issued `started_at` + `time_limit_minutes`, submit, results screen); Attempt history view.
- **Dependencies:** Phase 7 (progress integration) and Phase 5 (sections).
- **Testing:** Feature tests: scoring correctness for single- and multiple-choice; `max_attempts` enforcement; late/over-time submission handling; that `is_correct` never appears in the student-facing quiz-fetch response; ownership (student cannot submit/view another student's attempt); course completion correctly waits on quiz pass when required.
- **DoD:** Instructors can build quizzes; students can attempt them within configured constraints; scores are always server-computed and consistent; quiz pass status correctly gates course completion when configured.

### Phase 9 — Certificates
- **Objective:** Automatic certificate issuance on completion + public verification.
- **Tasks:** `certificates` migration; `CourseCompleted` event fired by `ProgressService` when completion criteria are met (Phase 7/8 logic); `GenerateCertificateJob` listener generates a unique `certificate_code`, renders a PDF (Blade template → PDF via a package such as DomPDF, run inside the queued job), stores it via `FileStorageService`, persists the `certificates` row; student download endpoint (streams/redirects to stored file); public verification endpoint (returns only non-sensitive fields, handles not-found vs revoked distinctly); admin revoke endpoint.
- **Database changes:** `certificates`.
- **Backend changes:** `CertificateService`, `GenerateCertificateJob`, `CourseCompleted` event + listener; `CertificateController` (student + public + admin variants); `CertificatePolicy`; `CertificateResource`, `PublicCertificateResource`.
- **API endpoints:** Section 4.10.
- **Frontend pages/components:** Student Certificates list + detail/download; Public Certificate Verification page (`/verify-certificate/:code`, no auth) with clear valid/invalid/revoked states; Admin certificate view + revoke action (in Admin course/user detail or a dedicated Certificates admin view).
- **Dependencies:** Phase 8 (completion criteria must be finalized, since it may include quiz pass) and Phase 6/7 (enrollment/progress).
- **Testing:** Feature/unit tests: certificate generated exactly once per enrollment even if completion event fires more than once (unique constraint on `enrollment_id` + idempotent job); verification endpoint correctness for valid/invalid/revoked codes; revoke restricted to admin; download restricted to the owning student.
- **DoD:** Completing a course reliably produces exactly one certificate with a working download and a working public verification page.

### Phase 10 — Reviews & Ratings
- **Objective:** Enrolled students can rate/review; courses display accurate aggregates.
- **Tasks:** `reviews` migration; create/update/delete endpoints restricted to enrolled students, one review per (student, course); recompute `courses.average_rating`/`ratings_count` transactionally on review create/update/delete; public paginated review listing on course detail; report-a-review endpoint feeding the `reports` table (introduced here or in Phase 13 admin work — documented as introduced now since reviews are its first source).
- **Database changes:** `reviews`, `reports`.
- **Backend changes:** `ReviewController`; `StoreReviewRequest`; `ReviewPolicy`; `ReviewResource`; rating-aggregate recalculation logic (in `CourseService` or inline in `ReviewService`).
- **API endpoints:** Section 4.11.
- **Frontend pages/components:** Review form + list on Course Details (public) and on the student's completed-course view; edit/delete own review UI; "report" action.
- **Dependencies:** Phase 6 (must be enrolled to review).
- **Testing:** Feature tests: non-enrolled student blocked from reviewing (403); duplicate review blocked (422/409, use update instead); average rating recalculates correctly on create/update/delete; ownership on edit/delete.
- **DoD:** Enrolled students can leave exactly one editable review; course pages show correct, live-updating aggregate rating.

### Phase 11 — Notifications
- **Objective:** In-app notifications for key lifecycle events.
- **Tasks:** Publish Laravel's notifications migration; implement Notification classes for each event in FR-NOTIF-1 (`CourseApprovedNotification`, `CourseRejectedNotification`, `NewEnrollmentNotification`, `QuizCompletedNotification`, `CourseCompletedNotification`, `CertificateIssuedNotification`); wire dispatch points into the relevant Services/Listeners already built in Phases 4, 6, 8, 9; notification list + mark-as-read endpoints; (email channel scaffolded but toggled off by default per notification type via a config flag, per PRD Section 8.10/16 V2 note).
- **Database changes:** Laravel's `notifications` table (Section 3.2).
- **Backend changes:** `NotificationController`; Notification classes; `NotificationService` (thin dispatch helper) so business Services don't directly couple to notification internals.
- **API endpoints:** Section 4.12.
- **Frontend pages/components:** Notification bell/dropdown in the shared header + full Notifications page; unread badge count sourced from list `meta`.
- **Dependencies:** Phases 4, 6, 8, 9 (the events being notified about must already exist).
- **Testing:** Feature tests confirming each triggering action creates the expected notification for the correct recipient; mark-as-read scoped to the owning user.
- **DoD:** Users receive and can read/dismiss in-app notifications for every event listed in FR-NOTIF-1.

### Phase 12 — Dashboards & Analytics
- **Objective:** Aggregated, role-scoped dashboard data.
- **Tasks:** Build efficient aggregate queries (using eager loading / `withCount` / `withAvg`, avoiding N+1) for each dashboard endpoint; instructor dashboard scoped strictly to own courses (policy/query-scoped, not just filtered in the frontend); admin dashboard is platform-wide.
- **Database changes:** None new (uses denormalized counters + aggregate queries against existing tables); consider read-optimized indexes if profiling shows need.
- **Backend changes:** `Student\DashboardController`, `Instructor\DashboardController`, `Admin\DashboardController`; corresponding lightweight aggregate Resources/DTOs.
- **API endpoints:** Section 4.13.
- **Frontend pages/components:** Student Dashboard (widgets per PRD 8.11/FR-DASH-1), Instructor Dashboard (FR-DASH-2), Admin Dashboard (FR-DASH-3) — cards + simple charts (e.g., a lightweight charting approach appropriate to the stack).
- **Dependencies:** Phases 6–11 (dashboards aggregate data from all prior domains).
- **Testing:** Feature tests confirming instructor dashboard numbers only reflect that instructor's own courses; admin dashboard totals match raw counts in seeded test data.
- **DoD:** Each role sees an accurate, correctly-scoped dashboard reflecting real underlying data.

### Phase 13 — Admin Panel (Moderation & Platform Management)
- **Objective:** Complete the remaining admin oversight surfaces not yet covered (users/courses/categories/certificates already exist by Phase 4/9/3 — this phase focuses on reports and settings).
- **Tasks:** Reports queue list/resolve/dismiss endpoints; basic platform settings storage (a simple `settings` key-value table or config-backed settings — documented choice: a `settings` table for admin-editable values like default passing score, site name, etc.) + settings endpoint.
- **Database changes:** `reports` (if not already added in Phase 10), optional `settings` table (`key` VARCHAR UNIQUE, `value` JSON).
- **Backend changes:** `Admin\ReportController`, `Admin\SettingsController`; `ReportPolicy`/Gate (admin-only).
- **API endpoints:** Section 4.14's reports endpoints, plus `GET/PUT /api/v1/admin/settings`.
- **Frontend pages/components:** Admin Reports queue (list, filter by status, resolve/dismiss actions with resolution notes); Admin Settings page.
- **Dependencies:** Phase 10 (reports data source), Phases 4/3/9 (users/courses/certificates admin surfaces already functional).
- **Testing:** Feature tests: only admins can access reports/settings endpoints; resolving a report updates status and `resolved_by`/`resolved_at` correctly.
- **DoD:** Admins have a single coherent panel covering users, courses (incl. approval queue), categories, certificates, reports, and settings.

### Phase 14 — Testing (Hardening Pass)
- **Objective:** Close testing gaps across the whole system before optimization/security/deployment passes.
- **Tasks:** Backfill any missing Feature/Unit tests per the Testing Strategy (Section 10) checklist; add authorization-matrix tests (every role × every protected endpoint) to systematically catch missing `403`s; add frontend tests for critical flows (auth, protected routes, quiz submission, form validation) using a component-testing approach appropriate to the Vite/React setup; run and fix any flaky tests; measure and address coverage gaps in Services (business logic) specifically, since that's where correctness matters most.
- **Database changes:** None (test-database/factory refinement only).
- **Backend changes:** Test factories for every model; a reusable "authorization matrix" test helper.
- **API endpoints:** None new.
- **Frontend pages/components:** None new (test files only).
- **Dependencies:** All prior phases.
- **Testing:** This phase *is* the testing work — see Section 10 for the full strategy it implements.
- **DoD:** All Section 10 test categories exist and pass in CI; no endpoint is reachable by an unauthorized role in the authorization-matrix suite.

### Phase 15 — Security & Optimization
- **Objective:** Harden and tune for production readiness.
- **Tasks:** Apply/verify rate limiting (`throttle` middleware) on auth and quiz-attempt endpoints; audit all Form Requests for correct `$fillable`/validated-only usage (no mass-assignment leaks); verify all file upload endpoints enforce MIME/extension/size limits server-side (not just client-side); run `EXPLAIN` on the heaviest listing/dashboard queries and add any missing indexes found; add response caching (e.g., cache category list, cache course-listing filter facets) where safe; verify eager loading (`with()`) is used everywhere a list endpoint touches relationships, eliminating N+1s (checked via a query-count assertion in tests or a profiling tool); review all Policies for the "ownership derived from DB, not client input" rule; ensure sensitive fields (`is_correct` on quiz options, other users' emails) are excluded from every relevant Resource.
- **Database changes:** Any indexes identified as missing during profiling.
- **Backend changes:** Rate limiter config, Resource audits, query optimization, cache layer for read-heavy endpoints.
- **API endpoints:** None new (existing endpoints hardened/optimized).
- **Frontend pages/components:** None new (performance pass: code-splitting routes, lazy-loading heavy pages like the Course Editor/Quiz Builder).
- **Dependencies:** All prior phases.
- **Testing:** Add a query-count regression test on key list endpoints (fails if N+1 reappears); add tests asserting sensitive fields are absent from relevant API responses; load-test (manually or with a simple script) the course listing and quiz-submission endpoints at expected MVP scale.
- **DoD:** No N+1 queries on primary list/dashboard endpoints; rate limiting active on sensitive endpoints; no sensitive field ever serialized to an unauthorized viewer; all security requirements in PRD Section 13 verified with a passing test.

### Phase 16 — Deployment
- **Objective:** Ship to a production-like environment.
- **Tasks:** See Section 13 (Deployment Strategy) for the full checklist; provision hosting for Laravel (PHP-FPM + web server) and MySQL; build and deploy the React app (static build served via CDN/static host or the same web server); configure environment variables per Section 14; configure CORS for the production frontend origin; run migrations on the production database; configure the filesystem disk for production (S3-compatible) and verify uploads work end-to-end; configure queue worker process (for certificate generation/notifications) and a process supervisor; set up HTTPS; set up error logging/monitoring; document a backup strategy for the database and uploaded files.
- **Database changes:** Run all migrations against production DB; run the category/admin-user seeder (production-safe seeder, not demo data).
- **Backend changes:** Production `.env`, `config/cache.php`/`config/queue.php` tuned for the chosen driver, `php artisan optimize` in the build/deploy step.
- **API endpoints:** None new.
- **Frontend pages/components:** Production build (`vite build`) with `VITE_API_URL` pointed at the production API origin.
- **Dependencies:** All prior phases (Phase 15 in particular).
- **Testing:** Smoke test the full critical path (register → verify → login → browse → enroll → complete a lesson → pass a quiz → receive certificate → verify certificate publicly) against the deployed environment.
- **DoD:** The application is reachable over HTTPS at its production URL(s), the full critical path smoke test passes, queue workers are processing certificate/notification jobs, and backups are configured.

---

## 9. Development Order & Dependency Graph

```
Phase 1: Setup
     ↓
Phase 2: Authentication
     ↓
Phase 3: Users & Roles
     ↓
Phase 4: Course Management (metadata + lifecycle) ── requires Categories (part of Phase 4)
     ↓
Phase 5: Course Content (sections/lessons/media)
     ↓
Phase 6: Enrollment
     ↓
Phase 7: Progress Tracking
     ↓
Phase 8: Quiz System ───────────────┐  (extends Progress's completion criteria)
     ↓                              │
Phase 9: Certificates  ◀────────────┘  (depends on final completion criteria from 7+8)
     ↓
Phase 10: Reviews & Ratings   (only needs Enrollment, could run parallel to 7–9 if desired)
     ↓
Phase 11: Notifications        (needs events from 4, 6, 8, 9)
     ↓
Phase 12: Dashboards & Analytics (aggregates everything above)
     ↓
Phase 13: Admin Panel completion (Reports/Settings)
     ↓
Phase 14: Testing hardening pass
     ↓
Phase 15: Security & Optimization
     ↓
Phase 16: Deployment
```

This is a correction/refinement of the PRD's suggested order in one respect: **Reviews (Phase 10)** only structurally depends on **Enrollment (Phase 6)**, not on Quizzes/Certificates/Progress — a team could parallelize Reviews alongside Phases 7–9 if there are two developers. It is kept in sequence here for a solo-developer, one-thing-at-a-time build, but the true dependency is called out so parallel teams don't block unnecessarily.

---

## 10. Testing Strategy

### 10.1 Backend
- **Unit tests:** Service classes in isolation (`ProgressService`, `QuizGradingService`, `CertificateService`, `CourseLifecycleService`) — pure logic, no HTTP layer, using model factories.
- **Feature (HTTP) tests, by area:**
  - **Authentication:** register/login/logout, email verification required for gated actions, password reset, invalid-credential handling, rate-limit triggering.
  - **Authorization:** a systematic matrix — for every protected endpoint, assert the correct 200/201 for the allowed role(s) and 401/403 for every other role/anonymous.
  - **Courses:** lifecycle transitions (valid/invalid), ownership enforcement, public listing only shows `published`.
  - **Content:** lesson type validation, media upload validation, enrollment-gated content access.
  - **Enrollment:** duplicate prevention, verified-only, unpublished-course rejection.
  - **Progress:** idempotent completion, percentage correctness across varied curriculum shapes, "continue" resolution.
  - **Quizzes:** scoring correctness (single/multiple choice), timing enforcement, `max_attempts` enforcement, correctness never leaked pre-submission.
  - **Certificates:** exactly-one-per-enrollment, public verification correctness (valid/invalid/revoked), download ownership.
- **API tests:** response shape/status-code contract tests for each endpoint group (can overlap with Feature tests; the point is asserting the documented shape in Section 4 doesn't silently drift).

### 10.2 Frontend
- **Component testing** for complex/stateful components: quiz-taking flow (timer, answer selection, submission), course player progress display, forms with validation (React Hook Form + schema).
- **Auth flow tests:** login/logout updates `AuthContext`; `ProtectedRoute`/`RoleRoute` redirect correctly when unauthenticated/wrong role.
- **Critical user flow smoke tests:** enroll → view lesson → mark complete → take quiz → see result, at least at a high level (can be manual for MVP if automated E2E tooling is out of scope, but should be scripted as a documented manual QA case either way — see 10.3).

### 10.3 Manual QA Checklist (Practical)
- [ ] Register as student, verify email, log in.
- [ ] Register as instructor, verify email, log in.
- [ ] Instructor creates a course with 2 sections, 2 lessons each (mix video/text/pdf), 1 quiz with 3 questions.
- [ ] Instructor submits course; admin sees it in the approval queue.
- [ ] Admin rejects with a reason; instructor sees the reason and resubmits.
- [ ] Admin approves; instructor publishes.
- [ ] Student finds the course via search/filter, views details, enrolls.
- [ ] Student completes all lessons in a section; section progress shows 100% only after the section quiz is also passed (if required).
- [ ] Student fails a quiz below passing score; can retry up to `max_attempts`.
- [ ] Student completes the entire course; certificate appears and downloads correctly.
- [ ] Anyone (logged out) can verify the certificate at `/verify-certificate/{code}`.
- [ ] Student leaves a review; average rating updates on the course page.
- [ ] Instructor sees updated enrollment/progress/rating stats on their dashboard.
- [ ] Admin dashboard totals reconcile with actual counts.
- [ ] Attempting cross-role/cross-owner actions (e.g., instructor B editing instructor A's course via direct API call) is rejected.
- [ ] Mobile viewport: navigation, course player, and quiz UI remain usable.

---

## 11. Security Strategy

Implements PRD Section 13 concretely:

1. **AuthN:** Sanctum tokens; passwords hashed via Laravel's default (bcrypt/argon2); `verified` middleware gates enroll/submit-course/etc.
2. **AuthZ:** Policies on every model with ownership semantics; Gates for role-only checks; controller actions call `$this->authorize(...)` before any Service call — never conditionally skipped.
3. **Validation:** Every write endpoint has a dedicated Form Request; no controller ever reads `$request->all()` directly into a model `create()`/`update()` call — explicit `validated()` arrays only.
4. **Mass assignment:** Models declare explicit `$fillable`; never `$guarded = []`.
5. **File uploads:** Server-side MIME + extension allow-list per content type (video: mp4/webm; docs: pdf; images: jpg/png/webp), max size enforced server-side (not just client-side, which is UX-only), stored outside direct public path where private (unpublished course content) is required, served via authenticated/controlled routes for gated content.
6. **SQL injection:** Eloquent/query builder parameter binding used exclusively; no raw string-concatenated queries.
7. **XSS:** React's default JSX escaping relied on for all rendered user content; the one exception — rich `text` lesson content — is sanitized server-side (allow-list HTML sanitizer) before storage and/or rendered via a sanitizing renderer client-side, never raw `dangerouslySetInnerHTML` on unsanitized input.
8. **CSRF:** Not applicable in bearer-token Sanctum mode (stateless API tokens); if the SPA-cookie Sanctum mode is chosen instead, Sanctum's built-in CSRF cookie flow is used — this is a single documented decision point, not a hybrid.
9. **Rate limiting:** `throttle:auth` on login/register/password-reset; `throttle:quiz-attempts` on attempt creation.
10. **Sensitive data exposure:** `is_correct` never in student-facing quiz Resources; email/internal IDs never in the public certificate-verification Resource; API Resources are the single enforcement point (never rely on the frontend to "hide" a field).
11. **Secrets:** All credentials/keys via `.env`, never committed; `.env.example` documents required keys without values.

---

## 12. Git Strategy

- **Branching model:** trunk-based with short-lived feature branches — `main` is always deployable; work happens on `feature/<phase>-<short-description>` (e.g., `feature/p8-quiz-scoring`), merged via Pull Request after review/tests pass.
- **Commit convention:** Conventional Commits — `type(scope): description`.
  - Examples:
    ```
    feat(auth): implement student registration
    feat(course): add course creation
    feat(quiz): implement quiz attempt system
    fix(progress): correct course completion calculation
    test(quiz): add scoring correctness tests
    chore(deps): bump laravel/sanctum
    docs(readme): add local setup instructions
    ```
- **PRs:** one PR per phase-task or logical unit (not one PR per phase); PR description references the relevant PRD/Implementation Plan section; CI (tests) must pass before merge.
- **Issues:** one issue per phase task list item (or per phase, for a solo dev, with a checklist matching the phase's Tasks); labeled by phase and area (`backend`, `frontend`, `db`, `security`).

---

## 13. Deployment Strategy

**Provider-agnostic** (works on any standard VPS/PaaS supporting PHP-FPM + MySQL + Node build tooling — e.g., a VPS with Nginx, or a PaaS like Render/Railway/Laravel Forge-managed servers; the architecture does not assume a specific vendor).

1. **Build:**
   - Backend: `composer install --no-dev --optimize-autoloader`, `php artisan config:cache`, `php artisan route:cache`, `php artisan migrate --force`.
   - Frontend: `npm ci && npm run build` producing a static `dist/` bundle.
2. **Serving:**
   - Frontend `dist/` served via a static host/CDN or the same web server as a static root, with SPA fallback routing (all non-file paths → `index.html`) so React Router's client-side routes work on refresh.
   - Backend served via PHP-FPM behind Nginx (or the PaaS equivalent), with `public/` as document root.
3. **CORS:** `config/cors.php` allowed origins set to the exact production frontend origin (no wildcard in production).
4. **Database:** managed MySQL instance; migrations run as part of the deploy step (`migrate --force`), never manually against production without going through the same migration files used in dev.
5. **Storage:** production filesystem disk switched to an S3-compatible driver via env vars only (`FILESYSTEM_DISK=s3` + S3 credentials/bucket/region) — no code changes required, since all file access goes through `FileStorageService`.
6. **Queue:** a persistent queue worker process (`php artisan queue:work`) managed by a process supervisor (e.g., Supervisor or the PaaS's background-worker primitive) so certificate generation and notification dispatch run reliably.
7. **HTTPS:** enforced at the web server/load balancer level (redirect HTTP→HTTPS); `APP_URL`/`VITE_API_URL` use `https://`.
8. **Error logging:** Laravel's logging channel configured to a persistent/aggregated target (file rotation at minimum; an external error tracker if available) rather than left at `stderr`-only in production.
9. **Backups:** scheduled MySQL dumps (daily, retained on a rolling window) + versioned/redundant object storage for uploaded files (S3 versioning or equivalent) — documented as a requirement even if the exact backup tool is deployment-environment-specific.

---

## 14. Environment Variables

### Backend (`.env`)
```
APP_NAME=LMS
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.example.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms
DB_USERNAME=
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=app.example.com
SESSION_DOMAIN=.example.com

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_BUCKET=
AWS_URL=

QUEUE_CONNECTION=database
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=

FRONTEND_URL=https://app.example.com
```

### Frontend (`.env`)
```
VITE_API_URL=https://api.example.com/api/v1
```

`.env.example` files (both apps) must list every key above with placeholder/empty values and be committed; real `.env` files are always gitignored.

---

## 15. Definition of Done (Global) & Development Checklist

A feature/phase is only "done" when **all** of the following hold:

- [ ] Database migration(s) written, reversible (`down()` implemented), and run cleanly on a fresh database.
- [ ] Form Request(s) validate every input field with correct rules and clear error messages.
- [ ] Policy/Gate enforces correct ownership/role for every new endpoint; verified by an explicit "wrong role/wrong owner returns 403" test.
- [ ] Business logic lives in a Service class, not the controller.
- [ ] API Resource used for every response (no raw `Model::all()`/`$model` returned directly).
- [ ] Feature test(s) cover the happy path, at least one validation-failure path, and the authorization-failure path.
- [ ] Frontend: loading, empty, and error states are all handled (not just the happy path).
- [ ] Frontend: the corresponding UI is reachable through real navigation (not just a direct URL), respecting `ProtectedRoute`/`RoleRoute`.
- [ ] No N+1 queries introduced (spot-checked via Laravel Debugbar/Telescope or a query-count assertion) on any list endpoint touched.
- [ ] No sensitive field (correct-answer flags, other users' private data) present in the response payload for an unauthorized viewer.
- [ ] Code committed with a Conventional-Commits-formatted message on a feature branch, merged via PR.

---

## 16. Architecture Review — Risks Identified & Mitigations

As a final senior-engineer pass, the following risks were identified in the initial design and addressed in this plan:

- **R-1 (Progress race conditions):** Naively recalculating `progress_percent` from application-layer counters risked double-counting under concurrent "mark complete" calls or retried requests. **Mitigation:** unique DB constraint on `(enrollment_id, lesson_id)` in `lesson_progress` makes completion an idempotent upsert, and recalculation reads from the DB's actual row count inside a transaction rather than incrementing a cached counter.
- **R-2 (Quiz integrity):** A naive design might send correct answers to the client for local scoring, or trust a client-submitted score. **Mitigation:** correct-answer flags are excluded from every student-facing Resource, and scoring is always computed server-side from `quiz_attempt_answers` against stored `quiz_options.is_correct` inside `QuizGradingService`, with server-side timing validation independent of any client timer.
- **R-3 (Authorization bypass via ownership spoofing):** A naive design might check "is this user an instructor" without checking "does this instructor own *this* course," allowing cross-instructor data access. **Mitigation:** every Policy method derives ownership from the model's actual DB relationship (`$course->instructor_id`), never from request input, and an authorization-matrix test suite (Phase 14) systematically verifies this per endpoint.
- **R-4 (Role model simplicity vs. future flexibility):** A single `role` ENUM on `users` is simpler than a full roles/permissions table system but cannot express a user holding multiple roles simultaneously. **Mitigation:** documented as an intentional MVP simplification (matches the PRD's actual requirements — one role per user); the upgrade path (a `roles` table + pivot) is noted so it's a additive migration later, not a rewrite, if ever needed.
- **R-5 (Large file storage):** Storing videos/PDFs as MySQL BLOBs would devastate performance and backup size. **Mitigation:** `content`/`file_path` columns store only references; actual bytes live on a filesystem disk behind `FileStorageService`, config-swappable from local to S3 with zero API changes.
- **R-6 (N+1 queries on listing/dashboard endpoints):** Naive Eloquent usage on course listings (with category, instructor, rating) or dashboards (aggregating across many courses) is a classic N+1 trap. **Mitigation:** explicit eager loading (`with()`, `withCount()`, `withAvg()`) mandated in the Definition of Done, plus denormalized counters (`average_rating`, `ratings_count`, `enrollments_count`) on `courses` to avoid aggregate joins on every listing request, refreshed transactionally at the point of change (review/enroll) rather than computed live.
- **R-7 (Certificate duplication on repeated completion events):** If the completion event could fire more than once (e.g., re-triggered by a retried request), a naive design could issue duplicate certificates. **Mitigation:** `UNIQUE` constraint on `certificates.enrollment_id` plus an idempotent job design (check-then-create inside a transaction, or rely on the DB constraint to reject the duplicate insert gracefully).
- **R-8 (Public certificate verification leaking data):** A naive verification endpoint might return full student/course records. **Mitigation:** a dedicated `PublicCertificateResource` exposes only student display name, course title, issue date, and status — never email, internal IDs, or other account data.
- **R-9 (Search/filter performance at scale):** Unindexed `LIKE '%term%'` search and unindexed filter columns would degrade badly past a few thousand courses. **Mitigation:** FULLTEXT index on `(title, description)`, standard indexes on `status`, `category_id`, and a composite `(status, category_id)` for the common "published + category filter" query shape.
- **R-10 (Course deletion destroying student history):** Hard-deleting a course with active enrollments would orphan/destroy student progress and certificate history. **Mitigation:** deletion is blocked when active enrollments exist and becomes an archive action instead (status-based, reversible), with actual hard deletion reserved for genuinely empty draft courses; `courses`/`users`/`reviews` use soft deletes so historical references (certificates, past enrollments) remain intact even if a record is later removed from active listings.

This review confirms the schema, API, and authorization design in this plan do not require redesign to implement phase-by-phase as specified.
