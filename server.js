const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //is a hashing package for secure storage of passwords //to allow communication between frontend and backend
const cors = require('cors');

const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/signin');
const { getProfile } = require('./controllers/profile');
const { updateEntries, fetchAPIData } = require('./controllers/image');

//to connect with the database
const knex = require('knex')({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true,
    }
});

const app = express();

//for hashing
const saltRounds = 10;

//MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());

//API-ENDPOINTS
app.get('/', (req,res) => {
    res.json('Server is running');
});

app.post('/signin',(req, res) => { handleSignIn(
        req,
        res,
        knex,
        bcrypt
    )
});

app.post('/register', (req, res) => { handleRegister(
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