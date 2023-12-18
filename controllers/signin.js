const handleSignIn = (req, res, knex, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Invalid input');
    }
    // LOAD hash from your password DB.
    //async
    // bcrypt.compare('apples', hash, function(err, result) {
    //     console.log('first guess ', result);
    // });
    // bcrypt.compare('abc', hash, function(err, result) {
    //     console.log('second guess ', result);
    // });
    knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if(isValid){
                return knex.select('*').from('users')
                            .where('email', '=', email)
                            .then(user => res.json(user))
                            .catch(err => res.status(400).json('Unable to get the user'));
            }else {
                res.status(400).json('Wrong Credentials, Try again!');
            }
        })
        .catch(err => res.status(400).json('Ooops! Something Went Wrong'));
    //to access body we need to use the middleware 
    //body-parser
}

module.exports = { handleSignIn };