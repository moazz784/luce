# One-time maintenance (production database)

## Reset all Identity users and re-seed the admin from `Seed` settings

The API seeds a single admin user **only when no user exists** with the email in `Seed:AdminEmail` ([appsettings.json](Luce.Api/appsettings.json), currently `AymanShamel@must.edu.eg`). If users already exist, seeding is skipped.

To **remove every account** (including old admins) and let the next application start create the configured admin:

1. **Back up the database** before running destructive SQL.
2. On SQL Server, run the following in order (table names match ASP.NET Core Identity defaults):

```sql
DELETE FROM AspNetUserRoles;
DELETE FROM AspNetUserClaims;
DELETE FROM AspNetUserLogins;
DELETE FROM AspNetUserTokens;
DELETE FROM AspNetUsers;
```

3. If you use **registration OTPs**, clear pending rows:

```sql
DELETE FROM RegistrationOtps;
```

4. Deploy or restart the API with `Seed:AdminEmail` and `Seed:AdminPassword` set via **hosting secrets** (not committed).
5. Confirm login with the new admin email.

**Warning:** This deletes all logins. Content tables (news, alumni, contact messages, etc.) are **not** affected by the script above.
