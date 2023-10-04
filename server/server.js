require('dotenv').config()
const express = require("express")
const cors = require("cors")
const {ObjectId} = require("mongodb")
const passport = require('passport')
const initializePassport = require('./passport-config')
const session = require('express-session')
const goalsRoutes = require('./routes/goalsRoutes')
const authRoutes = require('./routes/authRoutes')
const {client, connectToDatabase} = require('./databaseSetup')
const PORT = 8080

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
let corsOrigin = ''
if (process.env.NODE_ENV === 'production') {
    corsOrigin = 'http://13.52.102.2';
  } else {
    corsOrigin = 'http://localhost:3000';
  }
app.use(cors({origin: corsOrigin, credentials: true}))
app.use('/api/auth', authRoutes)
app.use('/api/goals', goalsRoutes)

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

const server = app.listen(app.listen(PORT, () => console.log(`Goalaunch app listening on port ${PORT}`)))
