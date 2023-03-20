# cscie-114_week-06_11ty-graphql-final
This is a fully functioning demo of 11ty using the [Star Wars GraphQL API](https://graphql.org/swapi-graphql/) and the [Open Movie Database (OMDB) API](https://www.omdbapi.com/).

## Installation
After cloning the repository, installation consists of three steps:

1. Adding and populating a `.env` file with an API key for the OMDB API.

2. Installing the appropriate npm packages.

3. Running the 11ty server on your local machine.

### Add a `.env` file
1. Create an API key at the [OMDB API](https://www.omdbapi.com/).

2. In the root directory of your cloned repository, create a `.env` file:
        touch .env

3. Add the following line to your `.env` file:

        OMDB_API_KEY=<your omdb api key goes here>


### Install the appropriate npm packages
In the root directory of the cloned repository, install all the npm packages you need with the following command:

    npm install

### Build and run the website with 11ty
In the root directory of the cloned repository, build the website and serve it up with:

    npm start
