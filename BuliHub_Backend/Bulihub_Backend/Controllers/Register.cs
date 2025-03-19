using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Bulihub_Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Net;
using System.Net.Mail;
using System.Linq;
using System;

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
                UserName = model.Email,
                BirthDate = model.BirthDate,
                Gender = model.Gender,
                Name = model.FullName,
                City = model.City,
                Status = "Active"
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

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        // A név claimben a user.Name
        new Claim(ClaimTypes.Name, user.Name),
        // Ha szeretnéd, email claimet is adhatsz
        new Claim(ClaimTypes.Email, user.Email ?? "")
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SuperSecretKey@345SuperSecretKey@345"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "bulihub.hu",
                audience: "bulihub.hu",
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds);

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            // VISSZAADJUK A NEVET ÉS AZ EMAILT IS
            return Ok(new
            {
                token = jwtToken,
                name = user.Name,
                email = user.Email
            });
        }


        // POST: api/auth/forgotpassword
        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            Console.WriteLine("ForgotPassword endpoint called with email: " + dto.Email);
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                Console.WriteLine("User not found for email: " + dto.Email);
                return Ok("Ha az email létezik, elküldtük a jelszó emlékeztetőt.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            string tempPassword = GenerateTemporaryPassword();
            var resetResult = await _userManager.ResetPasswordAsync(user, token, tempPassword);
            if (!resetResult.Succeeded)
            {
                var errorMessages = string.Join("; ", resetResult.Errors.Select(e => e.Description));
                Console.WriteLine("Password reset failed for email: " + dto.Email + " Reason(s): " + errorMessages);
                return BadRequest("Jelszó visszaállítása sikertelen. Részletek: " + errorMessages);
            }

            try
            {
                await SendPasswordReminderEmail(dto.Email, user.Name, tempPassword);
                Console.WriteLine("Email sent successfully to: " + dto.Email);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
                return StatusCode(500, "Hiba történt az email küldése során: " + ex.Message);
            }

            return Ok("Ha az email létezik, elküldtük a jelszó emlékeztetőt.");
        }

        private string GenerateTemporaryPassword(int length = 10)
        {
            // Bővített karakterkészlet, hogy megfeleljen a jelszókövetelményeknek
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            return new string(Enumerable.Repeat(validChars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task SendPasswordReminderEmail(string toEmail, string username, string tempPassword)
        {
            var fromAddress = new MailAddress("bulihubhu@gmail.com", "BuliHub");
            var toAddress = new MailAddress(toEmail);
            string subject = "BuliHub jelszó emlékeztető";
            string body = $"Kedves {username},\n\nAz új jelszavad: {tempPassword}\nKérjük, jelentkezz be\n\nÜdvözlettel,\nBuliHub csapata";

            using (var smtp = new SmtpClient())
            {
                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.EnableSsl = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential("bulihubhu@gmail.com", "pndgkozampthqfib");

                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body
                })
                {
                    await smtp.SendMailAsync(message);
                }
            }
        }
    }

    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateTime? BirthDate { get; set; }
        public string City { get; set; } = string.Empty;
        public bool Gender { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }
}
