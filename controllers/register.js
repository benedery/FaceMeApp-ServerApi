const handleRegister = (req,res, db, bcrypt, saltRounds) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
       return res.status(400).json('all fields must be fulfilled')
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash,
            email
        }).into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(userRegister => {
                        res.json(userRegister[0])
                    })
            }).then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'))
};

module.exports = {
    handleRegister:handleRegister
};