const express = require('express')

const PORT = 3000
const app = express()
const {mongoose} = require('./db/mongoose')
const bodyParser = require('body-parser')

const {List, Task} = require('./db/models/index')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.use(bodyParser.json())

// Lists
app.get('/lists', (req, res) => {
    List.find({}).then((lists) => {
        res.send(lists)
    })
})

app.post('/lists', (req, res) => {
    let title = req.body.title
    let newList = new List({
        title,
    })
    newList.save().then(listDoc => {
        res.send(listDoc)
    })
})

app.patch('/lists/:id', (req, res) => {
    List.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body,
    }).then(() => {
        res.sendStatus(200)
    })
})

app.delete('/lists/:id', (req, res) => {
    List.findOneAndRemove({_id: req.params.id}).then(removedListDocument => {
        res.send(removedListDocument)
    })
})

// Tasks
app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({
        _listId: req.params.listId,
    }).then(tasks => {
        res.send(tasks)
    })
})
app.post('/lists/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId,
    })
    newTask.save().then(newTaskDocument => {
        res.send(newTaskDocument)
    })
})

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId,
    }, {
        $set: req.body,
    }).then(() => {
        res.send({message: 'Updated successfully.'})
    })
})

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId,
    }).then(removedTaskDocument => {
        res.send(removedTaskDocument)
    })
})

app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId,
    }).then(task => {
        res.send(task)
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})
