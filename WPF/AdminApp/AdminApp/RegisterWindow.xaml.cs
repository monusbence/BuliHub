using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace AdminApp
{
    public partial class RegisterWindow : Window
    {
        private static readonly HttpClient client = new HttpClient { BaseAddress = new System.Uri("https://localhost:5001/") }; // Állítsd be a megfelelő API URL-t és portot

        public RegisterWindow()
        {
            InitializeComponent();
        }

        private async void Register_Click(object sender, RoutedEventArgs e)
        {
            var dto = new AdminRegisterDto
            {
                Username = UsernameTextBox.Text,
                Password = PasswordBox.Password
            };

            var response = await client.PostAsJsonAsync("api/admins/register", dto);
            if (response.IsSuccessStatusCode)
            {
                MessageBox.Show("Sikeres regisztráció!");
                var loginWindow = new LoginWindow();
                loginWindow.Show();
                this.Close();
            }
            else
            {
                MessageBox.Show("Hiba: " + await response.Content.ReadAsStringAsync());
            }
        }
    }

    public class AdminRegisterDto
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}

