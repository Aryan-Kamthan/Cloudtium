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
                console.log("historyData:", historyData);
                

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
        $("#search-result").html('');
        if(data.length == 0){
            $('#searchModal').modal('show');
            let emptyDiv = document.createElement('div');
            emptyDiv.innerHTML = `
            Sorry cannot find this city
            <hr />
            `;
            $("#search-result").append(emptyDiv);
        }
        else{
            displayCityInfo(data);
        }
        
    })
    .catch(err =>{
        window.alert(err)
    });
}

function validateInput(input) {
    // Regular expression to allow only letters, numbers, spaces, and common safe symbols
    console.log(input)
    const regex = /[a-zA-Z]*/;
    
    if ( regex.test(input)) {
        console.log("Input is safe");
        return true;
    } else {
        console.log("Input contains potentially dangerous characters");
        return false;
    }
}

const searchInput = document.getElementById('search-city').value;
$("#search-city").keypress(function(event){
        if(event.keyCode === 13){
            if (validateInput(searchInput)) {
            searchByCityName();
            }
        else {
            // Reject input
            alert('Invalid characters detected in input');
        }
    }
});
    




$(document).ready(function(){
    // clock();
    fetchWeatherData();
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


// Export Historical Export Historical Export HistoricalExport Historical

function startHistoryDownload(input){
    const blob = new Blob([input],{type:'application/csv'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
        a.download = 'historicalData-csv.csv';
        a.href = url;
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();
        a.remove();
        URL.revokeObjectURL(url);
}

const exportHistory = document.getElementById('exportHistory');
exportHistory.addEventListener('click',exportHistoryHandle);


function handleHistory(data) {
    data = data.forecast.forecastday;
    let csvRows = [];
    // Step 1: Extract headers
    const headers = new Set();

    // Step 2: Flatten the JSON structure
    data.forEach(entry => {
        let row = {};
        let stack = [entry];

        while (stack.length) {
            let current = stack.pop();

            for (let key in current) {
                let value = current[key];

                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (typeof item === 'object' && item !== null) {
                            stack.push(item);
                        } else {
                            row[key] = row[key] || [];
                            row[key].push(item.toString());
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    stack.push(value);
                } else {
                    row[key] = value.toString();
                }
            }
        }

        // Add row values to csvRows
        csvRows.push(row);
        Object.keys(row).forEach(header => headers.add(header));
    });

    // Step 3: Create header row
    csvRows.unshift(Array.from(headers));

    // Step 4: Convert to CSV format
    csvRows = csvRows.map(row => {
        return Object.values(row).map(value => 
            Array.isArray(value) ? value.join('|') : value // Join array values with a delimiter
        ).join(',');
    });

    console.log(csvRows.join('\n'));
    startHistoryDownload(csvRows.join('\n'))
}



function exportHistoryHandle(){

    var cityname = $("#search-city").val()||'Indore';
    var today = new Date();
    var startDate = new Date(new Date().setDate(today.getDate() - 8));
    let begin = startDate.toISOString().split('T')[0];
    var endDate = new Date(new Date().setDate(today.getDate() - 1));
    let end = endDate.toISOString().split('T')[0];



    const Historyurl = `https://weatherapi-com.p.rapidapi.com/history.json?q=${cityname}&lang=en&dt=${begin}&end_dt=${end}`;
    fetch(Historyurl,options)
    .then(res => res.json())
    .then(data => handleHistory(data))

}

// Export Forecast Export ForecastExport ForecastExport ForecastExport ForecastExport Forecast
const exportForecast = document.getElementById('exportForecast');
exportForecast.addEventListener('click',exportForecastHandle);

function startForecastDownload(input){
    const blob = new Blob([input],{type:'application/csv'});
    const url = URL.createObjectURL(blob);
    
   
    const a = document.createElement('a');
        a.download = 'forecast-csv.csv';
        a.href = url;
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();
        a.remove();
        URL.revokeObjectURL(url);

}

function handleForecast(data) {
    data = data.list;
    let csvRows = [];
    // Step 1: Extract headers
    const headers = new Set();

    // Step 2: Flatten the JSON structure
    data.forEach(entry => {
        let row = {};
        let stack = [entry];

        while (stack.length) {
            let current = stack.pop();

            for (let key in current) {
                let value = current[key];

                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (typeof item === 'object' && item !== null) {
                            stack.push(item);
                        } else {
                            row[key] = row[key] || [];
                            row[key].push(item.toString());
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    stack.push(value);
                } else {
                    row[key] = value.toString();
                }
            }
        }

        // Add row values to csvRows
        csvRows.push(row);
        Object.keys(row).forEach(header => headers.add(header));
    });

    // Step 3: Create header row
    csvRows.unshift(Array.from(headers));

    // Step 4: Convert to CSV format
    csvRows = csvRows.map(row => {
        return Object.values(row).map(value => 
            Array.isArray(value) ? value.join('|') : value // Join array values with a delimiter
        ).join(',');
    });

    startForecastDownload(csvRows.join('\n'));
}




function exportForecastHandle()
{
    if(navigator.geolocation){
           navigator.geolocation.getCurrentPosition(position =>{
            // console.log("position:",position);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            var today = new Date();
            var startDate = new Date(new Date().setDate(today.getDate() - 5));
            let begin = startDate.toISOString().split('T')[0];
            var endDate = new Date(new Date().setDate(today.getDate() - 1));
            let end = endDate.toISOString().split('T')[0];

            let apiURLForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
            fetch(apiURLForecast)
            .then(res => res.json())
            .then(data => handleForecast(data))
        });
    }
    else{
        windows.alert("Google Navigation not supported by this browser");
    }
    
}

// Export Forecast ends ends ends ends ends ends ends ends ends ends ends



    

function displayWeatherData(weatherData){
    let curr_temprature = (Number(weatherData.current.temp) - 273.15).toFixed(1);
    // console.log(curr_temprature);
   
    let curr_feelslike = (Number(weatherData.current.feels_like) - 273.15).toFixed(1);


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

    $(".weather-temp p").text(curr_temprature);
    
    $(".feelslike").text(curr_feelslike);
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
    let airValue = airData.list[0].components.o3.toFixed(0);
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

        let temp_max = (Number(forecast.main.temp_max) -273.15).toFixed(1);
        let temp_min = (Number(forecast.main.temp_min) -273.15).toFixed(0);
        let description = forecast.weather[0].description;
        // console.log("foredesc:",description);

        let humidity = forecast.main.humidity;
        let feelsLike = (Number(forecast.main.feels_like) -273.15).toFixed(0);
        let windSpeed = (Number(forecast.wind.speed * 1.60)).toFixed(1);
        let visible = (Number(forecast.visibility)/1000).toFixed(0);

        $("#forecast").append(` <div class="col-xl col-sm-4 col-6">
                                    <div class="forcast-box" style ="height:80vh;">
                                        <div class="weather-icon">
                                            <div class="weather-img">
                                                <img src="images/weather-icon/${weatherIcon}" alt="">
                                            </div>
                                        </div>
                                        <div class="22-type pt-2 weather-type text-center weather-desc" style = "margin-bottom:40px;">
                                            <p>${description}</p>
                                        </div>
                                        <div class="date-time" style="text-align: center; margin-bottom:30px;">
                                            <p>${dayOfMonth} ${month}</p>
                                            <span>${dayOfWeeks}</span>
                                        </div>
                                        <div class="temp d-flex justify-content-center align-items-end">
                                            <div class="max-temp">
                                                <p class="mb-0 changeU"> ${temp_max}°<em style="opacity:0.5; font-size:16px; font-style:normal;">C</em></p>
                                            </div>
                                        </div>
                                        <div class="highlights" style = "padding:30px;">
                                            <div class="row g-0">
                                                <div class="col-7 highlights-text d-flex align-items-center"style = "margin-bottom:20px;">
                                                    <div>
                                                        <img src="images/forcast/humidity-ico.svg" alt="">
                                                    </div>
                                                    <p class="mb-0">${humidity} <em>%</em></p>
                                                </div>
                                                <div class="col-5 highlights-text d-flex align-items-center"style = "margin-bottom:20px;">
                                                    <div>
                                                        <img src="images/forcast/feels-ico.svg" alt="">
                                                    </div>
                                                    <p class="mb-0 changeU">${feelsLike}° <em>C</em></p>
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
        // let icon = history.day.condition.icon;
        // let weatherIcon = getImage(icon);

        let description = history.day.condition.text;

        let temp_max = (Number(history.day.maxtemp_c)).toFixed(0);
        let temp_min = (Number(history.day.mintemp_c)).toFixed(0);

        let humidity = history.day.avghumidity;
        let feelsLike = (Number(history.hour[12].feelslike_c)).toFixed(0);
        let windSpeed = (Number(history.day.maxwind_kph)).toFixed(0);
        let visible = (Number(history.day.avgvis_km)).toFixed(0);
        let sunrise = history.astro.sunrise;
        let sunset = history.astro.sunset;


        $("#history").append(` <div class="col-xl col-sm-4 col-6">
            <div class="history-box" style = "height:80vh;">
                <div class="date-time" style="padding-top: 20px; margin-top:20px; margin-bottom:20px;">
                    <p>${dayOfMonth} ${month}</p>
                    <span>${dayOfWeeks}</span>
                </div>
                <div class="temp d-flex justify-content-center align-items-end" style ="margin-top:20px; margin-bottom:20px;">
                    <div class="max-temp">
                        <p class="mb-0 changeU">${temp_max}° C </p>
                    </div>
                    <div class="min-temp">
                        <p class="mb-0 changeU"> / ${temp_min}° C</p>
                    </div>
                </div>

                <div class="22-type pt-2 weather-type text-center style="margin-bottom:20px;">
                           <p> ${description}</p>
                </div>

                <div class="highlights">
                    <div class="row g-0">
                        <div class="col-7 highlights-text d-flex align-items-center" style="margin-bottom:25px">
                            <div>
                                <img src="images/forcast/humidity-ico.svg" alt="">
                            </div>
                            <p class="mb-10">${humidity} <em>%</em></p>
                        </div>

                        <div class="col-5 highlights-text d-flex align-items-center" style="margin-bottom:25px">
                            <div>
                                <img src="images/forcast/feels-ico.svg" alt="">
                            </div>
                            <p class="mb-0 changeU">${feelsLike}° <em> C</em></p> 
                        </div>

                        <div class="col-7 highlights-text d-flex align-items-center" style="margin-bottom:25px">
                            <div>
                                <img src="images/forcast/wind-ico.svg" alt="">
                            </div>
                            <p class="mb-0">${windSpeed} <em> km/h</em></p> 
                        </div>
                        <div class="col-5 highlights-text d-flex align-items-center" style="margin-bottom:25px">
                            <div>
                                <img src="images/forcast/visibility-ico.svg" alt="">
                            </div>
                            <p class="mb-0">${visible}<em>km</em></p>
                        </div>
                        <div class="col-7 highlights-text d-flex align-items-center" style="margin-bottom:20px">
                            <div>
                                <img src="images/sunrise.svg" alt="" style="color:red">
                            </div>
                            <p class="mb-0"><em> ${sunrise}  </em></p> 
                        </div>
                        <div class="col-5 highlights-text d-flex align-items-center" style="margin-bottom:20px">
                            <div>
                                <img src="images/sunset.svg" alt="">
                            </div>
                            <p class="mb-0"><em>${sunset}</em></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
    }
}

// Toggle Temp
const toggle = document.getElementById("toggleTemp");
const temperatureDisplays = document.querySelectorAll('.changeU');

toggle.addEventListener('change', () => {
    temperatureDisplays.forEach(tempDisplay => {
        const currentTemp = tempDisplay.textContent;

        if (toggle.checked) {
            // Convert to Fahrenheit
            const celsiusValue = parseFloat(currentTemp);
            const fahrenheitValue = (celsiusValue * 9/5) + 32;
            tempDisplay.textContent = `${fahrenheitValue.toFixed(1)}°F`;
        } else {
            // Convert to Celsius
            const fahrenheitValue = parseFloat(currentTemp);
            const celsiusValue = (fahrenheitValue - 32) * 5/9;
            tempDisplay.textContent = `${celsiusValue.toFixed(1)}°C`;
        }
    });
});


// Plot starts
function searchCityNameLatLon(){
    var cityname = $("#search-city").val()||'Indore';
    const geoLocationAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${APIKey}`;
    fetch(geoLocationAPI)
    .then(response => response.json())
    .then(data =>{
        console.log("Data:", data);
        if(data.length == 0){
            myChart.destroy();
        }
        else{
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log("fdggfd",lat);
            console.log("fdggfd",lat);
            return {lat, lon};
        }
        
    })
    .catch(err =>{
        window.alert(err)
    });
}

window.onload = function() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
         // console.log("position:",position);
         const lat = position.coords.latitude;
         const lon = position.coords.longitude;
         var today = new Date();
         var startDate = new Date(new Date().setDate(today.getDate() - 5));
         let begin = startDate.toISOString().split('T')[0];
         var endDate = new Date(new Date().setDate(today.getDate() - 1));
         let end = endDate.toISOString().split('T')[0];
    
        
        const apiEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
 
        const dateDropdown = document.getElementById('dateDropdown');
        let myChart; // Declare the chart variable globally to be reused

        // Function to get the next five dates
        function getNextFiveDates() {
            const dates = [];
            const currentDate = new Date();

            // Loop to get the next 5 days
            for (let i = 1; i <= 5; i++) {
                const futureDate = new Date(currentDate);
                futureDate.setDate(currentDate.getDate() + i); // Increment the date
                const formattedDate = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                dates.push(formattedDate);
            }

            return dates;
        }

        // Populate dropdown with the next five dates
        function populateDropdown() {
            const dates = getNextFiveDates();
            dates.forEach(date => {
                const option = document.createElement('option');
                option.value = date;
                option.text = date;
                dateDropdown.appendChild(option);
            });
        }

        // Fetch data from the API and plot the chart based on the selected date
        async function fetchData(targetDate) {
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let data = await response.json();
                data = data.list;

                // Check if data is an array, if not convert it to an array
                if (!Array.isArray(data)) {
                    console.warn('Data is not an array. Converting to array format.');
                    data = Object.values(data); // Convert object values to an array
                }

                // Filter data for the selected day
                const filteredData = data.filter(item => item.dt_txt.startsWith(targetDate));

                // Check if there is data for the specified date
                if (filteredData.length === 0) {
                    console.warn(`No data found for the date: ${targetDate}`);
                    return; // Exit if no data for the specified date
                }

                // Extracting only the time part from dt_txt for the x-axis
                const labels = filteredData.map(item => item.dt_txt.split(" ")[1]); // Getting only the time for the x-axis
                const temperatures = filteredData.map(item => {
                    return (item.main.temp - 273.15).toFixed(1); // Convert to Celsius
                }); // Getting the temperature for the y-axis in Celsius

                // If chart already exists, destroy it before creating a new one
                if (myChart) {
                    myChart.destroy();
                }

                plotChart(labels, temperatures);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // Plot the chart
        function plotChart(labels, values) {
            const ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels, // Time labels on the x-axis
                    datasets: [{
                        label: 'Temperature (°C) Over Time',
                        data: values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Temperature (°C)' // Specify the unit of measurement
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            },
                            ticks: {
                                autoSkip: false // Ensures all labels are shown on the x-axis
                            }
                        }
                    }
                }
            });
        }

        // Populate the dropdown on page load
        populateDropdown();

        // Fetch and plot data for the initial selected date (first option in dropdown)
        fetchData(dateDropdown.value);

        // Event listener to update the graph when the user selects a new date
        dateDropdown.addEventListener('change', function() {
        const selectedDate = dateDropdown.value;
        console.log('Selected Date:', selectedDate); // Console log the selected date
        fetchData(selectedDate); // Fetch and update the graph based on the selected date
    });
});
};
}



// Plot ends Plot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot endsPlot ends



// FAQ

const items = document.querySelectorAll('.accordion button');

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');

  for (let i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }

  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}

items.forEach((item) => item.addEventListener('click', toggleAccordion));