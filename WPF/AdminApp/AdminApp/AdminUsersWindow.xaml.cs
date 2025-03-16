using System.Collections.ObjectModel;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Linq;
using System;

namespace AdminApp
{
    public partial class AdminUsersWindow : Window
    {
        private static readonly HttpClient client = new HttpClient { BaseAddress = new System.Uri("https://localhost:7248/") };
        public ObservableCollection<UserItemViewModel> Users { get; set; } = new ObservableCollection<UserItemViewModel>();

        public AdminUsersWindow()
        {
            InitializeComponent();
            LoadUsers();
            UsersListBox.ItemsSource = Users;
        }

        private async void LoadUsers()
        {
            try
            {
                var users = await client.GetFromJsonAsync<List<UserDto>>("api/users");
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
                var response = await client.DeleteAsync($"api/users/{u.Id}");
                if (response.IsSuccessStatusCode)
                {
                    Users.Remove(u);
                }
                else
                {
                    MessageBox.Show($"Hiba a felhasználó (ID: {u.Id}) törlésekor.");
                }
            }
        }

        private async void UpdateUsers_Click(object sender, RoutedEventArgs e)
        {
            foreach (var u in Users)
            {
                // Készítünk egy DTO-t az update kéréshez
                var updateDto = new UserUpdateDto
                {
                    Name = u.Name,
                    Email = u.Email,
                    BirthDate = u.BirthDate
                };
                var response = await client.PutAsJsonAsync($"api/users/{u.Id}", updateDto);
                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show($"Hiba a felhasználó (ID: {u.Id}) módosításakor.");
                }
            }
            MessageBox.Show("Felhasználók frissítve!");
        }

        private void OpenEventsWindow_Click(object sender, RoutedEventArgs e)
        {
            var eventsWindow = new AdminEventsWindow();
            eventsWindow.Show();
            this.Close();
        }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public DateTime? BirthDate { get; set; }
    }

    public class UserItemViewModel : System.ComponentModel.INotifyPropertyChanged
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
        public bool IsMarkedForDeletion { get; set; }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }
    }

    public class UserUpdateDto
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public DateTime? BirthDate { get; set; }
    }
}

