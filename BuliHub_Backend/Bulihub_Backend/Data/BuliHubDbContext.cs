using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Bulihub_Backend.Models;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.SqlServer.Management.Smo;

namespace Bulihub_Backend.Data
{
    public class BuliHubDbContext
        : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
        public BuliHubDbContext(DbContextOptions<BuliHubDbContext> options)
            : base(options)
        {
        }

        // Saját entitások (Event, Ticket, Location, stb.):
        public DbSet<Event> Events { get; set; } = null!;
        // public DbSet<Ticket> Tickets { get; set; } = null!;
        // public DbSet<Location> Locations { get; set; } = null!;
        // ...stb.

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Alap Identity táblák átnevezése:
            builder.Entity<ApplicationUser>(b =>
            {
                b.ToTable("Users"); // AspNetUsers helyett "Users"
            });

            builder.Entity<ApplicationRole>(b =>
            {
                b.ToTable("Roles");
            });

            // Ha szeretnéd, a kapcsolatokat is átnevezheted:
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<int>>(b =>
            {
                b.ToTable("UserRoles");
            });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserClaim<int>>(b =>
            {
                b.ToTable("UserClaims");
            });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>>(b =>
            {
                b.ToTable("RoleClaims");
            });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<int>>(b =>
            {
                b.ToTable("UserLogins");
            });
            builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<int>>(b =>
            {
                b.ToTable("UserTokens");
            });

            // További Fluent API beállításokat is írhatsz ide, pl. for your "Events" table
        }
    }
}
