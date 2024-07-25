const apiKey = '6740b99789dee35f542042104e3f63d9';
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const cityButtonsContainer = document.getElementById('city-buttons');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    getWeatherData(city);
    addCityToHistory(city);
});

cityButtonsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('city-btn')) {
        const city = event.target.textContent;
        getWeatherData(city);
    }
});

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getForecastData(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data) {
    const cityName = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const temp = document.getElementById('temp');
    const wind = document.getElementById('wind');
    const humidity = document.getElementById('humidity');

    const date = new Date().toLocaleDateString();
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    cityName.textContent = `${data.name} (${date})`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = data.weather[0].description;
    temp.textContent = `Temp: ${data.main.temp} °F`;
    wind.textContent = `Wind: ${data.wind.speed} MPH`;
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
}

function getForecastData(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

function displayForecast(data) {
    const forecastCards = document.getElementById('forecast-cards');
    forecastCards.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const card = document.createElement('div');
        card.classList.add('forecast-card');

        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        const temp = `Temp: ${forecast.main.temp} °F`;
        const wind = `Wind: ${forecast.wind.speed} MPH`;
        const humidity = `Humidity: ${forecast.main.humidity} %`;

        card.innerHTML = `
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="${forecast.weather[0].description}">
            <p>${temp}</p>
            <p>${wind}</p>
            <p>${humidity}</p>
        `;
        forecastCards.appendChild(card);
    }
}

function addCityToHistory(city) {
    const cityButton = document.createElement('button');
    cityButton.classList.add('city-btn');
    cityButton.textContent = city;
    cityButtonsContainer.appendChild(cityButton);
}