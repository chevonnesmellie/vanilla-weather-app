function getForecast(coordinates) {
  let apiKey = "35edd9e7e8e2b546aad3ee8914df1a70";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `Last updated ${days[day]} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${days[day]}`;
}

function displayWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#current-temp").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector(
    "#condition"
  ).innerHTML = ` ${response.data.weather[0].description}`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `${response.data.wind.speed}m/s`;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  );

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "35edd9e7e8e2b546aad3ee8914df1a70";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then(displayWeather)
    .catch((error) => {
      alert(`The city "${city}" is unknown. Please try another city.`);
    });
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row forecast-row" id="forecast">`;
  let forecast = response.data.daily;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `        <div class="col forecast-title">
          <div class="card day-forecast">
            <div class="card-header">
              ${formatDay(forecastDay.dt * 1000)}
            </div>
            <div class="card-body">
              <h5 class="card-title">
              <img src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" width=50>
              </h5>
              <p class="card-text"><span class="high">${Math.round(
                forecastDay.temp.max
              )}°  </span><span class="low">   ${Math.round(
          forecastDay.temp.min
        )}°</span></p>
            </div>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("Toronto");
