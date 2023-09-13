require('dotenv').config()
const express = require("express")
const cors = require("cors")
const { MongoClient, ObjectId} = require("mongodb")
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const client = new MongoClient(process.env.CONNECTION_STRING)
const myDB = "myDB"
const PORT = 8080

const connectToDatabase = async () => {
    try{
        await client.connect()
        console.log(`Connected to the ${myDB} database`)
    } catch (err){
        console.error(`Error connecting to the database: ${err}`)
    }
}

connectToDatabase()

initializePassport(
    passport, 
    async (username) => {
        const response = await client.db('myDB').collection('users').findOne({username: username})
        return response
    },
    async (id) => {
        const response = await client.db('myDB').collection('users').findOne({_id: new ObjectId(id)})
        return response}

)


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
let corsOrigin = ''
if (process.env.NODE_ENV === 'production') {
    corsOrigin = 'https://goalaunch.com';
  } else {
    corsOrigin = 'http://localhost:3000';
  }
app.use(cors({origin: corsOrigin, credentials: true}))

app.get('/checkAuth', checkAuthenticated, (req, res)=>{
    res.sendStatus(200)
})

app.post('/login', checkNotAuthenticated, (req, res, next) => {
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
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
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

app.get('/adminData', (req, res) =>{
    res.send('admin data')
})

app.get('/userID', checkAuthenticated, (req, res) => {
    res.send(req.user._id)
})

app.get('/getDates', checkAuthenticated, async(req, res)=>{
    const dates = await client.db('myDB').collection('goals').findOne({goalName: 'Testing'});
    res.send(dates.dateAchievementStatuses[1].fullDate);
})

app.get('/test/:date', async(req, res)=>{
    let date = new Date();
    date.setDate(req.params.date);
    const response = await client.db('myDB').collection('goals').updateOne({goalName: "Testing"}, {
        $push: {
            dateAchievementStatuses: {
                $each: [{fullDate: date, status: 'checked'}],
                $sort: {fullDate: 1}
            }
        }
    })
    res.send(response);
})

app.get('/goalData', checkAuthenticated, async (req, res)=>{
    const data = await client.db('myDB').collection('goals').find({userID: req.user._id}).toArray();
    res.send(data)
})

app.post('/insertGoal', checkAuthenticated, async (req, res)=>{
    const newGoal = req.body.newGoal
    if(newGoal.length > 0){
        const response = await client
            .db(myDB)
            .collection('goals')
            .insertOne({goalName: newGoal,
                        userID: req.user._id,
                        dateAchievementStatuses: [],
                        notes: ""
                    })
        res.send(response)
    }
})

app.post('/editGoal', checkAuthenticated, async (req, res)=>{
    const goalName = req.body.goalName
    const _id = req.body._id
    if(goalName.length > 0){
        await client
            .db(myDB)
            .collection('goals')
            .updateOne({_id: new ObjectId(_id)}, {$set: {goalName: goalName}})
        res.send()
    }
})

app.post('/deleteGoal', checkAuthenticated, async(req, res)=>{
    const _id = req.body._id
    await client
        .db(myDB)
        .collection('goals')
        .deleteOne({_id: new ObjectId(_id)})
    res.send()
})

app.post('/incrementProgress', checkAuthenticated, async(req, res)=>{
    const _id = req.body._id
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, {$inc: {progressPoints: 1}})
    res.send()
})

app.post('/decrementProgress', checkAuthenticated, async(req, res)=>{
    const _id = req.body._id
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, {$inc: {progressPoints: -1}})
    res.send()
})

app.post('/checkDateStatus', checkAuthenticated, async (req, res) => {
    const _id = req.body._id
    const date = new Date(req.body.date)
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, {$push:{
        dateAchievementStatuses: {
            $each: [{fullDate: date, status: 'checked'}],
            $sort: {fullDate: 1}
        }
    }})
    res.sendStatus(200)
})
app.post('/crossDateStatus', checkAuthenticated, async (req, res) => {
    const _id = req.body._id
    const date = new Date(req.body.date)
    await client.db(myDB)
                .collection('goals')
                .updateOne({_id: new ObjectId(_id), "dateAchievementStatuses.fullDate": date}, 
                           {$set:{"dateAchievementStatuses.$.status": 'crossed'}})
    res.send()
})
app.post('/clearDateStatus', checkAuthenticated, async (req, res) => {
    const _id = req.body._id
    const date = new Date(req.body.date);
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, {$pull:{
        dateAchievementStatuses: { fullDate: date}
    }})
    res.send()
})

app.post('/insertStartTime', checkAuthenticated, async (req, res) =>{
    const _id = req.body._id
    const date = req.body.startTime
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, { $set: {startTime: date}})
    res.send()
})

app.post('/insertEndTime', checkAuthenticated, async (req, res) =>{
    const _id = req.body._id
    const date = req.body.endTime
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, { $set: {endTime: date}})
    res.send()
})

app.post('/setNotes', checkAuthenticated, async(req, res) => {
    const _id = req.body._id
    const notes = req.body.notes
    const response = await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, { $set: {notes: notes}})
    res.send()
})

app.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if(err){
            res.sendStatus(500).json({message: 'Error logging out'})
        }
        else{
            res.sendStatus(200)
    }})
})

function shutdown (e){
    console.info(`${e} signal received.`)
    console.log('Shutting down server...')
    server.close(async () => {
        console.log("Closing mongodb client..")
        await client.close()
        console.log("mongodb client closed")
        console.log("Server shutdown successfully")
        process.exit(0)
    })
}

process.on('SIGTERM', (e) => shutdown(e))
process.on('SIGINT', (e) => shutdown(e))
process.on('unhandledRejection', (e)=>shutdown(e))
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.status(401).json({message: "Not authenticated. Log in to perform action"})
    }
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        res.status(401).json({message: "Already logged in. Log out to perform action."})
    }
    else{
        next()
    }
}

const server = app.listen(app.listen(PORT, () => console.log(`Goalaunch app listening on port ${PORT}`)))