var http = require('http');
var fs = require('fs');

var cacheFile = __dirname + '/../cache/locations.data';

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
var cache = {};

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

function locationLookup(location, offset, callback) {
	setTimeout(function() {
		console.log('looking up '+location);
		var query = encodeURIComponent(location + ' , San Francisco, CA, USA');
		fetchJSON('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + query, function(res) {
			if (!res.results) {
				console.log('Unable to find geo location for ' + location);
			} else {
				for (var i in res.results) {
					locations[location] = res.results[i].geometry.location;
					var line = location + '|' + locations[location].lat + '|' + locations[location].lng;
					fs.appendFile(cacheFile, line + '\n', function (err) {
						if (err) {
							console.log(err);
						}
					});
					break; 
				}
			}
			
			if (res.status != 'OK') {
				console.log(res.status);
			}
	
			callback();
		});
	}, 1001 * offset);
}

function fetchData(callback) {
	fetchJSON('http://data.sfgov.org/resource/yitu-d5am.json', function(data) {
		for (var i in data) {
			var row = data[i];
			if (!row.locations) {
				continue;
			}
			
			if (cache[row.locations]) {
				locations[row.locations] = cache[row.locations];
			} else {
				locations[row.locations] = false;
			}
		}

		var locationCount = 0;
		var i = 0;
		var totalLocations = 0;
		for (var location in locations) {
			if (locations[location]) {
				continue;
			}
			
			totalLocations++;
			locationLookup(location, i, function() {
				locationCount++;
				console.log('Fetched location ' + locationCount + '/' + totalLocations);
				if (locationCount >= totalLocations) {
					callback(buildRows(data));
				}
			});
			i++;
		}
	});
}

/**
 * Since the raw data from SF movies is just a string
 * we need to use Google's geocoding API to convert
 * into Lat and Lng
 */
exports.init = function(callback) {
	console.log('Loading data');
	fs.readFile(cacheFile, 'utf-8', function(err, data) {
		var lines = data.split('\n');
		for (var i in lines) {
			var line = lines[i];
			var cols = line.split('|');
			cache[cols[0]] = {lat: cols[1], lng: cols[2]};
		}
		
		fetchData(callback);
	});
};
