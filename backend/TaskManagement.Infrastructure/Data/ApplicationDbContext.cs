using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.Models;
// 🔥 ALIAS to resolve ambiguity between your Task model and System.Threading.Tasks.Task
using TaskModel = TaskManagement.Core.Models.Task;

namespace TaskManagement.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options ?? throw new ArgumentNullException(nameof(options)))
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TaskModel> Tasks { get; set; } // 🔥 Using the alias

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.HasIndex(e => e.Username)
                    .IsUnique();

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(150);
                entity.HasIndex(e => e.Email)
                    .IsUnique();

                entity.Property(e => e.PasswordHash)
                    .IsRequired();

                entity.Property(e => e.Role)
                    .HasDefaultValue("RegularUser")
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });

            // Configure Task entity
            modelBuilder.Entity<TaskModel>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .HasMaxLength(1000);

                entity.Property(e => e.Status)
                    .HasDefaultValue("Pending")
                    .HasMaxLength(50);

                entity.Property(e => e.Priority)
                    .HasDefaultValue("Medium")
                    .HasMaxLength(50);

                entity.Property(e => e.Category)
                    .HasMaxLength(100);

                entity.Property(e => e.DueDate)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationship: Task belongs to User (Many-to-One)
                entity.HasOne(t => t.User)
                    .WithMany(u => u.Tasks)
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}