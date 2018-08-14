# omdb-movies-rest-api
Yet another node.js REST API.

# Live version

Live version available on [Heroku](https://quiet-depths-49220.herokuapp.com)

# Prerequisites

You need to have both [Node.js](https://nodejs.org) (v10.0.0+) and [MongoDB](https://www.mongodb.com) (v4.0.0+) installed to run
this application. 

# Installation

Navigate to root directory of the project, then run:

```
npm i
```

This application requires a connection to a MongoDB instance to work.

By default it tries to connect to a local database on port 27017.

API itself runs on port 3000.

These defaults can be changed by editing ./server/config/config.js

Start the application by running: 
```
npm start
```
or
```
node server/server.js
``` 

# Usage

Insert new movies into the database by making a POST request to the /movies endpoint. 
Request body needs to contain a "name" property to make a successful POST request.

Example:

```
{
    text: "Shrek"
}

```

Fetch a list of all movies in the database by making a GET request to the /movies endpoint.
GET request without any headers will return a list of all movies without any modifications.
The list of all movies can be sorted and filtered when proper headers are supplied by the user.


Example:
```
{
  action: "sort" || "filter",
  criterion: "Title" || "Year" || "Metascore", //uses "Title" if value not supplied by user
  direction: "ascending" || "descending", //for sorting only, defaults to 'ascending' if no value supplied by the user
  query: "Shrek" || "2001" || "84" //for filtering only. Required, responds with an error if no value supplied by the user.
}
```
Add comments to movies by making a POST request to the /comments endpoint.
Request body needs to contain an id of a movie existing in the database, as well as a text property.

Example:
```
{
    id: "5b7176dbd000be26244bb9dd",
    text: "Sample comment."
}
```

Fetch all comments added for a specific movie by making a GET request to the /comments/:id endpoint.
Replace ":id" with an id of a movie in the database to fetch all related comments.

Example: 
```
/comments/5b7176dbd000be26244bb9dd
```

Fetch all of the comments from the database by making a plain GET request to the /comments endpoint.

# Testing

Automated tests can be run with: 
```
npm test
```
Testing requires a connection to a MongoDB database. 

# Modules


Some of the modules used in this project:

* [express](https://www.npmjs.com/package/express)
* [mongodb](https://www.npmjs.com/package/mongodb)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [axios](https://www.npmjs.com/package/axios)
* [body-parser](https://www.npmjs.com/package/body-parser)

Test modules:

* [mocha](https://www.npmjs.com/package/mocha)
* [supertest](https://www.npmjs.com/package/supertest)
* [expect](https://www.npmjs.com/package/expect)

# Author

Created by Mateusz Sawastian.

## License

`omdb-movies-rest-api` is available under the MIT license. See the [LICENSE.md](LICENSE.md) file for more info.


