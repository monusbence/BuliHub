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

        // Kapcsolat a ServiceProviders táblával
        public int ProviderId { get; set; }
        [ForeignKey(nameof(ProviderId))]
        public ServiceProvider? Provider { get; set; }

        // Kapcsolat a Locations táblával
        public int LocationId { get; set; }
        [ForeignKey(nameof(LocationId))]
        public Location? Location { get; set; }

        public string Status { get; set; } = string.Empty;

        // Új mezők a frontend adatokhoz
        public int? Guests { get; set; }
        public string? Theme { get; set; }
        public string? LocationName { get; set; }
    }
}

