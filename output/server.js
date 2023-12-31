"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./Routes/auth.router"));
const pages_router_1 = __importDefault(require("./Routes/pages.router"));
const user_router_1 = __importDefault(require("./Routes/user.router"));
const notifications_router_1 = __importDefault(require("./Routes/notifications.router"));
const secrets_1 = __importDefault(require("./utils/secrets"));
const notifications_controller_1 = __importDefault(require("./Controllers/notifications.controller"));
try {
    const app = (0, express_1.default)();
    var whitelist = [
        String(secrets_1.default.clientURL_1),
        String(secrets_1.default.clientURL_2),
        "http://localhost:3000",
    ];
    //Do not delete the following commented lines, keep this to know what headers are to be set
    //app.use((req, res, next) => {
    //    res.set('Access-Control-Allow-Origin', clientURL);
    //    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //    res.set('Access-Control-Allow-Headers', 'Content-Type');
    //    res.set('Access-Control-Allow-Credentials', true);
    //    next();
    //})
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(String(origin)) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "DELETE", "POST"],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["set-cookie"],
    };
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.get("/", (req, res) => res.render("index.pug"));
    app.engine('pug', require('pug').__express);
    app.use(express_1.default.static("public"));
    app.use(pages_router_1.default);
    app.use(user_router_1.default);
    app.use(auth_router_1.default);
    app.use(express_1.default.json());
    app.use(notifications_router_1.default);
    app.options("*", (0, cors_1.default)(corsOptions));
    app.use((0, cors_1.default)(corsOptions));
    app.listen(secrets_1.default.serverPort, () => {
        console.log(`Server live on port: ${secrets_1.default.serverPort}`);
    });
    setInterval(notifications_controller_1.default, 5000);
    const formatMemoryUsage = (data) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
    const memoryData = process.memoryUsage();
    const memoryUsage = {
        rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
        heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
        heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
        external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
    };
    console.log(memoryUsage);
}
catch (error) {
    console.log(error);
}
