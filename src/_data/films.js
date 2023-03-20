require('dotenv').config();
const EleventyFetch = require("@11ty/eleventy-fetch");

// Set up JSON object that has IMDBs of each episode of Star Wars.
const imdbIDs = {
    "ep1": "tt0120915", // The Phantom Menace
    "ep2": "tt0121765", // Attack of the Clones
    "ep3": "tt0121766", // Revenge of the Sith
    "ep4": "tt0076759", // A New Hope
    "ep5": "tt0080684", // The Empire Strikes Back
    "ep6": "tt0086190"  // Return of the Jedi
};

// Set up constants used in OMDB REST API
const omdbEndpoint  = "https://www.omdbapi.com/";
const omdbKey       = process.env.OMDB_API_KEY;
const cacheDuration = "1d";
const responseType  = "json"; 

// Set up constants used in the SWAPI GraphQL query
const swapiEndpoint  = "https://swapi-graphql.netlify.app/.netlify/functions/index"; 
const graphQL        = JSON.stringify({
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
const fetchOptions   = {
    "method":  "POST",
    "body":    graphQL,
    "headers": {
        "Content-Type": "application/json"
    }
}

module.exports = async function() {
    let filmsData = {};
    try {
        let response = await fetch(swapiEndpoint, fetchOptions);
        filmsData    = await response.json();

    } catch (err) {
        console.log("Error in films.js fetch: " + err);
    };
    
    filmsData = await addOmdbData(filmsData);

    return filmsData;
}

// Cycle through all the films and pull out corresponding data from the OMDB.
// Place that data into the JSON argument that is provided.
async function addOmdbData(filmsData) {
    filmsData.data.allFilms.films.forEach(async film => {
        // Create query parameters
        let queryParams = new URLSearchParams(
            {
                "apikey": omdbKey,
                "i": imdbIDs[`ep${film.episodeID}`]
            }
        );
        let queryURL  = `${omdbEndpoint}?${queryParams}`;
        let movieInfo = {}; 

        try {
            movieInfo = await EleventyFetch(queryURL, {
                "duration": cacheDuration,
                "type": responseType
            });

        } catch (err) {
            console.log("Error in films.js eleventy-fetch:" + err);
        };

        // Place plot, poster URL, and other film information into film object
        film.poster   = movieInfo.Poster;
        film.plot     = movieInfo.Plot;
        film.released = movieInfo.Released;
    });
    return filmsData;

}
