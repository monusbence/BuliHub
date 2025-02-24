using System;
using System.Text.Json.Serialization;

namespace Bulihub_Backend.DTOs
{
    public class CreateEventDto
    {
        [JsonPropertyName("partyName")]
        public string PartyName { get; set; } = string.Empty;

        [JsonPropertyName("date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("time")]
        public string Time { get; set; } = string.Empty;

        [JsonPropertyName("location")]
        public string Location { get; set; } = string.Empty;

        [JsonPropertyName("guests")]
        public int Guests { get; set; }

        [JsonPropertyName("theme")]
        public string Theme { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
    }
}
