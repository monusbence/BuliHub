using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Bulihub_Backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly BuliHubDbContext _context;

        public EventsController(BuliHubDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _context.Events
                .Include(e => e.Provider)
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/events/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetEventById(int id)
        {
            var ev = await _context.Events
                .Include(e => e.Provider)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev == null)
                return NotFound();

            return Ok(ev);
        }

        // POST: api/events
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
        {
            // Kinyerjük a bejelentkezett user nevét a tokenből
            var userFullName = User?.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.Name)
                ?.Value ?? "Ismeretlen szervező";

            // Dátum+idő feldolgozása a dto.Time alapján
            DateTime startDate;
            try
            {
                var timeParts = dto.Time.Split(':');
                int hour = int.Parse(timeParts[0]);
                int minute = int.Parse(timeParts[1]);
                startDate = new DateTime(dto.Date.Year, dto.Date.Month, dto.Date.Day, hour, minute, 0);
            }
            catch (Exception)
            {
                return BadRequest("Invalid time format.");
            }

            var newEvent = new Event
            {
                Name = dto.PartyName,
                Description = dto.Description,
                StartDate = startDate,
                EndDate = startDate.AddHours(4), // Default időtartam: 4 óra
                LocationName = dto.LocationName,
                Address = dto.Address,
                Equipment = dto.Equipment,
                Guests = dto.Guests,
                Theme = dto.Theme,
                OrganizerName = userFullName,  // A JWT tokenből kinyert felhasználónév
                Status = "Upcoming"
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEventById), new { id = newEvent.Id }, newEvent);
        }

        // PUT: api/events/5
        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] UpdateEventDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch");

            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return NotFound();

            // Ellenőrizzük, hogy a bejelentkezett felhasználó a buli szervezője-e
            var currentUser = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (!string.Equals(existingEvent.OrganizerName, currentUser, StringComparison.OrdinalIgnoreCase))
            {
                return Forbid("You are not allowed to update this event.");
            }

            // Frissítjük az esemény adatait az UpdateEventDto alapján
            existingEvent.Name = dto.PartyName;
            existingEvent.Description = dto.Description;
            existingEvent.StartDate = dto.StartDate;
            existingEvent.EndDate = dto.EndDate;
            existingEvent.LocationName = dto.LocationName;
            existingEvent.Address = dto.Address;
            existingEvent.Equipment = dto.Equipment;
            existingEvent.Guests = dto.Guests;
            existingEvent.Theme = dto.Theme;
            // OrganizerName, ProviderId és Status általában nem változik itt

            await _context.SaveChangesAsync();
            return Ok(existingEvent);
        }

        // DELETE: api/events/5
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var existing = await _context.Events.FindAsync(id);
            if (existing == null)
                return NotFound();

            var currentUser = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (!string.Equals(existing.OrganizerName, currentUser, StringComparison.OrdinalIgnoreCase))
            {
                return Forbid("You are not allowed to delete this event.");
            }

            _context.Events.Remove(existing);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // Új DTO az esemény frissítéséhez
    public class UpdateEventDto
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
