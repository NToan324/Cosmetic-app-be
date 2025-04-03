"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const index_1 = __importDefault(require("./routers/index"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const socket_service_1 = __importDefault(require("./services/socket.service"));
const socket_instance_1 = __importDefault(require("./services/socket.instance"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173/portfolio", "http://localhost:5173"],
        methods: ["GET", "POST", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});
const port = process.env.NODE_ENV === "development"
    ? process.env.DEV_PORT || 5000
    : process.env.PROD_PORT || 8080;
//Security
app.use((0, helmet_1.default)());
//Socket
const socketService = new socket_service_1.default(io);
socket_instance_1.default.init(io);
socketService.init();
//Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
//connect database
(0, mongodb_1.default)();
//import routes
app.use(index_1.default);
//handler error
app.use(errorHandler_1.default.notFoundError);
app.use(errorHandler_1.default.globalError);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});
