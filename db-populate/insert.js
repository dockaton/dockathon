fs = require('fs')
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const url = 'mongodb://' + mongoHost + ':' + mongoPort + '/db';
const collectionName = process.env.MONGO_COLLECTION || 'collection';
const inputFilename = process.env.IPSUM_DATA_FILE || 'data.txt';
const minWordsInPar = 10;

var insertDocument = function(db, paragraph) {
   var entry =  {
     "data" : paragraph,
     "_random": Math.random()
   };
   db.collection(collectionName).insertOne(entry, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection:");
    console.log(entry);
  });
};

fs.readFile(inputFilename, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  } else {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        data.split("\n").forEach((paragraph) => {
            // console.log ( paragraph );
          var record = paragraph.trim();
          if (record.length > 0 && record.match(/("[^"]+"|[^"\s]+)/g).length >= minWordsInPar) {
            insertDocument(db, record);
          }
        });
        db.close();
    });
  }
});