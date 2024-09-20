const APIKey = '9f2fabf5bd00bd2a4d092cd7c6b4c73d';
// apiURL1 = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`
// apiURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
// apiURL3 = `http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}`
const part = 'hourly,daily,minutely'

$(document).ready(function(){
    clock();
    fetchWeatherData();
});



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

            apiURL1 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIKey}`;
            apiURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
            apiURL3 = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKey}`;

            Promise.all([
                fetch(apiURL1).then(response=>response.json()),
                fetch(apiURL2).then(response=>response.json()),
                fetch(apiURL3).then(response=>response.json()),
            ])
            .then(([weatherData, forecastData, airPollutionData])=>{
                console.log("weather:",weatherData);
                console.log("forecast:",forecastData);
                console.log("airpollutin:",airPollutionData);

                displayWeatherData(weatherData);
                displayForecast(forecastData);
            })
            .catch(error=>{
                window.alert(error);
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
    let description = weatherData.current.weather[0].description;
    let icon = weatherData.current.weather[0].icon;
    let iconImage = getImage(icon);
    let sunrise = weatherData.current.sunrise;
    let sunset = weatherData.current.sunset;

    $(".weather-temp p").text(temprature);
    $(".feelslike").text(feelslike);
    $(".sunrise").text(convertUnixto12H(sunrise));
    $(".sunset").text(convertUnixto12H(sunset));
    $(".humidity").html(`${Number(weatherData.current.humidity)} <em>%</em>`);
    $(".visibility").html(`${Number(weatherData.current.visibility)/1000} <em>km</em>`);
    $(".uvindex").html(`${Number(weatherData.current.uvi)} <em>UV</em>`);
    $(".windspeed").html(`${Number(weatherData.current.wind_speed)} <em>km/h</em>`);
    $(".weather-type").html(`<img src="images/weather-icon/${iconImage}" height="35px"> ${description}`);


}

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

function displayForecast(data){
    let cityname = data.city.name;
    let countryname = data.city.country;
    // console.log("cityname", cityname);
    // console.log("country", countryname);
    $(".city span").text(cityname);
    $(".city em").text(countryname);

    // for(let i = 0; i < data.list.length; i+=8)
    // {

    // }

}
