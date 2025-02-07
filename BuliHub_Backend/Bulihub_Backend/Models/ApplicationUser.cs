
using Microsoft.AspNetCore.Identity;

namespace Bulihub_Backend.Models
{
    public class ApplicationUser : IdentityUser<int>
    {

        public DateTime? BirthDate { get; set; }
        public bool Gender { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public string Name { get; set; } = string.Empty; // Most már default érték, így nem lesz null
        public string City { get; set; } = string.Empty; // Új mező
        public string? Status { get; set; }
    }
}


