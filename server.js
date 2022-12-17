const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { orgin: "*" } });
app.set("view engine", "ejs");
server.listen(3001);
app.get("/", (req, res) => {
  console.log("server start");
  res.render("home");
});
io.on("connection", (socket) => {
  console.log("user connected:" + socket.id);
  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });
});
