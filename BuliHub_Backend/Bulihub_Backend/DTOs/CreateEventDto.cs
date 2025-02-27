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

        [JsonPropertyName("locationName")]
        public string LocationName { get; set; } = string.Empty;

        // ÚJ mezők, amiket eddig a Location típusba raktunk
        [JsonPropertyName("address")]
        public string Address { get; set; } = string.Empty;

        [JsonPropertyName("equipment")]
        public string Equipment { get; set; } = string.Empty;

        [JsonPropertyName("guests")]
        public int Guests { get; set; }

        [JsonPropertyName("theme")]
        public string Theme { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
    }
}

