/* jshint esversion:6 */
var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser= require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {extended: false } );
var port = process.env.PORT || 8080;

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/table_project';

// static folder
app.use( express.static( 'public' ) );

// spin up server
app.listen( port, function(){
  console.log( 'server up on', port );
});

// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( 'index.html' );
});

// get koalas
app.get( '/getKoalas', function( req, res ){
  console.log( 'getKoalas route hit' );
  //assemble object to send
  var objectToSend= {}; //end objectToSend
  pg.connect( connectionString, ( err, client, done ) => {

    if( err ) res.status(500).send( "Oops!");

    var resultsArray = [];
    var query = client.query( 'SELECT * FROM koalas ORDER BY id ASC' );

    query.on( 'row', ( row ) => {
      resultsArray.push( row );
    });

    query.on( 'end', ( ) => {
      done();
      return res.send( resultsArray );
    });
  });

});

// add koala
app.post( '/addKoala', urlencodedParser, function( req, res ){
  console.log( 'addKoala route hit' );

  var data = req.body;
  var results = [];

  console.log( "Data", data );

  // Connect to database
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO koalas(name, sex, age, transfer_status, notes) values($1, $2, $3, $4, $5)", [ data.name, data.sex, data.age, data.readyForTransfer, data.notes ]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM koalas ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.send(results);
        });


    });
});

// edit koala
app.put( '/editKoala', urlencodedParser, function( req, res ){
  console.log( 'editKoala route hit' );


  var data = req.body;
  var results = [];

  console.log( "Data", data );

  // Connect to database
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("UPDATE koalas SET name=$2, sex=$3, age=$4, transfer_status=$5, notes=$6 WHERE id=$1", [ data.id, data.name, data.sex, data.age, data.readyForTransfer, data.notes ] );

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM koalas ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.send(results);
        });


    });


});
