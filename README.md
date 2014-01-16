sfmovies
========
A simple web app to list movies filmed in SF using the data from https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am

Demo
====
Live working demo is available at http://vps.alvinsng.com:3000/

Author
======
Created by Alvin Sng, http://alvinsng.com, http://www.linkedin.com/in/alvinsng

Used
====
Twitter Bootstrap
Google Maps Client Side Javascript API
Google Maps Server Side Geocoding API
JQuery
JavaScript
CSS
HTML
Node.js
Node.js express
Node.js socket.io
Data SF API

About
=====
The backend of the web app is built in Node.js with the use of Socket.io and Express libs.
The socket.io lib is used to return the rows when the user loads the webpage.
The express lib is used to easily handle static content.
The data is loaded and fetched only once when the Node.js webserver starts.
When the Node.js server starts, it will fetch the entire list of movies filmed in SF from Data SF APIs.
Before using Google geocoding APIs, a check will be made in the cache to speedup the load times.
Next it will parse the list of unique locations and run a Google Geocoding API request to get the lat and lng of the movie's location.
Since the Google Map geocoding API has heavy throttle, only 1 API call can be made per second.
When the page is loaded by the user, a socket.io request is made to get the already parsed list of all movies with the lat/lng info.
Upon data load, a Google Map is added onto the page along with a marker of every film location.
The search bar has a JavaScript listener that will filter out movies based on movie title on each key press.
The filtering is all done locally for fast results and best UX.

I decided to have the client store a list of all the movies since the list is pretty short ~1k rows.
Overall I spent about 5 hours building this app.

