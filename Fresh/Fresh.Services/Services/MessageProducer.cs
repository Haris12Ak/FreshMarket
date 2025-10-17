using EasyNetQ;
using Fresh.Model.Settings;
using Fresh.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Fresh.Services.Services
{
    public class MessageProducer : IMessageProducer
    {
        private readonly RabbitMQSettings _rabbitMQSettings;
        private readonly IBus _bus;

        public MessageProducer(IOptions<RabbitMQSettings> rabbitMQSettings)
        {
            _rabbitMQSettings = rabbitMQSettings.Value;

            _bus = RabbitHutch.CreateBus(
                   $"host={_rabbitMQSettings.RABBITMQ_HOST};virtualHost={_rabbitMQSettings.RABBITMQ_VIRTUALHOST};username={_rabbitMQSettings.RABBITMQ_USERNAME};password={_rabbitMQSettings.RABBITMQ_PASSWORD}");
        }

        public void SendingObject<T>(T obj)
        {
            _bus.PubSub.Publish(obj);
        }
    }
}
