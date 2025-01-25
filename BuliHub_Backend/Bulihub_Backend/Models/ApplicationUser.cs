
using Microsoft.AspNetCore.Identity;

namespace Bulihub_Backend.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        
        public DateTime? BirthDate { get; set; }
        public bool Gender { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public string? Name { get; set; }
        public string? Status { get; set; }
    }
}


