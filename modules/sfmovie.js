var http = require('http');

var locations = {};
var rows = [];

/**
 * Simple helper method to fetch the data in full and return
 */
function fetchJSON(url, callback) {
	http.get(url, function(res) {
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			callback(JSON.parse(data));
		});
	});
}

/**
 * Since the raw data from SF movies is just a string
 * we need to use Google's geocoding API to convert
 * into Lat and Lng
 */
function loadData(callback) {
	fetchJSON('http://data.sfgov.org/resource/yitu-d5am.json?release_year=2012', function(data) {
		for (var i in data) {
			var row = data[i];
			locations[row.locations]++;
		}
		
		var locationCount = 0;
		for (var location in locations) {
			var query = encodeURIComponent(location + ' , San Francisco, CA, USA');
			fetchJSON('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='+query, function(data) {
				if (!data.results) {
					console.log('Unable to find geo location for ' + location);
				} else {
					for (var i in data.results) {
						var result = data.results[i].geometry.location;
						console.log(result);
					}
				}
				
				locationCount++;
				if (locationCount >= locations.length) {
					buildRows();
				}
			});
			console.log(location);
			break;
		}
	});
}

exports.init = function(callback) {
	loadData(callback);
};
