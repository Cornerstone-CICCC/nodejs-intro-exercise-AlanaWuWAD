"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const dotenv_1 = __importDefault(require("dotenv"));
const fileFunc_1 = require("./lib/fileFunc");
dotenv_1.default.config();
const server = http_1.default.createServer((req, res) => {
    const { method } = req;
    // Allow CORS policy headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Pre-flight check
    if (method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    const parsedUrl = url_1.default.parse(req.url || '', true);
    const { pathname, query } = parsedUrl;
    const fileName = query.filename;
    // Home
    if (pathname === "/" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello from my server!");
        return;
    }
    // Get list of files
    if (pathname === "/list" && method === "GET") {
        (0, fileFunc_1.listFiles)().then(data => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));
        }).catch(err => {
            console.error(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Something went wrong...");
        });
        return;
    }
    // Read file
    if (pathname === "/read" && fileName && method === "GET") {
        (0, fileFunc_1.readAFile)(fileName).then(data => {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data);
        }).catch(err => {
            console.error(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Something went wrong...");
        });
        return;
    }
    // Create file
    if (pathname === "/" && method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            const { filename, fileContent } = JSON.parse(body);
            const success = yield (0, fileFunc_1.createFile)(filename, fileContent);
            if (!success) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error creating file");
                return;
            }
            res.writeHead(201, { "Content-Type": "text/plain" });
            res.end("Successfully created file!");
        }));
        return;
    }
    // Delete file
    if (pathname === "/" && fileName && method === "DELETE") {
        (0, fileFunc_1.deleteAFile)(fileName).then(data => {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("File deleted successfully...");
        }).catch(err => {
            console.error(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error deleting file...");
        });
        return;
    }
    // 404 Fallback
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found!");
    return;
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
