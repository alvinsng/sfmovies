var markers = [];

function initialize() {
	var mapOptions = {
		center : new google.maps.LatLng(37.7608, -122.4449),
		zoom : 13
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var socket = io.connect(window.location.href);
	socket.on('init', function(data) {
		var count = 0;
		for (var i in data) {
			var row = data[i];
			createMarker(map, row);
		}
		
		runSearch('');
		$('#search').keyup(function() {
			runSearch($(this).val());
		});
	});
}

function runSearch(input) {
	var input = input.toLowerCase();
	var visibleCount = 0;
	for (var i in markers) {
		var marker = markers[i];
		if (input && marker.getTitle().toLowerCase().indexOf(input) == -1) {
			marker.setVisible(false);
			continue;
		}

		marker.setVisible(true);
		visibleCount++;
	}
	
	$('#result_count').text(visibleCount);
}

function createMarker(map, row) {
	var infowindow = new google.maps.InfoWindow({
		content : getContent(row)
	});

	var marker = new google.maps.Marker({
		position : new google.maps.LatLng(row.lat, row.lng),
		map : map,
		title : row.title
	});

	markers.push(marker);

	google.maps.event.addListener(marker, 'click', function(e) {
		console.log(e);
		infowindow.open(map, marker);
	});
}

/**
 * Returns HTML string content for this row
 */
function getContent(row) {
	var content = '';
	content += '<div class="infoBox">';
	content += '<h3>' + row.title + '</h3>';
	content += '<ul>';
	content += '<li><b>Location: </b>' + row.locations + '</li>';
	content += '<li><b>Release Year: </b>' + row.release_year + '</li>';
	content += '<li><b>Main Actor: </b>' + row.actor_1 + '</li>';
	content += '<li><b>Director: </b>' + row.director + '</li>';
	content += '<li><b>Writer: </b>' + row.writer + '</li>';
	content += '<li><b>Product Company: </b>' + row.production_company + '</li>';
	content += '</ul>';
	content += '</div>';
	return content;
}


$(document).ready(function() {
	// we init the map first, and then the dot markers
	google.maps.event.addDomListener(window, 'load', initialize);
});

