using System.Collections.ObjectModel;
using System.Net.Http;
using System.Net.Http.Json;
using System.Windows;
using System.Linq;

namespace AdminApp
{
    public partial class AdminEventsWindow : Window
    {
        // Az admin végpontokat használjuk
        private static readonly HttpClient client = new HttpClient { BaseAddress = new System.Uri("https://localhost:7248/") };
        public ObservableCollection<EventItemViewModel> Events { get; set; } = new ObservableCollection<EventItemViewModel>();

        public AdminEventsWindow()
        {
            InitializeComponent();
            LoadEvents();
            EventsListBox.ItemsSource = Events;
        }

        public class EventDto
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
        }

        public class EventItemViewModel
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public bool IsMarkedForDeletion { get; set; }
        }

        private async void LoadEvents()
        {
            try
            {
                var events = await client.GetFromJsonAsync<List<EventDto>>("api/events");
                if (events != null)
                {
                    Events.Clear();
                    foreach (var ev in events)
                    {
                        Events.Add(new EventItemViewModel
                        {
                            Id = ev.Id,
                            Name = ev.Name,
                        });
                    }
                }
            }
            catch (System.Exception ex)
            {
                MessageBox.Show("Hiba az eventek betöltésekor: " + ex.Message);
            }
        }

        private async void DeleteEvents_Click(object sender, RoutedEventArgs e)
        {
            var toDelete = Events.Where(ev => ev.IsMarkedForDeletion).ToList();
            foreach (var ev in toDelete)
            {
                // Az új admin végpontot hívjuk:
                var response = await client.DeleteAsync($"api/admin/events/{ev.Id}");
                if (response.IsSuccessStatusCode)
                {
                    Events.Remove(ev);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba az event (ID: {ev.Id}) törlésekor: {error}");
                }
            }
        }

        private void OpenUsersWindow_Click(object sender, RoutedEventArgs e)
        {
            AdminUsersWindow usersWindow = new AdminUsersWindow();
            usersWindow.Show();
            this.Close();
        }
    }
}
