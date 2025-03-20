using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace Bulihub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        [HttpPost("contact")]
        public async Task<IActionResult> SendContactMessage([FromBody] ContactMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest("Email és üzenet kötelező.");
            }

            try
            {
                using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.EnableSsl = true;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential("bulihubhu@gmail.com", "pndgkozampthqfib");
                    smtp.Timeout = 10000; // 10 másodperces timeout

                    // A felhasználó által megadott adatok alapján állítjuk be a feladó címet
                    var fromAddress = new MailAddress(dto.Email, dto.Name);
                    var toAddress = new MailAddress("bulihubhu@gmail.com");
                    string subject = $"Új üzenet: {dto.Name}";
                    string body = $"Név: {dto.Name}\nEmail: {dto.Email}\nÜzenet:\n{dto.Message}";

                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body
                    })
                    {
                        // Beállítjuk a válaszcímkét is, így a címzett könnyebben válaszolhat a felhasználónak
                        message.ReplyToList.Add(new MailAddress(dto.Email));
                        await smtp.SendMailAsync(message);
                    }
                }
                return Ok("Üzenet sikeresen elküldve.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Hiba történt az üzenet küldése során: " + ex.Message);
            }
        }
    }

    public class ContactMessageDto
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Message { get; set; } = "";
    }
}
