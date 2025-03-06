"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const directory = "docs";
const filePath = path_1.default.join(__dirname, "../", directory);
const server = http_1.default.createServer((req, res) => {
    const { method } = req;
    const parsedUrl = url_1.default.parse(req.url || '', true);
    const { pathname, query } = parsedUrl;
    const fileName = query.filename;
    // Home
    if (pathname === "/" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello from my server!");
        return;
    }
    // Read file
    if (pathname === "/read" && method === "GET") {
        fs_1.default.readFile(`${filePath}/${fileName}`, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading file!");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data); // Send text content
        });
        return;
    }
    // Create file
    if (pathname === "/create" && method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            fs_1.default.writeFile(`${filePath}/${fileName}`, body, err => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error creating file");
                    return;
                }
                res.writeHead(201, { "Content-Type": "text/plain" });
                res.end("File created successfully!");
            });
        });
        return;
    }
    // Delete file
    if (pathname === "/delete" && method === "DELETE") {
        fs_1.default.unlink(`${filePath}/${fileName}`, err => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error deleting file...");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Successfully deleted file");
        });
        return;
    }
    // Logger
    if (pathname === "/log") {
        fs_1.default.appendFile(filePath + "/log.txt", `${new Date()}\r\n`, err => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error updating file");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Successfully updated log file!");
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
