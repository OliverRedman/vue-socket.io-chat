<template>
    <div id="app">
        <header>
            <h1>Socket.io chat</h1>
            <p class="username">Username: {{ username }}</p>
            <p class="online">Online: {{ users.length }}</p>
        </header>
        <ChatRoom v-bind:messages="messages" @sendMessage="this.sendMessage" />
    </div>
</template>

<script>
import io from "socket.io-client";
import ChatRoom from "./components/chatRoom.vue";
export default {
    components: {
        ChatRoom,
    },
    data() {
        return {
            username: "",
            socket: io("http://localhost:3000"),
            messages: [],
            users: [],
        };
    },
    methods: {
        joinServer() {
            this.socket.on("loggedIn", (data) => {
                this.messages = data.messages;
                this.users = data.users;
                this.socket.emit("newuser", this.username);
            });
            this.listen();
        },
        listen() {
            this.socket.on("userOnline", (user) => {
                this.users.push(user);
            });
            this.socket.on("userleft", (user) => {
                this.users.splice(this.users.indexOf(user), 1);
            });
            this.socket.on("msg", (message) => {
                this.messages.push(message);
            });
        },
        sendMessage(message) {
            this.socket.emit("msg", message);
        },
    },
    mounted: function() {
        this.username = prompt("What is your name?", "Anon");
        if (!this.username) {
            this.username = "Anon";
        }
        this.joinServer();
    },
};
</script>

<style>
body {
    font-family: "Avenir", Helvetica, sans-serif;
    color: #2c3e50;
    margin: 0;
    padding: 0;
}

#app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    max-width: 768px;
    margin: 0 auto;
}
</style>
