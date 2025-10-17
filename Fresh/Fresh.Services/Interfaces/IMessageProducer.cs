namespace Fresh.Services.Interfaces
{
    public interface IMessageProducer
    {
        public void SendingObject<T>(T obj);
    }
}
