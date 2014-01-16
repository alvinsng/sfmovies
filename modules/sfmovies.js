var http = require('http');

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

var locations = {};


function buildRows(data) {
	var rows = [];
	for (var i in data) {
		var row = data[i];
		if (!locations[row.locations]) {
			continue;
		}
		row.lat = locations[row.locations].lat;
		row.lng = locations[row.locations].lng;
		rows.push(row);
	}

	return rows;
}

function locationLookup(location, callback) {
	var query = encodeURIComponent(location + ' , San Francisco, CA, USA');
	fetchJSON('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + query, function(res) {
		if (!res.results) {
			console.log('Unable to find geo location for ' + location);
		} else {
			for (var i in res.results) {
				locations[location] = res.results[i].geometry.location;
				break; 
			}
		}

		callback();
	});
}

/**
 * Since the raw data from SF movies is just a string
 * we need to use Google's geocoding API to convert
 * into Lat and Lng
 */
exports.init = function(callback) {
	console.log('Loading data');
	fetchJSON('http://data.sfgov.org/resource/yitu-d5am.json', function(data) {
		for (var i in data) {
			var row = data[i];
			if (!row.locations) {
				continue;
			}
			locations[row.locations] = false;
		}

		var locationCount = 0;
		var totalLocations = Object.keys(locations).length;
		for (var location in locations) {
			locationLookup(location, function() {
				locationCount++;
				if (locationCount >= totalLocations) {
					callback(buildRows(data));
				}
			});
		}
	});
};
