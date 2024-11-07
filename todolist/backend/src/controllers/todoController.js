const Todo = require('../models/todo');

exports.getAllTodos = (req, res) => {
    Todo.getAll((err, results) => {
        if (err) {
            console.error('Error fetching todos:', err);
            return res.status(500).json({ error: 'Failed to fetch todos' });
        }
        res.status(200).json(results);
    });
};

exports.createTodo = (req, res) => {
    const { title, description, dueDate } = req.body;
    if (!title || !description || !dueDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    Todo.create(title, description, dueDate, (err, result) => {
        if (err) {
            console.error('Error creating todo:', err);
            return res.status(500).json({ error: 'Failed to create todo' });
        }
        res.status(201).json({
            id: result.insertId,
            title,
            description,
            dueDate,
            completed: 0
        });
    });
};

exports.updateTodo = (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    if (!title || !description || !dueDate || completed === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    Todo.update(id, title, description, dueDate, completed, (err, result) => {
        if (err) {
            console.error('Error updating todo:', err);
            return res.status(500).json({ error: 'Failed to update todo' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({
            id: parseInt(id),
            title,
            description,
            dueDate,
            completed
        });
    });
};

exports.deleteTodo = (req, res) => {
    const { id } = req.params;
    Todo.delete(id, (err, result) => {
        if (err) {
            console.error('Error deleting todo:', err);
            return res.status(500).json({ error: 'Failed to delete todo' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    });
};
