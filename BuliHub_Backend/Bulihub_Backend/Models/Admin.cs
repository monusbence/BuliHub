using System;

namespace Bulihub_Backend.Models
{
    public class Admin
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        // Jelenleg egyszerűsítve tároljuk a jelszót (természetesen éles környezetben jelszó hash-elést javasolt alkalmazni)
        public string Password { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    }
}
