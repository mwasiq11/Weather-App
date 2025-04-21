async function searchWeather(defaultCity) {
    const cityInput = defaultCity || document.querySelector("#cityInput").value;
    document.getElementById("cityInput").value = cityInput;

    const loader = document.getElementById("loader")

    loader.style.display = "flex";  // Show loader
    document.body.classList.add("loading") // Add blur

    try {


        // Get current date info
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();


        document.getElementById("date").innerHTML = currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

        // Get city from input
        const city = cityInput;
        document.getElementById("location").innerHTML = city


        const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        // Fetch weather data
        const response = await fetch(apiURL);
        if (!response.ok) {
            document.getElementById("location").innerHTML = "City not found"
        }
        const data = await response.json();



        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windspeed = data.wind.speed;

        document.getElementById("tempatureWork").innerHTML = `${temperature} °C `;
        document.getElementById("humdityWork").innerHTML = `${humidity} % `;
        document.getElementById("windSpeedWork").innerHTML = `${windspeed} m/s `;

        const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const forecastRes = await fetch(forecastApi);
        const forecastData = await forecastRes.json();

        const forecastList = forecastData.list;
        const filteredForecasts = [];

        // Get forecast at 12:00:00 for next 5 days
        for (let i = 0; i < forecastList.length; i++) {
            if (forecastList[i].dt_txt.includes("12:00:00")) {
                filteredForecasts.push(forecastList[i]);
            }
        }

        const days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        const sectionIds = [
            { day: "monPara", condition: "monCondition", icon: ".monSection img", temp: ".monSection .tempPara" },
            { day: "tuesPara", condition: "tuesCondition", icon: ".tuesSection img", temp: ".tuesSection .tempPara" },
            { day: "wedPara", condition: "wedCondition", icon: ".wedSection img", temp: ".wedSection .tempPara" },
            { day: "thrusPara", condition: "thrusCondition", icon: ".thrusSection img", temp: ".thrusSection .tempPara" },
            { day: "friPara", condition: "friCondition", icon: ".friSection img", temp: ".friSection .tempPara" }
        ];

        for (let i = 0; i < 5; i++) {
            const forecast = filteredForecasts[i];
            const date = new Date(forecast.dt_txt);
            const dayName = days[date.getDay()];
            const tempMin = Math.round(forecast.main.temp_min);
            const tempMax = Math.round(forecast.main.temp_max * 1.3);
            const iconCode = forecast.weather[0].icon;
            const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const condition = forecast.weather[0].description;

            document.getElementById(sectionIds[i].day).innerText = dayName;
            // Display condition
            document.getElementById(sectionIds[i].condition).innerText = condition;
            document.querySelector(sectionIds[i].icon).src = iconURL;
            document.querySelector(sectionIds[i].temp).innerText = `${tempMin} / ${tempMax} °C`;

        }

    }

    catch (error) {
        console.error(`"Fetching Weather data Error" ${error.message}`);
        alert("Please enter a valid City name!");

    }
    finally {
        // Hide loader, show content
        loader.style.display = "none";
        document.body.classList.remove("loading");
    }



}
document.querySelector(".box").addEventListener("click", () => {
    searchWeather()
});

window.addEventListener("load", () => {
    searchWeather("Pakistan");
});

