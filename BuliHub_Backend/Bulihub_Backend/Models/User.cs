using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Bulihub_Backend.Models
{
    [Table("UsersSajat")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public DateTime? BirthDate { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

       
        public int RoleId { get; set; }
        [ForeignKey(nameof(RoleId))]
        public Role? Role { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = string.Empty;

        public bool Gender { get; set; }
    }
}
