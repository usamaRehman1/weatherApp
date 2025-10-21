console.log("javaScript Running.....")

const API_KEY = "4873aaa58624164be2166c2c2e7d8587";
const weatherEmojis = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Smoke: "💨",
    Haze: "🌁",
    Dust: "🌪️",
    Fog: "🌫️",
    Sand: "🌪️",
    Ash: "🌋",
    Squall: "🌬️",
    Tornado: "🌪️"
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const months = ["January", "Fabrary", "March", "April", "May", "June", "July", "August", "September", "Octuber", "November", "December"]
const cityDisplay = document.getElementById("city_display");
const date = document.getElementById("date");
const icon = document.getElementById("icon");
const temperature = document.getElementById("temp");
const mainCondition = document.getElementById("main");
const display_Wind = document.getElementById("wind");
const display_humidity = document.getElementById("humidity");
const display_pressure = document.getElementById("pressure");

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const city = document.getElementById("search").value.trim();
    console.log(city)

    if(city == "") return alert("please enter city name")
        
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        const date = new Date();

        console.log(data);

        const { name, main: { temp, humidity, pressure }, wind: { speed }, timezone, visibility, weather } = data;
        const { id, main, description } = weather[0];
        console.log("temp =>", temp)

        cityDisplay.innerText = `${name}`;
        date.innerText = `${days[date.getDay()]},${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        icon.innerText = `${weatherEmojis[main]}`;
        temperature.innerHTML = `${temp}<sup>o</sup>C`;
        mainCondition.innerText = `${main}`;
        display_Wind.innerText = `${speed}mph`;
        display_humidity.innerText = `${humidity}%`;
        display_pressure.innerText = `${pressure}hpa`;


    } catch (error) {
        console.log("Error =>", error)

    }

})