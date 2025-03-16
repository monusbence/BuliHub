using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Windows;

namespace AdminApp
{
    public partial class LoginWindow : Window
    {
        private static readonly HttpClient client = new HttpClient { BaseAddress = new System.Uri("https://localhost:7248/") };

        public LoginWindow()
        {
            InitializeComponent();
        }

        public class AdminLoginDto
        {
            public string Username { get; set; } = "";
            public string Password { get; set; } = "";
        }

        public class LoginResponseDto
        {
            public string Token { get; set; } = "";
            public int AdminId { get; set; }
        }

        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            var dto = new AdminLoginDto
            {
                Username = UsernameTextBox.Text,
                Password = PasswordBox.Password
            };

            var response = await client.PostAsJsonAsync("api/admins/login", dto);
            if (response.IsSuccessStatusCode)
            {
                var loginResult = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
                AuthManager.Token = loginResult?.Token ?? "";
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", AuthManager.Token);

                // Sikeres bejelentkezés után automatikusan megnyitjuk az AdminEventsWindow-t
                AdminEventsWindow eventsWindow = new AdminEventsWindow();
                eventsWindow.Show();
                this.Close();
            }
            else
            {
                MessageBox.Show("Hiba: " + await response.Content.ReadAsStringAsync());
            }
        }
    }
}


