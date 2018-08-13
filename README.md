# omdb-movies-rest-api
Yet another node.js REST API.

# Prerequisites

```
MongoDB Community Server v4.0+
Node.js 10+
```
# Installation

Navigate to root catalogue of the project, then run:

```
npm i
```
This application needs a connection to MongoDB to work.

By default it tries to connect to a local database on port 27017.

API itself runs on port 3000.

Defaults can be changed by editing ./server/config/config.js

# Usage

Insert new movies into the database by making a POST request to the /movies endpoint. 
Request body needs to contain a "name" property to make a successful POST request.

Fetch a list of all movies in the database by making a GET request to the /movies endpoint.
GET request without any headers will return a list of all movies without any modifications.
The list of all movies can be sorted and filtered when proper headers are supplied by the user.

Example headers object for GET /movies:
```
{
  "action": "sort" || "filter",
  "criterion": "Title" || "Year" || "Metascore",
  "ascending": "true" || "false", //optionally for sorting
  "query": "Shrek" || "2001" || "84" //mandatory for filtering
}
```
Add comments to movies by making a POST request to the /comments endpoint.
Request body needs to cointain an id of a movie existing in the database, as well as a text property.

Fetch all comments added for a specific movie by making a GET request to the /comments/:id endpoint.
Replace ":id" with an id of a movie in the database to fetch all related comments.

Fetch all of the comments from the database by making a GET request to the /comments endpoint.

# Testing

Automated tests can be run with: 
```
npm test
```
# Live version

Live version available at [Heroku](https://quiet-depths-49220.herokuapp.com)
