using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Bulihub_Backend.Models;


namespace Bulihub_Backend.Data
{
    public class BuliHubDbContext
  : IdentityDbContext<Bulihub_Backend.Models.ApplicationUser,
                      Bulihub_Backend.Models.ApplicationRole,
                      int>
    {
        public BuliHubDbContext(DbContextOptions<BuliHubDbContext> options)
            : base(options)
        {
        }

        // Saját entitások
        public DbSet<Models.User> Users { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;
        public DbSet<Ticket> Tickets { get; set; } = null!;
        public DbSet<Models.ServiceProvider> ServiceProviders { get; set; } = null!;
        public DbSet<Report> Reports { get; set; } = null!;
        public DbSet<Location> Locations { get; set; } = null!;  // Engedélyezd ezt a sort

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<Models.ApplicationRole>().ToTable("Roles");
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<int>>().ToTable("UserRoles");
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserClaim<int>>().ToTable("UserClaims");
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>>().ToTable("RoleClaims");
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<int>>().ToTable("UserLogins");
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<int>>().ToTable("UserTokens");

            // További beállítások...
        }
    }

}
