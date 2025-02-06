using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Bulihub_Backend.Models;

namespace BuliHub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var newUser = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Email, // Az Identity-ben a UserName is kötelező
                BirthDate = model.BirthDate,
                Gender = model.Gender, // Már bool típusú érték
                Name = model.FullName,
                // Mivel az ApplicationUser nem tartalmaz külön City tulajdonságot,
                // itt a Status mezőbe illesztjük a város információt.
                Status = $"Active; City: {model.City}"
            };

            var result = await _userManager.CreateAsync(newUser, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Registration successful");
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var result = await _signInManager.PasswordSignInAsync(
                user,
                model.Password,
                isPersistent: false,
                lockoutOnFailure: false
            );

            if (!result.Succeeded)
                return Unauthorized("Invalid credentials");

            return Ok("Login successful");
        }
    }

    // DTO-k
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateTime? BirthDate { get; set; }
        public string City { get; set; } = string.Empty;
        public bool Gender { get; set; }  // bool típusú érték, ahogy a formból érkezik
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}


