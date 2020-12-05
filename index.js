const express = require('express')
const app = express()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guqdp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // root
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    const userReview = client.db("MovieDatabase").collection("user-review");
    const addNewUser = client.db("MovieDatabase").collection("signup-info");
    const addToFavourites = client.db("MovieDatabase").collection("favorite-movie");

    // add review
    app.post("/userreview", (req, res) => {
        const review = req.body;
        userReview.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result);
            })
    })

    // add newuser
    app.post("/addNewUser", (req, res) => {
        const user = req.body;
        addNewUser.insertOne(user)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // add To Favourites
    app.post("/favoritelist", (req, res) => {
        const favList = req.body;
        addToFavourites.insertOne(favList)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // // query 
    app.get('/getuserinfo', (req, res) => {
        addNewUser.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // get orderinfo
    app.get('/customersorderinfo', (req, res) => {
        addNewUser.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // get review
    app.get('/getreviewdata', (req, res) => {
        userReview.find({ title: req.query.title })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // get loggedin user review data
    app.get('/getrateddata', (req, res) => {
        userReview.find({ username: req.query.username })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // get favoritelist
    app.get('/getfavlist', (req, res) => {
        addToFavourites.find({ username: req.query.username })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


});

app.listen(process.env.PORT || port)