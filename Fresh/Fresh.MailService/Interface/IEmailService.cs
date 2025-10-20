namespace Fresh.MailService.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string toName, string subject, string plainText, string htmlContent);
    }
}
