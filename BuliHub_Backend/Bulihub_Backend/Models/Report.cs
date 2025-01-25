using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Bulihub_Backend.Models
{
    [Table("Reports")]
    public class Report
    {
        [Key]
        public int Id { get; set; }

        
        public int ReportedBy { get; set; }
        [ForeignKey(nameof(ReportedBy))]
        public User? ReporterUser { get; set; }

        
        public int EventId { get; set; }
        [ForeignKey(nameof(EventId))]
        public Event? Event { get; set; }

        public string? Content { get; set; }

        public DateTime ReportDate { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}
