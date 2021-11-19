import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// allow cross-origin resource sharing (CORS)
app.use(cors());

// init the data store
db.data = db.data || { users: [] }

//serve static files from public directory
app.use(express.static('public'));

// data parser - used to parse post data
import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

// return all users
app.get('/data', function(req, res) {
    res.send(db.data.users);
});

// post route
app.post('/test', function(req, res){
    console.log(req.body.username, req.body.password);
    res.send(req.body.username + " " + req.body.password);
})

// add user
app.post('/add', function(req, res){
    var user = {
        'name' : req.body.name,
        'dob' : req.body.dob,
        'email' : req.body.email,
        'username' : req.body.username,
        'password' : req.body.password,
        'phone' : req.body.phone,
        'streetaddress' : req.body.streetaddress,
        'citystatezip' : req.body.citystatezip,
        'latitude' : req.body.latitude,
        'longitude' : req.body.longitude,
        'avatar' : req.body.avatar
    }
    db.data.users.push(user);
    console.log(db.data.users);
    db.write();
    res.send(db.data.users);
})

//start server
app.listen(port, function() {
    console.log(`Running on port ${port}!`);
});
