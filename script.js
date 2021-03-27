const apiKey = "65c0423878b5167610787a63b85a34a6";

var cities = [];
var city=document.querySelector("#city-search-form");
var cityType=document.querySelector("#city");
var weatherContainer=document.querySelector("#current-weather-container");
var citySearchInput = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveday-container");
var prevSearchBtn = document.querySelector("#past-search-buttons");

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityType.value.trim();
    if(city){
        city = city[0].toUpperCase() + city.slice(1);
        getWeather(city);
        cities.unshift({city});
        cityType.value = "";
        saveSearch();
        prevSearch(city);
    } else{
        alert("Please enter a City");
    }
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getWeather = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
   //clear old content
   weatherContainer.textContent= "";  
   citySearchInput.textContent=searchCity;

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   runOnecall(lat, lon)
}

var runOnecall = function(lat, lon){
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayCurrent(data)
            displayUvIndex(data)
            display5Day(data)
        });
    });
}

var displayCurrent = function(data) {

    var current = data.current
    //create date element
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment.unix(current.dt).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);

   //create an image element
   var weatherImg = document.createElement("img")
   weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);
   weatherImg.setAttribute("width", "50");
   weatherImg.setAttribute("height", "50");
   citySearchInput.appendChild(weatherImg);

   //create a span element to hold temperature data
   var temperatureEl = document.createElement("span");
   var kelvinTemp = current.temp
   var fahrenTemp = ((kelvinTemp - 273.15) * (9/5)) + 32
   temperatureEl.textContent = "Temperature: " + fahrenTemp.toFixed(2) + " °F";
   temperatureEl.classList = "list-group-item"
  
   //create a span element to hold Humidity data
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + current.humidity + " %";
   humidityEl.classList = "list-group-item"

   //create a span element to hold Wind data
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + current.wind_speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   //append to container
   weatherContainer.appendChild(temperatureEl);

   //append to container
   weatherContainer.appendChild(humidityEl);

   //append to container
   weatherContainer.appendChild(windSpeedEl);
}
 
var displayUvIndex = function(index){
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "list-group-item"

    var uvi = index.current.uvi

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = uvi

    if(uvi <=2){
        uvIndexValue.classList = "favorable"
    }else if(uvi >2 && uvi<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(uvi >8){
        uvIndexValue.classList = "severe"
    };

    uvIndex.appendChild(uvIndexValue);

    //append index to current weather
    weatherContainer.appendChild(uvIndex);
}

var display5Day = function(weather){
    forecastContainer.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    if (weather.daily) {}

    for (var i = 0; i < 5; i++) {
        var dailyForecast = weather.daily[i];        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherImg = document.createElement("img")
       weatherImg.classList = "card-body text-center";
       weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherImg);
       
       //create temperature span
       var forecastTemp=document.createElement("span");
       forecastTemp.classList = "card-body text-center";
       var kelvinTemp = dailyForecast.temp.max
       var fahrenTemp = ((kelvinTemp - 273.15) * (9/5)) + 32
       forecastTemp.textContent = fahrenTemp.toFixed(2) + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTemp);

       var forecastHumid=document.createElement("span");
       forecastHumid.classList = "card-body text-center";
       forecastHumid.textContent = dailyForecast.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumid);

       //append to five day container
        forecastContainer.appendChild(forecastEl);
    }
}
var prevSearch = function(prevSearch){
 
    prevSearchEl = document.createElement("button");
    prevSearchEl.textContent = prevSearch;
    prevSearchEl.classList = "d-flex w-100 btn-light border p-3";
    prevSearchEl.setAttribute("data-city",prevSearch)
    prevSearchEl.setAttribute("type", "submit");

    prevSearchBtn.prepend(prevSearchEl);
}


var prevSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getWeather(city);
    }
}

city.addEventListener("submit", formSumbitHandler);
prevSearchBtn.addEventListener("click", prevSearchHandler);