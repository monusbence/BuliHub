using System;

namespace Bulihub_Backend.Models
{
    public class Party
    {
        public Guid Id { get; set; } = Guid.NewGuid();   
        public string PartyName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;  
        public string Location { get; set; } = string.Empty;
        public int Guests { get; set; }
        public string Theme { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}

