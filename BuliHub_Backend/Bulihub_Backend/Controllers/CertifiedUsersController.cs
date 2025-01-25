using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CertifiedUsersController : ControllerBase
    {
        private static List<CertifiedUser> _certUsers = new List<CertifiedUser>();

        // POST api/certifiedusers/register
        [HttpPost("register")]
        public IActionResult RegisterCertifiedUser([FromBody] CertifiedUser newCertUser)
        {
            
            if (_certUsers.Any(cu => cu.Email == newCertUser.Email))
            {
                return Conflict("Ezzel az e-mail címmel már regisztráltak (hitelesített).");
            }

            _certUsers.Add(newCertUser);
            return CreatedAtAction(nameof(GetCertifiedUserById), new { id = newCertUser.Id }, newCertUser);
        }

        // GET api/certifiedusers
        [HttpGet]
        public IActionResult GetAllCertifiedUsers()
        {
            return Ok(_certUsers);
        }

        // GET api/certifiedusers/{id}
        [HttpGet("{id}")]
        public IActionResult GetCertifiedUserById(Guid id)
        {
            var certUser = _certUsers.FirstOrDefault(c => c.Id == id);
            if (certUser == null) return NotFound();

            return Ok(certUser);
        }
    }
}
