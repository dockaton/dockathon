var express = require('express');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var port = 80;
if (process.env.SERVER_PORT && parseInt(process.env.SERVER_PORT) > 0) {
  port = parseInt(process.env.SERVER_PORT);
}

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const url = 'mongodb://' + mongoHost + ':' + mongoPort + '/db';
const collectionName = process.env.MONGO_COLLECTION || 'collection';

const TYPE_PARAGRAPH = 'paragraph';
const TYPE_SENTENCE = 'sentence';
const TYPE_WORD = 'word';

/**
* Returns an array of strings (paragraphs)
*/
var getRandomParagraphs = function(callback, n = 1) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        var query = {
            "_random": {
              $gte: Math.random()
            }

        };
        var options = {
            // something for randomizing the results?
            "limit": n,
        };

        db.collection(collectionName)
            .find(query, options)
            .toArray(function(e, result){
                assert.equal(null, e);
                var toReturn = result.map(entry => {
                    return entry.data.toString();
                });
                callback(toReturn);
            });

        db.close();
    });
};

/**
* Returns an array of strings (sentences)
*/
var getRandomSentences = function(callback, n = 1) {
  var cb = (data) => {
    var result = data.map(paragraph => {
      return extractSentence(paragraph);
    });
    callback(result);
  };

  getRandomParagraphs(cb, n);
};

/**
* Returns an array of strings (sentences)
*/
var getRandomWords = function(callback, n = 1) {
  var cb = (data) => {
    var result = data.map(paragraph => {
      return extractWord(paragraph);
    });
    callback(result);
  };

  getRandomSentences(cb, n);
};

var extractSentence = function(paragraph) {
  var sentences = paragraph.match(/(.*?[.?!])(?: |$)/g);
  if (sentences && sentences.length > 0) {
    var index = Math.floor(Math.random() * sentences.length);
    return sentences[index];
  } else {
    return paragraph;
  }
};

var extractWord = function(sentence) {
  var words = sentence.match(/("[^"]+"|[^"\s]+)/g);
  if (words && words.length > 0) {
    var index = Math.floor(Math.random() * words.length);
    return words[index];
  } else {
    return sentence;
  }
};

var getRandomFunction = function(req) {
  if(req.query.type) {
    if (req.query.type === TYPE_PARAGRAPH) {
      return getRandomParagraphs;
    } else if(req.query.type === TYPE_SENTENCE) {
      return getRandomSentences;
    } else if(req.query.type === TYPE_WORD) {
      return getRandomWords;
    }
  }
    
  return getRandomParagraphs;
}

var getConcatSymbol = function(req) {
  if (req.query.type) {
    if (req.query.type === TYPE_SENTENCE ||
        req.query.type === TYPE_WORD) {
      return ' ';
    }
  }

  return '\n';
};

app.get('/ipsum', function (req, res) {
  var callback = (data) => {
      console.log (data);
      res.end(data.join(getConcatSymbol(req)));
  };

  var randomFunction = getRandomFunction(req);
  if(req.query.count && parseInt(req.query.count) > 1) {
        randomFunction(callback, parseInt(req.query.count));
    } else {
        randomFunction(callback, 1);
    }
});

app.use(express.static('public'));

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});