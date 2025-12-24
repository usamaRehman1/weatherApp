const API_KEY = ""; // API Key Of Weather APP 

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const months = ["January", "Fabrary", "March", "April", "May", "June", "July", "August", "September", "Octuber", "November", "December"]
const citySearchInput = document.getElementById('city-search-input');
const currentDateElem = document.getElementById('current-date');
const currentCityElem = document.getElementById('current-city');
const currentCountryElem = document.getElementById('current-country');
const currentTimeElem = document.getElementById('current-time');
const currentWeatherIcon = document.getElementById('current-weather-icon');
const currentTempElem = document.getElementById('current-temp');
const currentDescriptionElem = document.getElementById('current-description');
const detailHumidityElem = document.getElementById('detail-humidity');
const detailWindElem = document.getElementById('detail-wind');
// const detailUVElem = document.getElementById('detail-uv');
const detailPressureElem = document.getElementById('detail-pressure');
const hourlyForecastContainer = document.getElementById('hourly-forecast-container');

// This function handle the weather emojy accourding to condition 
function getWeatherCondition(id) {
    if (id === 800) return "Clear Sky ☀️";
    if (id >= 801 && id <= 804) return "Cloudy ☁️";
    if (id >= 200 && id < 300) return "Thunderstorm ⛈️";
    if (id >= 300 && id < 400) return "Drizzle 🌦️";
    if (id >= 500 && id < 600) return "Rain 🌧️";
    if (id >= 600 && id < 700) return "Snow ❄️";
    if (id >= 700 && id < 800) return "Atmosphere 🌁";
    return "Unknown";
}

// This function display all weather condition 
const weatherConditionDisplay = async (city) => {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        if (data.message == "city not found") {
            alert("Please enter a valid city name.")
            return
        }
        // console.log("data => ", data)
        const { name, main: { temp, humidity, pressure }, sys: { country }, wind: { speed }, timezone, visibility, weather, dt } = data;
        const { id, main, description, icon } = weather[0];

        const date = new Date(dt * 1000);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000 + timezone * 1000);
        const hourOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const timeString = localDate.toLocaleTimeString('en-US', hourOptions);

        // fetch all countries array
        fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags")
            .then(res => res.json())
            .then(arr => {
                const currCountry = arr.filter(countryArr => countryArr.cca2 == country)
                currentCountryElem.innerText = `${currCountry[0].name.common}`
            });

        currentCityElem.innerText = `${name}`;
        currentDateElem.innerText = `${days[date.getDay()]},${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        currentTimeElem.innerText = `${timeString}`;
        currentWeatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        currentTempElem.innerHTML = `${Math.round(temp)}<sup>o</sup>`;
        currentDescriptionElem.innerText = `${getWeatherCondition(id)}`;
        detailWindElem.innerText = `${speed} mph`;
        detailHumidityElem.innerText = `${humidity} %`;
        detailPressureElem.innerText = `${pressure} hpa`;

        // call weather forecast API 
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();
        updateHourlyForecast(forecastData.list.slice(0, 8), timezone);
    } catch (error) {
        console.log("Error =>", error)
    }
}


// Function to update the hourly forecast section
async function updateHourlyForecast(hourlyData, timezoneOffsetSeconds) {
    hourlyForecastContainer.innerHTML = '';

    hourlyData.forEach(item => {
        const { dt, weather, main: { temp } } = item;
        const { icon } = weather[0];
        const date = new Date(dt * 1000);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000 + timezoneOffsetSeconds * 1000);
        const hourOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const timeString = localDate.toLocaleTimeString('en-US', hourOptions);

        const hourlyItem = `
                        <div class="flex-none w-28 text-center p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                            <p class="text-xs opacity-70 mb-2">${timeString}</p>
                            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="hourly weather icon" class="w-10 h-10 mx-auto mb-2" />
                            <p class="font-bold">${Math.round(temp)}°</p>
                        </div>
                    `;
        hourlyForecastContainer.innerHTML += hourlyItem;
    });
}

// This function runs when the user searches for a country
document.querySelector("#searchBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    let city = citySearchInput.value.trim()
    if (!city) return alert("please enter city name");
    weatherConditionDisplay(city)
    citySearchInput.value = ""
})

// --- Event Listeners (When press Enter) ---
citySearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const city = citySearchInput.value.trim();
        console.log("city =>", city)
        if (city) {
            weatherConditionDisplay(city);
        }
        citySearchInput.value = ""
    }
});

// --- Initialize with a default city ---
document.addEventListener('DOMContentLoaded', () => {
    weatherConditionDisplay("karachi")
});