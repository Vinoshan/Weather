// Variables
var searchButton = document.getElementById("search-button");
var cityInput = document.getElementById("city-input");
var currentWeatherDiv = document.getElementById("current-weather");
var forecastDiv = document.getElementById("forecast");

// Set API key
var API_KEY = "f9289c267f86d4d0b1e4031ca530ba8c";

// Hide current weather and forecast initially
currentWeatherDiv.classList.add("hidden");
forecastDiv.classList.add("hidden");

// Event listener for search button click
searchButton.addEventListener("click", function () {
  var cityName = cityInput.value;
  getCityCoordinates(cityName);
});

// Get city coordinates based on city name
function getCityCoordinates(cityName) {
  var geoCodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  fetch(geoCodingUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getWeatherData(data[0].lat, data[0].lon);
    });
}

// Get weather data based on latitude and longitude
function getWeatherData(lat, lon) {
  var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      updateCurrentWeather(data);
      updateForecast(data);
      currentWeatherDiv.classList.remove("hidden"); // Show current weather
      forecastDiv.classList.remove("hidden"); // Show forecast
    });
}

// Update current weather display
function updateCurrentWeather(data) {
  var currentWeather = data.list[0];
  var temperatureK = currentWeather.main.temp;
  var temperatureC = Math.round(temperatureK - 273.15);

  var weatherIcon = `<i class="fas fa-sun"></i>`; // Default icon (sun)

  // Get the weather condition code
  var weatherCode = currentWeather.weather[0].id;

  // Assign appropriate weather icon based on the condition code
  if (weatherCode >= 200 && weatherCode <= 232) {
    weatherIcon = `<i class="fas fa-bolt"></i>`; // Thunderstorm
  } else if (weatherCode >= 300 && weatherCode <= 321) {
    weatherIcon = `<i class="fas fa-cloud-rain"></i>`; // Drizzle
  } else if (weatherCode >= 500 && weatherCode <= 531) {
    weatherIcon = `<i class="fas fa-cloud-showers-heavy"></i>`; // Rain
  } else if (weatherCode >= 600 && weatherCode <= 622) {
    weatherIcon = `<i class="fas fa-snowflake"></i>`; // Snow
  } else if (weatherCode >= 701 && weatherCode <= 781) {
    weatherIcon = `<i class="fas fa-smog"></i>`; // Atmosphere
  } else if (weatherCode === 800) {
    weatherIcon = `<i class="fas fa-sun"></i>`; // Clear sky
  } else if (weatherCode >= 801 && weatherCode <= 804) {
    weatherIcon = `<i class="fas fa-cloud"></i>`; // Clouds
  }

  var currentWeatherHtml = `
      <h2>${data.city.name} (${new Date().toLocaleDateString()})</h2>
      <p>${weatherIcon}</p>
      <p>Temp: ${temperatureC} &#8451;</p>
      <p>Wind: ${currentWeather.wind.speed} km/h</p>
      <p>Humidity: ${currentWeather.main.humidity}%</p>
    `;

  currentWeatherDiv.innerHTML = currentWeatherHtml;
}

// Update forecast display
function updateForecast(data) {
  var forecastHtml = "<h2>5-Day Forecast:</h2>";
  forecastHtml += '<div class="row">';

  var uniqueDays = new Set();
  var today = new Date().toISOString().split("T")[0];

  for (var i = 0; i < data.list.length; i++) {
    var dailyData = data.list[i];
    var date = new Date(dailyData.dt * 1000);
    var dateStr = date.toISOString().split("T")[0];

    if (uniqueDays.has(dateStr) || dateStr === today) {
      continue;
    }

    uniqueDays.add(dateStr);

    if (uniqueDays.size === 6) {
      break;
    }

    var temperatureK = dailyData.main.temp;
    var temperatureC = Math.round(temperatureK - 273.15);

    var weatherIcon = `<i class="fas fa-sun"></i>`; // Default icon (sun)

    // Get the weather condition code
    var weatherCode = dailyData.weather[0].id;

    // Assign appropriate weather icon based on the condition code
    if (weatherCode >= 200 && weatherCode <= 232) {
      weatherIcon = `<i class="fas fa-bolt"></i>`; // Thunderstorm
    } else if (weatherCode >= 300 && weatherCode <= 321) {
      weatherIcon = `<i class="fas fa-cloud-rain"></i>`; // Drizzle
    } else if (weatherCode >= 500 && weatherCode <= 531) {
      weatherIcon = `<i class="fas fa-cloud-showers-heavy"></i>`; // Rain
    } else if (weatherCode >= 600 && weatherCode <= 622) {
      weatherIcon = `<i class="fas fa-snowflake"></i>`; // Snow
    } else if (weatherCode >= 701 && weatherCode <= 781) {
      weatherIcon = `<i class="fas fa-smog"></i>`; // Atmosphere
    } else if (weatherCode === 800) {
      weatherIcon = `<i class="fas fa-sun"></i>`; // Clear sky
    } else if (weatherCode >= 801 && weatherCode <= 804) {
      weatherIcon = `<i class="fas fa-cloud"></i>`; // Clouds
    }

    forecastHtml += `
        <div class="col-sm-6 col-md-4 col-lg-2">
          <h3>${date.toLocaleDateString()}</h3>
          <p>${weatherIcon}</p>
          <p>Temp: ${temperatureC} &#8451;</p>
          <p>Wind: ${dailyData.wind.speed} km/h</p>
          <p>Humidity: ${dailyData.main.humidity}%</p>
        </div>
      `;
  }

  forecastHtml += "</div>";
  forecastDiv.innerHTML = forecastHtml;
}
