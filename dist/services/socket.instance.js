"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketInstance {
    static io;
    static init(io) {
        this.io = io;
    }
    static getIO() {
        if (!this.io) {
            throw new Error("Socket.io not initialized");
        }
        return this.io;
    }
}
exports.default = SocketInstance;
