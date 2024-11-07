const db = require('../config/database');

const Todo = {
    getAll: (calback) => {
        db.query('SELECT * FROM todos', calback);
    },

    create: (title, description, dueDate, callback) => {
        db.query('INSERT INTO todos (title, description, dueDate) VALUES (?, ?, ?)', [title, description, dueDate], callback);
    },

    update: (id, title, description, dueDate, completed, callback) => {
        db.query('UPDATE todos SET title = ?, description = ?, dueDate = ?, completed = ? WHERE id = ?', [title, description, dueDate, completed, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM todos WHERE id = ?', [id], callback);
    }
}

module.exports = Todo;