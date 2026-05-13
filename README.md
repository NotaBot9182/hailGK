# CDC Recruitment Portal

Web platform for the **Career Development Centre (CDC), IIT (ISM) Dhanbad**, supporting structured **Job Notification Forms (JNF)** and **Intern Notification Forms (INF)** for campus recruitment.

Functional and technical detail is maintained in [**CDC_Portal_Spec_v1_0.md**](./CDC_Portal_Spec_v1_0.md) (software specification / high-level design).

## Repository layout

| Path | Description |
|------|-------------|
| [`cdc-portal-api/`](./cdc-portal-api/) | Laravel REST API, authentication (Sanctum), notifications, admin routes |
| [`cdc-portal-frontend/`](./cdc-portal-frontend/) | Next.js (App Router) recruiter and admin UI (MUI) |
| [`CDC_Portal_Spec_v1_0.md`](./CDC_Portal_Spec_v1_0.md) | Product and architecture specification (v1.0) |

## Prerequisites

- **Backend:** PHP **8.3+**, [Composer](https://getcomposer.org/), MySQL or MariaDB  
- **Frontend:** Node.js **18+** (LTS recommended) and npm  
- **Optional:** Redis if you switch Laravel `CACHE_DRIVER` / `QUEUE_CONNECTION` away from file/sync for production-like behaviour

## Backend API (`cdc-portal-api`)

```bash
cd cdc-portal-api
composer install
```

1. Create a `.env` file in `cdc-portal-api` (use Laravel’s standard keys for database, mail, and app settings; your team may provide a checked-in template). Generate an application key:

   ```bash
   php artisan key:generate
   ```

2. Set database credentials and mail settings in `.env` (see [Environment variables](#environment-variables)).

3. Run migrations and start the server:

   ```bash
   php artisan migrate
   php artisan serve
   ```

The API is served at `http://127.0.0.1:8000` by default. A simple health check:

`GET http://127.0.0.1:8000/api/health`

### Composer shortcuts

From `cdc-portal-api`, `composer run dev` can start the Laravel server, queue listener, logs, and Vite together when you are using the default Laravel frontend tooling in that project. For this monorepo, you typically run the **Next.js** app separately (below).

## Frontend (`cdc-portal-frontend`)

```bash
cd cdc-portal-frontend
npm install
```

Create a `.env.local` (or export variables in your shell) so the app knows where the API lives:

| Variable | Example (local) | Purpose |
|----------|-----------------|--------|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000/api` | Base URL for Axios calls to Laravel |

When `NEXT_PUBLIC_API_URL` points at localhost, `next.config.js` also **rewrites** `/api/*` and `/storage/*` to the Laravel host so relative URLs can work in the browser.

Start the development server:

```bash
npm run dev
```

By default the app listens on **port 3000** (see `package.json`: `next dev -H 0.0.0.0`).

Production build:

```bash
npm run build
npm start
```

## Environment variables

Never commit real secrets. Use placeholders in documentation and keep `.env` / `.env.local` out of version control.

### Laravel (`cdc-portal-api/.env`)

Typical keys include:

- `APP_NAME`, `APP_ENV`, `APP_DEBUG`, `APP_URL`
- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `MAIL_*` for SMTP (registration OTP and transactional mail)
- `GEMINI_API_KEY` — only if you use optional AI-assisted features in the frontend

Adjust `CACHE_DRIVER`, `QUEUE_CONNECTION`, and `SESSION_DRIVER` for your deployment (see Laravel documentation).

### Next.js (`cdc-portal-frontend/.env.local`)

- `NEXT_PUBLIC_API_URL` — Laravel API base URL including the `/api` path segment

## API surface

Route groups (all under the `/api` prefix unless your web server is configured otherwise):

- `auth` — OTP, register, login, logout, password reset  
- `company` — company profile and contacts  
- `notifications` — JNF/INF drafts, tabs, submit, uploads  
- `admin` — admin-only listing, status, export, user management  
- `alumni` — alumni mentorship flows where implemented  

For a machine-readable overview, see [`cdc-portal-api/api-spec.json`](./cdc-portal-api/api-spec.json) if present in your checkout.

## Contributing

1. Branch from the main integration branch used by your team.  
2. Keep changes focused and aligned with [**CDC_Portal_Spec_v1_0.md**](./CDC_Portal_Spec_v1_0.md) where applicable.  
3. Run API tests (`composer test` in `cdc-portal-api`) and `npm run lint` in `cdc-portal-frontend` before opening a pull request.

## Acknowledgements

Developed for the **Career Development Centre, IIT (ISM) Dhanbad**. Specification references peer IIT placement portals for field and UX inspiration, as noted in the spec document.
