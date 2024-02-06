const express = require('express')
const bodyParser = require('body-parser')
const {connectToDb, getDb} = require('./dbConnection.cjs')
const app = express()
const {ObjectId} = require('mongodb')
app.use(bodyParser.json())
let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else {
        app.listen(8000)
        db = getDb()
        console.log('Listening on port 8000...')
    }
})
app.post('/add-entry',(request,response) => {
    db.collection('ExpensesData').insertOne(request.body).then(() => {
        response.status(201).json({
            "status":"Entry added successfully"
        })
    }).catch(() => {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})

app.get('/get-data',(request,response) => {
    let entries = []
    db.collection('ExpensesData')
    .find()
    .forEach(entry => entries.push(entry))
    .then(() => {
    response.status(200).json(entries)
   
}).catch(() => {
    response.status(500).json({
        "status" : "Could not fetch documents"
    })
})
})

app.delete('/delete-data',(request,response) =>
{
    if(ObjectId.isValid(request.query.id)){
    db.collection('ExpensesData').deleteOne({
        _id : new ObjectId(request.query.id)})
    .then(() => {
    response.status(200).json({
        "status" : "Deleted successfully"
    }).catch(() =>
    {
        response.status(500).json({
            "status" : "Error in deletion"
        })
    })
})}
    else{
        response.json({
            "status" : "Not a validID"
        })
    }
})
app.patch('/update-data/:id',(request,response) => {
    if(ObjectId.isValid(request.params.id)){
    db.collection("ExpensesData").updateOne(
        {_id : new ObjectId(request.params.id)},
        {$set : request.body}
    ).then(() => {
        response.json({
            "status":"updated successfull"
        })
    }).catch(() => {
        response.json({
            "status":"updated not successfull" 
        })
    })
}else{
    response.json({
        "status" : "not a valid"
    })
}})