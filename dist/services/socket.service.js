"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketService {
    io;
    constructor(io) {
        this.io = io;
    }
    init() {
        this.io.on("connection", (socket) => {
            console.log("[Socket] A user connected");
            this.getMessages(socket);
            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
        });
    }
    getMessages(socket) {
        socket.on("message", (message) => {
            console.log("[Socket] Message: ", message);
            this.io.emit("message", message);
        });
    }
}
exports.default = SocketService;
