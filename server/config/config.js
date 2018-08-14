let env = process.env.NODE_ENV || 'development';

process.env.OMDB_API_KEY = '3183d87d';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/omdb-movies";
}

if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/omdb-movies-test";
}

console.log(`Running in ${env} mode`);
