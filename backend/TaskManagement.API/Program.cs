using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Services;
using InfrastructureRepositories = TaskManagement.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();

// 🔥 Register JWT Authentication
var jwtSettings = new TaskManagement.Core.Models.JwtSettings();
builder.Configuration.GetSection("Jwt").Bind(jwtSettings);
jwtSettings.Validate();

var jwtKeyBytes = Encoding.UTF8.GetBytes(jwtSettings.Key);
var jwtSecurityKey = new SymmetricSecurityKey(jwtKeyBytes);

builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = jwtSecurityKey
        };
    });

// 🔥 Register Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("A production database connection string named 'DefaultConnection' must be provided. In development, place the LocalDB string in appsettings.Development.json.");
}

if (!builder.Environment.IsDevelopment())
{
    var builderOptions = new SqlConnectionStringBuilder(connectionString);

    if (!string.IsNullOrWhiteSpace(builderOptions.DataSource) &&
        (builderOptions.DataSource.Contains("LocalDB", StringComparison.OrdinalIgnoreCase) ||
         builderOptions.DataSource.Contains("(localdb)", StringComparison.OrdinalIgnoreCase)))
    {
        throw new InvalidOperationException("LocalDB is not supported in production. Provide a production-ready SQL Server connection string via secure configuration.");
    }

    if (builderOptions.TrustServerCertificate)
    {
        throw new InvalidOperationException("TrustServerCertificate=True is not allowed in production. Use a properly validated SQL Server certificate.");
    }

    if (builderOptions.IntegratedSecurity)
    {
        throw new InvalidOperationException("Trusted connection / Windows authentication is not portable for production. Supply a production-ready SQL Server connection string.");
    }

    if (!builderOptions.Encrypt)
    {
        throw new InvalidOperationException("Encrypt=False is not allowed in production. Use an encrypted SQL Server connection string.");
    }
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 🔥 Register Dependency Injection (DI) for Services and Repositories
builder.Services.AddScoped<IUserRepository, InfrastructureRepositories.UserRepository>();
builder.Services.AddScoped<ITaskRepository, InfrastructureRepositories.TaskRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// In local development without HTTPS configured, skip automatic HTTPS redirection.
// This prevents the warning about missing HTTPS port when running with `dotnet run`.
if (app.Urls.Any(url => url.StartsWith("https://", StringComparison.OrdinalIgnoreCase)))
{
    app.UseHttpsRedirection();
}

// 🔥 IMPORTANT: Authentication must come before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new { message = "TaskManagement.API is running" }));

app.Run();