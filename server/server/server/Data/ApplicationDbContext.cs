using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Reflection.Metadata;

namespace server.Data
{
    public class ApplicationDbContext :DbContext
    {
        public ApplicationDbContext(DbContextOptions options):base(options)
        { 
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
            modelBuilder.Entity<Role>()
                .HasIndex(r => r.Name)
                .IsUnique();
            modelBuilder
          .Entity<Agent>()
          .Property(e => e.status)
          .HasConversion(
              v => v.ToString(),
              v => (AgentStatusEnum)Enum.Parse(typeof(AgentStatusEnum), v));

        }

        public DbSet<Role> roles { get; set; }
        public DbSet<User> users { get; set; } 
        public DbSet<Agent> agents { get; set; }
    }
}
