const {MongoClient, ObjectId} = require("mongodb")
const client = new MongoClient(process.env.CONNECTION_STRING)
const myDB = "myDB"

const connectToDatabase = async () => {
    try{
        await client.connect()
        console.log(`Connected to the ${myDB} database`)
    } catch (err){
        console.error(`Error connecting to the database: ${err}`)
    }
}

module.exports = {
    client: client,
    myDB: myDB,
    connectToDatabase: connectToDatabase
}