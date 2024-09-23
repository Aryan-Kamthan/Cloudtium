const APIKey = '9f2fabf5bd00bd2a4d092cd7c6b4c73d';
// apiURL1 = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`
// apiURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
// apiURL3 = `http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}`
// apiURL4 = `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`
const part = 'hourly,daily,minutely'

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': 'b89d5b922bmshd0c701d311cd7b3p1251a4jsnfbc9f09360b4',
                    'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
                }
            };


function displayCityInfo(data){
    $("#search-result").html('');
    $('#searchModal').modal('show');

    data.forEach(city =>{
        let cityDiv = document.createElement('div');
        cityDiv.classList.add('city-info');
        cityDiv.innerHTML = `
            <h3>${city.name}, ${city.country}</h3>
            <p>Latitude : ${city.lat}</p>
            <p>Longitude : ${city.lon}</p>
            <hr />
            `;
        
        cityDiv.addEventListener("click",() => {
            $('#searchModal').modal('hide');
            let lat = city.lat;
            let lon = city.lon;
            let apiURL1
            let apiURL2;
            let apiURL3;
            var cityname = $("#search-city").val();
            var today = new Date();
            var startDate = new Date(new Date().setDate(today.getDate() - 5));
            let begin = startDate.toISOString().split('T')[0];
            var endDate = new Date(new Date().setDate(today.getDate() - 1));
            let end = endDate.toISOString().split('T')[0];



            apiURL1 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIKey}`;
            apiURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
            apiURL3 = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKey}`;
            const url = `https://weatherapi-com.p.rapidapi.com/history.json?q=${cityname}&lang=en&dt=${begin}&end_dt=${end}`;
           

            Promise.all([
                fetch(apiURL1).then(response=>response.json()),
                fetch(apiURL2).then(response=>response.json()),
                fetch(apiURL3).then(response=>response.json()),
                fetch(url, options).then(response=>response.json()),
                
            ])
            .then(([weatherData, forecastData, airPollutionData, historyData])=>{
                console.log("weather:",weatherData);
                console.log("forecast:",forecastData);
                console.log("airpollutin:",airPollutionData);
                console.log("Search_history:", historyData);
                

                displayWeatherData(weatherData);
                displayAirData(airPollutionData);
                displayForecast(forecastData);
                displayHistory(historyData);
            })
            .catch(error=>{
                window.alert(error);
            });
        });
        $("#search-result").append(cityDiv);
    });
    
}

function searchByCityName(){
    var cityname = $("#search-city").val();
    const geoLocationAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${APIKey}`;
    fetch(geoLocationAPI)
    .then(response => response.json())
    .then(data =>{
        displayCityInfo(data);
    })
    .catch(err =>{
        window.alert(err)
    });
}

$(document).ready(function(){
    clock();
    fetchWeatherData();
    $("#search-city").keypress(function(event){
        if(event.keyCode === 13){
            searchByCityName();
        }
    });
});



function convertUnixto12H(timestamp){
    const date = new Date(timestamp * 1000);

    let hours = date.getHours();
    let minutes = date.getMinutes();

    const amPM = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2,'0');
    let timestring = `${hours}:${minutes.toString().padStart(2,'0')} ${amPM}`;
    return timestring;  
}

function getImage(icon)
{
    const weatherImages = {
        "01d": "clear-sky.svg",
        "01n": "clear-sky.svg",
        "02d": "few-clouds.svg",
        "02n": "few-clouds.svg",
        "03d": "scattered-clouds.svg",
        "03n": "scattered-clouds.svg",
        "04d": "broken-clouds.svg",
        "04n": "broken-clouds.svg",
        "50d": "mist.svg",
        "50n": "mist.svg",
        "09d": "shower-rain.svg",
        "09n": "shower-rain.svg",
        "10d": "rain.svg",
        "10n": "rain.svg",
        "11d": "thunderstorm-rain.svg",
        "11n": "thunderstorm-rain.svg",
        "13d": "snow.svg",
        "13n": "snow.svg",
    };

    return weatherImages[icon] ||"clear-sky.svg";
}

function displayAirColor(airValue){
    let airColor;
    if(airValue >=0 && airValue <50)
    {
        airColor = '#6bdf4e';
    }
    else if(airValue >=51 && airValue <100){
        airColor = '#f2eb0e';

    }
    else if(airValue >=101 && airValue <200){
        airColor = '#ffa023';
    }
    else if(airValue >=201 && airValue <300){
        airColor = '#bc5f00';
    }
    else if(airValue >=301 && airValue <400){
        airColor = '#cd342c';
    }
    else if(airValue >=401){
        airColor = '#ff0000';
    }
    return airColor;
}

function clock()
{
    const now = new Date();
    const monthNames = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var month = monthNames[now.getMonth()];
    var day = dayNames[now.getDay()];
    var year = now.getFullYear();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var date = now.getDate();
    var ampm = hours >=12?'PM':'AM';
    var hours = hours%12||12;
    hours = hours < 10?'0' + hours:hours;
    minutes = minutes < 10 ? '0' +minutes:minutes;
    
    $(".day").text(`${day}`);
    $(".currentDate").text(`${date} ${month}, ${year}`);
    $(".time").text(`${hours}:${minutes} ${ampm}`);
}

function fetchWeatherData(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(position =>{
            console.log("position:",position);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            let apiURL1;
            let apiURL2;
            let apiURL3;
            var today = new Date();
            var startDate = new Date(new Date().setDate(today.getDate() - 5));
            let begin = startDate.toISOString().split('T')[0];
            var endDate = new Date(new Date().setDate(today.getDate() - 1));
            let end = endDate.toISOString().split('T')[0];

            apiURL1 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIKey}`;
            apiURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
            apiURL3 = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKey}`;
            const url = `https://weatherapi-com.p.rapidapi.com/history.json?q=Indore&lang=en&dt=${begin}&end_dt=${end}`;
            

            Promise.all([
                fetch(apiURL1).then(response=>response.json()),
                fetch(apiURL2).then(response=>response.json()),
                fetch(apiURL3).then(response=>response.json()),
                fetch(url, options).then(response=>response.json()),
                
            ])
            .then(([weatherData, forecastData, airPollutionData, historyData])=>{
                console.log("weather:",weatherData);
                console.log("forecast:",forecastData);
                console.log("airpollutin:",airPollutionData);
                console.log("history:",historyData);

                displayWeatherData(weatherData);
                displayAirData(airPollutionData);
                displayForecast(forecastData);
                displayHistory(historyData);

            })
            .catch(error=>{
                console.error(error);
            });
        

        });
    }
    else{
        windows.alert("Google Navigation not supported by this browser");
    }
}

function displayWeatherData(weatherData){
    let temprature = (Number(weatherData.current.temp) - 273.15).toFixed(1);
    let feelslike = (Number(weatherData.current.feels_like) - 273.15).toFixed(1);

    // Description and icons section
    let description = weatherData.current.weather[0].description;
    let icon = weatherData.current.weather[0].icon;
    let iconImage = getImage(icon);

    // console.log("description:" ,description);
    // console.log("icon:" ,icon);
    // console.log("img:" ,iconImage);

    $(".weather-type").html(`<img src="images/weather-icon/${iconImage}" height="35px" class="weather-type"> ${description}`);
    $(".weather-icon").html(`<div class="weather-img"><img src="images/weather-icon/${iconImage}"alt=""></div>`);


    // Description and icons section ends

    $(".weather-temp p").text(temprature);
    $(".feelslike").text(feelslike);
    $(".humidity").html(`${Number(weatherData.current.humidity)} <em>%</em>`);
    $(".visibility").html(`${Number(weatherData.current.visibility)/1000} <em>km</em>`);
// UV section start
    let uvValue = Number(weatherData.current.uvi);
    $(".uvindex").html(`${uvValue} <em>UV</em>`);
    let uvindexValue = ((uvValue * 15) -180);
    $("#uvIndexProjection").html(`<div id="bar" class="circle" style="transform: rotate(${uvindexValue}deg);"></div>`)
// UV section end

// Sun section
    let sunrise = weatherData.current.sunrise;
    let sunset = weatherData.current.sunset;

    let sunriseMillisecs = sunrise * 1000;
    let sunsetMillisecs = sunset * 1000;
    let sunriseDate = new Date(sunriseMillisecs);
    let sunsetDate = new Date(sunsetMillisecs);
    let sunriseHours = sunriseDate.getHours();
    let sunsetHours = sunsetDate.getHours();
    let difference  = sunsetHours - sunriseHours; // Hours in that day

    let degPerHour = 180/Number(difference);

    let currentTime = new Date(Date.now()); // Time When we are looking into projection.
    let currentSunDifferences = currentTime.getHours() - sunriseHours;

    let angle = ((currentSunDifferences * degPerHour)- 180);
    let angleSun = angle < 0 ? angle : 0;
    $(".sunrise").text(convertUnixto12H(sunrise));
    $(".sunset").text(convertUnixto12H(sunset));
    $("#sunrisesetProjection").html(`<div id="bar" class="circle" style="transform: rotate(${angleSun}deg);"></div>`)
// Sun Section end

    $(".windspeed").html(`${(Number(weatherData.current.wind_speed) *1.609).toFixed(1)} <em>km/h</em>`);
    

}

function displayAirData(airData){
    let airValue = airData.list[0].main.aqi;
    let airColor = displayAirColor(airValue);
    $("#airColor").html(`<span class="air-color me-2" style="background:${airColor}" id="airColor"></span>`)
    $("#airQuality").html(`<p class="mb-0 d-flex align-items-center" id="airQuality">${airValue}</p>`)
}


function displayForecast(data){
    let cityname = data.city.name;
    let countryname = data.city.country;
    $(".city span").text(cityname);
    $(".city em").text(countryname);
    
    $("#forecast").html(``);
    for(let i = 7; i < data.list.length; i+=8)
    {
        let forecast = data.list[i];
        // console.log("8fore:", forecast);
        let date = new Date(forecast.dt * 1000);
        const dayOfWeeks = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];
        let month = date.toLocaleDateString('default',{month:'long'});
        let dayOfMonth = date.getDate();
        let icon = forecast.weather[0].icon;
        let weatherIcon = getImage(icon);

        let temp_max = (Number(forecast.main.temp_max) -273.15).toFixed(0);
        let temp_min = (Number(forecast.main.temp_min) -273.15).toFixed(0);

        let humidity = forecast.main.humidity;
        let feelsLike = (Number(forecast.main.feels_like) -273.15).toFixed(0);
        let windSpeed = (Number(forecast.wind.speed * 1.60)).toFixed(1);
        let visible = (Number(forecast.visibility)/1000).toFixed(0);

        $("#forecast").append(` <div class="col-xl col-sm-4 col-6">
                                    <div class="forcast-box">
                                        <div class="weather-icon">
                                            <div class="weather-img">
                                                <img src="images/weather-icon/${weatherIcon}" alt="">
                                            </div>
                                        </div>
                                        <div class="date-time" style="text-align: center;">
                                            <p>${dayOfMonth} ${month}</p>
                                            <span>${dayOfWeeks}</span>
                                        </div>
                                        <div class="temp d-flex justify-content-center align-items-end">
                                            <div class="max-temp">
                                                <p class="mb-0">${temp_max}°</p>
                                            </div>
                                            <div class="min-temp">
                                                <p class="mb-0">/ ${temp_min}°</p>
                                            </div>
                                        </div>
                                        <div class="highlights">
                                            <div class="row g-0">
                                                <div class="col-7 highlights-text d-flex align-items-center">
                                                    <div>
                                                        <img src="images/forcast/humidity-ico.svg" alt="">
                                                    </div>
                                                    <p class="mb-0">${humidity} <em>%</em></p>
                                                </div>
                                                <div class="col-5 highlights-text d-flex align-items-center">
                                                    <div>
                                                        <img src="images/forcast/feels-ico.svg" alt="">
                                                    </div>
                                                    <p class="mb-0">${feelsLike}°</p>
                                                </div>
                                                <div class="col-7 highlights-text d-flex align-items-center">
                                                    <div>
                                                        <img src="images/forcast/wind-ico.svg" alt="">
                                                    </div>
                                                    <p class="mb-0">${windSpeed} <em> km/h</em></p> 
                                                </div>
                                                <div class="col-5 highlights-text d-flex align-items-center">
                                                    <div>
                                                        <img src="images/forcast/visibility-ico.svg" alt="">
                                                    </div>
                                                    <p class="mb-0">${visible}<em>km</em></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`);
    }

}

function displayHistory(data){

    $("#history").html(``);
    for(let i = 0; i <data.forecast.forecastday.length; i++)
    {
        let history = data.forecast.forecastday[i];
        // console.log("HISSS:",history);
        let date = new Date(history.date_epoch * 1000);
        const dayOfWeeks = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];
        let month = date.toLocaleDateString('default',{month:'long'});
        let dayOfMonth = date.getDate();
        let icon = history.day.condition.icon;
        // let weatherIcon = getImage(icon);

        let temp_max = (Number(history.day.maxtemp_c)).toFixed(0);
        let temp_min = (Number(history.day.mintemp_c)).toFixed(0);

        let humidity = history.day.avghumidity;
        // let feelsLike = (Number(forecast.main.feels_like) -273.15).toFixed(0);
        let windSpeed = (Number(history.day.maxwind_kph)).toFixed(1);
        let visible = (Number(history.day.avgvis_km)).toFixed(0);


        $("#history").append(` <div class="col-xl col-sm-4 col-6">
            <div class="history-box">
                <div class="weather-icon">
                    <div class="weather-img">
                        <img src="images/weather-icon/${icon}" alt="">
                    </div>
                </div>
                <div class="date-time">
                    <p>${dayOfMonth} ${month}</p>
                    <span>${dayOfWeeks}</span>
                </div>
                <div class="temp d-flex justify-content-center align-items-end">
                    <div class="max-temp">
                        <p class="mb-0">${temp_max}°</p>
                    </div>
                    <div class="min-temp">
                        <p class="mb-0">/ ${temp_min}°</p>
                    </div>
                </div>
                <div class="highlights">
                    <div class="row g-0">
                        <div class="col-7 highlights-text d-flex align-items-center">
                            <div>
                                <img src="images/forcast/humidity-ico.svg" alt="">
                            </div>
                            <p class="mb-0">${humidity} <em>%</em></p>
                        </div>
                        <div class="col-7 highlights-text d-flex align-items-center">
                            <div>
                                <img src="images/forcast/wind-ico.svg" alt="">
                            </div>
                            <p class="mb-0">${windSpeed} <em> km/h</em></p> 
                        </div>
                        <div class="col-5 highlights-text d-flex align-items-center">
                            <div>
                                <img src="images/forcast/visibility-ico.svg" alt="">
                            </div>
                            <p class="mb-0">${visible}<em>km</em></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
    }
}
