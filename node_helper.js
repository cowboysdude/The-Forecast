/* Magic Mirror
 * Module: Forecast
 *
 * By Cowboysdude
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment'); 
var fs = require('fs'); 

module.exports = NodeHelper.create({

    start: function() {
        console.log("Getting module: " + this.name);
		
		this.forecast = {
            timestamp: null,
            data: null
        };
        this.path = "modules/The-Forecast/forecast.json";
 
        if (fs.existsSync(this.path)) {
            var temp = JSON.parse(fs.readFileSync(this.path, 'utf8'));
     
            if (temp.timestamp === this.getDate()) { 
				this.forecast = temp;
            }
        }
    }, 

	getForecast: function(url) {
		console.log("getting data")
		var self = this;
		var forecasts;
		request({
             url: "https://api.weather.gov/gridpoints/BGM/35,50/forecast",
            method: 'GET',
            headers: {
                'token': 'SHIFYpUPJOYdfCbCOUHoueGNTdttXYGe',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0 Chrome/79.0.3945.130 Safari/537.36'
            },
        }, (error, response, body) => {
        	if(!error){
	            var result = JSON.parse(body).properties.periods;
	            var forecast = result; 
	     		console.log("body="+body);    
				
				var farray = [];
	             //forecast = forecast.slice(1, 20);     // get my results and cut it down
		        for (var forecasts of forecast) {     // loop the array 
		            var now = moment(forecasts.startTime).format('ddd');   //need to check time
		            if (forecasts.isDaytime == true) {    //set the condition that I'm looking for to create dayHigh and NightLow below
		                var high = forecasts.temperature
		            } else if (forecasts.isDaytime == false) {
						var low = forecasts.temperature; 
		            };
		            var temps = {
		                hilow: {
		                    dayHigh: high,
		                    nightLow: low,
		                    name: forecasts.name,
		                    day: now,
		                    windDirection: forecasts.windDirection,
		                    windSpeed: forecasts.windSpeed
		                }
		            }; 
	                forecasts = Object.assign(forecasts, temps);  //Add this to each object
		      		farray.push(forecasts);  //push objects that I want into a new array.   It's only capturing the 1st one.  Everything works until I get here.....
					
				}
	       //  console.log(farray);  
				self.sendSocketNotification('FORECAST_RESULT', farray); 
				self.forecast.timestamp = self.getDate();
                self.forecast.data = forecasts;
                //fs.writeFileSync(self.path, JSON.stringify(self.forecast));
        	}
        	else {
        		console.log("request error = "+JSON.stringify(error))
        	}
    	});
    },

	fileWrite: function() {
        fs.writeFile(this.path, JSON.stringify(this.forecast), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The Forecast file was written!");
        });
    },

    getDate: function() {
        return (new Date()).toLocaleDateString();
    },
	
	    socketNotificationReceived: function(notification) {
        if (notification === 'GET_FORECAST') { 
				if (this.forecast.timestamp === this.getDate() && this.forecast.data !== null) {
                this.sendSocketNotification('FORECAST_RESULT', this.forecast.data);
				console.log("Using data we already have");
            } else { 
            	console.log("getting forecast data")
                this.getForecast();
				console.log("Getting new data");
         }   }
	},
	
});	
	