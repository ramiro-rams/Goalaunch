const express = require('express')
const router = express.Router()
const {ObjectId} = require("mongodb")
const {checkAuthenticated} = require('./authMiddleware')
const {client, myDB} = require('../databaseSetup')

router.get('/goalData', checkAuthenticated, async (req, res)=>{
    try{
        const data = await client.db('myDB').collection('goals').find({userID: req.user._id}).toArray();
        res.send(data)
    }catch(e){
        res.sendStatus(503).json({error: "Database operaton failed"})
    }
})

router.post('/insertGoal', checkAuthenticated, async (req, res)=>{
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

router.post('/editGoal', checkAuthenticated, async (req, res)=>{
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

router.post('/deleteGoal', checkAuthenticated, async(req, res)=>{
    const _id = req.body._id
    await client
        .db(myDB)
        .collection('goals')
        .deleteOne({_id: new ObjectId(_id)})
    res.send()
})

router.post('/incrementProgress', checkAuthenticated, async(req, res)=>{
    const _id = req.body._id
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, {$inc: {progressPoints: 1}})
    res.send()
})

router.post('/decrementProgress', checkAuthenticated, async(req, res)=>{
    const _id = req.body._id
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, {$inc: {progressPoints: -1}})
    res.send()
})

router.post('/checkDateStatus', checkAuthenticated, async (req, res) => {
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
router.post('/crossDateStatus', checkAuthenticated, async (req, res) => {
    const _id = req.body._id
    const date = new Date(req.body.date)
    await client.db(myDB)
                .collection('goals')
                .updateOne({_id: new ObjectId(_id), "dateAchievementStatuses.fullDate": date}, 
                           {$set:{"dateAchievementStatuses.$.status": 'crossed'}})
    res.send()
})
router.post('/clearDateStatus', checkAuthenticated, async (req, res) => {
    const _id = req.body._id
    const date = new Date(req.body.date);
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, {$pull:{
        dateAchievementStatuses: { fullDate: date}
    }})
    res.send()
})

router.post('/insertStartTime', checkAuthenticated, async (req, res) =>{
    const _id = req.body._id
    const date = req.body.startTime
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, { $set: {startTime: date}})
    res.send()
})

router.post('/insertEndTime', checkAuthenticated, async (req, res) =>{
    const _id = req.body._id
    const date = req.body.endTime
    await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, { $set: {endTime: date}})
    res.send()
})

router.post('/setNotes', checkAuthenticated, async(req, res) => {
    const _id = req.body._id
    const notes = req.body.notes
    const response = await client.db(myDB).collection('goals').updateOne({_id: new ObjectId(_id)}, { $set: {notes: notes}})
    res.send()
})

module.exports = router