const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./src/routes/todoRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
const port = 5000;

app.use(bodyParser.json());
app.use('/api', todoRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});