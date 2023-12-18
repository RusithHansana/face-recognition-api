const getProfile = (req, res, knex) => {
    const { id } = req.params;

    knex('users').where('id', id)
        .then(user => user.length? res.json(user)
                    : res.status(404).json('User not found'))
        .catch(err => res.status(404).json('Something Went Wrong. Try Again!'));

}

module.exports = { getProfile };