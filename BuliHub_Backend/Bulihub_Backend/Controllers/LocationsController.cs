using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly BuliHubDbContext _context;

        public LocationsController(BuliHubDbContext context)
        {
            _context = context;
        }

        // Helyszínek keresése név alapján
        [HttpGet("search")]
        public async Task<IActionResult> SearchLocations([FromQuery] string name)
        {
            var locations = await _context.Locations
                .Where(l => l.Name.Contains(name))
                .ToListAsync();

            return Ok(locations);
        }

        // Helyszín létrehozása
        [HttpPost]
        public async Task<IActionResult> CreateLocation([FromBody] Location location)
        {
            var existingLocation = await _context.Locations
                .FirstOrDefaultAsync(l => l.Name == location.Name);

            if (existingLocation != null)
            {
                return Ok(existingLocation);  // Ha már létezik, nem szükséges új helyszínt létrehozni
            }

            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateLocation), new { id = location.Id }, location);
        }
    }
}

