// Load the dotenv library to load environment variables from a .env file
require('dotenv').config();

// Load the EleventyFetch library to make HTTP requests
const EleventyFetch = require("@11ty/eleventy-fetch");

// Define an object that contains the IMDb IDs of each Star Wars episode
const imdbIDs = {
    "ep1": "tt0120915", // The Phantom Menace
    "ep2": "tt0121765", // Attack of the Clones
    "ep3": "tt0121766", // Revenge of the Sith
    "ep4": "tt0076759", // A New Hope
    "ep5": "tt0080684", // The Empire Strikes Back
    "ep6": "tt0086190"  // Return of the Jedi
};

// This code loads the dotenv library, which allows the application to
// load environment variables from a .env file. It also loads the
// EleventyFetch library, which is used to make HTTP requests. Finally,
//it defines an object called imdbIDs that contains the IMDb IDs for each Star Wars episode.
//
//Note: The IMDb IDs are unique identifiers assigned to each movie on the IMDb website.

// Set up constants used in OMDB REST API
const omdbEndpoint  = "https://www.omdbapi.com/"; // URL of the OMDB API endpoint
const omdbKey       = process.env.OMDB_API_KEY; // API key loaded from environment variable
const cacheDuration = "1d"; // Cache duration for API responses
const responseType  = "json"; // Response type for API requests

// Set up constants used in the SWAPI GraphQL query
const swapiEndpoint  = "https://swapi-graphql.netlify.app/.netlify/functions/index"; // URL of the SWAPI GraphQL endpoint
const graphQL        = JSON.stringify({ // GraphQL query to retrieve data about all Star Wars films
    query: `query AllFilms {
        allFilms {
            films {
                title
                episodeID
                openingCrawl
                director
                producers
                releaseDate
                id
                characterConnection {
                    characters {
                        name
                        id
                    }
                }
                planetConnection {
                    planets {
                        name
                        id
                    }
                }
                starshipConnection {
                    starships {
                        name
                        id
                    }
                }
                vehicleConnection {
                    vehicles {
                        name
                        id
                    }
                }
            }
        }
    }`
});
const fetchOptions   = { // Options for the HTTP request to the SWAPI GraphQL endpoint
    "method":  "POST", // HTTP method
    "body":    graphQL, // Request body (in this case, the GraphQL query)
    "headers": { // Request headers
        "Content-Type": "application/json" // Content type of the request
    }
}
// Export an async function that retrieves film data from SWAPI and adds additional data from the OMDB API
module.exports = async function() {
    let filmsData = {}; // Initialize an empty object to store the film data
    try {
        let response = await fetch(swapiEndpoint, fetchOptions); // Make a request to the SWAPI GraphQL endpoint using the fetch method
        filmsData    = await response.json(); // Store the JSON response in the filmsData object

    } catch (err) {
        console.log("Error in films.js fetch: " + err); // Log any errors that occur
    };

    filmsData = await addOmdbData(filmsData); // Add additional data from the OMDB API using the addOmdbData function

    return filmsData; // Return the updated film data object
}

// Define a function that adds data from the OMDB API to the film data object
async function addOmdbData(filmsData) {
    filmsData.data.allFilms.films.forEach(async film => { // Loop over each film in the film data object
        // Create query parameters for the OMDB API request
        let queryParams = new URLSearchParams(
            {
                "apikey": omdbKey, // API key for the OMDB API
                "i": imdbIDs[`ep${film.episodeID}`] // IMDb ID for the corresponding Star Wars episode
            }
        );
        let queryURL  = `${omdbEndpoint}?${queryParams}`; // Combine the OMDB API endpoint URL and query parameters
        let movieInfo = {}; // Initialize an empty object to store the movie information

        try {
            movieInfo = await EleventyFetch(queryURL, { // Make a request to the OMDB API using the EleventyFetch library
                "duration": cacheDuration, // Set the cache duration for the response
                "type": responseType // Set the response type
            });

        } catch (err) {
            console.log("Error in films.js eleventy-fetch:" + err); // Log any errors that occur
        };

        // Place plot, poster URL, and other film information into film object
        film.poster   = movieInfo.Poster; // Store the URL of the movie poster
        film.plot     = movieInfo.Plot; // Store the movie plot summary
        film.released = movieInfo.Released; // Store the release date of the movie
    });
    return filmsData; // Return the updated film data object

}

// This code exports an async function that retrieves film data from the SWAPI GraphQL endpoint
// and adds additional data from the OMDB API using the addOmdbData function.
//
// The module.exports statement defines an anonymous async function that initializes an
// empty object called filmsData and makes a request to the SWAPI GraphQL endpoint using the fetch method.
// If the request is successful, it stores the JSON response in the filmsData object.
//
// It then calls the addOmdbData function to add additional data from the OMDB
// API to the filmsData object. Finally, it returns the updated filmsData object.
//
// The addOmdbData function loops over each film in the filmsData object and makes a
// request to the OMDB API using the EleventyFetch library. It uses the URLSearchParams
// constructor to create query parameters for the API request, and it combines the OMDB API
// endpoint URL and query parameters to create a complete URL for the request.
//
// If the API request is successful, it stores the movie poster URL, plot summary,
