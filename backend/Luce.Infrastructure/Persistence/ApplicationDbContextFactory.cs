using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Luce.Infrastructure.Persistence;

// Design-time factory for `dotnet ef` (no running host / DI).
public sealed class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var apiRoot = ResolveApiProjectDirectory();
        var config = new ConfigurationBuilder()
            .SetBasePath(apiRoot)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
            .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException(
                "Connection string 'DefaultConnection' was not found. Check Luce.Api/appsettings.json or set environment variable ConnectionStrings__DefaultConnection.");

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new ApplicationDbContext(optionsBuilder.Options);
    }

    private static string ResolveApiProjectDirectory()
    {
        var start = new DirectoryInfo(Directory.GetCurrentDirectory());

        if (File.Exists(Path.Combine(start.FullName, "appsettings.json")) &&
            start.Name.Equals("Luce.Api", StringComparison.OrdinalIgnoreCase))
            return start.FullName;

        for (var dir = start; dir != null; dir = dir.Parent)
        {
            var apiSettings = Path.Combine(dir.FullName, "Luce.Api", "appsettings.json");
            if (File.Exists(apiSettings))
                return Path.GetDirectoryName(apiSettings)!;
        }

        throw new InvalidOperationException(
            "Could not locate Luce.Api/appsettings.json. Run the command from the backend folder, e.g. " +
            "\"dotnet ef database update --project Luce.Infrastructure --startup-project Luce.Api\".");
    }
}
