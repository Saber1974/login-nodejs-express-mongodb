/*

* Module dependencies

*/

var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , app = express() // Web framework to handle routing requests
  , MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
  , routes = require('./routes'); // Routes for our application


MongoClient.connect('mongodb://localhost:27017/myproducts', function(err, db) {
    "use strict";
    if(err) throw err;

    // Register our templating engine
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));

    app.use(stylus.middleware(
      { src: __dirname + '/public'
      , compile: compile
      }
    ));

    app.use(express.static(__dirname + '/public'));

    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    app.use(express.bodyParser());

    // Application routes
    routes(app, db);

    app.listen(8080);
    console.log('MyProducts Login App listening on "http://localhost:8080"');
});



function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}