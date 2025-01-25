using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PartiesController : ControllerBase
    {
        
        private static List<Party> _parties = new List<Party>();

        // POST api/parties
        [HttpPost]
        public IActionResult CreateParty([FromBody] Party newParty)
        {
            
            if (string.IsNullOrWhiteSpace(newParty.PartyName))
            {
                return BadRequest("A buli neve kötelező!");
            }

            
            _parties.Add(newParty);

            
            return CreatedAtAction(nameof(GetPartyById), new { id = newParty.Id }, newParty);
        }

        // GET api/parties
        [HttpGet]
        public IActionResult GetAllParties()
        {
            return Ok(_parties);
        }

        // GET api/parties/{id}
        [HttpGet("{id}")]
        public IActionResult GetPartyById(Guid id)
        {
            var party = _parties.FirstOrDefault(p => p.Id == id);
            if (party == null)
            {
                return NotFound("Buli nem található ezzel az ID-vel.");
            }
            return Ok(party);
        }

        // PUT api/parties/{id} – update (opcionális)
        [HttpPut("{id}")]
        public IActionResult UpdateParty(Guid id, [FromBody] Party updated)
        {
            var existingParty = _parties.FirstOrDefault(p => p.Id == id);
            if (existingParty == null) return NotFound();

            
            existingParty.PartyName = updated.PartyName;
            existingParty.Date = updated.Date;
            existingParty.Time = updated.Time;
            existingParty.Location = updated.Location;
            existingParty.Guests = updated.Guests;
            existingParty.Theme = updated.Theme;
            existingParty.Description = updated.Description;

            return Ok(existingParty);
        }

        // DELETE api/parties/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteParty(Guid id)
        {
            var party = _parties.FirstOrDefault(p => p.Id == id);
            if (party == null) return NotFound();

            _parties.Remove(party);
            return NoContent();
        }
    }
}
