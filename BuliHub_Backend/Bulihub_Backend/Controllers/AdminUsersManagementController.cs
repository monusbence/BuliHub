using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    public class AdminUsersManagementController : ControllerBase
    {
        private readonly BuliHubDbContext _context;
        public AdminUsersManagementController(BuliHubDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // Az ApplicationUser entitásból dolgozunk (Users tábla)
            var users = await _context.Set<ApplicationUser>().ToListAsync();
            return Ok(users);
        }

        // DELETE: api/admin/users/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Set<ApplicationUser>().FindAsync(id);
            if (user == null)
                return NotFound();
            _context.Set<ApplicationUser>().Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/admin/users/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUserUpdateDto dto)
        {
            var user = await _context.Set<ApplicationUser>().FindAsync(id);
            if (user == null)
                return NotFound();

            // Frissítjük az alapadatokat
            user.Name = dto.Name;
            user.BirthDate = dto.BirthDate;
            user.Gender = dto.Gender;
            user.City = dto.City;
            user.Status = dto.Status;

            // Email módosítása: minden érintett mezőt frissítünk
            user.Email = dto.Email;
            user.UserName = dto.Email;
            user.NormalizedEmail = dto.Email.ToUpperInvariant();
            user.NormalizedUserName = dto.Email.ToUpperInvariant();

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // Nested DTO a duplikáció elkerülése érdekében
        public class AdminUserUpdateDto
        {
            public string Name { get; set; } = "";
            public DateTime? BirthDate { get; set; }
            public bool Gender { get; set; }
            public string City { get; set; } = "";
            public string Status { get; set; } = "";
            public string Email { get; set; } = "";
        }
    }
}
