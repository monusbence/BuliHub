using System.Collections.ObjectModel;
using System.Net.Http;
using System.Net.Http.Json;
using System.Windows;
using System.Linq;
using System;
using System.ComponentModel;

namespace AdminApp
{
    public partial class AdminUsersWindow : Window
    {
        // Az admin végpontot token nélkül használjuk
        private static readonly HttpClient client = new HttpClient { BaseAddress = new System.Uri("https://localhost:7248/") };
        public ObservableCollection<UserItemViewModel> Users { get; set; } = new ObservableCollection<UserItemViewModel>();

        public AdminUsersWindow()
        {
            InitializeComponent();
            LoadUsers();
            UsersListBox.ItemsSource = Users;
        }

        // DTO, amelyet az API visszaad (ApplicationUser mezők alapján)
        public class UserDto
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string Email { get; set; } = "";
            public DateTime? BirthDate { get; set; }
            public bool Gender { get; set; }
            public string City { get; set; } = "";
            public string? Status { get; set; }
        }

        public class UserItemViewModel : INotifyPropertyChanged
        {
            public int Id { get; set; }
            private string name = "";
            public string Name
            {
                get => name;
                set { name = value; OnPropertyChanged(nameof(Name)); }
            }
            private string email = "";
            public string Email
            {
                get => email;
                set { email = value; OnPropertyChanged(nameof(Email)); }
            }
            private DateTime? birthDate;
            public DateTime? BirthDate
            {
                get => birthDate;
                set { birthDate = value; OnPropertyChanged(nameof(BirthDate)); OnPropertyChanged(nameof(BirthDateString)); }
            }
            public string BirthDateString
            {
                get => BirthDate?.ToString("yyyy-MM-dd") ?? "";
                set
                {
                    if (DateTime.TryParse(value, out DateTime dt))
                    {
                        BirthDate = dt;
                        OnPropertyChanged(nameof(BirthDateString));
                    }
                }
            }
            private bool gender;
            public bool Gender
            {
                get => gender;
                set { gender = value; OnPropertyChanged(nameof(Gender)); }
            }
            private string city = "";
            public string City
            {
                get => city;
                set { city = value; OnPropertyChanged(nameof(City)); }
            }
            private string status = "";
            public string Status
            {
                get => status;
                set { status = value; OnPropertyChanged(nameof(Status)); }
            }
            public bool IsMarkedForDeletion { get; set; }

            public event PropertyChangedEventHandler PropertyChanged;
            protected void OnPropertyChanged(string propertyName)
            {
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        private async void LoadUsers()
        {
            try
            {
                // Az admin végpont: api/admin/users
                var users = await client.GetFromJsonAsync<List<UserDto>>("api/admin/users");
                if (users != null)
                {
                    Users.Clear();
                    foreach (var u in users)
                    {
                        Users.Add(new UserItemViewModel
                        {
                            Id = u.Id,
                            Name = u.Name,
                            Email = u.Email,
                            BirthDate = u.BirthDate,
                            Gender = u.Gender,
                            City = u.City,
                            Status = u.Status ?? ""
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba a felhasználók betöltésekor: " + ex.Message);
            }
        }

        private async void DeleteUsers_Click(object sender, RoutedEventArgs e)
        {
            var toDelete = Users.Where(u => u.IsMarkedForDeletion).ToList();
            foreach (var u in toDelete)
            {
                var response = await client.DeleteAsync($"api/admin/users/{u.Id}");
                if (response.IsSuccessStatusCode)
                {
                    Users.Remove(u);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba a felhasználó (ID: {u.Id}) törlésekor: {error}");
                }
            }
        }

        private async void UpdateUsers_Click(object sender, RoutedEventArgs e)
        {
            foreach (var u in Users)
            {
                var updateDto = new AdminUserUpdateDto
                {
                    Name = u.Name,
                    Email = u.Email,
                    BirthDate = u.BirthDate,
                    Gender = u.Gender,
                    City = u.City,
                    Status = u.Status
                };
                var response = await client.PutAsJsonAsync($"api/admin/users/{u.Id}", updateDto);
                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show($"Hiba a felhasználó (ID: {u.Id}) módosításakor.");
                }
            }
            MessageBox.Show("Felhasználók frissítve!");
        }

        private void OpenEventsWindow_Click(object sender, RoutedEventArgs e)
        {
            AdminEventsWindow eventsWindow = new AdminEventsWindow();
            eventsWindow.Show();
            this.Close();
        }

        // Nested DTO for updating a user
        public class AdminUserUpdateDto
        {
            public string Name { get; set; } = "";
            public string Email { get; set; } = "";
            public DateTime? BirthDate { get; set; }
            public bool Gender { get; set; }
            public string City { get; set; } = "";
            public string Status { get; set; } = "";
        }
    }
}
