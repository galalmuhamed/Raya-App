using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace server.Models
{
    public class User
    {
        public int Id { get; set; }
       
        [Required,MaxLength(50)] 
        public string? Username { get; set; }
        [Required]
        public string? Password { get; set; }

        public DateTime? CreatedDate { get; set; } = DateTime.Now;

        [Required]
        public int RoleId { get; set; }
        public Role? Role { get; set; }
    }
}
