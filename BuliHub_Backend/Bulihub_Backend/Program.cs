using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.SqlServer.Management.Smo;

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

// Identity pipeline
app.UseHttpsRedirection();
app.UseAuthentication();   // Fontos a belépés/hozzáférés vezérléséhez
app.UseAuthorization();

app.MapControllers();

app.Run();
