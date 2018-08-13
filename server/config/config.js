let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/omdb-movies";
}

console.log(`Running in ${env} mode`);
