using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bulihub_Backend.Models
{
    [Table("Events")]
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Opcionális: ha van ServiceProvider tábla
        public int? ProviderId { get; set; }
        [ForeignKey(nameof(ProviderId))]
        public ServiceProvider? Provider { get; set; }

        // A korábbi Location mezői:
        public string? LocationName { get; set; }   // Helyszín neve
        public string? Address { get; set; }        // Cím
        public string? Equipment { get; set; }      // Extrák

        // A bejelentkezett user neve
        public string? OrganizerName { get; set; }

        // Alapértelmezett
        public string Status { get; set; } = string.Empty;

        // Egyéb mezők
        public int? Guests { get; set; }
        public string? Theme { get; set; }
    }
}


