const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

// CONEXÃO COM O BANCO DE DADOS
mongoose.connect("mongodb+srv://rocketseat:rocketseat@clusterx-nlrev.mongodb.net/oministack9?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connectedUsers = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
})

// GET, POST, PUT, DELETE

// req.query = Acessar query params (para filtros)
// req.params = Acessar route params (para edição, delete)
// req.body = Acessar corpo da requisição (para criação, edição)

app.use(cors());
// HABILITA O JSON NO SERVIDOR
app.use(express.json());
// CAMINHO PARA OS ARQUIVOS
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
// ROTAS DAS FUNÇÕES DO SERVIDOR
app.use(routes);
// PORTA DE SERVIÇO DO SERVIDOR 
app.listen(3333);
