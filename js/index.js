
const npt_search = document.getElementById('npt_search');
const btn_find = document.querySelector('.btn_find');
let weather_data = {};

btn_find.addEventListener("click", function() {
    if (npt_search.value) {
        find_weather(npt_search.value);
    } else {
        getGeolocation();
    }
});

npt_search.addEventListener('input', function() {
    find_weather(npt_search.value);
    console.log(npt_search.value);
});

async function find_weather(query) {
    const apiKey = "2e3823da84b549fb9e861802242406"; 

    try {
        let response;
        if (typeof query === 'object' && query.lat && query.lon) {
            response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query.lat},${query.lon}&days=3`);
        } else {
            response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3`);
        }
        const data = await response.json();
        weather_data = data;
        console.log(weather_data);
        displayData();
    } catch (error) {
        console.log('Error fetching weather data:', error);
    }
}

function displayData() {
    let cartona = '';

    // Today weather
    cartona += `
        <div class="col-lg-4 today">
            <div class="d-flex justify-content-between info-date p-2 rounded-3" style="background-color: #2d303d">
                <span>${new Date().toLocaleString('en-US', { weekday: 'long' })}</span>
                <span class="date">${new Date().toLocaleDateString()}</span>
            </div>
            <div class="weather ms-2">
                <h1 class="h4 mt-4 ms-4">${weather_data.location.name}</h1>
                <div>
                    <h2>${weather_data.current.temp_c}°C</h2>
                </div>
                <div>
                    <img style="width: 25%" src="https:${weather_data.current.condition.icon}" alt="weather condition" />
                    <p style="color: #1577be; font-weight: 600" class="ms-3">
                        ${weather_data.current.condition.text}
                    </p>
                </div>
                <div class="down ms-3 pb-4">
                    <span>
                        <img src="imgs/icon-umberella.png" alt="umbrella" />
                        ${weather_data.current.humidity}%
                    </span>
                    <span class="ms-3">
                        <img src="imgs/icon-wind.png" alt="wind" /> ${weather_data.current.wind_kph} km/h
                    </span>
                    <span class="ms-3">
                        <img src="imgs/icon-compass.png" alt="wind" /> ${weather_data.current.wind_dir}
                    </span>
                </div>
            </div>
        </div>
    `;

    //tow days
    for (let i = 1; i < weather_data.forecast.forecastday.length; i++) {
        let forecast = weather_data.forecast.forecastday[i];
        let date = new Date(forecast.date);
        let background
        if(i==1){
            background = '#262936'
        }
        else{
            background = '#323544'
        }

        cartona += `
            <div class="col-lg-4 forecast" style="background-color: ${background}">
                <div class="text-center info-date p-2 rounded-3" style="background-color: #2d303d">
                    <span class="text-center">${date.toLocaleString('en-US', { weekday: 'long' })}</span>
                </div>
                <div class="weather mt-5">
                    <div class="text-center">
                        <img class="icon-style mt-3" src="https:${forecast.day.condition.icon}" alt="weather condition" />
                        <h3 class="text-white mt-4">${forecast.day.avgtemp_c}°C</h3>
                        <h6 class="text-white mt-2">${forecast.day.maxwind_mph}°</h6>
                    </div>
                    <div class="text-center mt-4">
                        <p style="color: #1577be; font-weight: 600">
                            ${forecast.day.condition.text}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById('info-weather').innerHTML = cartona;
}

function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const coords = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            find_weather(coords);
        }, error => {
            console.log('Error getting geolocation:', error);
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}


getGeolocation();
