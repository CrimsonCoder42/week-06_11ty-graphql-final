// Load the dotenv library to load environment variables from a .env file
require('dotenv').config();

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

// Export an async function that fetches data from the Canvas LMS GraphQL API using fetch
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
    const response = await fetch(canvasEndpoint, fetchOptions);
    const data = await response.json();
    return data.data.course;
  } catch (error) {
    console.log('Error fetching Canvas LMS data:', error);
    return null;
  }
};
