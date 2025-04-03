import { Server } from "socket.io";

class SocketInstance {
  private static io: Server;

  public static init(io: Server) {
    this.io = io;
  }

  public static getIO(): Server {
    if (!this.io) {
      throw new Error("Socket.io not initialized");
    }
    return this.io;
  }
}

export default SocketInstance;
