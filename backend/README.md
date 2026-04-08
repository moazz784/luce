# Luce CMS API

ASP.NET Core 8 Web API for the Luce alumni site: SQL Server, EF Core, Identity + JWT, and public/admin content endpoints.

## Run locally

Prerequisites: [.NET 8 SDK](https://dotnet.microsoft.com/download), SQL Server or LocalDB.

```powershell
cd backend
dotnet restore
dotnet ef database update --project Luce.Infrastructure --startup-project Luce.Api
dotnet run --project Luce.Api
```

**Applying migrations** can also be run from `backend/Luce.Infrastructure` with `dotnet ef database update` alone: `ApplicationDbContextFactory` loads `Luce.Api/appsettings.json` at design time so `DbContextOptions` resolve correctly. If that fails, use the `--startup-project Luce.Api` form from the `backend` folder.

**Clean IIS publish output:** from `backend`, run `.\publish-clean.ps1`. It deletes `backend/publish` if it exists, then runs `dotnet publish` for `Luce.Api` in Release configuration into that folder.

Default URLs are shown in `Luce.Api/Properties/launchSettings.json` (for example `http://localhost:5009`). Swagger UI is available in the Development environment.

- **Docs for the React app:** [FRONTEND_API_INTEGRATION.md](FRONTEND_API_INTEGRATION.md)
- **MonsterASP.NET / IIS deploy:** [DEPLOY_MONSTERASP.md](DEPLOY_MONSTERASP.md)

## Solution layout

| Project | Role |
|---------|------|
| `Luce.Domain` | Entities |
| `Luce.Application.Abstractions` | DTOs, service interfaces, `IApplicationDbContext` |
| `Luce.Application` | Service implementations |
| `Luce.Infrastructure` | EF Core, Identity, JWT, file storage |
| `Luce.Api` | Controllers, `Program.cs`, hosting |
