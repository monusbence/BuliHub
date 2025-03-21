using System.IO;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace AdminApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            var imageSource = new BitmapImage();
            imageSource.BeginInit();
            imageSource.StreamSource = new FileStream("AppLogo(png).png", FileMode.Open, FileAccess.Read);
            imageSource.EndInit();
            imgLogo.Source =  imageSource;
        }

        private void RegisterButton_Click(object sender, RoutedEventArgs e)
        {
            var registerWindow = new RegisterWindow();
            registerWindow.Show();
            this.Close();
        }

        private void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            var loginWindow = new LoginWindow();
            loginWindow.Show();
            this.Close();
        }

    }

}
