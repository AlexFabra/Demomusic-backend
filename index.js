const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const { socketController } = require('./sockets/socketController');
const io = require('socket.io')(this);

//create express server:
const app = express();
//cors:
app.use(cors());

//production frontend route:
//app.use(express.static('public'));

//read and parse body:
app.use(express.json());

//initialize db:
dbConnection();

//Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/search', require('./routes/searches'));
app.use('/api/upload', require('./routes/uploads'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

//listen port:
app.listen(process.env.PORT, () => {
    console.log('listening port ' + process.env.PORT)
})

io.on('connection', (socket) => socketController(socket, this.io));

