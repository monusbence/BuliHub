using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminsController : ControllerBase
    {
        private readonly BuliHubDbContext _context;
        public AdminsController(BuliHubDbContext context)
        {
            _context = context;
        }

        // POST: api/admins/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AdminRegisterDto dto)
        {
            if (await _context.Admins.AnyAsync(a => a.Username == dto.Username))
            {
                return Conflict("Ezzel a felhasználónévvel már regisztráltak.");
            }

            var newAdmin = new Admin
            {
                Username = dto.Username,
                Password = dto.Password // Egyszerűsített megoldás – éles környezetben jelszó hash-elést alkalmazz!
            };

            _context.Admins.Add(newAdmin);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = newAdmin.Id }, newAdmin);
        }

        // POST: api/admins/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == dto.Username);
            if (admin == null || admin.Password != dto.Password)
            {
                return Unauthorized("Érvénytelen felhasználónév vagy jelszó.");
            }
            return Ok(new { message = "Sikeres bejelentkezés", adminId = admin.Id });
        }

        // GET: api/admins/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound();
            return Ok(admin);
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
