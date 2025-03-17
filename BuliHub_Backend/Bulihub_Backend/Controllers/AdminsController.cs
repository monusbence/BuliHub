using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/admins")]
    public class AdminsController : ControllerBase
    {
        private readonly BuliHubDbContext _context;
        // A PasswordHasher az Admin típusra
        private readonly PasswordHasher<Admin> _passwordHasher = new PasswordHasher<Admin>();

        public AdminsController(BuliHubDbContext context)
        {
            _context = context;
        }

        // POST: api/admins/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AdminRegisterDto dto)
        {
            // Ellenőrizzük, hogy már létezik-e ilyen felhasználónév
            if (await _context.Admins.AnyAsync(a => a.Username == dto.Username))
            {
                return Conflict("Ezzel a felhasználónévvel már regisztráltak.");
            }

            var admin = new Admin
            {
                Username = dto.Username,
                // A jelszó hash-elése – a null első paraméter helyett akár az admin objektumot is megadhatjuk
                PasswordHash = _passwordHasher.HashPassword(null, dto.Password)
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Regisztráció sikeres", AdminId = admin.Id });
        }

        // POST: api/admins/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == dto.Username);
            if (admin == null)
            {
                return Unauthorized("Érvénytelen felhasználónév vagy jelszó.");
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, dto.Password);
            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Érvénytelen felhasználónév vagy jelszó.");
            }

            // Itt token generálás is lehetséges, ha szükséges
            return Ok(new { Message = "Bejelentkezés sikeres", AdminId = admin.Id });
        }
    }

    // DTO-k a könnyebb adatátvitelhez
    public class AdminRegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AdminLoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
