const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'demo';
var cors = require('cors');
app.use(express.json());

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname })
});


app.get('/user', (req, res) => {
    let {limit = 0, skip = 0, search = ''} = req.query;
   let searchKey  = search === '' ?  {} : {name:{$regex :new RegExp(search, 'i') }};
    
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
            findDocuments(db, function (docs) {
                res.send(docs);
            });
    });

    const findDocuments = function (db, callback) {
        const collection = db.collection('userDataCollection');
        collection.find(searchKey).skip(parseInt(skip)).limit(parseInt(limit)).toArray( (err, docs) => {
            assert.equal(err, null);
            collection.find(searchKey).count().then((count) => {
                callback({docs, count});
            });
        });
    }
});

app.post('/user', (req, res) => {

    const {body} = req;
    
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
            addData(db, function (docs) {
                res.send(docs);
            });
    });

    const addData = function (db, callback) {
        const collection = db.collection('userDataCollection');
        collection.insertOne(body, function (err, result) {
            console.log("Inserted 1 document into the collection");
            callback(result);
        });
    }
});

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Listening on port ${port}....`));