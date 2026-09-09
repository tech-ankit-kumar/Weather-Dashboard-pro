# 🌤️ Weather Dashboard Pro

A responsive and user-friendly weather dashboard built using **HTML, CSS, JavaScript, and Open-Meteo REST API**.

The application provides real-time weather information for cities around the world along with a 7-day forecast, favorites, search history, location-based weather, and dark/light mode.

## 🚀 Features

- 🔍 Search weather by city
- 🌡️ Current temperature
- 🥵 Feels-like temperature
- ☁️ Weather condition with icons
- 💧 Humidity information
- 💨 Wind speed
- 🌧️ Precipitation
- 🌅 Sunrise and sunset time
- 📅 7-day weather forecast
- 📍 Weather based on current browser location
- ⭐ Add favorite cities
- 🕘 Search history
- 🌙 Dark/Light mode
- 🔄 Refresh weather data
- 💾 Browser localStorage support
- 📱 Responsive design for mobile, tablet and desktop
- ❌ Error handling for invalid cities and API problems

## 🛠️ Technologies Used

- **HTML5** – Website structure
- **CSS3** – Styling and responsive design
- **JavaScript** – Application logic and API integration
- **Open-Meteo API** – Live weather data

## 📁 Project Structure

```text
weather-dashboard-pro/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── LICENSE
```

## ⚙️ How It Works

The application follows this simple process:

```text
User enters city
       ↓
JavaScript sends city name
       ↓
Open-Meteo Geocoding API
       ↓
Latitude & Longitude
       ↓
Open-Meteo Forecast API
       ↓
Weather JSON data
       ↓
Dashboard displays weather
```

## 🌐 API Used

This project uses the **Open-Meteo API** to retrieve weather information.

No API key is required.

## ▶️ How to Run

### Option 1 – Directly

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in your browser.
4. Search for any city.

### Option 2 – VS Code

1. Open the project in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. Search for a city.

> An internet connection is required because weather data is fetched from the API.

## 💾 Local Storage

The project uses browser `localStorage` to save:

- Favorite cities
- Search history
- Dark/Light mode preference

No database is required.

## 📱 Responsive Design

The dashboard is designed to work on:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📟 Tablet

## 🎯 Learning Outcomes

Through this project, I practiced:

- HTML page structure
- CSS Grid and Flexbox
- Responsive web design
- JavaScript DOM manipulation
- JavaScript `fetch()` API
- REST API integration
- Async/Await
- JSON data handling
- Browser Geolocation API
- Local Storage
- Error handling

## 🔮 Future Improvements

Possible future improvements include:

- Hourly weather forecast
- Weather charts
- Weather alerts
- Air quality information
- Multiple-city comparison
- Automatic weather updates
- PWA/mobile app support

## 👨‍💻 Author

**Ankit Kumar**

If you like this project, feel free to ⭐ the repository.

## 📄 License

This project is created for educational and portfolio purposes.