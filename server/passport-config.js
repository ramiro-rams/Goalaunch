const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username)
        if (user == null) {
            return done(null, false, {message: 'No user with that email'})
        }
        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
                return(done(null, false, {message: 'password incorrect'}))
            }
        } catch(e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id))
    })
}

module.exports = initialize