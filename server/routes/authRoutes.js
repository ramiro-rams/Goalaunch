const router = require('express').Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const {checkAuthenticated, checkNotAuthenticated} = require('./authMiddleware')

router.get('/checkAuth', checkAuthenticated, (req, res)=>{
    res.sendStatus(200)
})

router.post('/login', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'Authentication successful' });
      });
    })(req, res, next);
  }); 

  router.post('/register', checkNotAuthenticated, async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    function isUsernameValid(username){
        const validCharacters = /^[a-z0-9.]+$/
        const maxUsernameLength = 30
        if(username.length <= maxUsernameLength && username.length > 0 && validCharacters.test(username))
            return true
        else
            return false
    }
    function isPasswordValid(password) {
        if (password.length < 8) {
          return false;
        }
        // Check for at least three of the following character types
        let charTypes = 0
        // Uppercase letters
        if (/[A-Z]/.test(password)) {
          charTypes++
        }
        // Lowercase letters
        if (/[a-z]/.test(password)) {
          charTypes++
        }
        // Numbers
        if (/\d/.test(password)) {
          charTypes++
        }
        // Special symbols (you can customize this character class)
        if (/[\W_]/.test(password)) {
          charTypes++
        }
        return charTypes >= 3;
      }
    if(isUsernameValid(username)){
        const response = await client.db('myDB').collection('users').findOne({username: username})
        if(!response){
            if(isPasswordValid(password)){
                try{
                    const hashedPassword = await bcrypt.hash(password, 10)
                    const response = await client.db(myDB).collection('users').insertOne({username: username, password: hashedPassword})
                    res.status(201).json({message: 'Registration successful'})
                }catch{
                    res.status(500).json({error: 'Internal server error'})
                }
            }
            else{
                res.status(400).json({error: 'InvalidPassword', message: "The password must be at least 8 characters long and contain at least three of the following character types: uppercase letters, lowercase letters, numbers, and special symbols."})
            }
            
        }
        else{
            res.status(409).json({error: 'UsernameTaken', message: "Username is already taken"})
        }
    }
    else{
        res.status(400).json({error: 'InvalidUsername', message: 'The username must be between 1 and 30 characters long and can contain lowercase letters, digits, and periods'})
    }
})

router.delete('/logout', (req, res) => {
  req.logOut((err) => {
      if(err){
          res.sendStatus(500).json({message: 'Error logging out'})
      }
      else{
          res.sendStatus(200)
  }})
})

module.exports = router