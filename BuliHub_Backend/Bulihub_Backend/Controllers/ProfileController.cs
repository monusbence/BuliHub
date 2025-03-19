using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using Bulihub_Backend.Models; // vagy a te namespace-ed, ahol az ApplicationUser található

namespace Bulihub_Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET /api/profile/me
        // Visszaadja a bejelentkezett user adatait: név, email, születési dátum, város, nem
        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            // Tokenből kinyerjük az email claimet
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (userEmail == null)
                return Unauthorized("No email claim found in token.");

            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null)
                return NotFound("User not found.");

            // Opcionálisan formázhatod a születési dátumot (pl. yyyy-MM-dd)
            var birthDateString = user.BirthDate?.ToString("yyyy-MM-dd");

            return Ok(new
            {
                fullName = user.Name,
                email = user.Email,
                birthDate = birthDateString,
                city = user.City,
                gender = user.Gender
            });
        }

        // POST /api/profile/changepassword
        // Ellenőrzi a jelenlegi jelszót, és módosítja egy újra
        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            // Tokenből kinyerjük az email claimet
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (userEmail == null)
                return Unauthorized("No email claim found in token.");

            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null)
                return NotFound("User not found.");

            // Ellenőrizzük a jelenlegi jelszót
            var isOldPasswordCorrect = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
            if (!isOldPasswordCorrect)
            {
                return BadRequest("A jelenlegi jelszó helytelen.");
            }

            // Jelszó módosítása
            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                return BadRequest("Jelszó módosítása sikertelen: " + errors);
            }

            return Ok("Jelszó sikeresen módosítva.");
        }
    }

    // DTO a jelszóváltáshoz
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
