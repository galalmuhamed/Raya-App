namespace server.Requests
{
    public class UpdateAgentRequest
    {
        public string? Name { get; set; }
        public string? status { get; set; }
        public int UserId { get; set; }
    }
}
