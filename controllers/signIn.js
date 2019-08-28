const login = (req,res,db,bcrypt)=>{
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('all fields must be fulfilled')
    }
    db.select('hash').from('login').where({email}).then(
        data=> {
            const loginSuccess = bcrypt.compareSync(password, data[0].hash);
            if(loginSuccess){
                db.select('*').from('users').where({email}).then(
                    user => res.json(user[0])
                )}
            else {
                res.status(400).json('login failure')
            }
        }
    ).catch(err => res.status(400).json('problem with data provided'))
}

module.exports = {
    login:login
}