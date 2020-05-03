const formatMessage = require("./utils/messages");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set Static folder
app.use(express.static(path.join(__dirname, "public")));

//Run when client connects
io.on("connection", (socket) => {
  const botname = "ChatCord Bot";

  //Welcome user
  socket.emit("message", formatMessage(botname, "Welcome to ChatCord!!"));

  //Broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botname, " has joined the chat")
  );

  //Run when the clients disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botname, " has left the chat "));
  });

  //Listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server runnning on port ${PORT}`));
