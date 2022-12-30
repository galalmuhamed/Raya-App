using server.Models;

namespace server.Requests
{
    public class AddAgentRequest
    {
        public string? Name { get; set; }
        public string? status { get; set; }
        public int UserId { get; set; }
    }
}
