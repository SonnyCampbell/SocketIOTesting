import Game from './Game/Game'
import Player from './Game/ServerPlayer'
import GameConnection from './Game/GameConnection'

var path = require('path');

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, './client')));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, './client/index.html'));
});

let conn = new GameConnection(io);
let players = {};

io.on('connection', (socket) => {
    console.log('User ' + socket.id + ' connected to server.');

    socket.on('JoinRoom', function(username, roomName){
        conn.JoinRoom(socket, username,roomName);
    });

    socket.on('StartGame', function(){
        conn.StartGame(socket);
    });

    socket.on('DealHands', function(numOfCards){
        console.log('Dealing Hands');
        conn.DealHands(socket, numOfCards);
    });

    socket.on('ShuffleDeck', function() {
        conn.ShuffleDeck(socket);
    });

    socket.on('DealCard', function() {
        console.log('deal card server side received');
        conn.DealCard(socket);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});