using System.IO;
using Selu383.SP25.P03.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DataContext") ?? throw new InvalidOperationException("Connection string 'DataContext' not found.")));

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddRazorPages();

            builder.Services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            builder.Services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = false;
            });

            builder.Services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = 403;
                    return Task.CompletedTask;
                };

                options.SlidingExpiration = true;
            });

            if (File.Exists(".env"))
            {
                foreach (var line in File.ReadAllLines(".env"))
                {
                    if (!string.IsNullOrWhiteSpace(line) && !line.StartsWith("#"))
                    {
                        var parts = line.Split('=', 2, StringSplitOptions.RemoveEmptyEntries);
                        if (parts.Length == 2)
                        {
                            Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
                        }
                    }
                }
            }

            builder.Services.AddHttpClient<TmdbService>();
            builder.Services.AddScoped<TmdbService>();
            builder.Services.AddScoped<ShowtimeManagementService>();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
    await db.Database.MigrateAsync();
    
    SeedTheaters.Initialize(scope.ServiceProvider);
    await SeedRoles.Initialize(scope.ServiceProvider);
    await SeedUsers.Initialize(scope.ServiceProvider);
    SeedMovies.Initialize(scope.ServiceProvider);
    SeedConcessions.Initialize(scope.ServiceProvider);
    
    // Generate showtimes on startup if none exist
    var showtimeService = scope.ServiceProvider.GetRequiredService<ShowtimeManagementService>();
    await showtimeService.GenerateShowtimesIfNoneExist();
}

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseRouting()
               .UseAuthorization()
               .UseEndpoints(x =>
               {
                   x.MapControllers();
               });
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSpa(x =>
                {
                    x.UseProxyToSpaDevelopmentServer("http://localhost:5173");
                });
            }
            else
            {
                app.MapFallbackToFile("/index.html");
            }

            app.Run();
        }
    }
}
