using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/admin/events")]
    public class AdminEventsManagementController : ControllerBase
    {
        private readonly BuliHubDbContext _context;
        public AdminEventsManagementController(BuliHubDbContext context)
        {
            _context = context;
        }

        // DELETE: api/admin/events/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var existing = await _context.Events.FindAsync(id);
            if (existing == null)
                return NotFound();
            _context.Events.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        

        // PATCH: api/admin/events/5
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchEvent(int id, [FromBody] PatchEventDto dto)
        {
            var eventEntity = await _context.Events.FindAsync(id);
            if (eventEntity == null)
                return NotFound();

            // Csak azok a mezők frissülnek, amiket nem null értékkel adunk meg
            if (dto.StartDate.HasValue)
                eventEntity.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue)
                eventEntity.EndDate = dto.EndDate.Value;
            if (!string.IsNullOrEmpty(dto.Status))
                eventEntity.Status = dto.Status;
            if (dto.Guests.HasValue)
                eventEntity.Guests = dto.Guests.Value;
            if (!string.IsNullOrEmpty(dto.LocationName))
                eventEntity.LocationName = dto.LocationName;
            if (!string.IsNullOrEmpty(dto.Theme))
                eventEntity.Theme = dto.Theme;
            if (!string.IsNullOrEmpty(dto.Address))
                eventEntity.Address = dto.Address;
            if (!string.IsNullOrEmpty(dto.Equipment))
                eventEntity.Equipment = dto.Equipment;

            await _context.SaveChangesAsync();
            return Ok(eventEntity);
        }

        // Egyéb metódusok: GET, PUT, DELETE stb.
    }

    // DTO a PATCH metódushoz
    public class PatchEventDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Status { get; set; }
        public int? Guests { get; set; }
        public string? LocationName { get; set; }
        public string? Theme { get; set; }
        public string? Address { get; set; }
        public string? Equipment { get; set; }
    }


    // Nested DTO a duplikáció elkerülése érdekében
    public class AdminUpdateEventDto
        {
            public int Id { get; set; }
            public string PartyName { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string LocationName { get; set; } = string.Empty;
            public string Address { get; set; } = string.Empty;
            public string Equipment { get; set; } = string.Empty;
            public int Guests { get; set; }
            public string Theme { get; set; } = string.Empty;
        }
    }


