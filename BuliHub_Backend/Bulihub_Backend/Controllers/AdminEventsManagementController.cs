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

        // PUT: api/admin/events/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] AdminUpdateEventDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch");
            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return NotFound();

            existingEvent.Name = dto.PartyName;
            existingEvent.Description = dto.Description;
            existingEvent.StartDate = dto.StartDate;
            existingEvent.EndDate = dto.EndDate;
            existingEvent.LocationName = dto.LocationName;
            existingEvent.Address = dto.Address;
            existingEvent.Equipment = dto.Equipment;
            existingEvent.Guests = dto.Guests;
            existingEvent.Theme = dto.Theme;

            await _context.SaveChangesAsync();
            return Ok(existingEvent);
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
}

