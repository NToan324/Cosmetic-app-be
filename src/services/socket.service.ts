import { Server, Socket } from "socket.io";
class SocketService {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
  }

  public init() {
    this.io.on("connection", (socket: Socket) => {
      console.log("[Socket] A user connected");
      this.getMessages(socket);
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }

  private getMessages(socket: Socket) {
    socket.on("message", (message) => {
      console.log("[Socket] Message: ", message);
      this.io.emit("message", message);
    });
  }
}

export default SocketService;
