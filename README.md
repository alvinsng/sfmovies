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
The socket.io lib was used to return the rows when the user loads the webpage.
The express lib is used to easily handle static content.
The data is loaded and fetched only once during the start of the Node.js webserver instance.
During this process it will fetch the entire list of movies filmed in SF from Data SF APIs.
Next it will parse the list of unique locations and run a Google Geocoding API request to get the lat and lng of the movie's location
During the page load, it will make a socket.io request to get the already parsed list of all movies with the lat/lng info.
It will render the Google Maps onto the page along with a marker of every film location.
The search bar has a JavaScript listener that will filter out movies based on movie title per each key press.
The filtering is all done locally for fast results and best UX.

I decided to have the client store a list of all the movies since the list is pretty short. Overall I spent about 4 hours building this app.

