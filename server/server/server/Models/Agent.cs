using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    
    public enum AgentStatusEnum{
        New,
        Approved
    }

    public class Agent
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public AgentStatusEnum status { get; set; }
    }
}
