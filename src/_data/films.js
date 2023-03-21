// Load the dotenv library to load environment variables from a .env file
require('dotenv').config();

// Load the EleventyFetch library to make HTTP requests
const EleventyFetch = require("@11ty/eleventy-fetch");

// Set up the Canvas LMS GraphQL API endpoint and access token
const canvasEndpoint = 'https://YOUR_CANVAS_DOMAIN/api/graphql';
const accessToken = process.env.CANVAS_API_TOKEN;

// Define the GraphQL query you want to execute
const graphQL = JSON.stringify({
  query: `
    query {
      course(id: "REPLACE_WITH_COURSE_ID") {
        name
        assignmentsConnection {
          nodes {
            name
            description
            dueAt
          }
        }
      }
    }
  `,
});

// Export an async function that fetches data from the Canvas LMS GraphQL API using EleventyFetch
module.exports = async function () {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: graphQL,
  };

  try {
    const data = await EleventyFetch(canvasEndpoint, fetchOptions);
    return data.data.course;
  } catch (error) {
    console.log('Error fetching Canvas LMS data:', error);
    return null;
  }
};
