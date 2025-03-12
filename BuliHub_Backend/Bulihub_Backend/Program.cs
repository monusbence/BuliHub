using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// 3) CORS be�ll�t�sok
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

// 4) ASP.NET Core Identity konfigur�ci�
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    // P�lda Identity be�ll�t�sok:
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireUppercase = false;
    // stb.
})
.AddEntityFrameworkStores<BuliHubDbContext>()
.AddDefaultTokenProviders();

// 5) JWT Bearer autentik�ci� hozz�ad�sa
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "bulihub.hu",
        ValidAudience = "bulihub.hu",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SuperSecretKey@345SuperSecretKey@345"))
    };
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            // Megakad�lyozzuk az alap�rtelmezett redirect-et
            context.HandleResponse();
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync("{\"error\": \"Unauthorized\"}");
        }
    };
});

// 6) Kontroller
builder.Services.AddControllers();

// (Opcion�lis) Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Haszn�ljuk a CORS middleware-t a be�ll�tott policy-val:
app.UseCors("AllowFrontend");

// Identity pipeline
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
