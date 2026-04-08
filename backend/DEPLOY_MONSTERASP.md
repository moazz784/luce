# Deploying Luce API to MonsterASP.NET (IIS + SQL Server)

This backend targets **ASP.NET Core 8** on **Windows / IIS** with **SQL Server**, which matches typical MonsterASP.NET hosting.

## 1. Database

1. Create (or obtain) a **SQL Server** database and user from the hosting control panel.
2. Build a **connection string** (example shape):

   `Server=db47199.public.databaseasp.net; Database=db47199; User Id=db47199; Password=b#4CN6o@!qY3; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;`

3. Store it only in hosting configuration or environment variables — **never** commit production secrets to git.

## 2. Configuration on the host

Set these application settings (names may vary by panel; use environment variables or the host’s “App Settings” UI):

| Key | Purpose |
|-----|---------|
| `ConnectionStrings__DefaultConnection` | SQL Server connection string |
| `Jwt__SigningKey` | Long random secret (at least 32 characters for HS256) |
| `Jwt__Issuer` / `Jwt__Audience` | Usually your API public URL or product name |
| `Jwt__AccessTokenMinutes` | Access token lifetime |
| `Auth__AllowRegister` | Set `false` in production unless you intentionally allow admin self-registration |
| `Seed__AdminEmail` / `Seed__AdminPassword` | Only for first deploy; change password after login |
| `Cors__AllowedOrigins__0` … | Your production SPA origin(s), e.g. `https://www.yoursite.com` |

## 3. Publish the API

From the repository `backend` folder:

```powershell
dotnet publish Luce.Api/Luce.Api.csproj -c Release -o ./publish
```

Upload the contents of `publish/` to the host’s **.NET Core** application folder (follow MonsterASP’s doc for subdomains or virtual directories).

## 4. Migrations

Apply EF Core migrations to the production database **once** per release:

- From a machine that can reach the SQL Server, run:

  `dotnet ef database update --project Luce.Infrastructure --startup-project Luce.Api`

  with `ConnectionStrings__DefaultConnection` (or `appsettings.Production.json`) pointing to production.

- Alternatively, generate a SQL script from the migration and run it in SQL Server Management Studio.

The app also runs `Database.Migrate()` on startup; for production, some teams prefer **not** auto-migrating and only using scripts — choose one approach and stay consistent.

## 5. File uploads

Uploaded images are stored under **`wwwroot/uploads`**. Ensure the IIS app pool identity has **write** permission to that folder, or uploads will fail.

## 6. HTTPS and URLs

- Use **HTTPS** in production.
- Return correct **absolute** media URLs: the upload endpoint builds URLs from the incoming request host; ensure your reverse proxy or IIS forwards **Host** / **X-Forwarded-Proto** correctly if the API sits behind a load balancer.

## 7. Smoke test

- `GET https://your-api-host/swagger` (if Swagger is enabled for your environment).
- `GET https://your-api-host/api/public/home-bundle` should return JSON (may be empty lists until content is added).
- Log in with seeded admin credentials, then call an `/api/admin/*` endpoint with the bearer token.
