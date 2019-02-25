const User = require('../models/user')
const jwt = require('jsonwebtoken')
process.env.SECRET_KEY = 'secret'
const user = async function (req)  {
    return User.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    })
        .then(user => {
            if (user) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                req.session.loggedin = true;
                req.session.username = req.body.email;
                // res.redirect('/users/home');
                // res.end();
               
                return "{ token:"+token +"}"
                console.log(token);
            } else {
                return 'User does not exist'
            }
        })
        .catch(err => {
            return 'error: ' + err
        })
};
module.exports = { user }