const handleRegister = (req, res, knex, bcrypt, saltRounds) => {
    const { name, email , password } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json('Invalid input');
    }
    //HASHING
    const hash = bcrypt.hashSync(password, saltRounds);
    //async
    // bcrypt.genSalt(saltRounds, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //         console.log(hash);
    //     });
    // });

    //since we need to update multiple tables
    //we will use transaction block
    //where all the operations must be successful to proceed
    //this make sures there are no inconsistencies within relations
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>
            trx('users')
                .returning('*') //to show the table
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => res.json(user[0])
                )
                .catch(err => res.status(400).json('Request Failed Try Again!'))
        )
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(500).json(err));   
    
}

module.exports = { handleRegister };