var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3004);

var mangUsers = [];

io.on("connection", function (socket) {
  console.log("Co nguoi ket noi " + socket.id);

  socket.on("client-send-Username", function (data) {
    if (mangUsers.indexOf(data) >= 0) {
      socket.emit("server-send-dki-thatbai");
    } else {
      mangUsers.push(data);
      socket.Username = data;
      socket.emit("server-send-dki-thanhcong", data);
      io.sockets.emit("server-send-danhsach-Users", mangUsers);
    }
  });

  socket.on("logout", function () {
    mangUsers.splice(
      mangUsers.indexOf(socket.Username), 1
    );
    socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
  });

  socket.on("user-send-message", function (data) {
    io.sockets.emit("server-send-mesage", { un: socket.Username, nd: data });
  });

  socket.on("toi-dang-go-chu", function () {
    var s = "<b>"+socket.Username + "</b> đang nhập nội dung";
    // io.sockets.emit("ai-do-dang-go-chu", s);
    socket.broadcast.emit("ai-do-dang-go-chu", s);
  });

  socket.on("toi-stop-go-chu", function () {
    io.sockets.emit("ai-do-STOP-go-chu");
  });

  socket.on('disconnect', function () {
    console.log('Got disconnect!');
    mangUsers.splice(
      mangUsers.indexOf(socket.Username), 1
    );
    io.sockets.emit("ai-do-STOP-go-chu");
    socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
  });

});

app.get("/", function (req, res) {
  res.render("trangchu");
});
