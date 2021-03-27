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
        getWeather(city);
        get5dayForecast(city);
        cities.unshift({city});
        cityType.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    prevSearch(city);
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

   //console.log(weather);

   //create date element
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);

   //create an image element
   var weatherImg = document.createElement("img")
   weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInput.appendChild(weatherImg);

   //create a span element to hold temperature data
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
  
   //create a span element to hold Humidity data
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   //create a span element to hold Wind data
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   //append to container
   weatherContainer.appendChild(temperatureEl);

   //append to container
   weatherContainer.appendChild(humidityEl);

   //append to container
   weatherContainer.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon)
}

 var getUvIndex = function(lat,lon){
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
           // console.log(data)
        });
    });
    //console.log(lat);
    //console.log(lon);
}
 
var displayUvIndex = function(index){
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndex.appendChild(uvIndexValue);

    //append index to current weather
    weatherContainer.appendChild(uvIndex);
}

var get5dayForecast = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainer.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //console.log(dailyForecast)

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
       forecastTemp.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTemp);

       var forecastHumid=document.createElement("span");
       forecastHumid.classList = "card-body text-center";
       forecastHumid.textContent = dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumid);

        // console.log(forecastEl);
       //append to five day container
        forecastContainer.appendChild(forecastEl);
    }

}
var prevSearch = function(prevSearch){
 
    // console.log(pastSearch)

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
        get5dayForecast(city);
    }
}

// pastSearch();

city.addEventListener("submit", formSumbitHandler);
prevSearchBtn.addEventListener("click", prevSearchHandler);