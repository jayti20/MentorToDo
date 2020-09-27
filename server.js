const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
let Todo = require('./todo.model');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Jayti:Password20$@cluster0.3abx0.mongodb.net/todos?retryWrites=true&w=majority', { useNewUrlParser: true });
const connection = mongoose.connection;

// Once the connection is established, callback
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

todoRoutes.route('/').get((req, res) => {
    Todo.find((err, todos) => {
        if (err)
            console.log(err);
        else {
            res.json(todos);
            console.log(todos)
        }
    });
});

todoRoutes.route('/:id').get((req, res) => {
    const id = req.params.id;
    Todo.findById(id, (err, todo) => {
        res.json(todo);
    });
});

todoRoutes.route('/add').post((req, res) => {
    const todo = new Todo(req.body);
    console.log("Todos-> ", todo)
    todo.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/update/:id').post((req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (!todo)
            res.status(404).send('Data is not found');
        else {
            console.log("Server Todo Updated-> ", req.body)
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_tasks = req.body.todo_tasks

            todo.save().then(todo => {
                res.json('Todo updated');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    });
});
todoRoutes.route('/delete/:id').delete((req, res) => {
    Todo.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send('Data was deleted');
    })
})
app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
