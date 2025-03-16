using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bulihub_Backend.Data;
using Bulihub_Backend.Models;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly BuliHubDbContext _context;
        public UsersController(BuliHubDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.BirthDate = dto.BirthDate;
            await _context.SaveChangesAsync();
            return Ok(user);
        }
    }

    public class UserUpdateDto
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public DateTime? BirthDate { get; set; }
    }
}
