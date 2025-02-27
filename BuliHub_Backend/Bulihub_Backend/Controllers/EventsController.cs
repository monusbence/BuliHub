using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Bulihub_Backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

            if (ev == null) return NotFound();
            return Ok(ev);
        }

        // POST: api/events
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
        {
            // Kinyerjük a bejelentkezett user nevét (ClaimTypes.Name)
            var userFullName = User?.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.Name)
                ?.Value ?? "Ismeretlen szervező";

            // Dátum+idő formázás
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
                EndDate = startDate.AddHours(4), // default 4 óra
                LocationName = dto.LocationName,
                Address = dto.Address,
                Equipment = dto.Equipment,
                Guests = dto.Guests,
                Theme = dto.Theme,
                OrganizerName = userFullName,
                Status = "Upcoming"
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEventById), new { id = newEvent.Id }, newEvent);
        }

        // PUT: api/events/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] Event updatedEvent)
        {
            if (id != updatedEvent.Id) return BadRequest("ID mismatch");

            var existing = await _context.Events.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = updatedEvent.Name;
            existing.Description = updatedEvent.Description;
            existing.StartDate = updatedEvent.StartDate;
            existing.EndDate = updatedEvent.EndDate;
            existing.LocationName = updatedEvent.LocationName;
            existing.Address = updatedEvent.Address;
            existing.Equipment = updatedEvent.Equipment;
            existing.Guests = updatedEvent.Guests;
            existing.Theme = updatedEvent.Theme;
            existing.OrganizerName = updatedEvent.OrganizerName; // Ha frissíteni akarod
            existing.ProviderId = updatedEvent.ProviderId;
            existing.Status = updatedEvent.Status;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/events/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var existing = await _context.Events.FindAsync(id);
            if (existing == null) return NotFound();

            _context.Events.Remove(existing);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

