let currentWeather = null;
let currentPlace = null;

const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");

async function searchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showMessage("Please enter a city name.");
    return;
  }

  showMessage("Loading weather...");
  try {
    const place = await findCity(city);
    await loadWeather(place);
    saveHistory(place.name);
  } catch (error) {
    showMessage(error.message);
  }
}

async function findCity(city) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to connect to weather service.");

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Try another city.");
  }

  return data.results[0];
}

async function loadWeather(place) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum` +
    `&timezone=auto&forecast_days=7`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to get weather data.");

  const data = await response.json();

  currentPlace = place;
  currentWeather = data;

  renderCurrent(place, data);
  renderForecast(data);
  renderFavorites();
  renderHistory();

  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  message.textContent = "";
}

function renderCurrent(place, data) {
  const c = data.current;
  const d = data.daily;

  document.getElementById("cityName").textContent =
    `${place.name}, ${place.country}`;

  document.getElementById("localTime").textContent =
    `Local time: ${formatDateTime(c.time)} • ${place.timezone}`;

  document.getElementById("temperature").textContent =
    Math.round(c.temperature_2m);

  document.getElementById("feelsLike").textContent =
    Math.round(c.apparent_temperature);

  document.getElementById("humidity").textContent =
    Math.round(c.relative_humidity_2m);

  document.getElementById("wind").textContent =
    Math.round(c.wind_speed_10m);

  document.getElementById("rain").textContent =
    c.precipitation ?? 0;

  document.getElementById("sunrise").textContent =
    formatTime(d.sunrise[0]);

  document.getElementById("sunset").textContent =
    formatTime(d.sunset[0]);

  document.getElementById("condition").textContent =
    getCondition(c.weather_code);

  document.getElementById("weatherIcon").textContent =
    getIcon(c.weather_code);
}

function renderForecast(data) {
  const box = document.getElementById("forecast");
  box.innerHTML = "";

  data.daily.time.forEach((date, i) => {
    box.innerHTML += `
      <div class="forecast-card">
        <div class="day">${formatDay(date)}</div>
        <div class="icon">${getIcon(data.daily.weather_code[i])}</div>
        <div class="temps">
          ${Math.round(data.daily.temperature_2m_max[i])}° /
          ${Math.round(data.daily.temperature_2m_min[i])}°
        </div>
        <small>${getCondition(data.daily.weather_code[i])}</small>
      </div>
    `;
  });
}

function refreshWeather() {
  if (currentPlace) loadWeather(currentPlace);
}

async function getCurrentLocation() {
  if (!navigator.geolocation) {
    showMessage("Your browser does not support location.");
    return;
  }

  showMessage("Getting your location...");

  navigator.geolocation.getCurrentPosition(
    async position => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url =
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`;

        // Reverse geocoding is not supported by all free endpoints,
        // so weather is loaded directly if place information is unavailable.
        let place = {
          name: "My Location",
          country: "",
          latitude: lat,
          longitude: lon,
          timezone: "auto"
        };

        try {
          const geoResponse = await fetch(url);
          const geoData = await geoResponse.json();
          if (geoData.name) {
            place.name = geoData.name;
            place.country = geoData.country || "";
            place.timezone = geoData.timezone || "auto";
          }
        } catch (_) {}

        await loadWeather(place);
        saveHistory(place.name);
      } catch (error) {
        showMessage("Could not load weather for your location.");
      }
    },
    () => showMessage("Location permission was denied.")
  );
}

function addFavorite() {
  if (!currentPlace) return;

  let favorites = JSON.parse(localStorage.getItem("weatherFavorites")) || [];

  const exists = favorites.some(
    item => item.name.toLowerCase() === currentPlace.name.toLowerCase()
  );

  if (!exists) {
    favorites.push({
      name: currentPlace.name,
      country: currentPlace.country,
      latitude: currentPlace.latitude,
      longitude: currentPlace.longitude,
      timezone: currentPlace.timezone
    });
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }

  renderFavorites();
}

function renderFavorites() {
  const box = document.getElementById("favorites");
  const favorites = JSON.parse(localStorage.getItem("weatherFavorites")) || [];

  if (favorites.length === 0) {
    box.innerHTML = "<p>No favorite cities yet.</p>";
    return;
  }

  box.innerHTML = favorites.map((item, index) => `
    <div class="favorite-item" onclick="loadFavorite(${index})">
      ⭐ ${item.name}${item.country ? ", " + item.country : ""}
    </div>
  `).join("");
}

async function loadFavorite(index) {
  const favorites = JSON.parse(localStorage.getItem("weatherFavorites")) || [];
  if (favorites[index]) {
    showMessage("Loading favorite city...");
    await loadWeather(favorites[index]);
    message.textContent = "";
  }
}

function saveHistory(city) {
  if (!city || city === "My Location") return;

  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  history = history.filter(
    item => item.toLowerCase() !== city.toLowerCase()
  );

  history.unshift(city);
  history = history.slice(0, 8);

  localStorage.setItem("weatherHistory", JSON.stringify(history));
  renderHistory();
}

async function loadHistoryCity(city) {
  cityInput.value = city;
  await searchWeather();
}

function renderHistory() {
  const box = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  if (history.length === 0) {
    box.innerHTML = "<p>No search history yet.</p>";
    return;
  }

  box.innerHTML = history.map(city => `
    <div class="history-item" onclick="loadHistoryCity('${escapeHtml(city)}')">
      🕘 ${escapeHtml(city)}
    </div>
  `).join("");
}

function clearHistory() {
  localStorage.removeItem("weatherHistory");
  renderHistory();
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("weatherTheme", isDark ? "dark" : "light");

  document.getElementById("themeBtn").textContent =
    isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function loadTheme() {
  if (localStorage.getItem("weatherTheme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeBtn").textContent = "☀️ Light Mode";
  }
}

function refreshStoredData() {
  renderFavorites();
  renderHistory();
  loadTheme();
}

function showMessage(text) {
  message.textContent = text;
}

function formatDay(date) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short"
  });
}

function formatTime(value) {
  return value ? value.split("T")[1].slice(0, 5) : "--";
}

function formatDateTime(value) {
  if (!value) return "--";
  return value.replace("T", " ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCondition(code) {
  if (code === 0) return "Clear Sky";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([85, 86].includes(code)) return "Snow Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

function getIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
}

cityInput.addEventListener("keydown", event => {
  if (event.key === "Enter") searchWeather();
});

refreshStoredData();
