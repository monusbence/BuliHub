using System;
using System.Linq;
using System.Threading.Tasks;
using Bulihub_Backend.Controllers;
using Bulihub_Backend.Data;
using Bulihub_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Bulihub_Backend.Tests
{
    public class AdminUsersManagementControllerTests : IDisposable
    {
        private readonly BuliHubDbContext _context;
        private readonly AdminUsersManagementController _controller;
        private readonly DbContextOptions<BuliHubDbContext> _options;

        public AdminUsersManagementControllerTests()
        {
            // InMemory adatbázis minden teszthez
            _options = new DbContextOptionsBuilder<BuliHubDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new BuliHubDbContext(_options);
            SeedData(_context);
            _controller = new AdminUsersManagementController(_context);
        }

        private void SeedData(BuliHubDbContext context)
        {
            // Két ApplicationUser rekord feltöltése
            context.Set<ApplicationUser>().AddRange(
                new ApplicationUser
                {
                    Id = 1,
                    Name = "Alice",
                    Email = "alice@example.com",
                    UserName = "alice@example.com",
                    NormalizedEmail = "ALICE@EXAMPLE.COM",
                    NormalizedUserName = "ALICE@EXAMPLE.COM",
                    BirthDate = new DateTime(1990, 1, 1),
                    Gender = true,
                    City = "Budapest",
                    Status = "Active",
                    RegistrationDate = DateTime.UtcNow
                },
                new ApplicationUser
                {
                    Id = 2,
                    Name = "Bob",
                    Email = "bob@example.com",
                    UserName = "bob@example.com",
                    NormalizedEmail = "BOB@EXAMPLE.COM",
                    NormalizedUserName = "BOB@EXAMPLE.COM",
                    BirthDate = new DateTime(1985, 5, 20),
                    Gender = false,
                    City = "Debrecen",
                    Status = "Inactive",
                    RegistrationDate = DateTime.UtcNow
                }
            );
            context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        // 1. GET: Visszaadja az összes felhasználót
        [Fact]
        public async Task GetAllUsers_Returns_All_Users()
        {
            var result = await _controller.GetAllUsers();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var users = Assert.IsAssignableFrom<System.Collections.Generic.List<ApplicationUser>>(okResult.Value);
            Assert.Equal(2, users.Count);
        }

        // 2. GET: Üres listát ad vissza, ha nincs felhasználó
        [Fact]
        public async Task GetAllUsers_Returns_Empty_List_When_No_Users()
        {
            foreach (var user in _context.Set<ApplicationUser>().ToList())
            {
                _context.Set<ApplicationUser>().Remove(user);
            }
            await _context.SaveChangesAsync();

            var result = await _controller.GetAllUsers();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var users = Assert.IsAssignableFrom<System.Collections.Generic.List<ApplicationUser>>(okResult.Value);
            Assert.Empty(users);
        }

        // 3. DELETE: Létező felhasználó törlése sikeres
        [Fact]
        public async Task DeleteUser_ExistingUser_Returns_NoContent()
        {
            var result = await _controller.DeleteUser(1);
            Assert.IsType<NoContentResult>(result);

            var user = await _context.Set<ApplicationUser>().FindAsync(1);
            Assert.Null(user);
        }

        // 4. DELETE: Nem létező felhasználó törlése NotFound eredményt ad
        [Fact]
        public async Task DeleteUser_NonExistingUser_Returns_NotFound()
        {
            var result = await _controller.DeleteUser(999);
            Assert.IsType<NotFoundResult>(result);
        }

        // 5. UPDATE: Létező felhasználó frissítése sikeres
        [Fact]
        public async Task UpdateUser_ExistingUser_Returns_Ok()
        {
            var dto = new AdminUsersManagementController.AdminUserUpdateDto
            {
                Name = "Alice Updated",
                BirthDate = new DateTime(1991, 2, 2),
                Gender = false,
                City = "Szeged",
                Status = "Updated",
                Email = "aliceupdated@example.com"
            };

            var result = await _controller.UpdateUser(1, dto);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedUser = Assert.IsAssignableFrom<ApplicationUser>(okResult.Value);

            Assert.Equal("Alice Updated", updatedUser.Name);
            Assert.Equal(new DateTime(1991, 2, 2), updatedUser.BirthDate);
            Assert.False(updatedUser.Gender);
            Assert.Equal("Szeged", updatedUser.City);
            Assert.Equal("Updated", updatedUser.Status);
            Assert.Equal("aliceupdated@example.com", updatedUser.Email);
            Assert.Equal("aliceupdated@example.com", updatedUser.UserName);
            Assert.Equal("ALICEUPDATED@EXAMPLE.COM", updatedUser.NormalizedEmail);
            Assert.Equal("ALICEUPDATED@EXAMPLE.COM", updatedUser.NormalizedUserName);
        }

        // 6. UPDATE: Nem létező felhasználó frissítése NotFound eredménnyel tér vissza
        [Fact]
        public async Task UpdateUser_NonExistingUser_Returns_NotFound()
        {
            var dto = new AdminUsersManagementController.AdminUserUpdateDto
            {
                Name = "Nonexistent",
                BirthDate = null,
                Gender = true,
                City = "Nowhere",
                Status = "Inactive",
                Email = "nonexistent@example.com"
            };

            var result = await _controller.UpdateUser(999, dto);
            Assert.IsType<NotFoundResult>(result);
        }

        // 7. UPDATE: Az email módosítása helyesen normalizálódik
        [Fact]
        public async Task UpdateUser_Email_Normalization_Works()
        {
            var dto = new AdminUsersManagementController.AdminUserUpdateDto
            {
                Name = "Bob Updated",
                BirthDate = new DateTime(1985, 5, 20),
                Gender = true,
                City = "Miskolc",
                Status = "Active",
                Email = "bob.new@example.com"
            };

            var result = await _controller.UpdateUser(2, dto);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedUser = Assert.IsAssignableFrom<ApplicationUser>(okResult.Value);

            Assert.Equal("bob.new@example.com", updatedUser.Email);
            Assert.Equal("bob.new@example.com", updatedUser.UserName);
            Assert.Equal("BOB.NEW@EXAMPLE.COM", updatedUser.NormalizedEmail);
            Assert.Equal("BOB.NEW@EXAMPLE.COM", updatedUser.NormalizedUserName);
        }

        // 8. UPDATE: A felhasználó frissítése nem változtatja meg a RegistrationDate-t
        [Fact]
        public async Task UpdateUser_DoesNot_Change_RegistrationDate()
        {
            var originalUser = await _context.Set<ApplicationUser>().FindAsync(1);
            var originalDate = originalUser.RegistrationDate;

            var dto = new AdminUsersManagementController.AdminUserUpdateDto
            {
                Name = "Alice Updated Again",
                BirthDate = new DateTime(1990, 1, 1),
                Gender = true,
                City = "Pécs",
                Status = "Active",
                Email = "alice2@example.com"
            };

            var result = await _controller.UpdateUser(1, dto);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedUser = Assert.IsAssignableFrom<ApplicationUser>(okResult.Value);

            Assert.Equal(originalDate, updatedUser.RegistrationDate);
        }

        // 9. GET után törlés után kevesebb felhasználó érhető el
        [Fact]
        public async Task GetAllUsers_AfterDeletion_Returns_FewerUsers()
        {
            await _controller.DeleteUser(1);

            var result = await _controller.GetAllUsers();
            var okResult = Assert.IsType<OkObjectResult>(result);
            var users = Assert.IsAssignableFrom<System.Collections.Generic.List<ApplicationUser>>(okResult.Value);

            Assert.Single(users);
        }

        // 10. Paraméteres teszt: Üres email esetén az összes email mező üres marad
        [Theory]
        [InlineData("")]
        public async Task UpdateUser_EmptyEmail_ResultsInEmptyNormalization(string emailInput)
        {
            var dto = new AdminUsersManagementController.AdminUserUpdateDto
            {
                Name = "Bob Updated",
                BirthDate = new DateTime(1985, 5, 20),
                Gender = true,
                City = "Debrecen",
                Status = "Active",
                Email = emailInput
            };

            var result = await _controller.UpdateUser(2, dto);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedUser = Assert.IsAssignableFrom<ApplicationUser>(okResult.Value);

            Assert.Equal("", updatedUser.Email);
            Assert.Equal("", updatedUser.UserName);
            Assert.Equal("", updatedUser.NormalizedEmail);
            Assert.Equal("", updatedUser.NormalizedUserName);
        }
    }
}
