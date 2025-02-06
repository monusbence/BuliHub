using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

// 1) MySQL kapcsolat (appsettings.json -> "BuliHubConnection")
var connectionString = builder.Configuration.GetConnectionString("BuliHubConnection");

// 2) EF Core + Pomelo MySQL
builder.Services.AddDbContext<BuliHubDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // A frontend URL-je
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


// 3) ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    // Példa Identity beállítások:
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireUppercase = false;
    // stb.
})
.AddEntityFrameworkStores<BuliHubDbContext>()
.AddDefaultTokenProviders();

// 4) Kontroller
builder.Services.AddControllers();

// (Opcionális) Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Használjuk a CORS middleware-t a beállított policy-val:
app.UseCors("AllowFrontend");

// Identity pipeline
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
