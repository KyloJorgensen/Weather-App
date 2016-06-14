$(document).ready(function() {
	'use strict';
	var result = {};
	getRequest('New+York');
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
		$('.temporary').remove();
		var dayNum = 0;
		showHours(result, dayNum);
		$('.days').empty()
		$.each(result.weather, function(index, value) {
			showDays(value);
		});
	}

	function showHours(result, dayNum) {
		$('.date').html(result.weather[dayNum].date);
		$.each(result.weather[dayNum].hourly, function(index, value) {
			showHour(value);
		});
	}

	function showHour(value) {
			$('main').append('<div class="temporary hour"><img class="hour-img" src=' + value.weatherIconUrl[0].value + '>' + 
				'<dt class="time">' + value.time + '</dt>' +
				'<dt class="temp">' + value.tempF + 'F/' + value.tempC + 'C</dt>' +
				'<dt class="humidity">' + value.humidity + '%</dt>' +
				'<dt class="chance-of-weather">' + weatherType(value) + '</dt></div>'
			);
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
