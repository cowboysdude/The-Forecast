/* Magic Mirror
 * Module: The-Forecast
 *
 * By Cowboysdude
 * MIT Licensed.
 */
Module.register("The-Forecast", {

    // Module config defaults.
    defaults: {
        updateInterval: 30 * 60 * 1000,
        initialLoadDelay: 3450, 

         
        imageArray: {
            "Chance Light Rain then Chance Rain And Snow": "sleet",
            "Light Rain then Rain And Snow Likely": "sleet",
            "Slight Chance Snow Showers then Mostly Cloudy": "chancesnow",
            "Chance Light Rain then Chance Rain And Snow": "sleet",
            "Light Rain then Rain And Snow Likely": "chancesnow",
            "Rain And Snow Likely": "sleet",
            "Sleet": "sleet",
            "Snow Showers Likely": "chancesnow",
            "Light Rain": "rain",
            "Chance Rain": "chancerain",
            "Partly Sunny then Slight Chance Snow Showers": "chancesnow",
            "Light Rain Likely then Rain And Snow Likely": "chancesnow",
            "Chance Rain Showers then Chance Light Rain": "chancerain",
            "Chance Light Rain": "chancerain",
            "Chance Light Snow": "snow",
            "Light Snow Likely": "snow",
            "Light Snow": "snow",
            "Rain And Snow Likely": "sleet",
            "Slight Chance Light Snow": "chancesnow",
            "Light Snow Likely then Cloudy": "overcast",
            "Mostly Sunny": "clear",
            "Mostly Cloudy then Chance Light Rain": "chancerain",
            "Chance Rain And Snow": "sleet",
            "Partly Sunny then Chance Light Rain": "chancerain",
            "Chance Rain And Snow": "sleet",
            "Chance Light Snow": "chancesnow",
            "Sunny": "clear",
            "Partly Sunny then Slight Chance Rain Showers": "chancerain",
            "Chance Rain Showers": "chancerain",
            "Light Rain Likely": "chancerain",
            "Rain Showers Likely": "chancerain",
            "Chance Snow Showers": "chancesnow",
            "Mostly Clear": "mostlycloudy",
            "Mostly Cloudy": "mostlycloudy",
            "Sunny": "clear",
            "Clear": "clear",
            "Partly Sunny": "mostlycloudy",
            "Mostly Clear": "mostlycloudy",
            "Partly Sunny then Slight Chance Light Rain": "chancerain",
            "Rain Likely": "rain",
            "Rain then Rain And Snow Likely": "sleet",
            "Slight Chance Snow Showers": "chancesnow",
            "Mostly Cloudy": "mostlycloudy",
            "Light Snow Likely then Chance Snow Showers": "snow",
            "Chance Light Snow then Mostly Cloudy": "mostlycloudy",
            "Mostly Cloudy": "mostlycloudy",
            "Overcast": "mostlycloudy",
            "Light Rain Likely": "chancerain",
            "Rain Shower Likely": "chancerain",
            "Chance Light Rain then Chance Rain Showers": "chancerain",
            "Chance Rain And Snow Showers": "chancesnow",
            "Chance Snow Showers then Chance Light Rain": "chancerain",
            "Chance Snow Showers then Mostly Sunny": "chancesnow",
            "Partly Cloudy": "mostlycloudy",
			"Fair": "mostlycloudy",
			"Mostly Cloudy then Slight Chance Rain Showers":"chancerain",
			"Slight Chance Snow Showers then Partly Sunny":"partlycloudy",
			"Chance Rain And Snow Showers":"chancerain",
			"Slight Chance Snow Showers then Slight Chance Rain Showers":"chancerain",
			"Rain Showers":"rain",
			"Chance Snow Showers then Partly Sunny":"partlycloudy",
			"Rain":"rain",
			"Chance Light Rain then Mostly Cloudy":"mostlycloudy",
			"Slight Chance Rain And Snow then Chance Rain And Snow Showers":"chancerain"

        } 
    }, 
     
    getScripts: function() {
        return ["moment.js"];
    },
	
    getStyles: function() {
        return ["The-Forecast.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name); 
        this.today = ""; 
		this.forecast=[];
		this.getForecast()
        this.scheduleUpdate(); 	
    },


   getDom: function() {  
		console.log(this.forecast); 
		  
		var forecasts = this.forecast; 
        
        var d = new Date();
        var n = d.getHours();
        var ev1 = moment().format("HH");

        var wrapper = document.createElement("div"); 
  
		//var testy = moment(forecast[0].endTime).format('dddd');
 
		//var nowy = moment().format('dddd');
		//var high = (testy == nowy || forecast[0].name == "Tonight") ? forecast[0].temperature: console.log("not working John");
		// var low = (testy == nowy) ? forecast[1].temperature: console.log("not working John"); 
  
        var nextRow = document.createElement("div");
        nextRow.classList.add('bright');
        nextRow.setAttribute('style','float:left;'); 
		
	  
		for (a = 0; a < forecasts.length; a++) { 
		if (forecast[a].isDaytime == true) {
                var forecast = forecast[a]; 
		 
    			var timey = moment().format('ddd');
                var now = moment(forecast.startTime).format('ddd');
                var nowDay = moment(forecast.startTime).format('ddd');
                var DayDate = moment(forecast.startTime).format('M/D');
                var udate = moment(forecast.startTime).format('H');
                var iconImg = "modules/The-Forecast/icons/" + this.config.imageArray[forecast.shortForecast] + ".gif' height=10% width=10%>";
                var wimage = this.config.imageArray[forecast.shortForecast];
			if (forecast.name !== "Today"){
                nextRow.innerHTML += `<figure>
									  <figcaption>${forecast.hilow.day} - ${DayDate}</figcaption>
									  <img src='modules/The-Forecast/icons/${wimage}.gif' height='45' width='55'>
									   <figcaption>${high}&#730/${low}&#730</figcaption>
									</figure>`;
			} 	} 
		 }
		 
        wrapper.appendChild(nextRow); 
	 
        return wrapper;
		  
    },
 
     	 scheduleUpdate: function() {
        setInterval(() => {
		this.getForecast();
        }, this.config.updateInterval);
    }, 
	
    processFore: function(data) {
        this.forecast = data;
console.log(this.forecast);		
       console.log("Got forecast data"); 		
    }, 
     
    getForecast: function() {
        this.sendSocketNotification('GET_FORECAST');
    },
	
	 socketNotificationReceived: function(notification, payload) {
        
		if (notification === "FORECAST_RESULT") {
           this.processFore(payload);
          console.log("Got payload");		   
        } 
        this.updateDom(this.config.initialLoadDelay);
	 	 
    },
   
	 
    
});