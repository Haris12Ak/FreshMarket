using Fresh.MailService.Interface;
using Fresh.Model.Settings;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Fresh.MailService.Service
{
    public class EmailService : IEmailService
    {
        private readonly SendGridSettings _settings;

        public EmailService(IOptions<SendGridSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string toName, string subject, string plainText, string htmlContent)
        {
            var client = new SendGridClient(_settings.ApiKey);
            var from = new EmailAddress(_settings.FromEmail, _settings.FromName);
            var to = new EmailAddress(toEmail, toName);

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainText, htmlContent);
            await client.SendEmailAsync(msg);
        }
    }
}
