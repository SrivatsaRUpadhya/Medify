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
const mysql = __importStar(require("mysql2"));
const secrets_1 = __importDefault(require("./secrets"));
let db;
if (secrets_1.default.db_url) {
    db = mysql.createPool(secrets_1.default.db_url);
    db.query("SELECT 1", (err, rows) => {
        if (err) {
            console.error("Failed to connect to database");
            process.exit(1);
        }
        console.log("Connected to database");
    });
}
else {
    db = mysql.createPool({
        host: secrets_1.default.host,
        user: secrets_1.default.user,
        database: secrets_1.default.database,
        password: secrets_1.default.password,
        port: parseInt(secrets_1.default.port || "3306"),
    });
}
exports.default = db;
