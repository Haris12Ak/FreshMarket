
using EasyNetQ;
using Fresh.MailService.Interface;
using Fresh.Model;
using Fresh.Model.Settings;
using Microsoft.Extensions.Options;

namespace Fresh.MailService
{
    public class BackgroundWorkerService : BackgroundService
    {
        private readonly RabbitMQSettings _rabbitMQSettings;
        private readonly IEmailService _emailService;
        private readonly ILogger<BackgroundWorkerService> _logger;
        private readonly IBus _bus;

        public BackgroundWorkerService(IOptions<RabbitMQSettings> rabbitMQSettings, IEmailService emailService, ILogger<BackgroundWorkerService> logger)
        {
            _rabbitMQSettings = rabbitMQSettings.Value;
            _emailService = emailService;
            _logger = logger;

            _bus = RabbitHutch.CreateBus(
                   $"host={_rabbitMQSettings.RABBITMQ_HOST};virtualHost={_rabbitMQSettings.RABBITMQ_VIRTUALHOST};username={_rabbitMQSettings.RABBITMQ_USERNAME};password={_rabbitMQSettings.RABBITMQ_PASSWORD}");
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                _bus.PubSub.Subscribe<EmailMessageDto>("Fresh.MailService", HandleMessage);

                _logger.LogInformation("RabbitMQ listener started...");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to start RabbitMQ listener.");
            }

            await base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Keep the service alive
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        private async Task HandleMessage(EmailMessageDto emailMessage)
        {
            try
            {
                _logger.LogInformation($"Email message received: {emailMessage.Email}");

                var subject = "Welcome to Fresh App";

                var plainText = $"Hello {emailMessage.FirstName}, your username is {emailMessage.Username}, password {emailMessage.Password}";

                var assembly = typeof(Fresh.MailService.BackgroundWorkerService).Assembly;
                var assemblyFolder = Path.GetDirectoryName(assembly.Location);

                string templatePath = Path.Combine(assemblyFolder!, "Templates", "CreateEmailTemplate.html");

                string htmlTemplate = await File.ReadAllTextAsync(templatePath);

                string htmlContent = htmlTemplate
                   .Replace("{{FirstName}}", emailMessage.FirstName)
                   .Replace("{{CompanyName}}", emailMessage.CompanyName)
                   .Replace("{{CompanyAddress}}", emailMessage.CompanyAddress)
                   .Replace("{{Username}}", emailMessage.Username)
                   .Replace("{{Password}}", emailMessage.Password);

                await _emailService.SendEmailAsync(
                        emailMessage.Email,
                        $"{emailMessage.FirstName} {emailMessage.LastName}",
                        subject,
                        plainText,
                        htmlContent
                        );

                _logger.LogInformation("Email sent successfully to {to}", emailMessage.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling email message.");
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("RabbitMQ listener is stopping...");

            try
            {
                _bus.Dispose();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while stopping RabbitMQ listener.");
            }

            await base.StopAsync(cancellationToken);
            _logger.LogInformation("RabbitMQ listener stopped.");
        }

        public override void Dispose()
        {
            _bus.Dispose();
            base.Dispose();
        }
    }
}
