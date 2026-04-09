# Frontend integration guide (Luce API)

This document is for the React (Vite) app in the repository root. **Do not change UI styling** unless needed; wire data and auth to the backend API.

## Base URL

- Add an environment variable (no trailing slash). **Production sites on HTTPS (e.g. Vercel) must use an `https://` API URL**; calling `http://` from an HTTPS page is blocked as mixed content.
- Example production: `VITE_API_BASE_URL=https://luce.runasp.net` (must match a TLS endpoint your host exposes).
- In code, prefix every request: `` `${import.meta.env.VITE_API_BASE_URL}/api/...` ``.
- For local development with the API on `http://localhost:5009`, set `VITE_API_BASE_URL=http://localhost:5009` in `.env.local`.
- The app default in [src/Api.js](../src/Api.js) is `https://luce.runasp.net` when `VITE_API_BASE_URL` is unset (production builds).
- **Local dev:** With `npm run dev`, leave `VITE_API_BASE_URL` unset so requests go to `/api/...` on the Vite port; [vite.config.js](../vite.config.js) proxies `/api` and **`/uploads`** to `http://localhost:5009`. Run the API (`dotnet run` in `Luce.Api`) on port **5009**. Do **not** set `VITE_API_BASE_URL` to the Vite URL (e.g. `http://localhost:3000`) or `/api` will 404.

## CORS

The API allows origins listed in `Cors:AllowedOrigins` in [appsettings.json](Luce.Api/appsettings.json). Production SPA: **`https://luce-six.vercel.app`** (must match exactly, including `https`). Add preview domains in Vercel if you test PR deployments. On MonsterASP / runasp.net, override origins via environment variables or the host app settings UI if the deployed API does not read the repo `appsettings.json`.

## Authentication (HttpOnly cookie + JWT)

The API issues a JWT in an **HttpOnly** cookie named **`access_token`** on successful **login** and **register**. The browser sends it automatically on same-site requests. For **cross-origin** SPAs (for example Vercel → Azure), configure `Cors:AllowedOrigins` with your exact SPA origin and use **HTTPS** in production so the cookie can use `SameSite=None; Secure`.

- **Registration allowed?** `GET /api/auth/registration-status` returns `{ "allowRegister": true|false }` (no auth). The login page uses this to hide **Register** when `Auth:AllowRegister` is `false` in [appsettings.json](Luce.Api/appsettings.json) (production default). **Redeploy the API** after pulling this route; if the endpoint is missing (404), the SPA assumes registration is allowed and relies on `POST` registration endpoints to enforce the flag.
- **Login:** `POST /api/auth/login` with JSON body `{ "email", "password" }`. Only **`@must.edu.eg`** addresses are allowed (so admins and students can sign in). Response JSON still includes `accessToken` (and `roles`) for compatibility, but the SPA should rely on the cookie for API calls.
- **Register (students, OTP):** (1) `POST /api/auth/register/start` with `{ "userName", "email", "password" }` where **`email`** must match **`digits@must.edu.eg`**. The API sends a **6-digit OTP** via **Brevo** (configure `Brevo:ApiKey`, `Brevo:SenderEmail`, `Otp:Pepper` on the host). (2) `POST /api/auth/register/verify` with `{ "email", "otp", "password" }` to create the account. New accounts get the **`User`** role only. The legacy **`POST /api/auth/register`** returns **400** with a message to use the OTP flow.
- **Response:** `{ "accessToken", "expiresAt", "email", "userName", "roles" }`. The SPA stores **`roles`** in **sessionStorage** (key `luce_roles`) for UI checks; it does **not** read the JWT from JavaScript.
- **Current user:** `GET /api/auth/me` (requires auth) returns `{ "email", "userName", "roles" }`. Use this after navigation or on the home page to refresh session state. All `fetch` calls use **`credentials: "include"`** (see [src/Api.js](../src/Api.js)).
- **Admin and authenticated requests:** send cookies with `credentials: "include"`. The API reads the JWT from the cookie or from `Authorization: Bearer` if present.
- **Logout:** `POST /api/auth/logout` (no body) clears the cookie; the client also clears session storage via [src/authService.js](../src/authService.js).
- **Protect `/AdminDashboard`:** [src/ProtectedRoute.jsx](../src/ProtectedRoute.jsx) calls `GET /api/auth/me` and redirects to `/login` if unauthenticated or to `/` if the user is not **Admin**.

### Default seeded admin (development)

Configured under `Seed` in [appsettings.json](Luce.Api/appsettings.json) (default admin email **`AymanShamel@must.edu.eg`**). Change the password in production and rotate after first login. To replace all users and re-seed, see [MAINTENANCE.md](MAINTENANCE.md).

## Public read endpoints (no auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public/home-bundle` | Single payload: news, events, awards, alumni, hero slides, syndicates |
| GET | `/api/public/news` | Published news only |
| GET | `/api/public/events` | Events (includes `date.day` / `date.month` for the home page) |
| GET | `/api/public/awards` | Awards |
| GET | `/api/public/alumni` | Alumni |
| GET | `/api/public/hero` | Hero slides |
| GET | `/api/public/syndicates` | Syndicate cards |
| POST | `/api/public/contact` | Body: `name`, `email`, optional `phone`, `message` |

Use **`home-bundle`** in [Home.jsx](../src/Home.jsx) to replace multiple hardcoded arrays with one `useEffect` + `fetch`, or call individual endpoints if you prefer smaller payloads.

## Admin CRUD (requires `Admin` role)

All routes require an authenticated **Admin** user (JWT from **`access_token`** cookie with `credentials: "include"`, or `Authorization: Bearer` if you send a token manually).

| Section | Base path |
|---------|-----------|
| News | `/api/admin/news` |
| Events | `/api/admin/events` |
| Awards | `/api/admin/awards` |
| Alumni | `/api/admin/alumni` |
| Hero | `/api/admin/hero` |
| Syndicates | `/api/admin/syndicates` |
| Contact inbox | `/api/admin/contact-messages` |

Patterns:

- Content sections: `GET` list · `GET {id}` · `POST` create · `PUT {id}` update · `DELETE {id}`

**Contact messages** (submissions from `POST /api/public/contact`): `GET /api/admin/contact-messages` returns an array of `{ id, name, email, phone, message, createdAt }` (newest first). `DELETE /api/admin/contact-messages/{id}` removes one row. The admin UI lists these under **رسائل التواصل** in [AdminDashboard.jsx](../src/AdminDashboard.jsx).

Request/response shapes for content CRUD match the admin DTOs in the backend (`NewsCreateDto`, `NewsUpdateDto`, `NewsAdminDto`, etc.).

## Media upload

- `POST /api/admin/media` with `multipart/form-data` and field name **`file`**.
- Response: `{ "url": "https://host/uploads/..." }` (absolute URL). Use this string as `imageUrl` when creating or updating content.

Avoid sending large base64 images inside JSON in production; upload first, then send the returned URL.

## Field mapping: Home.jsx vs AdminDashboard.jsx

The backend uses **one canonical model per entity**. Map API fields to your existing UI as follows.

### News

- **Public:** `id`, `title`, `body`, `imageUrl`, `publishedAt`.
- **Admin list/form:** same plus `sortOrder`, `isPublished`, `createdAt`, `updatedAt`.
- Current [Home.jsx](../src/Home.jsx) news items use `title` + imported image; replace imports with `imageUrl` from API (absolute or root-relative to API host).

### Events

- **Public:** `eventDate` (ISO), plus **`date: { day, month }`** for display (e.g. `06`, `Nov`), `location`, `timeRange`, `description`, `accentColor`, `imageUrl`.
- **Admin:** `title`, `eventDate`, `location`, `timeRange`, `description`, `accentColor`, `imageUrl`, `sortOrder`.
- [AdminDashboard.jsx](../src/AdminDashboard.jsx) currently uses only `title`, `date` (string), `image`. When saving to API, map `date` input to `eventDate` (ISO date-time) and fill optional fields as needed.

### Awards

- **Public:** `title`, `subtitle`, `winnerName`, `content`, `imageUrl`.
- **Admin:** same plus `sortOrder`.
- Home awards carousel uses `title`, `subtitle`, `name` (story text), `image` — map `name` ↔ `winnerName` / `content` depending on which text you show.

### Alumni

- **Public / Admin:** `name`, `shortDescription`, `fullBio`, `imageUrl` (+ `sortOrder` on admin).
- Align with existing `description` / `fullBio` in Home.

### Hero

- **Public / Admin:** optional `title`, `imageUrl`, `sortOrder` (admin).
- Replace static `slides` array with API-driven list; each slide is an image URL (plus optional title).

### Syndicates (ESSP section)

- **Public / Admin:** `title`, `imageUrl`, `link`, `buttonText`, `sortOrder`.

## Error shape

Validation and failures use **ProblemDetails** or similar JSON with `title` / `detail`. Handle **401** on login failure and **403** when registration is disabled.

## Vite dev proxy (optional)

To avoid CORS during local dev, you can proxy `/api` to the backend in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': { target: 'https://localhost:5009', changeOrigin: true },
  },
},
```

Then use relative URLs like `/api/public/home-bundle` and omit `VITE_API_BASE_URL` for dev only.

---

See [DEPLOY_MONSTERASP.md](DEPLOY_MONSTERASP.md) for hosting the API and database on MonsterASP.NET.

AdminEmail: admin@localhost,
    AdminPassword": ChangeMe!123