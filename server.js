const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //is a hashing package for secure storage of passwords
const cors = require('cors'); //to allow communication between frontend and backend

const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/signin');
const { getProfile } = require('./controllers/profile');
const { updateEntries, fetchAPIData } = require('./controllers/image');

//to connect with the database
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'p0stGre@Sql',
      database : 'smart_brain'
    }
});

const app = express();

//for hashing
const saltRounds = 10;

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

//API-ENDPOINTS
app.get('/', (req,res) => {
    res.json('Server is running');
});

app.options('/signin', cors());
app.post('/signin', cors(), (req, res) => { handleSignIn(
        req,
        res,
        knex,
        bcrypt
    )
});

app.options('/register', cors());
app.post('/register', cors(), (req, res) => { handleRegister(
        req,
        res,
        knex,
        bcrypt,
        saltRounds
    )
});

app.get('/profile/:id', (req, res) => { getProfile(
        req,
        res,
        knex
    )
});

app.post('/detect', (req, res) => { fetchAPIData(req, res) });

app.put('/image', (req, res) => { updateEntries(
        req,
        res,
        knex
    )
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

//IMPORTANT: FIRST PLAN OUT BEFORE CODING THE API
/*
    /--> res = get is working
    /singin --> POST res = success / fail
    /register --> POST res = user
    /profile/:userId --> GET res = user
    /image --> PUT res = user
*/