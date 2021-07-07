const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
let users = [];
let messages = [];
let index = 0;

io.on("connection", (socket) => {
    socket.emit("loggedIn", {
        users: users.map((s) => s.username),
        messages: messages,
    });

    // new user
    socket.on("newuser", (username) => {
        console.log(`${username} has joined`);
        socket.username = username;
        users.push(socket);

        io.emit("userOnline", socket.username);
    });

    socket.on("msg", (msg) => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg,
        };

        messages.push(message);
        io.emit("msg", message);
        index++;
    });

    // dis
    socket.on("disconnect", () => {
        console.log(`${socket.username} has disconnected.`);
        io.emit("userleft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
});
http.listen(3000, () => {
    console.log("listening on port", 3000);
});
