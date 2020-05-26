var socket = io("https://qt-webchat.herokuapp.com/");
var currentUser = "";

socket.on("server-send-dki-thatbai", function () {
  alert("Sai Username (co nguoi da dang ki roi!!!)");
});

socket.on("server-send-danhsach-Users", function (data) {
  $("#boxContent").html("");
  let temp = data;
  temp.reverse();
  temp.forEach(function (i) {
    $("#boxContent").append("<div class='user'>" + i + "</div>");
  });
});

socket.on("server-send-dki-thanhcong", function (data) {
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
  currentUser = data;
});

socket.on("server-send-mesage", function (data) {
  $("#listMessages").append("<div class='ms'><b>" + data.un + "</b>:" + data.nd + "</div>");
});

socket.on("ai-do-dang-go-chu", function (data) {
  $("#thongbao").html("<img width='20px' src='typing05.gif'> " + data);
});

socket.on("ai-do-STOP-go-chu", function () {
  $("#thongbao").html("");
});


$(document).ready(function () {
  $("#loginForm").show();
  $("#chatForm").hide();

  $("#txtMessage").keypress(function () {
    socket.emit("toi-dang-go-chu");
  })

  $("#txtMessage").focusout(function () {
    socket.emit("toi-stop-go-chu");
  })

  // $("#btnRegister").click(function(){
  //   socket.emit("client-send-Username", $("#txtUsername").val());
  // });
  $("#formLogin").submit(function (e) {
    socket.emit("client-send-Username", $("#txtUsername").val());
    e.preventDefault();

  })

  $("#btnLogout").click(function () {
    socket.emit("logout");
    $("#chatForm").hide(2000);
    $("#loginForm").show(1000);
  });

  // $("#btnSendMessage").click(function(){
  //   socket.emit("user-send-message", $("#txtMessage").val());
  // });
  $("#formChat").submit(function (e) {
    e.preventDefault();
    socket.emit("user-send-message", $("#txtMessage").val());
    socket.emit("toi-stop-go-chu");
    $("#txtMessage").val("");
    // $("#txtMessage").blur();
  });


});
