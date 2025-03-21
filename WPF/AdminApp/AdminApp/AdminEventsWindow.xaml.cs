using System;
using System.Collections.ObjectModel;
using System.Net.Http;
using System.Net.Http.Json;
using System.Windows;
using System.Linq;
using System.ComponentModel;
using System.Windows.Controls;
using System.Windows.Data;

namespace AdminApp
{
    public partial class AdminEventsEditWindow : Window
    {
        private static readonly HttpClient client = new HttpClient { BaseAddress = new Uri("https://localhost:7248/") };
        public ObservableCollection<EventEditViewModel> Events { get; set; } = new ObservableCollection<EventEditViewModel>();

        public AdminEventsEditWindow()
        {
            InitializeComponent();
            LoadEvents();
            EventsListBox.ItemsSource = Events;
        }

        public class EventDto
        {
            public int Id { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string Status { get; set; } = "";
            public int? Guests { get; set; }
            public string? LocationName { get; set; }
            public string? Theme { get; set; }
            public string? Address { get; set; }
            public string? Equipment { get; set; }
        }

        public class EventEditViewModel : INotifyPropertyChanged
        {
            public int Id { get; set; }
            private DateTime startDate;
            public DateTime StartDate
            {
                get => startDate;
                set { startDate = value; OnPropertyChanged(nameof(StartDate)); }
            }
            private DateTime endDate;
            public DateTime EndDate
            {
                get => endDate;
                set { endDate = value; OnPropertyChanged(nameof(EndDate)); }
            }
            private string status = "";
            public string Status
            {
                get => status;
                set { status = value; OnPropertyChanged(nameof(Status)); }
            }
            private int? guests;
            public int? Guests
            {
                get => guests;
                set { guests = value; OnPropertyChanged(nameof(Guests)); OnPropertyChanged(nameof(GuestsString)); }
            }
            public string GuestsString
            {
                get => Guests?.ToString() ?? "";
                set
                {
                    if (int.TryParse(value, out int result))
                        Guests = result;
                    else
                        Guests = null;
                    OnPropertyChanged(nameof(GuestsString));
                }
            }
            private string locationName = "";
            public string LocationName
            {
                get => locationName;
                set { locationName = value; OnPropertyChanged(nameof(LocationName)); }
            }
            private string theme = "";
            public string Theme
            {
                get => theme;
                set { theme = value; OnPropertyChanged(nameof(Theme)); }
            }
            private string address = "";
            public string Address
            {
                get => address;
                set { address = value; OnPropertyChanged(nameof(Address)); }
            }
            private string equipment = "";
            public string Equipment
            {
                get => equipment;
                set { equipment = value; OnPropertyChanged(nameof(Equipment)); }
            }
            private bool isMarkedForDeletion;
            public bool IsMarkedForDeletion
            {
                get => isMarkedForDeletion;
                set { isMarkedForDeletion = value; OnPropertyChanged(nameof(IsMarkedForDeletion)); }
            }

            public event PropertyChangedEventHandler PropertyChanged;
            protected void OnPropertyChanged(string propertyName)
            {
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        // DTO a PATCH kéréshez, minden mező opcionális
        public class PatchEventDto
        {
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public string? Status { get; set; }
            public int? Guests { get; set; }
            public string? LocationName { get; set; }
            public string? Theme { get; set; }
            public string? Address { get; set; }
            public string? Equipment { get; set; }
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
                        Events.Add(new EventEditViewModel
                        {
                            Id = ev.Id,
                            StartDate = ev.StartDate,
                            EndDate = ev.EndDate,
                            Status = ev.Status,
                            Guests = ev.Guests,
                            LocationName = ev.LocationName ?? "",
                            Theme = ev.Theme ?? "",
                            Address = ev.Address ?? "",
                            Equipment = ev.Equipment ?? ""
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba az eventek betöltésekor: " + ex.Message);
            }
        }

        private async void UpdateEvents_Click(object sender, RoutedEventArgs e)
        {
            foreach (var ev in Events)
            {
                var dto = new PatchEventDto
                {
                    StartDate = ev.StartDate,
                    EndDate = ev.EndDate,
                    Status = string.IsNullOrWhiteSpace(ev.Status) ? null : ev.Status,
                    Guests = ev.Guests,
                    LocationName = string.IsNullOrWhiteSpace(ev.LocationName) ? null : ev.LocationName,
                    Theme = string.IsNullOrWhiteSpace(ev.Theme) ? null : ev.Theme,
                    Address = string.IsNullOrWhiteSpace(ev.Address) ? null : ev.Address,
                    Equipment = string.IsNullOrWhiteSpace(ev.Equipment) ? null : ev.Equipment
                };

                var request = new HttpRequestMessage(new HttpMethod("PATCH"), $"api/admin/events/{ev.Id}")
                {
                    Content = JsonContent.Create(dto)
                };

                var response = await client.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba az event (ID: {ev.Id}) frissítésekor: {error}");
                }
            }
            MessageBox.Show("Eventek frissítve!");
            LoadEvents();
        }

        private async void DeleteEvents_Click(object sender, RoutedEventArgs e)
        {
            var toDelete = Events.Where(ev => ev.IsMarkedForDeletion).ToList();
            foreach (var ev in toDelete)
            {
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

        // Szűrési funkció: Amikor a FilterTextBox tartalma változik, frissítjük a listát
        private void FilterTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            var view = CollectionViewSource.GetDefaultView(EventsListBox.ItemsSource);
            if (view != null)
            {
                view.Filter = FilterEvents;
                view.Refresh();
            }
        }

        // Szűrési logika: itt a Theme (az esemény neve) alapján szűrünk
        private bool FilterEvents(object item)
        {
            // Ellenőrizzük, hogy a FilterTextBox létezik-e
            if (FilterTextBox == null)
                return true;
            // Ha a szűrő üres, minden elem megjelenik
            if (string.IsNullOrWhiteSpace(FilterTextBox.Text))
                return true;

            var ev = item as EventEditViewModel;
            if (ev == null)
                return false;
            return ev.Theme.IndexOf(FilterTextBox.Text, StringComparison.OrdinalIgnoreCase) >= 0;
        }
    }
}
