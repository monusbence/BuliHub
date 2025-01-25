using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private static List<User> _users = new List<User>();

        // POST api/users/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] User newUser)
        {
            // ellenőrzés: nincs-e még ilyen email
            if (_users.Any(u => u.Email == newUser.Email))
            {
                return Conflict("Ezzel az e-mail címmel már regisztráltak.");
            }

            _users.Add(newUser);
            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
        }

        // GET api/users
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_users);
        }

        // GET api/users/{id}
        [HttpGet("{id}")]
        public IActionResult GetUserById(Guid id)
        {
            var user = _users.FirstOrDefault(u =>
            {
                return u.Id == Convert.ToInt32( id);
            });
            if (user == null) return NotFound();

            return Ok(user);
        }
    }
}
