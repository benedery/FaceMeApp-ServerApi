const express = require('express');
const app = express();
// hash/bcrypt config
const bcrypt = require('bcrypt');
const saltRounds = 10 // increase this if you want more iterations
const cors = require('cors');

//set controllers
const register = require('./controllers/register.js');
const signin = require('./controllers/signIn.js');
const profile = require('./controllers/profile.js');
const image = require("./controllers/image");

const knex = require('knex')
const db  = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'facemeapp'
    }
});

app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    db.select('*').from('users')
        .then(user => res.json(user))
        .catch(err => res.status(400).res.json('err getting users data'))
})

app.post('/signin', (req,res)=> {signin.login(req,res,db,bcrypt)});
app.post('/register', (req,res) => { register.handleRegister(req,res,db,bcrypt,saltRounds)});
app.get('/profile/:id', (req,res)=> {profile.getProfile(req,res,db)});
app.put('/image', (req,res)=>{image.updateEntries(req,res,db)});
app.post('/imageapi', (req,res)=>{image.handleApiCall(req,res)});

const PORT = process.env.PORT;
app.listen(PORT || 4003, ()=>{
    console.log(`app listen on port ${PORT}`)
})


