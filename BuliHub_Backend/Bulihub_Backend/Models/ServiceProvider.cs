using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bulihub_Backend.Models
{
    [Table("ServiceProviders")]
    public class ServiceProvider
    {
        [Key]
        public int Id { get; set; }

        // FK a Users táblára
        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public string Adoszam { get; set; } = string.Empty;
        public string Services { get; set; } = string.Empty;
        public bool Company { get; set; }
    }
}
