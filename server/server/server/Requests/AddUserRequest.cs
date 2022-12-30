using server.Models;
using System.ComponentModel.DataAnnotations;

namespace server.Response
{
    public class AddUserRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public int RoleId { get; set; }
    }
}
