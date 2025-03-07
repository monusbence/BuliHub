using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace AdminApp
{
    public partial class LoginWindow : Window
    {
        private static readonly HttpClient client = new HttpClient { BaseAddress = new System.Uri("https://localhost:5001/") }; // Állítsd be a megfelelő API URL-t és portot

        public LoginWindow()
        {
            InitializeComponent();
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
                MessageBox.Show("Sikeres bejelentkezés!");
                // Itt megnyithatsz egy admin dashboard ablakot, ahol a további admin műveletek elérhetőek
            }
            else
            {
                MessageBox.Show("Hiba: " + await response.Content.ReadAsStringAsync());
            }
        }
    }

    public class AdminLoginDto
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}

