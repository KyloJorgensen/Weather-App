$(document).ready(function() {
	'use strict';
	var result = {};
	getRequest('New+York');
	geoFindMe();

	$(function(){
		$('form').submit(function() {
			event.preventDefault();
			var searchTerm = $('.search-term').val();
			getRequest(searchTerm);
		});
	})

	function getRequest(searchTerm) {
		var data = {
			key: 'b5cd85b9eab74e879e5233654161306',
			q: searchTerm,
			num_of_days: 15,
			showlocaltime: 'yes',
			showmap: 'yes',
			tp: 1,
			format: 'json'
		},
			url = "https://api.worldweatheronline.com/premium/v1/weather.ashx";

		$.ajax({
			url: url,
			data: data,
			dataType: "jsonp",//use jsonp to avoid cross origin issues
			type: "GET",
		})	
		.done(function(results){ //this waits for the ajax to return with a succesful promise object
			result = results;
			validateResult(results.data);
		})
		.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
			alert('error with request from ' + url);
		});
	}

	function validateResult(result) {
		if (result.error) {
			alert(result.error[0].msg);
		} else {
			generateWeatherResults(result);
			// console.log(result);
		}
	}

	function generateWeatherResults(result) {
		$('.current-weather-img').html('<img class="current-weather-img" src=' + 
			result.current_condition[0].weatherIconUrl[0].value + '>')
		$('.place').html('<h1>' + result.request[0].query + '</h2><h3> Date ' + result.time_zone[0].localtime +
		 	'</h3><h3>Temperature ' + result.current_condition[0].temp_F + 'F/' + result.current_condition[0].temp_C + 'C '
		  	+ result.current_condition[0].weatherDesc[0].value + '</h3>')
		var dayNum = 0;
		showHours(result, dayNum);
		$('.days').empty()
		$.each(result.weather, function(index, value) {
			showDays(value);
		});
		themedBackground(result.time_zone[0].localtime);
	}

	function showHours(result, dayNum) {
		$('.temporary').remove();
		$('.date').html(result.weather[dayNum].date);
		$.each(result.weather[dayNum].hourly, function(index, value) {
			showHour(value);
		});
	}

	function showHour(value) {
		$('.img').append('<li class="temporary"><img class="hour-img" src=' + value.weatherIconUrl[0].value + '><li>');
		$('.time').append('<li class="temporary"><p>' + value.time + '</p>');
		$('.temperature').append('<li class="temporary"><p>' + value.tempF + 'F / ' + value.tempC + 'C</p>');
		$('.humidity').append('<li class="temporary"><p>' + value.humidity + '%</p>');
		$('.chance-of-weather').append('<li class="temporary"><p>' + weatherType(value) + '</p>');
	}

	function weatherType(value) {
		if (value.chanceofsnow > 0) {
			return value.chanceofsnow + '% Snow';
		}	else {
			return value.chanceofrain + '% Rain';
		}
	}

	function showDays(value) {
		$('.days').append('<li><button>' + value.date + '</button></li>');
	}

	function themedBackground(dateandtime) {
		var splited = dateandtime.split(" "),
			time = splited[1].split(":"),
			hour = Number(time[0]),
			night = result.data.weather[0].astronomy[0].moonrise.split(":"),
			morning = result.data.weather[0].astronomy[0].sunrise.split(":");
			night = Number(night[0]) + 12;
			morning = Number(morning[0]);
		if (hour >= morning && hour <= night) {
			$('body').css("background-color", "#96B4E4");
			$('.container').css("background-color", "#FCEE21");
		}
		else {
			$('body').css("background-color", "#3C4A90");
			$('.container').css("background-color", "#FFFDEE");
		}
	}

	function geoFindMe() {
        var output = document.getElementById("out");

        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            getRequest(latitude + ',' + longitude);
        }, function(error) {
        });
    }

	$('footer').on('click', 'button', function() {
		showNewDay($(this).html());
	});

	function showNewDay(date) {
		var dayNum;
		for (var i = 0; i < result.data.weather.length; i++) {
			if (result.data.weather[i].date == date) {
				dayNum = i;
			}
		}
		if (dayNum) {
			console.log(result);
			$('.temporary').remove();
			showHours(result.data, dayNum);
		}
	}


});
