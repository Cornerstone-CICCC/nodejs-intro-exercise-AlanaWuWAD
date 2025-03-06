"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const articles = [
    { title: "First article", content: "This is my first article" },
    { title: "Second article", content: "This is my second article" },
];
const server = http_1.default.createServer((req, res) => {
    const { url, method } = req;
    // Home
    if (url === "/" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello from my server!");
        return;
    }
    // About
    if (url === "/about-us" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>About Us</h1>");
        return;
    }
    // Blog
    if (url === "/blog" && method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(articles));
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
