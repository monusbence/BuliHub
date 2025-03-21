using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BuliHub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HirlevelController : ControllerBase
    {
        // POST: api/hirlevel/subscribe
        [HttpPost("subscribe")]
        public async Task<IActionResult> SubscribeHirlevel([FromBody] HirlevelSubscribeDto model)
        {
            try
            {
                await SendHirlevelConfirmationEmail(model.Email);
                return Ok("Feliratkozás sikeres! Kérjük, ellenőrizd az email fiókodat a visszaigazoló levélért.");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, "Hiba történt az email küldése során: " + ex.Message);
            }
        }

        private async Task SendHirlevelConfirmationEmail(string toEmail)
        {
            var fromAddress = new MailAddress("bulihubhu@gmail.com", "BuliHub");
            var toAddress = new MailAddress(toEmail);
            string subject = "Sikeres feliratkozás a BuliHub hírlevélre";
            string body =
                "Kedves Feliratkozott,\n\n" +
                "Köszönjük, hogy feliratkoztál a BuliHub hírlevelére! " +
                "Mostantól elsőként értesülhetsz a legújabb bulikról, eseményekről és különleges ajánlatainkról. " +
                "Ha bármilyen kérdésed van, bátran keress minket!\n\n" +
                "Üdvözlettel,\n" +
                "A BuliHub Csapata";

            using (var smtp = new SmtpClient())
            {
                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.EnableSsl = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.UseDefaultCredentials = false;
                // Gmail-jelszó a "bulihubhu@gmail.com" fiókhoz:
                smtp.Credentials = new NetworkCredential("bulihubhu@gmail.com", "pndgkozampthqfib");

                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body
                })
                {
                    await smtp.SendMailAsync(message);
                }
            }
        }
    }

    public class HirlevelSubscribeDto
    {
        public string Email { get; set; }
    }
}
